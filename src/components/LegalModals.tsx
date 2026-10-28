import React, { useState } from 'react';
import { X, Copy, Check, Database, Shield, FileText, Cloud, Terminal, Github } from 'lucide-react';

interface LegalModalsProps {
  activeModal: 'privacy' | 'terms' | 'schema' | 'integrations' | null;
  onClose: () => void;
}

export const LegalModals: React.FC<LegalModalsProps> = ({ activeModal, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!activeModal) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const schemaSQL = `-- ============================================================
-- HOSTBANGER DATABASE SCHEMA (Supabase PostgreSQL with RLS)
-- ============================================================

-- 1. User Profiles Table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    display_name TEXT NOT NULL,
    plan_tier TEXT NOT NULL DEFAULT 'free' CHECK (plan_tier IN ('free', 'vip_starter', 'vip_pro', 'vip_business')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 2. Website Projects Table
CREATE TABLE public.website_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    project_name TEXT NOT NULL,
    website_title TEXT NOT NULL,
    website_description TEXT,
    category TEXT NOT NULL DEFAULT 'Business',
    source_files JSONB NOT NULL DEFAULT '{"index.html":"","style.css":"","script.js":""}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 3. Deployment Records Table
CREATE TABLE public.deployment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.website_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('cloudflare_pages', 'github_pages', 'hostbanger_edge')),
    deployment_status TEXT NOT NULL DEFAULT 'Draft' CHECK (deployment_status IN ('Draft', 'Preparing', 'Deploying', 'Published', 'Failed')),
    deployment_logs JSONB DEFAULT '[]'::jsonb,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 4. Provider Project Identifiers Table
CREATE TABLE public.provider_project_identifiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.website_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('cloudflare_pages', 'github_pages', 'hostbanger_edge')),
    provider_project_id TEXT NOT NULL,
    environment_variables JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 5. Public Website URLs Table
CREATE TABLE public.public_website_urls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.website_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subdomain TEXT NOT NULL UNIQUE,
    full_public_url TEXT NOT NULL UNIQUE,
    provider TEXT NOT NULL,
    ssl_active BOOLEAN NOT NULL DEFAULT true,
    total_visits BIGINT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deployment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_project_identifiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.public_website_urls ENABLE ROW LEVEL SECURITY;

-- 1. user_profiles: Users can only read/update their own profile
CREATE POLICY "Users can access only their own user profile"
ON public.user_profiles FOR ALL
USING (auth.uid() = id);

-- 2. website_projects: Users can only access their authorized website projects
CREATE POLICY "Users can access only their own website projects"
ON public.website_projects FOR ALL
USING (auth.uid() = user_id);

-- 3. deployment_records: Users can only access their own deployment records
CREATE POLICY "Users can access only their own deployment records"
ON public.deployment_records FOR ALL
USING (auth.uid() = user_id);

-- 4. provider_project_identifiers: Users can only access their provider IDs
CREATE POLICY "Users can access only their own provider identifiers"
ON public.provider_project_identifiers FOR ALL
USING (auth.uid() = user_id);

-- 5. public_website_urls: Users can manage their own URLs, public can view
CREATE POLICY "Users can manage only their own public website URLs"
ON public.public_website_urls FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Public read-only access for published website URLs"
ON public.public_website_urls FOR SELECT
USING (true);`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-[#0E1222] border border-[#232B48] rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1F2742] bg-[#12172C]">
          <div className="flex items-center gap-2.5">
            {activeModal === 'privacy' && <Shield className="w-5 h-5 text-purple-400" />}
            {activeModal === 'terms' && <FileText className="w-5 h-5 text-[#00E5FF]" />}
            {activeModal === 'schema' && <Database className="w-5 h-5 text-indigo-400" />}
            {activeModal === 'integrations' && <Cloud className="w-5 h-5 text-cyan-400" />}
            <h3 className="font-bold text-white text-lg capitalize">
              {activeModal === 'schema'
                ? 'Supabase PostgreSQL Schema & RLS Policies'
                : activeModal === 'integrations'
                ? 'Cloudflare Pages & GitHub Integration Guide'
                : activeModal === 'privacy'
                ? 'HOSTBANGER Privacy Policy'
                : 'HOSTBANGER Terms of Service'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-slate-300 text-sm leading-relaxed">
          {activeModal === 'privacy' && (
            <div className="space-y-4">
              <p>
                <strong>Last Updated: October 2026</strong>
              </p>
              <p>
                At HOSTBANGER (Tagline: "Build Free. Publish Instantly."), we believe in user data autonomy and zero tracking lock-in.
              </p>
              <h4 className="text-white font-bold pt-2">1. 100% User Code Ownership</h4>
              <p>
                All website files, HTML markup, CSS styling, and JavaScript logic created in HOSTBANGER belong entirely to you. You can download and self-host your files at any time.
              </p>
              <h4 className="text-white font-bold pt-2">2. Secure Server Sandboxing</h4>
              <p>
                All preview frames operate within sandboxed frames to prevent cross-site execution.
              </p>
              <h4 className="text-white font-bold pt-2">3. Account Deletion</h4>
              <p>
                You have the full right to delete your account, saved projects, and associated deployments at any time directly through the Account Settings tab.
              </p>
            </div>
          )}

          {activeModal === 'terms' && (
            <div className="space-y-4">
              <p>
                <strong>Effective Date: October 2026</strong>
              </p>
              <p>
                Welcome to HOSTBANGER. By using our website builder and free hosting services, you agree to these transparent terms.
              </p>
              <h4 className="text-white font-bold pt-2">1. Free Hosting & Subdomains</h4>
              <p>
                Free subdomains (such as <code className="text-[#00E5FF]">*.pages.dev</code> or <code className="text-[#00E5FF]">*.hostbanger.app</code>) are provided under the respective hosting provider's root domain and remain subject to acceptable use policies.
              </p>
              <h4 className="text-white font-bold pt-2">2. Acceptable Use Policy</h4>
              <p>
                Users may not deploy malware, deceptive phishing pages, or illegal content. Violating sites are removed immediately.
              </p>
            </div>
          )}

          {activeModal === 'schema' && (
            <div className="space-y-4">
              <p className="text-slate-400">
                HOSTBANGER includes full schema definitions for Supabase PostgreSQL with Row Level Security (RLS) covering <code className="text-[#00E5FF]">profiles</code>, <code className="text-[#00E5FF]">projects</code>, and <code className="text-[#00E5FF]">deployments</code>:
              </p>
              <div className="relative">
                <button
                  onClick={() => handleCopy(schemaSQL)}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded bg-[#1A223C] hover:bg-[#28355C] text-xs font-semibold text-white flex items-center gap-1.5 border border-[#334270]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
                  {copied ? 'Copied SQL' : 'Copy Script'}
                </button>
                <pre className="p-4 rounded-xl bg-[#080B15] border border-[#1C2542] text-xs font-mono text-emerald-400 overflow-x-auto max-h-[350px]">
                  {schemaSQL}
                </pre>
              </div>
            </div>
          )}

          {activeModal === 'integrations' && (
            <div className="space-y-4">
              <p className="text-slate-300">
                Setup guide for external providers and required environment variables:
              </p>

              <div className="grid gap-3">
                <div className="p-3.5 rounded-xl bg-[#141A30] border border-[#232D4E]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Cloud className="w-4 h-4 text-orange-400" />
                      Cloudflare Pages (Static Hosting)
                    </span>
                    <span className="text-[11px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-400/10">
                      SUPPORTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Set <code className="text-[#00E5FF]">CLOUDFLARE_API_TOKEN</code> and <code className="text-[#00E5FF]">CLOUDFLARE_ACCOUNT_ID</code> in server environment to connect your direct Cloudflare account. Automatic fallback edge hosting is active if unset.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141A30] border border-[#232D4E]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Github className="w-4 h-4 text-white" />
                      GitHub OAuth & GitHub Pages
                    </span>
                    <span className="text-[11px] font-bold text-purple-400 px-2 py-0.5 rounded bg-purple-400/10">
                      OAUTH / PAT READY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Allows pushing static source files to user repositories and deploying to <code className="text-[#00E5FF]">https://username.github.io/repo/</code>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#141A30] border border-[#232D4E]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white flex items-center gap-2">
                      <Database className="w-4 h-4 text-indigo-400" />
                      Supabase PostgreSQL & Auth
                    </span>
                    <span className="text-[11px] font-bold text-indigo-400 px-2 py-0.5 rounded bg-indigo-400/10">
                      SCHEMA READY
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Run the SQL schema provided in the Schema tab inside your Supabase SQL editor to create the <code className="text-[#00E5FF]">profiles</code>, <code className="text-[#00E5FF]">projects</code>, and <code className="text-[#00E5FF]">deployments</code> tables.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1F2742] bg-[#12172C] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] font-bold text-xs"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
