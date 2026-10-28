import {
  User,
  WebsiteProject,
  SupportTicket,
  BackupItem,
  AdminMetrics,
  SubdomainCheckResult,
  HostingProvider,
  AiMode,
  AiGenerationResult
} from '../types';

const TOKEN_KEY = 'hostbanger_auth_token';
const USER_KEY = 'hostbanger_user';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setStoredSession(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearStoredSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {})
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(endpoint, {
    ...options,
    headers
  });

  if (!res.ok) {
    let errMessage = 'Request failed';
    try {
      const data = await res.json();
      errMessage = data.error || data.message || errMessage;
    } catch {
      errMessage = `HTTP ${res.status}: ${res.statusText}`;
    }
    throw new Error(errMessage);
  }

  return res.json() as Promise<T>;
}

export const api = {
  // Auth
  async login(email: string, role?: 'user' | 'admin') {
    const data = await request<{ user: User; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, role })
    });
    setStoredSession(data.token, data.user);
    return data;
  },

  async register(name: string, email: string, password: string, role?: 'user' | 'admin') {
    const data = await request<{ user: User; token: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role })
    });
    setStoredSession(data.token, data.user);
    return data;
  },

  async resetPassword(email: string) {
    return request<{ success: boolean; message: string }>('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async getMe() {
    return request<{ user: User }>('/api/auth/me');
  },

  async updateProfile(name?: string, plan?: string) {
    const data = await request<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, plan })
    });
    const current = getStoredUser();
    if (current) setStoredSession(current.id, data.user);
    return data.user;
  },

  async deleteAccount() {
    const res = await request<{ success: boolean; message: string }>('/api/auth/account', {
      method: 'DELETE'
    });
    clearStoredSession();
    return res;
  },

  // Subdomain validation
  async checkSubdomain(name: string, provider: HostingProvider = 'cloudflare_pages') {
    return request<SubdomainCheckResult>(
      `/api/subdomains/check?name=${encodeURIComponent(name)}&provider=${encodeURIComponent(provider)}`
    );
  },

  // Projects
  async getProjects() {
    const data = await request<{ projects: WebsiteProject[] }>('/api/projects');
    return data.projects;
  },

  async getProject(id: string) {
    const data = await request<{ project: WebsiteProject }>(`/api/projects/${id}`);
    return data.project;
  },

  async createProject(params: {
    name: string;
    websiteTitle?: string;
    websiteDescription?: string;
    category?: WebsiteProject['category'];
    templateId?: string;
    html?: string;
    css?: string;
    js?: string;
    provider?: HostingProvider;
  }) {
    const data = await request<{ project: WebsiteProject }>('/api/projects', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return data.project;
  },

  async uploadWebsiteFiles(params: {
    files: Array<{ name: string; content: string }>;
    projectName?: string;
    websiteTitle?: string;
    category?: WebsiteProject['category'];
    provider?: HostingProvider;
  }) {
    const data = await request<{ project: WebsiteProject; message: string }>('/api/upload', {
      method: 'POST',
      body: JSON.stringify(params)
    });
    return data;
  },

  async updateProject(id: string, updates: Partial<WebsiteProject> & { editNote?: string }) {
    const data = await request<{ project: WebsiteProject }>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
    return data.project;
  },

  async duplicateProject(id: string) {
    const data = await request<{ project: WebsiteProject }>(`/api/projects/${id}/duplicate`, {
      method: 'POST'
    });
    return data.project;
  },

  async deleteProject(id: string) {
    return request<{ success: boolean; message: string }>(`/api/projects/${id}`, {
      method: 'DELETE'
    });
  },

  async deployProject(
    id: string,
    options?: { chosenSubdomain?: string; provider?: HostingProvider }
  ) {
    return request<{
      success: boolean;
      project: WebsiteProject;
      publicUrl: string;
      subdomain: string;
      provider: HostingProvider;
      logs: Array<{ step: string; message: string; status: 'pending' | 'success' | 'error'; timestamp: string }>;
    }>(`/api/projects/${id}/deploy`, {
      method: 'POST',
      body: JSON.stringify(options || {})
    });
  },

  async republishProject(id: string) {
    return request<{ success: boolean; project: WebsiteProject; message: string }>(
      `/api/projects/${id}/republish`,
      { method: 'POST' }
    );
  },

  // GitHub integration
  async connectGitHub(githubUsername: string) {
    return request<{ success: boolean; user: User; message: string }>('/api/github/connect', {
      method: 'POST',
      body: JSON.stringify({ githubUsername })
    });
  },

  async pushGitHubRepo(projectId: string, repoName?: string) {
    return request<{ success: boolean; repo: string; githubPagesUrl: string; message: string }>(
      '/api/github/push-repo',
      {
        method: 'POST',
        body: JSON.stringify({ projectId, repoName })
      }
    );
  },

  // AI Builder & Gemini Intelligence
  async generateWebsite(params: {
    prompt: string;
    category?: string;
    theme?: string;
    mode?: AiMode;
  }) {
    return request<AiGenerationResult>('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async refineWebsite(params: {
    prompt: string;
    currentHtml: string;
    currentCss: string;
    currentJs: string;
    currentPython?: string;
    mode?: AiMode;
  }) {
    return request<{
      html: string;
      css: string;
      js: string;
      python?: string;
      thinking?: string;
      changesSummary: string;
      answer?: string;
    }>('/api/ai/refine', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async askAi(params: { prompt: string; context?: string }) {
    return request<{
      answer: string;
      thinking: string;
      suggestions: string[];
      codeSnippets?: { html?: string; css?: string; js?: string; python?: string };
    }>('/api/ai/ask', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  // Hosting stats & file manager
  async getHostingStats() {
    return request<{
      edgeNodes: Array<{ location: string; ping: string; status: string; load: string }>;
      storage: {
        usedMb: number;
        limitMb: number;
        breakdown: { htmlMb: number; assetsMb: number; backupsMb: number };
      };
      bandwidth: {
        usedMb: number;
        limitMb: number;
      };
      totalVisits: number;
      sslCertificatesIssued: number;
      activeDeployments: number;
    }>('/api/hosting/stats');
  },

  async getBackups() {
    const data = await request<{ backups: BackupItem[] }>('/api/hosting/backups');
    return data.backups;
  },

  async createBackup(projectId: string) {
    return request<{ backup: BackupItem; message: string }>('/api/hosting/backups', {
      method: 'POST',
      body: JSON.stringify({ projectId })
    });
  },

  async restoreBackup(id: string) {
    return request<{ success: boolean; message: string }>(`/api/hosting/backups/${id}/restore`, {
      method: 'POST'
    });
  },

  async getProjectFiles(projectId: string) {
    return request<{ files: any[] }>(`/api/hosting/files/${projectId}`);
  },

  // Support
  async getTickets() {
    const data = await request<{ tickets: SupportTicket[] }>('/api/support/tickets');
    return data.tickets;
  },

  async createTicket(subject: string, category: string, priority: string, message: string) {
    const data = await request<{ ticket: SupportTicket }>('/api/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject, category, priority, message })
    });
    return data.ticket;
  },

  async replyTicket(ticketId: string, text: string) {
    const data = await request<{ ticket: SupportTicket }>(`/api/support/tickets/${ticketId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ text })
    });
    return data.ticket;
  },

  // Admin
  async getAdminMetrics() {
    return request<{
      metrics: AdminMetrics;
      users: User[];
      projects: WebsiteProject[];
      tickets: SupportTicket[];
    }>('/api/admin/metrics');
  }
};
