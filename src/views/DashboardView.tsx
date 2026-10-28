import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { Logo } from '../components/Logo';
import { WebsiteProject, User, SupportTicket, BackupItem, HostingProvider, SubdomainCheckResult, WebsiteTemplate } from '../types';
import { TEMPLATES, HOSTING_PLANS } from '../data/templates';
import { api } from '../services/api';
import {
  Server,
  Globe,
  Layers,
  FolderTree,
  Activity,
  HardDrive,
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  Settings,
  Plus,
  ExternalLink,
  Edit,
  Copy,
  Trash2,
  RefreshCw,
  Rocket,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Check,
  Send,
  Sparkles,
  Lock,
  Cloud,
  Github,
  Key,
  Database,
  UploadCloud,
  FileUp,
  Link2,
  History,
  FileText,
  AlertCircle,
  FileCode,
  FileCheck
} from 'lucide-react';

interface DashboardViewProps {
  initialTab?: string;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onEditProject: (project: WebsiteProject) => void;
  onCreateNewWebsite: () => void;
  onSelectTemplate?: (template: WebsiteTemplate) => void;
  onPreviewTemplate?: (template: WebsiteTemplate) => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  initialTab = 'websites',
  currentUser,
  onOpenAuth,
  onEditProject,
  onCreateNewWebsite,
  onSelectTemplate,
  onPreviewTemplate,
  onLogout
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [projects, setProjects] = useState<WebsiteProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hostingStats, setHostingStats] = useState<any>(null);
  const [backups, setBackups] = useState<BackupItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Status Filter for My Websites
  const [statusFilter, setStatusFilter] = useState<'All' | 'Draft' | 'Preparing' | 'Deploying' | 'Published' | 'Failed'>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // GitHub connection form state
  const [githubUser, setGithubUser] = useState<string>(currentUser?.githubUsername || '');
  const [isConnectingGithub, setIsConnectingGithub] = useState<boolean>(false);

  // Password reset state
  const [resetEmailSent, setResetEmailSent] = useState<boolean>(false);

  // File Manager tab state
  const [selectedFileProject, setSelectedFileProject] = useState<string>('');
  const [fileList, setFileList] = useState<any[]>([]);
  const [activeFileContent, setActiveFileContent] = useState<string | null>(null);
  const [activeFileName, setActiveFileName] = useState<string | null>(null);

  // Support Ticket Form state
  const [ticketSubject, setTicketSubject] = useState<string>('');
  const [ticketCategory, setTicketCategory] = useState<string>('Cloudflare Pages');
  const [ticketPriority, setTicketPriority] = useState<string>('medium');
  const [ticketMessage, setTicketMessage] = useState<string>('');
  const [ticketReply, setTicketReply] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Settings State
  const [profileName, setProfileName] = useState<string>(currentUser?.name || '');

  // -------------------------------------------------------------
  // DEDICATED UPLOAD WEBSITE FILES STATE
  // -------------------------------------------------------------
  const [uploadedFiles, setUploadedFiles] = useState<Array<{ name: string; content: string; size: number; type: string }>>([]);
  const [uploadProjectName, setUploadProjectName] = useState<string>('');
  const [uploadWebsiteTitle, setUploadWebsiteTitle] = useState<string>('');
  const [uploadCategory, setUploadCategory] = useState<WebsiteProject['category']>('Business');
  const [uploadProvider, setUploadProvider] = useState<HostingProvider>('cloudflare_pages');
  const [subdomainCheck, setSubdomainCheck] = useState<SubdomainCheckResult | null>(null);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccessProject, setUploadSuccessProject] = useState<WebsiteProject | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Choose Website Name state for My Domains & Subdomains tab
  const [domainSearchInput, setDomainSearchInput] = useState<string>('shadowgaming');
  const [domainSearchProvider, setDomainSearchProvider] = useState<HostingProvider>('cloudflare_pages');
  const [isSearchingDomain, setIsSearchingDomain] = useState<boolean>(false);
  const [domainSearchResult, setDomainSearchResult] = useState<SubdomainCheckResult | null>(null);
  const [domainSearchError, setDomainSearchError] = useState<string | null>(null);

  const handleSearchDomainInDashboard = async (nameToCheck?: string) => {
    const raw = nameToCheck !== undefined ? nameToCheck : domainSearchInput;
    const clean = raw.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/(^-|-$)/g, '');

    if (!clean || clean.length < 3) {
      setDomainSearchError('Website name must be at least 3 characters.');
      setDomainSearchResult(null);
      return;
    }

    setIsSearchingDomain(true);
    setDomainSearchError(null);

    try {
      const res = await api.checkSubdomain(clean, domainSearchProvider);
      setDomainSearchResult(res);
    } catch (err: any) {
      setDomainSearchError(err?.message || 'Failed to check subdomain availability.');
      setDomainSearchResult(null);
    } finally {
      setIsSearchingDomain(false);
    }
  };

  // Template browser category filter
  const [templateCategory, setTemplateCategory] = useState<string>('All');

  useEffect(() => {
    loadDashboardData();
  }, [currentUser]);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [projList, stats, bks, tkts] = await Promise.all([
        api.getProjects(),
        api.getHostingStats(),
        api.getBackups(),
        api.getTickets()
      ]);
      setProjects(projList);
      setHostingStats(stats);
      setBackups(bks);
      setTickets(tkts);
      if (projList.length > 0) {
        setSelectedFileProject(projList[0].id);
        loadProjectFiles(projList[0].id);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadProjectFiles = async (pId: string) => {
    try {
      const res = await api.getProjectFiles(pId);
      setFileList(res.files);
      if (res.files && res.files.length > 0) {
        setActiveFileName(res.files[0].name);
        setActiveFileContent(res.files[0].content);
      } else {
        setActiveFileName(null);
        setActiveFileContent(null);
      }
    } catch (err) {
      console.error('Failed to load project files:', err);
    }
  };

  // Subdomain validation for upload form
  const handleProjectNameChange = async (name: string) => {
    const clean = name.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
    setUploadProjectName(clean);
    if (!uploadWebsiteTitle || uploadWebsiteTitle === uploadProjectName) {
      setUploadWebsiteTitle(clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : '');
    }

    if (!clean || clean.length < 3) {
      setSubdomainCheck(null);
      return;
    }

    setIsCheckingSubdomain(true);
    try {
      const res = await api.checkSubdomain(clean, uploadProvider);
      setSubdomainCheck(res);
    } catch (err) {
      console.error('Subdomain check error:', err);
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  // File staging with security verification
  const processFiles = (files: FileList | File[]) => {
    setUploadError(null);
    setUploadSuccessProject(null);
    const disallowedExts = ['.exe', '.bat', '.cmd', '.sh', '.php', '.py', '.rb', '.pl', '.jsp', '.asp', '.cgi', '.dll', '.bin', '.msi', '.vbs', '.jar'];
    const newFiles: Array<{ name: string; content: string; size: number; type: string }> = [];

    for (let i = 0; i < files.length; i++) {
      const f = files[i];
      const lowerName = f.name.toLowerCase();
      const isDisallowed = disallowedExts.some(ext => lowerName.endsWith(ext));

      if (isDisallowed) {
        setUploadError(`Security Alert: File "${f.name}" contains an unauthorized executable or server script extension. HOSTBANGER free static hosting accepts only client-side web assets (HTML, CSS, JS, images, SVG, JSON).`);
        return;
      }

      const reader = new FileReader();
      const isImage = lowerName.match(/\.(png|jpe?g|gif|webp|svg|ico)$/i);

      if (isImage) {
        reader.readAsDataURL(f);
      } else {
        reader.readAsText(f);
      }

      reader.onload = () => {
        newFiles.push({
          name: f.name,
          content: reader.result as string,
          size: f.size,
          type: f.type || 'text/plain'
        });

        if (newFiles.length === files.length) {
          setUploadedFiles(prev => {
            const combined = [...prev];
            newFiles.forEach(nf => {
              const idx = combined.findIndex(c => c.name === nf.name);
              if (idx >= 0) combined[idx] = nf;
              else combined.push(nf);
            });
            return combined;
          });

          // Autofill project name if empty
          if (!uploadProjectName && files.length > 0) {
            const first = files[0].name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[^a-z0-9-]/g, '-');
            if (first) handleProjectNameChange(first);
          }
        }
      };
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleRemoveStagedFile = (name: string) => {
    setUploadedFiles(prev => prev.filter(f => f.name !== name));
  };

  // Submit Uploaded Files and Deploy Website
  const handleSubmitUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadedFiles.length === 0) {
      setUploadError('Please select or drop at least one file to upload.');
      return;
    }

    const hasHtml = uploadedFiles.some(f => f.name.toLowerCase() === 'index.html' || f.name.toLowerCase().endsWith('.html'));
    if (!hasHtml) {
      setUploadError('Upload Validation: An "index.html" file is required as the primary entry point for static website hosting.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const res = await api.uploadWebsiteFiles({
        files: uploadedFiles.map(f => ({ name: f.name, content: f.content })),
        projectName: uploadProjectName || 'my-uploaded-website',
        websiteTitle: uploadWebsiteTitle || uploadProjectName || 'Uploaded Website',
        category: uploadCategory,
        provider: uploadProvider
      });

      setUploadSuccessProject(res.project);
      setProjects(prev => [res.project, ...prev.filter(p => p.id !== res.project.id)]);
      showToast(`Website uploaded! Subdomain: ${res.project.subdomain}`);
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process website files');
    } finally {
      setIsUploading(false);
    }
  };

  // Direct Publish Action from Dashboard
  const handleDeployDirect = async (projectId: string) => {
    try {
      showToast('Initiating deployment to Cloudflare Pages edge...');
      // Mark as Deploying optimistically
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? { ...p, status: 'Deploying' as const } : p))
      );

      const res = await api.deployProject(projectId);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? res.project : p))
      );
      showToast(`Website successfully published at ${res.project.publicUrl || res.project.subdomain}!`);
    } catch (err: any) {
      showToast(`Deployment failed: ${err?.message}`);
      loadDashboardData();
    }
  };

  const handleRepublish = async (projectId: string) => {
    try {
      showToast('Republishing website to global edge...');
      const res = await api.republishProject(projectId);
      setProjects(prev =>
        prev.map(p => (p.id === projectId ? res.project : p))
      );
      showToast('Website republished with fresh Let\'s Encrypt TLS certificate!');
    } catch (err: any) {
      showToast(err?.message || 'Republish failed');
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this website? All public URLs and files will be unlinked.')) return;
    try {
      await api.deleteProject(projectId);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      showToast('Website deleted successfully.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete website');
    }
  };

  const handleDuplicateProject = async (projectId: string) => {
    try {
      const newProj = await api.duplicateProject(projectId);
      setProjects(prev => [newProj, ...prev]);
      showToast(`Duplicated project: ${newProj.websiteTitle}`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to duplicate project');
    }
  };

  const handleDownloadZip = async (project: WebsiteProject) => {
    try {
      showToast('Generating clean source ZIP package...');
      const zip = new JSZip();
      zip.file('index.html', project.html || '<!DOCTYPE html><html><body><h1>Welcome</h1></body></html>');
      if (project.css) zip.file('style.css', project.css);
      if (project.js) zip.file('script.js', project.js);
      zip.file(
        'HOSTBANGER-README.txt',
        `Website: ${project.websiteTitle}\nSubdomain: ${project.subdomain}\nProvider: ${project.provider}\nPublished with HOSTBANGER - Create Free. Host Free. Go Online.`
      );

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.slug || 'hostbanger-website'}-source.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('ZIP file downloaded successfully.');
    } catch (err) {
      showToast('Failed to generate ZIP archive.');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    showToast(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedUrl(null), 3000);
  };

  const handleConnectGitHub = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUser.trim()) return;
    setIsConnectingGithub(true);
    try {
      const res = await api.connectGitHub(githubUser.trim());
      showToast(res.message || `GitHub connected: @${githubUser.trim()}`);
    } catch (err: any) {
      showToast(err?.message || 'Failed to connect GitHub');
    } finally {
      setIsConnectingGithub(false);
    }
  };

  const handlePushToGithub = async (projectId: string) => {
    try {
      showToast('Pushing static source code to GitHub...');
      const res = await api.pushGitHubRepo(projectId);
      showToast(res.message);
    } catch (err: any) {
      showToast(err?.message || 'Failed to push to GitHub');
    }
  };

  const handlePasswordReset = async () => {
    if (!currentUser?.email) return;
    try {
      const res = await api.resetPassword(currentUser.email);
      setResetEmailSent(true);
      showToast(res.message);
    } catch (err: any) {
      showToast(err?.message || 'Password reset request failed');
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject || !ticketMessage) return;
    try {
      const t = await api.createTicket(ticketSubject, ticketCategory, ticketPriority, ticketMessage);
      setTickets(prev => [t, ...prev]);
      setTicketSubject('');
      setTicketMessage('');
      showToast('Support ticket opened! Our technical engineers will respond shortly.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to create ticket');
    }
  };

  const handleReplyTicket = async (tId: string) => {
    if (!ticketReply.trim()) return;
    try {
      const updated = await api.replyTicket(tId, ticketReply);
      setTickets(prev => prev.map(t => (t.id === tId ? updated : t)));
      setTicketReply('');
      showToast('Reply sent.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to send reply');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateProfile(profileName);
      showToast('Profile updated successfully.');
    } catch (err: any) {
      showToast(err?.message || 'Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('CRITICAL WARNING: This will permanently delete your HOSTBANGER account and all hosted websites. Proceed?')) return;
    try {
      await api.deleteAccount();
      onLogout();
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete account');
    }
  };

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Filtered projects
  const filteredProjects = projects.filter(p => {
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      p.websiteTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subdomain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredTemplates = templateCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category.toLowerCase() === templateCategory.toLowerCase());

  // Aggregate deployment history across all projects
  const allDeploymentEvents = projects.flatMap(p =>
    (p.history || []).map(h => ({
      ...h,
      projectId: p.id,
      projectName: p.websiteTitle,
      subdomain: p.subdomain,
      status: p.status,
      provider: p.provider,
      publicUrl: p.publicUrl
    }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="min-h-screen bg-[#080A14] text-slate-100 flex flex-col">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 rounded-xl bg-[#141C36] border border-[#00E5FF]/40 text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00E5FF]" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* DASHBOARD TOP HEADER */}
      <div className="bg-[#0D1020] border-b border-[#1C233C] px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="md" showTagline={true} />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => setActiveTab('upload')}
            className="px-3.5 py-2 rounded-xl bg-[#18213E] hover:bg-[#253360] text-slate-200 border border-[#2B355A] font-bold text-xs flex items-center gap-1.5 transition-all"
          >
            <UploadCloud className="w-3.5 h-3.5 text-[#00E5FF]" />
            Upload Website Files
          </button>

          <button
            onClick={onCreateNewWebsite}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all"
          >
            <Plus className="w-4 h-4 text-[#0B0D19]" />
            Create New Website
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD BODY: SIDEBAR + CONTENT */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        {/* SIDEBAR NAVIGATION - MATCHING EXACT USER REQUIREMENTS */}
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <div className="px-3 py-2 text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Websites & Domains
          </div>

          <button
            onClick={() => setActiveTab('websites')}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'websites'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Server className="w-4 h-4 text-[#00E5FF]" />
              <span>My Websites</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-slate-300 font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'upload'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-emerald-400" />
            <span>Upload Website Files</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'templates'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Website Templates</span>
          </button>

          <button
            onClick={() => setActiveTab('urls')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'urls'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Link2 className="w-4 h-4 text-cyan-400" />
            <span>My Domains and Subdomains</span>
          </button>

          <button
            onClick={() => setActiveTab('deployments')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'deployments'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <History className="w-4 h-4 text-amber-400" />
            <span>Deployment History</span>
          </button>

          <div className="pt-4 px-3 py-2 text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Hosting & Edge
          </div>

          <button
            onClick={() => setActiveTab('hosting')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'hosting'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Cloud className="w-4 h-4 text-orange-400" />
            <span>Cloudflare Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'github'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Github className="w-4 h-4 text-slate-300" />
            <span>GitHub Pages</span>
          </button>

          <button
            onClick={() => setActiveTab('files')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'files'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <FolderTree className="w-4 h-4 text-yellow-400" />
            <span>File Management</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'resources'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>Storage & Bandwidth</span>
          </button>

          <div className="pt-4 px-3 py-2 text-[11px] font-black uppercase text-slate-400 tracking-wider">
            Account & Support
          </div>

          <button
            onClick={() => setActiveTab('support')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'support'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <LifeBuoy className="w-4 h-4 text-blue-400" />
            <span>Helpdesk & Support</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'settings'
                ? 'bg-[#18213E] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.2)] border border-[#00E5FF]/30'
                : 'text-slate-400 hover:text-white hover:bg-[#12162A]'
            }`}
          >
            <Settings className="w-4 h-4 text-slate-400" />
            <span>Account Settings</span>
          </button>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 min-w-0">
          {/* ======================================================== */}
          {/* TAB 1: MY WEBSITES */}
          {/* ======================================================== */}
          {activeTab === 'websites' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">My Websites</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Manage your hosted websites, view deployment status, update code, or download ZIP archives.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="px-3.5 py-2 rounded-xl bg-[#141B33] hover:bg-[#1E274A] border border-[#2B355A] text-slate-200 font-bold text-xs flex items-center gap-1.5 transition-all"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-[#00E5FF]" />
                    Upload Files
                  </button>
                  <button
                    onClick={onCreateNewWebsite}
                    className="px-4 py-2 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Create New Website
                  </button>
                </div>
              </div>

              {/* Status Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#0D1020] border border-[#1C233C]">
                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                  {(['All', 'Published', 'Draft', 'Preparing', 'Deploying', 'Failed'] as const).map(status => {
                    const count = status === 'All' ? projects.length : projects.filter(p => p.status === status).length;
                    return (
                      <button
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                          statusFilter === status
                            ? 'bg-[#00E5FF] text-[#0B0D19]'
                            : 'bg-[#141A30] text-slate-300 hover:text-white hover:bg-[#1B2342]'
                        }`}
                      >
                        {status} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Search query input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search websites by name or URL..."
                    className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500"
                  />
                </div>
              </div>

              {/* Websites Grid */}
              {filteredProjects.length === 0 ? (
                <div className="p-12 text-center rounded-2xl bg-[#0F1325] border border-[#212946]">
                  <Server className="w-12 h-12 text-[#00E5FF] mx-auto mb-4 opacity-50" />
                  <h3 className="font-bold text-white text-base">No websites match your filter</h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                    {projects.length === 0
                      ? 'You have not created or uploaded any websites yet. Get started now!'
                      : 'No websites match the selected filter. Try switching to "All".'}
                  </p>
                  <div className="mt-6 flex items-center justify-center gap-3">
                    <button
                      onClick={onCreateNewWebsite}
                      className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-bold text-xs"
                    >
                      Build with AI
                    </button>
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="px-5 py-2.5 rounded-xl bg-[#18213E] text-white font-bold text-xs border border-[#28355C]"
                    >
                      Upload Static Bundle
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredProjects.map(project => (
                    <div
                      key={project.id}
                      className="rounded-2xl bg-[#111528] border border-[#212946] p-6 shadow-xl flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all"
                    >
                      <div>
                        {/* Header: Category and Status Pill */}
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-[11px] font-bold text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                            {project.category}
                          </span>
                          <span
                            className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5 ${
                              project.status === 'Published'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : project.status === 'Failed'
                                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                                : project.status === 'Deploying' || project.status === 'Preparing'
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                                : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current" />
                            {project.status}
                          </span>
                        </div>

                        <h3 className="text-lg font-black text-white">{project.websiteTitle}</h3>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">{project.websiteDescription}</p>

                        {/* Metadata Box */}
                        <div className="mt-4 pt-4 border-t border-white/5 space-y-2 text-xs font-mono">
                          <div className="flex justify-between items-center">
                            <span className="font-sans text-slate-400">Public URL:</span>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[#00E5FF] font-bold truncate max-w-[180px]">
                                https://{project.subdomain}
                              </span>
                              <button
                                onClick={() => copyToClipboard(`https://${project.subdomain}`)}
                                title="Copy public URL"
                                className="p-1 hover:text-white text-slate-400 transition-colors"
                              >
                                {copiedUrl === `https://${project.subdomain}` ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-sans text-slate-400">Hosting Provider:</span>
                            <span className="font-sans text-slate-300 font-bold capitalize">
                              {project.provider === 'cloudflare_pages' ? 'Cloudflare Pages' : 'HOSTBANGER Edge'}
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-sans text-slate-400">Free SSL Certificate:</span>
                            <span className="text-emerald-400 font-sans font-semibold flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> Active (TLS 1.3)
                            </span>
                          </div>

                          <div className="flex justify-between">
                            <span className="font-sans text-slate-400">Updated:</span>
                            <span className="font-sans text-slate-400">
                              {new Date(project.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        {project.status === 'Failed' && project.errorMessage && (
                          <div className="mt-3 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
                            <p className="font-bold">{project.errorMessage}</p>
                            {project.recoveryHint && <p className="text-[11px] mt-1 text-slate-300">{project.recoveryHint}</p>}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons as requested */}
                      <div className="mt-6 pt-4 border-t border-[#1C233C] space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => onEditProject(project)}
                            className="py-2 px-3 rounded-lg bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-white flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5 text-[#00E5FF]" />
                            Edit Website
                          </button>

                          {project.status === 'Published' && project.publicUrl ? (
                            <a
                              href={project.publicUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="py-2 px-3 rounded-lg bg-[#00E5FF] text-[#0B0D19] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-[#38BDF8] transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                              Open Website
                            </a>
                          ) : (
                            <button
                              onClick={() => handleDeployDirect(project.id)}
                              className="py-2 px-3 rounded-lg bg-emerald-500 text-black text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-400 transition-colors"
                            >
                              <Rocket className="w-3.5 h-3.5" />
                              Publish Website
                            </button>
                          )}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleRepublish(project.id)}
                              className="text-slate-400 hover:text-[#00E5FF] flex items-center gap-1 text-[11px]"
                            >
                              <RefreshCw className="w-3 h-3" />
                              Republish
                            </button>
                            <span>•</span>
                            <button
                              onClick={() => handleDownloadZip(project)}
                              className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px]"
                            >
                              <Download className="w-3 h-3" />
                              Download Files
                            </button>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDuplicateProject(project.id)}
                              title="Duplicate Project"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id)}
                              title="Delete Website"
                              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 2: UPLOAD WEBSITE FILES (DEDICATED FULL FEATURE) */}
          {/* ======================================================== */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Upload Website Files</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Upload HTML, CSS, JavaScript, and images to publish your static website with free Cloudflare Pages hosting.
                </p>
              </div>

              {uploadSuccessProject ? (
                <div className="p-8 rounded-2xl bg-[#0E1626] border border-emerald-500/40 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-white">Website Uploaded & Ready!</h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Your static files have been successfully validated, structured, and assigned a live free subdomain.
                  </p>

                  <div className="p-4 rounded-xl bg-black/50 border border-white/10 max-w-lg mx-auto flex items-center justify-between">
                    <span className="font-mono text-sm text-[#00E5FF] font-bold">
                      https://{uploadSuccessProject.subdomain}
                    </span>
                    <button
                      onClick={() => copyToClipboard(`https://${uploadSuccessProject.subdomain}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-white flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      Copy URL
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-3 pt-4">
                    {uploadSuccessProject.publicUrl && (
                      <a
                        href={uploadSuccessProject.publicUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-black text-xs flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open Live Website
                      </a>
                    )}
                    <button
                      onClick={() => onEditProject(uploadSuccessProject)}
                      className="px-5 py-2.5 rounded-xl bg-[#18213E] text-white font-bold text-xs border border-[#2B355A]"
                    >
                      Edit in Studio
                    </button>
                    <button
                      onClick={() => {
                        setUploadSuccessProject(null);
                        setUploadedFiles([]);
                        setUploadProjectName('');
                      }}
                      className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white text-xs font-bold"
                    >
                      Upload Another
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitUpload} className="space-y-6">
                  {/* Security Notice Banner */}
                  <div className="p-4 rounded-xl bg-[#101426] border border-[#202946] flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-slate-300">
                      <p className="font-bold text-white">Supported Free Static Formats</p>
                      <p className="mt-0.5 text-slate-400">
                        Upload <code className="text-[#00E5FF]">index.html</code> along with supporting <code className="text-[#00E5FF]">.css</code>, <code className="text-[#00E5FF]">.js</code>, and image assets (<code className="text-[#00E5FF]">.png, .jpg, .svg, .webp</code>). Executable extensions (<code className="text-rose-400">.exe, .bat, .php, .sh</code>) are automatically blocked for security.
                      </p>
                    </div>
                  </div>

                  {uploadError && (
                    <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>{uploadError}</span>
                    </div>
                  )}

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={e => {
                      e.preventDefault();
                      setIsDragOver(true);
                    }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                      isDragOver
                        ? 'border-[#00E5FF] bg-[#00E5FF]/10'
                        : 'border-[#273256] hover:border-[#00E5FF]/50 bg-[#0E1222]'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept=".html,.htm,.css,.js,.json,.svg,.png,.jpg,.jpeg,.webp,.gif,.ico"
                      onChange={handleFileInputChange}
                      className="hidden"
                    />
                    <UploadCloud className="w-12 h-12 text-[#00E5FF] mx-auto mb-3" />
                    <h3 className="font-bold text-white text-base">Drag & drop your website files here</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      or click to browse from your computer (index.html, styles, scripts, images)
                    </p>
                    <span className="inline-block mt-4 px-3 py-1 rounded-full text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 border border-[#00E5FF]/20">
                      25 MB Maximum Static Bundle Limit
                    </span>
                  </div>

                  {/* Staged Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="p-5 rounded-2xl bg-[#0D1020] border border-[#1D2542] space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-white/5">
                        <span className="text-xs font-bold text-white uppercase tracking-wider">
                          Staged Files ({uploadedFiles.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => setUploadedFiles([])}
                          className="text-xs text-rose-400 hover:text-rose-300"
                        >
                          Clear All
                        </button>
                      </div>

                      <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1">
                        {uploadedFiles.map((f, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-lg bg-[#141A30] border border-[#212B4C] flex items-center justify-between text-xs"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                              <span className="font-mono text-slate-200 truncate">{f.name}</span>
                              {f.name.toLowerCase() === 'index.html' && (
                                <span className="text-[10px] font-bold text-[#00E5FF] bg-[#00E5FF]/20 px-1.5 py-0.5 rounded">
                                  Entry Point
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="font-mono text-slate-500 text-[10px]">
                                {(f.size / 1024).toFixed(1)} KB
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveStagedFile(f.name)}
                                className="text-slate-400 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Project Details Configuration */}
                  <div className="p-6 rounded-2xl bg-[#0D1020] border border-[#1D2542] space-y-4">
                    <h3 className="font-bold text-white text-base">Website Details & Free Subdomain</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Project Name / Subdomain Slug
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={uploadProjectName}
                            onChange={e => handleProjectNameChange(e.target.value)}
                            placeholder="e.g. my-awesome-portfolio"
                            className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white font-mono"
                          />
                          {isCheckingSubdomain && (
                            <RefreshCw className="w-3.5 h-3.5 text-[#00E5FF] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                          )}
                        </div>

                        {subdomainCheck && (
                          <div className="mt-1.5 text-[11px] font-mono">
                            {subdomainCheck.available ? (
                              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                                <CheckCircle2 className="w-3 h-3" /> Subdomain Available: {subdomainCheck.fullDomain}
                              </span>
                            ) : (
                              <span className="text-amber-400 flex items-center gap-1 font-bold">
                                <AlertTriangle className="w-3 h-3" /> Taken. Suggestion: {subdomainCheck.suggestedAlternatives?.[0] || 'Try another name'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Website Title
                        </label>
                        <input
                          type="text"
                          value={uploadWebsiteTitle}
                          onChange={e => setUploadWebsiteTitle(e.target.value)}
                          placeholder="e.g. Elena Rostova - Interaction Design"
                          className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Category
                        </label>
                        <select
                          value={uploadCategory}
                          onChange={e => setUploadCategory(e.target.value as any)}
                          className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="Business">Business</option>
                          <option value="Gaming">Gaming</option>
                          <option value="Portfolio">Portfolio</option>
                          <option value="Store">Online Store</option>
                          <option value="Blog">Blog & News</option>
                          <option value="Landing">Landing Page</option>
                          <option value="Education">Education</option>
                          <option value="Entertainment">Entertainment</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-300 mb-1">
                          Hosting Provider
                        </label>
                        <select
                          value={uploadProvider}
                          onChange={e => {
                            setUploadProvider(e.target.value as any);
                            if (uploadProjectName) handleProjectNameChange(uploadProjectName);
                          }}
                          className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                        >
                          <option value="cloudflare_pages">Cloudflare Pages (*.pages.dev)</option>
                          <option value="hostbanger_edge">HOSTBANGER Edge (*.hostbanger.app)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={isUploading || uploadedFiles.length === 0}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-sm flex items-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#0B0D19]" />
                          Validating & Uploading...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-4 h-4 text-[#0B0D19]" />
                          Upload & Publish Website
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 3: WEBSITE TEMPLATES */}
          {/* ======================================================== */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">Website Templates</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Choose from 8 curated, responsive foundations. Test in live preview or launch directly in the AI studio.
                  </p>
                </div>
              </div>

              {/* Template Category filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['All', 'Gaming', 'Business', 'Portfolio', 'Store', 'Blog', 'Landing', 'Education', 'Entertainment'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setTemplateCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                      templateCategory.toLowerCase() === cat.toLowerCase()
                        ? 'bg-[#00E5FF] text-[#0B0D19]'
                        : 'bg-[#12162A] text-slate-300 hover:text-white hover:bg-[#1B2342]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Templates Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTemplates.map(tpl => (
                  <div
                    key={tpl.id}
                    className="rounded-2xl bg-[#111528] border border-[#212946] overflow-hidden flex flex-col justify-between hover:border-[#00E5FF]/40 transition-all shadow-xl"
                  >
                    <div className="h-44 overflow-hidden relative bg-black">
                      <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover opacity-85 hover:opacity-100 transition-opacity" />
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-[#00E5FF] bg-black/80 backdrop-blur-sm">
                        {tpl.category}
                      </span>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-white text-base leading-snug">{tpl.name}</h3>
                        <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tpl.description}</p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-white/5 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onPreviewTemplate && onPreviewTemplate(tpl)}
                          className="py-2 px-3 rounded-lg bg-[#18213E] hover:bg-[#253360] text-slate-200 text-xs font-bold text-center"
                        >
                          Live Preview
                        </button>
                        <button
                          onClick={() => onSelectTemplate && onSelectTemplate(tpl)}
                          className="py-2 px-3 rounded-lg bg-[#00E5FF] text-[#0B0D19] text-xs font-black text-center hover:bg-[#38BDF8]"
                        >
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 4: MY DOMAINS AND SUBDOMAINS */}
          {/* ======================================================== */}
          {activeTab === 'urls' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">My Domains and Subdomains</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Choose a website name, verify live availability, and manage your provisioned public URLs across Cloudflare Pages.
                </p>
              </div>

              {/* CHOOSE WEBSITE NAME CARD */}
              <div className="p-6 rounded-2xl bg-[#0F1428] border border-[#232D4E] space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-5 h-5 text-[#00E5FF]" />
                    <h3 className="font-bold text-white text-base">Choose Website Name</h3>
                  </div>
                  <span className="text-[11px] font-mono text-[#00E5FF] font-semibold">
                    Free Subdomain Format: https://name.pages.dev
                  </span>
                </div>

                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleSearchDomainInDashboard();
                  }}
                  className="flex flex-col sm:flex-row gap-2.5"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={domainSearchInput}
                      onChange={e => {
                        setDomainSearchInput(e.target.value);
                        setDomainSearchResult(null);
                        setDomainSearchError(null);
                      }}
                      placeholder="Enter website name (e.g. shadowgaming)"
                      className="w-full bg-[#080B16] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3.5 py-2.5 text-xs text-white font-mono placeholder-slate-500"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono text-slate-500">
                      .{domainSearchProvider === 'cloudflare_pages' ? 'pages.dev' : 'hostbanger.app'}
                    </span>
                  </div>

                  <select
                    value={domainSearchProvider}
                    onChange={e => {
                      setDomainSearchProvider(e.target.value as any);
                      setDomainSearchResult(null);
                    }}
                    className="bg-[#080B16] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-slate-300 font-bold"
                  >
                    <option value="cloudflare_pages">Cloudflare Pages (*.pages.dev)</option>
                    <option value="hostbanger_edge">HOSTBANGER Edge (*.hostbanger.app)</option>
                  </select>

                  <button
                    type="submit"
                    disabled={isSearchingDomain}
                    className="px-5 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-black text-xs flex items-center justify-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.3)] disabled:opacity-50"
                  >
                    {isSearchingDomain ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    Check Name
                  </button>
                </form>

                {domainSearchError && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{domainSearchError}</span>
                  </div>
                )}

                {domainSearchResult && (
                  <div
                    className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      domainSearchResult.available
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-amber-950/40 border-amber-500/40 text-amber-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold">
                        {domainSearchResult.available ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        <span>{domainSearchResult.available ? 'Subdomain Available!' : 'Name Reserved / Unavailable'}</span>
                      </div>
                      <span className="font-mono font-bold text-white block mt-0.5">
                        https://{domainSearchResult.fullDomain}
                      </span>
                      <p className="text-[11px] text-slate-300 mt-0.5">{domainSearchResult.message}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(`https://${domainSearchResult.fullDomain}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#141A30] hover:bg-[#1E2548] text-white text-xs font-semibold flex items-center gap-1 border border-white/10"
                      >
                        <Copy className="w-3 h-3" />
                        Copy URL
                      </button>

                      {domainSearchResult.available && (
                        <button
                          onClick={() => {
                            setUploadProjectName(domainSearchResult.requestedName);
                            setUploadWebsiteTitle(domainSearchResult.requestedName.charAt(0).toUpperCase() + domainSearchResult.requestedName.slice(1));
                            setUploadProvider(domainSearchResult.provider);
                            setActiveTab('upload');
                          }}
                          className="px-4 py-1.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Create Website with this Name
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* LIST OF REGISTERED WEBSITES AND SUBDOMAINS */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-base">Active Registered Website Subdomains ({projects.length})</h3>
                  <button
                    onClick={onCreateNewWebsite}
                    className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-[#00E5FF] flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Create Website
                  </button>
                </div>

                {projects.map(p => (
                  <div
                    key={p.id}
                    className="p-5 rounded-2xl bg-[#111528] border border-[#212946] flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-lg hover:border-[#00E5FF]/30 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h4 className="font-bold text-white text-base">{p.websiteTitle}</h4>
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            p.status === 'Published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : p.status === 'Failed'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : p.status === 'Deploying' || p.status === 'Preparing'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse'
                              : 'bg-slate-700/60 text-slate-300 border border-slate-600'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {p.status}
                        </span>
                        <span className="text-[10px] font-mono text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10">
                          {p.category}
                        </span>
                      </div>

                      {/* Website URL display */}
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="text-slate-400 font-sans">Website URL:</span>
                        <span className="text-[#00E5FF] font-bold">https://{p.subdomain}</span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-sans flex items-center gap-3 flex-wrap">
                        <span>Provider: <strong className="text-slate-200">{p.provider === 'cloudflare_pages' ? 'Cloudflare Pages' : 'HOSTBANGER Edge'}</strong></span>
                        <span>•</span>
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" /> Edge TLS Active
                        </span>
                        <span>•</span>
                        <span>Visits: <strong className="text-slate-200 font-mono">{p.visits}</strong></span>
                      </div>
                    </div>

                    {/* Actions: Copy URL, Open Website, Publish, Edit, Delete */}
                    <div className="flex items-center gap-2 flex-wrap pt-2 lg:pt-0 border-t lg:border-t-0 border-white/5">
                      <button
                        onClick={() => copyToClipboard(`https://${p.subdomain}`)}
                        className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5 text-[#00E5FF]" />
                        Copy URL
                      </button>

                      {p.status === 'Published' && p.publicUrl ? (
                        <a
                          href={p.publicUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-1.5 rounded-lg bg-[#00E5FF] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 hover:bg-[#38BDF8]"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open Website
                        </a>
                      ) : (
                        <button
                          onClick={() => handleDeployDirect(p.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-emerald-400"
                        >
                          <Rocket className="w-3.5 h-3.5" />
                          Publish Website
                        </button>
                      )}

                      <button
                        onClick={() => onEditProject(p)}
                        className="px-3 py-1.5 rounded-lg bg-[#141A30] hover:bg-[#1E2548] text-xs font-bold text-slate-200 flex items-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#00E5FF]" />
                        Edit Website
                      </button>

                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        title="Delete Project"
                        className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 5: DEPLOYMENT HISTORY */}
          {/* ======================================================== */}
          {activeTab === 'deployments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Deployment History & Logs</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Full chronological record of builds, file updates, and edge deployments with status verification.
                </p>
              </div>

              <div className="space-y-3">
                {allDeploymentEvents.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#0F1325] border border-[#212946] text-center text-slate-400 text-xs">
                    No deployment history recorded yet.
                  </div>
                ) : (
                  allDeploymentEvents.map((evt, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-xl bg-[#101426] border border-[#1E2540] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm">{evt.projectName}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                              evt.status === 'Published'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            ● {evt.status}
                          </span>
                        </div>
                        <p className="text-slate-400 mt-1 font-sans">{evt.prompt || 'Code updated & deployed'}</p>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                          <span>{new Date(evt.timestamp).toLocaleString()}</span>
                          <span>•</span>
                          <span className="text-[#00E5FF]">{evt.subdomain}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {evt.publicUrl && (
                          <a
                            href={evt.publicUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-slate-200 text-xs font-bold flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3 text-[#00E5FF]" />
                            View
                          </a>
                        )}
                        <button
                          onClick={() => handleRepublish(evt.projectId)}
                          className="px-3 py-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 text-xs font-bold"
                        >
                          Republish
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 6: FREE HOSTING (CLOUDFLARE PAGES) */}
          {/* ======================================================== */}
          {activeTab === 'hosting' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Free Hosting with Cloudflare Pages</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Deploy supported static websites worldwide with authentic <code className="text-[#00E5FF]">*.pages.dev</code> subdomains.
                </p>
              </div>

              {/* Status and Features */}
              <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946] space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <Cloud className="w-8 h-8 text-orange-400" />
                    <div>
                      <h3 className="font-bold text-white text-base">Cloudflare Pages Connector</h3>
                      <p className="text-xs text-slate-400">Server-side deployment API integration</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
                    ● Production Ready
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#090C18] border border-[#1E2540]">
                    <span className="text-slate-400 font-bold block mb-1">Subdomain Format</span>
                    <span className="font-mono text-[#00E5FF] font-bold">https://yourproject.pages.dev</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#090C18] border border-[#1E2540]">
                    <span className="text-slate-400 font-bold block mb-1">Bandwidth Limit</span>
                    <span className="text-white font-bold">Unlimited static requests (₹0 Free)</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#090C18] border border-[#1E2540]">
                    <span className="text-slate-400 font-bold block mb-1">SSL Certificate</span>
                    <span className="text-emerald-400 font-bold">Universal Edge TLS 1.3 Included</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-300 leading-relaxed bg-[#141A30] p-4 rounded-xl border border-[#242F50]">
                  <p className="font-bold text-white mb-1">Free Hosting Rules & Transparency:</p>
                  <p>
                    • Free subdomains are provided under the hosting provider's domain (<code className="text-[#00E5FF]">*.pages.dev</code> or <code className="text-[#00E5FF]">*.hostbanger.app</code>).
                  </p>
                  <p className="mt-1">
                    • HOSTBANGER never displays fake deployment URLs; websites are only marked as Published once verified by the deployment runner.
                  </p>
                  <p className="mt-1">
                    • To connect a personal custom Cloudflare account token, administrators can set <code className="text-[#00E5FF]">CLOUDFLARE_API_TOKEN</code> and <code className="text-[#00E5FF]">CLOUDFLARE_ACCOUNT_ID</code> in the server environment.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 7: GITHUB INTEGRATION */}
          {/* ======================================================== */}
          {activeTab === 'github' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">GitHub Integration</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Connect your GitHub account to store website source code and deploy with GitHub Pages.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946] space-y-6">
                <div className="flex items-center gap-3">
                  <Github className="w-8 h-8 text-white" />
                  <div>
                    <h3 className="font-bold text-white text-base">Authorized GitHub OAuth / PAT</h3>
                    <p className="text-xs text-slate-400">
                      We never ask for your GitHub password. Connect via authorized handle or token.
                    </p>
                  </div>
                </div>

                <form onSubmit={handleConnectGitHub} className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={githubUser}
                    onChange={e => setGithubUser(e.target.value)}
                    placeholder="Enter your GitHub username (e.g. octocat)"
                    className="flex-1 bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <button
                    type="submit"
                    disabled={isConnectingGithub}
                    className="px-4 py-2 rounded-xl bg-white text-black font-bold text-xs"
                  >
                    {isConnectingGithub ? 'Connecting...' : 'Authorize GitHub'}
                  </button>
                </form>

                {/* Projects GitHub Push Table */}
                <div className="pt-4 border-t border-white/5 space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    Push Website Source Code to GitHub
                  </h4>
                  {projects.map(p => (
                    <div key={p.id} className="p-3.5 rounded-xl bg-[#090C18] border border-[#1E2540] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white text-xs">{p.websiteTitle}</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          Target: {githubUser || 'user'}/{p.name}
                        </span>
                      </div>
                      <button
                        onClick={() => handlePushToGithub(p.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-[#00E5FF] flex items-center gap-1.5"
                      >
                        <Github className="w-3.5 h-3.5" />
                        Push to Repo
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 8: FILE MANAGEMENT */}
          {/* ======================================================== */}
          {activeTab === 'files' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black text-white">File Management</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Inspect and download your website source files (index.html, style.css, script.js).
                  </p>
                </div>
                {projects.length > 0 && (
                  <select
                    value={selectedFileProject}
                    onChange={e => {
                      setSelectedFileProject(e.target.value);
                      loadProjectFiles(e.target.value);
                    }}
                    className="bg-[#141A30] border border-[#242F50] text-xs font-semibold rounded-xl px-3 py-2 text-white"
                  >
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>{p.websiteTitle}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[500px] rounded-2xl bg-[#0D1020] border border-[#1F2742] overflow-hidden">
                <div className="p-4 bg-[#0A0C18] border-r border-[#1B223A] overflow-y-auto">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Static Project Files
                  </div>
                  <div className="space-y-1">
                    {fileList.map((f, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setActiveFileName(f.name);
                          setActiveFileContent(f.content);
                        }}
                        className={`w-full text-left p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors ${
                          activeFileName === f.name ? 'bg-[#18213E] text-[#00E5FF]' : 'text-slate-300 hover:bg-white/5'
                        }`}
                      >
                        <span className="truncate">{f.name}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{f.size} B</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 p-4 flex flex-col bg-[#070912]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#1A223A]">
                    <span className="font-mono text-xs font-bold text-slate-300">
                      /{activeFileName || 'index.html'}
                    </span>
                    <span className="text-[10px] text-[#00E5FF] font-semibold">
                      Validated for Static Deployment
                    </span>
                  </div>
                  <pre className="flex-1 overflow-auto p-4 text-xs font-mono text-emerald-400 bg-black/40 rounded-lg mt-3 leading-relaxed">
                    {activeFileContent || '// Select a file to inspect content'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 9: RESOURCES */}
          {/* ======================================================== */}
          {activeTab === 'resources' && hostingStats && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Storage & Bandwidth Usage</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Accurate metrics measured across your HOSTBANGER containers and Cloudflare edge caches.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
                  <span className="text-xs font-bold text-slate-400 uppercase">Disk Storage</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-white font-mono">{hostingStats.storage.usedMb} MB</span>
                    <span className="text-xs text-slate-400 font-semibold">/ 500 MB (Free)</span>
                  </div>
                  <div className="mt-4 w-full h-2 bg-[#1A2038] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (hostingStats.storage.usedMb / 500) * 100)}%` }}
                      className="h-full bg-[#00E5FF]"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
                  <span className="text-xs font-bold text-slate-400 uppercase">Monthly Bandwidth</span>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-3xl font-black text-[#00E5FF] font-mono">{hostingStats.bandwidth.usedMb} MB</span>
                    <span className="text-xs text-slate-400 font-semibold">/ 100 GB (Free)</span>
                  </div>
                  <div className="mt-4 w-full h-2 bg-[#1A2038] rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, (hostingStats.bandwidth.usedMb / 100000) * 100)}%` }}
                      className="h-full bg-gradient-to-r from-[#00E5FF] to-[#A855F7]"
                    />
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
                  <span className="text-xs font-bold text-slate-400 uppercase">Edge Nodes</span>
                  <div className="mt-2">
                    <span className="text-3xl font-black text-emerald-400 font-mono">300+ PoPs</span>
                    <span className="text-xs text-slate-400 block mt-1">Cloudflare & HOSTBANGER SLA</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 10: SUPPORT */}
          {/* ======================================================== */}
          {activeTab === 'support' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Helpdesk & Support Center</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Assistance with Cloudflare Pages, subdomains, AI builder, and GitHub publishing.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
                <h3 className="font-bold text-white text-base mb-4">Open Support Ticket</h3>
                <form onSubmit={handleCreateTicket} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Subject</label>
                      <input
                        type="text"
                        required
                        value={ticketSubject}
                        onChange={e => setTicketSubject(e.target.value)}
                        placeholder="e.g. Question about Cloudflare Pages deployment"
                        className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                      <select
                        value={ticketCategory}
                        onChange={e => setTicketCategory(e.target.value)}
                        className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-xs text-white"
                      >
                        <option value="Cloudflare Pages">Cloudflare Pages</option>
                        <option value="Hosting">Hosting Infrastructure</option>
                        <option value="GitHub">GitHub Pages</option>
                        <option value="AI Builder">AI Builder</option>
                        <option value="Domains">Subdomains</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={ticketMessage}
                      onChange={e => setTicketMessage(e.target.value)}
                      placeholder="Describe the issue..."
                      className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl p-3 text-xs text-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-bold text-xs"
                  >
                    Submit Ticket
                  </button>
                </form>
              </div>

              {/* Tickets list */}
              <div className="space-y-4">
                <h3 className="font-bold text-white text-base">Your Tickets</h3>
                {tickets.map(t => (
                  <div key={t.id} className="p-5 rounded-2xl bg-[#111528] border border-[#212946]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-white text-sm">{t.subject}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                        {t.status}
                      </span>
                    </div>
                    <div className="space-y-2 mt-4 pt-3 border-t border-white/5">
                      {t.messages.map((m, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-xl text-xs ${
                            m.sender === 'user' ? 'bg-[#18213E] text-slate-200' : 'bg-[#1C1835] text-purple-200 border border-purple-500/20'
                          }`}
                        >
                          <span className="font-bold block text-[10px] text-slate-400 mb-1">
                            {m.sender === 'user' ? 'You' : 'HOSTBANGER Engineer'}
                          </span>
                          {m.text}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* TAB 11: ACCOUNT SETTINGS */}
          {/* ======================================================== */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Account Settings & Supabase Auth</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your HOSTBANGER profile, credentials, and Supabase database connection.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946] max-w-xl space-y-6">
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Display Name</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={e => setProfileName(e.target.value)}
                      className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl p-2.5 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={currentUser?.email || ''}
                      className="w-full bg-[#080B15] border border-[#232B48] rounded-xl p-2.5 text-xs text-slate-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-bold text-xs"
                    >
                      Save Profile
                    </button>
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      className="px-4 py-2.5 rounded-xl bg-[#18213E] text-slate-200 font-bold text-xs hover:bg-[#253360]"
                    >
                      Send Password Reset Email
                    </button>
                  </div>
                </form>

                {/* Danger zone */}
                <div className="pt-6 border-t border-rose-500/20">
                  <h4 className="text-xs font-bold uppercase text-rose-400 tracking-wider mb-2">
                    Delete Account
                  </h4>
                  <p className="text-xs text-slate-400 mb-4">
                    Permanently delete your HOSTBANGER account and unpublish all live projects.
                  </p>
                  <button
                    onClick={handleDeleteAccount}
                    className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold"
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
