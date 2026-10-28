export type DeploymentStatus = 'Draft' | 'Preparing' | 'Deploying' | 'Published' | 'Failed';
export type HostingProvider = 'cloudflare_pages' | 'github_pages' | 'hostbanger_edge' | 'vip_cloud_hosting';
export type PlanTier = 'free' | 'pro' | 'business' | 'vip_starter' | 'vip_pro' | 'vip_business';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  plan: PlanTier;
  avatar?: string;
  githubUsername?: string;
  githubConnected?: boolean;
  createdAt: string;
}

export interface WebsiteProject {
  id: string;
  userId: string;
  name: string; // project_name
  slug: string;
  websiteTitle: string; // website_title
  websiteDescription: string; // website_description
  category: 'Gaming' | 'Business' | 'Portfolio' | 'Blog' | 'Store' | 'Educational' | 'Entertainment' | 'Landing Page';
  html: string;
  css: string;
  js: string;
  python?: string;
  aiMode?: 'website' | 'game' | 'code' | 'think';
  thinking?: string;
  status: DeploymentStatus;
  subdomain: string;
  customDomain?: string;
  provider: HostingProvider;
  publicUrl?: string;
  deployedAt?: string;
  errorMessage?: string;
  recoveryHint?: string;
  githubRepo?: string;
  githubPagesUrl?: string;
  cloudflareProjectId?: string;
  createdAt: string;
  updatedAt: string;
  storageMb: number;
  bandwidthMb: number;
  visits: number;
  sslActive: boolean;
  history?: Array<{
    id: string;
    timestamp: string;
    prompt: string;
    html: string;
    css: string;
    js: string;
    python?: string;
    thinking?: string;
  }>;
}

export interface DomainRecord {
  id: string;
  userId: string;
  projectId?: string;
  domainName: string;
  tld: string;
  status: 'active' | 'pending' | 'expired';
  registrationDate: string;
  renewalDate: string;
  priceInr: number;
  renewalPriceInr: number;
  autoRenew: boolean;
  dnsRecords: DnsRecord[];
}

export interface DnsRecord {
  id: string;
  type: 'A' | 'CNAME' | 'TXT' | 'MX';
  name: string;
  value: string;
  ttl: number;
  status: 'verified' | 'pending';
}

export interface SubscriptionRecord {
  id: string;
  userId: string;
  planId: PlanTier;
  planName: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodEnd: string;
  amountInr: number;
  interval: 'monthly' | 'yearly';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  userId: string;
  type: 'vip_subscription' | 'domain_purchase';
  itemTitle: string;
  amountInr: number;
  status: 'verified' | 'pending' | 'failed';
  paymentMethod: string;
  invoiceNumber: string;
  createdAt: string;
}

export interface SubdomainCheckResult {
  requestedName: string;
  fullDomain: string;
  provider: HostingProvider;
  available: boolean;
  message: string;
  suggestedAlternatives?: string[];
}

export interface DomainCheckResult {
  domain: string;
  tld: string;
  available: boolean;
  priceInr: number;
  renewalPriceInr: number;
  statusText: string;
  registrar: string;
}

export interface WebsiteTemplate {
  id: string;
  name: string;
  category: 'Gaming' | 'Business' | 'Portfolio' | 'Blog' | 'Store' | 'Educational' | 'Entertainment' | 'Landing Page';
  description: string;
  thumbnail: string;
  features: string[];
  html: string;
  css: string;
  js: string;
  python?: string;
  isPopular?: boolean;
}

export type AiMode = 'website' | 'game' | 'code' | 'think';

export interface AiGenerationResult {
  title: string;
  html: string;
  css: string;
  js: string;
  python?: string;
  thinking?: string;
  explanation?: string;
  mode?: AiMode;
  prompt: string;
  source: string;
}

export interface HostingPlan {
  id: PlanTier;
  name: string;
  priceMonthlyInr?: number;
  priceMonthly?: number;
  priceYearlyInr?: number;
  priceYearly?: number;
  renewalPriceInr?: number;
  tagline: string;
  badge?: string;
  isPopular?: boolean;
  isVip?: boolean;
  features: {
    freePublishing: string;
    subdomains?: string;
    freeSubdomain?: string;
    customDomain?: boolean | string;
    customDomainSupport?: boolean;
    cloudflarePages: boolean;
    githubPages?: boolean;
    commercialHosting?: boolean;
    storage: string;
    bandwidth: string;
    aiCredits: string;
    ssl?: string;
    backups: string;
    support: string;
    analytics?: string;
    freeSSL?: boolean;
    advancedCodeEditor?: boolean;
    [key: string]: any;
  };
}

export interface BackupItem {
  id: string;
  projectId: string;
  projectName: string;
  createdAt: string;
  sizeMb: number;
  type: 'auto' | 'manual';
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'Free Hosting' | 'VIP Hosting' | 'Domains' | 'Cloudflare Pages' | 'GitHub' | 'AI Builder' | 'Billing & Payments' | 'General';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  messages: Array<{
    sender: 'user' | 'support';
    text: string;
    timestamp: string;
  }>;
}

export interface AdminMetrics {
  totalUsers: number;
  totalProjects: number;
  activeDeployments: number;
  totalAiGenerations: number;
  totalStorageUsedGb: number;
  totalBandwidthServedGb: number;
  monthlyRevenueInr?: number;
  monthlyRevenue?: number;
  activePaidSubscriptions?: number;
  openTickets: number;
  serverUptime: number;
}
