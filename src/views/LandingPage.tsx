import React, { useState } from 'react';
import { TEMPLATES, HOSTING_PLANS } from '../data/templates';
import { WebsiteTemplate, HostingProvider, SubdomainCheckResult, AiMode } from '../types';
import { api } from '../services/api';
import {
  Sparkles,
  ArrowRight,
  Zap,
  Shield,
  Server,
  Globe,
  Code2,
  Check,
  ChevronDown,
  Layers,
  Rocket,
  Cpu,
  Monitor,
  ExternalLink,
  Flame,
  Award,
  Users,
  Cloud,
  Github,
  CheckCircle2,
  HelpCircle,
  Plus,
  Search,
  Copy,
  AlertTriangle,
  RefreshCw,
  Lock,
  Gamepad2,
  Terminal,
  Brain,
  Play
} from 'lucide-react';

interface LandingPageProps {
  onStartGenerating: (prompt: string, category?: string, mode?: AiMode) => void;
  onExploreTemplates: () => void;
  onSelectTemplate: (template: WebsiteTemplate) => void;
  onPreviewTemplate: (template: WebsiteTemplate) => void;
  onOpenPricingPlan: (planId: string) => void;
  onClaimSubdomain?: (subdomain: string, provider: HostingProvider) => void;
  onNavigateToDomains?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartGenerating,
  onExploreTemplates,
  onSelectTemplate,
  onPreviewTemplate,
  onOpenPricingPlan,
  onClaimSubdomain,
  onNavigateToDomains
}) => {
  const [heroPrompt, setHeroPrompt] = useState('');
  const [aiMode, setAiMode] = useState<AiMode>('website');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Free Subdomain Search State
  const [domainSearchName, setDomainSearchName] = useState('shadowgaming');
  const [domainProvider, setDomainProvider] = useState<HostingProvider>('cloudflare_pages');
  const [isCheckingDomain, setIsCheckingDomain] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<SubdomainCheckResult | null>(null);
  const [domainError, setDomainError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const cleanDomain = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  };

  const handleCheckDomain = async (nameToCheck?: string) => {
    const raw = nameToCheck !== undefined ? nameToCheck : domainSearchName;
    const clean = cleanDomain(raw).replace(/(^-|-$)/g, '');

    if (!clean || clean.length < 3) {
      setDomainError('Website name must be at least 3 characters.');
      setDomainCheckResult(null);
      return;
    }

    setIsCheckingDomain(true);
    setDomainError(null);

    try {
      const res = await api.checkSubdomain(clean, domainProvider);
      setDomainCheckResult(res);
    } catch (err: any) {
      setDomainError(err?.message || 'Failed to verify name with hosting provider.');
      setDomainCheckResult(null);
    } finally {
      setIsCheckingDomain(false);
    }
  };

  const copyDomainUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const categories = [
    'All',
    'Gaming',
    'Business',
    'Portfolio',
    'Blog',
    'Store',
    'Educational',
    'Entertainment',
    'Landing Page'
  ];

  const filteredTemplates = selectedCategory === 'All'
    ? TEMPLATES
    : TEMPLATES.filter(t => t.category === selectedCategory);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const promptToUse = heroPrompt.trim() || (
      aiMode === 'game'
        ? 'Create a 60fps retro space shooter arcade game with score counter and sound effects'
        : aiMode === 'code'
        ? 'Generate HTML5 semantic layout, modern CSS, interactive JS, and complete Python FastAPI backend'
        : aiMode === 'think'
        ? 'Analyze the architecture for hosting a high-performance web app with free subdomains'
        : 'Create a professional gaming website with game cards, a dark theme, and a navigation menu.'
    );
    const category = aiMode === 'game' ? 'Gaming' : 'Business';
    onStartGenerating(promptToUse, category, aiMode);
  };

  const samplePromptsByMode: Record<AiMode, Array<{ label: string; prompt: string }>> = {
    website: [
      { label: 'Gaming Clan', prompt: 'Create a professional gaming website with game cards, a dark theme, and a navigation menu.' },
      { label: 'SaaS AI Engine', prompt: 'Build a modern responsive AI startup landing page with hero, benchmarks, and pricing table.' },
      { label: 'Luxury Brand Store', prompt: 'Architectural techwear boutique storefront with dynamic shopping bag and drop lookbook.' },
      { label: 'Creative Portfolio', prompt: 'Minimalist high-contrast portfolio for an interaction designer with selected case studies.' }
    ],
    game: [
      { label: '🚀 Space Defender', prompt: 'Create a 60fps space shooter arcade game with laser bursts, alien waves, and sound effects.' },
      { label: '🐍 Cyber Snake', prompt: 'Create a retro cyber snake game with neon grid, score multiplier, and touch buttons.' },
      { label: '🏓 Neon Pong 2026', prompt: 'Create a two-player neon paddle ball arcade game with 60fps physics and score tracking.' },
      { label: '🧱 Brick Breaker', prompt: 'Create a neon brick breaker arcade game with particle explosions and high score counter.' }
    ],
    code: [
      { label: 'Full-Stack Python + HTML', prompt: 'Generate semantic HTML5, modern CSS, interactive JS, and complete Python FastAPI backend.' },
      { label: 'Python Pygame Script', prompt: 'Generate complete Python Pygame arcade script with player physics, collision detection, and score.' },
      { label: 'Python Flask REST API', prompt: 'Generate a Python Flask backend service with CRUD endpoints and connected frontend UI.' },
      { label: 'Data Dashboard', prompt: 'Create interactive HTML/JS analytics cards with connected Python data processing script.' }
    ],
    think: [
      { label: 'Edge Architecture', prompt: 'Analyze how Cloudflare Pages handles static routing and automated TLS 1.3 Let\'s Encrypt certificates.' },
      { label: 'Game Loop Optimization', prompt: 'Explain the mathematical principles of requestAnimationFrame game loops and canvas rendering.' },
      { label: 'Python Backend Setup', prompt: 'How do I connect a static frontend on Cloudflare Pages with a Python backend service?' },
      { label: 'Subdomain DNS Rules', prompt: 'Explain DNS CNAME verification, RFC 1123 label standards, and edge propagation.' }
    ]
  };

  const currentSamplePrompts = samplePromptsByMode[aiMode] || samplePromptsByMode.website;

  const faqs = [
    {
      q: 'Is HOSTBANGER website creation and hosting truly free?',
      a: 'Yes! The Free Forever tier allows you to generate websites, edit HTML/CSS/JS, save projects, download source files, and publish to free subdomains (such as *.pages.dev or *.hostbanger.app) powered by Cloudflare Pages and our distributed edge network.'
    },
    {
      q: 'How does Cloudflare Pages integration work?',
      a: 'Cloudflare Pages hosts your static website assets (HTML, CSS, JS, images) across their ultra-fast global network. When you publish, your project receives an authentic free subdomain (e.g. https://yourname.pages.dev) with automatic HTTPS and DDoS mitigation.'
    },
    {
      q: 'What is the difference between Cloudflare Pages and GitHub Pages?',
      a: 'Cloudflare Pages deploys directly from static uploads or connected Git repos to a custom *.pages.dev address with instant edge caching. GitHub Pages deploys your source code directly from a GitHub repository branch to https://username.github.io/repo/. Both are supported on HOSTBANGER.'
    },
    {
      q: 'Can I download and keep my website source code?',
      a: 'Absolutely. You retain 100% intellectual property ownership. You can download a complete ZIP bundle containing clean index.html, style.css, script.js, and documentation at any time with zero vendor lock-in.'
    },
    {
      q: 'What happens if the AI model is temporarily busy or unavailable?',
      a: 'HOSTBANGER includes an automatic template-based synthesizer and direct visual code editor fallback, ensuring you can always construct, customize, and publish your website without interruption.'
    }
  ];

  return (
    <div className="min-h-screen text-slate-100 selection:bg-[#00E5FF] selection:text-[#0B0D19]">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Background Gradients & Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#6366F1]/20 via-[#A855F7]/15 to-[#00E5FF]/20 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute top-10 right-10 w-96 h-96 bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B30] border border-[#2B355A] text-xs font-bold text-slate-300 shadow-xl mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E5FF] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E5FF]"></span>
            </span>
            <span className="text-[#00E5FF] uppercase tracking-wider font-extrabold">TAGLINE: Get Your Free Website Address!</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Free Subdomains on Cloudflare Pages</span>
          </div>

          {/* EXACT HERO HEADING AS SPECIFIED */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-[1.12]">
            Get Your Free Website{' '}
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
              Domain!
            </span>
          </h1>

          {/* EXACT HERO SUBTITLE AS SPECIFIED */}
          <p className="mt-4 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Choose your website name, publish your website, and share your free URL with everyone.
          </p>

          {/* ======================================================== */}
          {/* DOMAIN-NAME SEARCH BOX AS SPECIFIED */}
          {/* ======================================================== */}
          <div className="mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCheckDomain();
              }}
              className="p-2 sm:p-2.5 rounded-2xl bg-[#12162A]/95 border border-[#2B3456] shadow-[0_15px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl focus-within:border-[#00E5FF] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full flex items-center">
                  <Globe className="w-5 h-5 text-[#00E5FF] ml-3.5 shrink-0" />
                  <input
                    type="text"
                    value={domainSearchName}
                    onChange={(e) => {
                      setDomainSearchName(e.target.value);
                      setDomainCheckResult(null);
                      setDomainError(null);
                    }}
                    placeholder="Enter your website name"
                    className="w-full py-3 pl-3 pr-28 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base font-mono focus:outline-none"
                  />
                  <span className="absolute right-3 text-xs font-mono text-slate-400 select-none">
                    .pages.dev
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isCheckingDomain}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.4)] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                >
                  {isCheckingDomain ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-[#0B0D19]" />
                      Checking...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 text-[#0B0D19]" />
                      Check Name
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Expected URL format & quick chips */}
            <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-slate-400 px-1 gap-2">
              <div className="flex items-center gap-1.5 font-mono">
                <span>Expected URL:</span>
                <span className="text-[#00E5FF] font-bold">
                  https://{cleanDomain(domainSearchName) || 'shadowgaming'}.pages.dev
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Try:</span>
                {['shadowgaming', 'apexclan', 'novaflow', 'techblog'].map(chip => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => {
                      setDomainSearchName(chip);
                      handleCheckDomain(chip);
                    }}
                    className="text-slate-300 hover:text-[#00E5FF] font-mono underline decoration-dotted"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Validation Error Message */}
            {domainError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{domainError}</span>
              </div>
            )}

            {/* Verification Result Card */}
            {domainCheckResult && (
              <div
                className={`mt-4 p-4 sm:p-5 rounded-2xl border text-left transition-all animate-in fade-in duration-200 ${
                  domainCheckResult.available
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-100 shadow-[0_0_25px_rgba(16,185,129,0.2)]'
                    : 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {domainCheckResult.available ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      )}
                      <span className="font-bold text-sm uppercase tracking-wide">
                        {domainCheckResult.available ? 'Subdomain Available!' : 'Name Reserved / Unavailable'}
                      </span>
                    </div>

                    <p className="font-mono text-base sm:text-lg font-black text-white mt-1">
                      https://{domainCheckResult.fullDomain}
                    </p>

                    <p className="text-xs text-slate-300 mt-0.5">{domainCheckResult.message}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => copyDomainUrl(`https://${domainCheckResult.fullDomain}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#141A30] hover:bg-[#1E2548] text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                    >
                      {copiedUrl === `https://${domainCheckResult.fullDomain}` ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-300" />
                      )}
                      <span>{copiedUrl === `https://${domainCheckResult.fullDomain}` ? 'Copied' : 'Copy'}</span>
                    </button>

                    {domainCheckResult.available && (
                      <button
                        onClick={() => {
                          if (onClaimSubdomain) {
                            onClaimSubdomain(domainCheckResult.requestedName, domainCheckResult.provider);
                          } else {
                            onStartGenerating(`Build a complete website for ${domainCheckResult.requestedName} with modern responsive layout`);
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#00E5FF] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:bg-[#38BDF8]"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#0B0D19]" />
                        Claim Name & Build Website
                      </button>
                    )}
                  </div>
                </div>

                {/* Suggestions when unavailable */}
                {!domainCheckResult.available && domainCheckResult.suggestedAlternatives && domainCheckResult.suggestedAlternatives.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5 text-xs">
                    <span className="font-bold text-white block">
                      Recommended Available Alternatives:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {domainCheckResult.suggestedAlternatives.map(alt => (
                        <button
                          key={alt}
                          onClick={() => {
                            setDomainSearchName(alt);
                            handleCheckDomain(alt);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#0F1426] hover:bg-[#1A223E] border border-amber-500/30 text-xs font-mono text-[#00E5FF] flex items-center gap-1"
                        >
                          <span>{alt}.pages.dev</span>
                          <ArrowRight className="w-3 h-3 text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Provider Policy Explanation */}
            <p className="mt-3 text-[11px] text-slate-500 leading-normal text-center">
              * Availability is verified through the Cloudflare Pages hosting provider workflow. Free subdomains are supplied under <code className="text-[#00E5FF]">*.pages.dev</code> with automatic TLS 1.3 encryption and DDoS protection.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onStartGenerating('Create a modern website with hero, features, and responsive layout')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-sm tracking-wide shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Rocket className="w-4 h-4 text-[#0B0D19]" />
              Get Free Hosting
            </button>

            <button
              onClick={() => onStartGenerating('Create a high converting business landing page with modern cards')}
              className="px-6 py-3.5 rounded-xl bg-[#161B30] hover:bg-[#1E2544] text-white border border-[#2B355A] font-extrabold text-sm flex items-center gap-2 transition-all hover:border-[#00E5FF]/40 shadow-lg"
            >
              <Plus className="w-4 h-4 text-[#00E5FF]" />
              Create Website
            </button>

            <button
              onClick={() => onStartGenerating(heroPrompt || 'Create a professional gaming website with game cards, a dark theme, and a navigation menu.')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#6366F1] to-[#A855F7] text-white font-black text-sm tracking-wide shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 border border-purple-400/30"
            >
              <Sparkles className="w-4 h-4 text-[#00E5FF]" />
              Generate Website with AI
            </button>

            <button
              onClick={onExploreTemplates}
              className="px-6 py-3.5 rounded-xl bg-[#161B30] hover:bg-[#1E2544] text-slate-200 border border-[#283256] font-bold text-sm flex items-center gap-2 transition-all"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Explore Templates
            </button>
          </div>

          {/* Large AI Prompt Box with Gemini AI Integration */}
          <div className="mt-12 max-w-3xl mx-auto text-left">
            {/* Gemini AI Status Header & Mode Switcher */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-3 px-1">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-[#00E5FF]/15 to-[#A855F7]/15 border border-[#00E5FF]/30 text-xs font-bold text-white shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00E5FF] animate-pulse" />
                  <span className="bg-gradient-to-r from-[#00E5FF] via-white to-[#A855F7] bg-clip-text text-transparent font-extrabold tracking-wide">
                    GOOGLE GEMINI 3.8 FLASH & THINKING AI
                  </span>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active
                </span>
              </div>

              {/* Mode Toggle Pills */}
              <div className="flex items-center bg-[#151A30] p-1 rounded-xl border border-[#252F50] text-xs">
                <button
                  type="button"
                  onClick={() => setAiMode('website')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    aiMode === 'website'
                      ? 'bg-[#00E5FF] text-[#0B0D19] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  Website
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode('game')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    aiMode === 'game'
                      ? 'bg-[#A855F7] text-white shadow-[0_0_10px_rgba(168,85,247,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Gamepad2 className="w-3.5 h-3.5" />
                  Game
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode('code')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    aiMode === 'code'
                      ? 'bg-[#38BDF8] text-[#0B0D19] shadow-[0_0_10px_rgba(56,189,248,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  Code
                </button>
                <button
                  type="button"
                  onClick={() => setAiMode('think')}
                  className={`px-3 py-1 rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                    aiMode === 'think'
                      ? 'bg-[#EAB308] text-[#0B0D19] shadow-[0_0_10px_rgba(234,179,8,0.4)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Brain className="w-3.5 h-3.5" />
                  Think
                </button>
              </div>
            </div>

            <form
              onSubmit={handleHeroSubmit}
              className="relative p-2.5 rounded-2xl bg-[#12162A]/95 border border-[#2B3456] shadow-[0_20px_60px_rgba(0,0,0,0.7)] backdrop-blur-xl focus-within:border-[#00E5FF] transition-all"
            >
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative flex-1 w-full flex items-center">
                  {aiMode === 'game' ? (
                    <Gamepad2 className="w-5 h-5 text-[#A855F7] ml-3 shrink-0" />
                  ) : aiMode === 'code' ? (
                    <Terminal className="w-5 h-5 text-[#38BDF8] ml-3 shrink-0" />
                  ) : aiMode === 'think' ? (
                    <Brain className="w-5 h-5 text-amber-400 ml-3 shrink-0" />
                  ) : (
                    <Sparkles className="w-5 h-5 text-[#00E5FF] ml-3 shrink-0" />
                  )}
                  <input
                    type="text"
                    value={heroPrompt}
                    onChange={(e) => setHeroPrompt(e.target.value)}
                    placeholder={
                      aiMode === 'game'
                        ? 'Describe your game... (e.g. 60fps retro space shooter with sound effects & high score)'
                        : aiMode === 'code'
                        ? 'Describe code to generate... (e.g. Full-stack HTML5, modern CSS, JS, & Python backend)'
                        : aiMode === 'think'
                        ? 'Ask Gemini AI anything... (e.g. How to architect a responsive site with free Cloudflare edge)'
                        : 'Describe your website... (e.g. Modern SaaS AI startup with dark neon theme and benchmarks)'
                    }
                    className="w-full py-3.5 pl-3 pr-4 bg-transparent text-white placeholder-slate-500 text-sm sm:text-base focus:outline-none font-medium"
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm tracking-wide transition-all flex items-center justify-center gap-2 shrink-0 ${
                    aiMode === 'game'
                      ? 'bg-gradient-to-r from-[#A855F7] to-[#C084FC] text-white hover:shadow-[0_0_25px_rgba(168,85,247,0.6)]'
                      : aiMode === 'code'
                      ? 'bg-gradient-to-r from-[#38BDF8] to-[#00E5FF] text-[#0B0D19] hover:shadow-[0_0_25px_rgba(56,189,248,0.6)]'
                      : aiMode === 'think'
                      ? 'bg-gradient-to-r from-[#EAB308] to-[#FACC15] text-[#0B0D19] hover:shadow-[0_0_25px_rgba(234,179,8,0.6)]'
                      : 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] hover:shadow-[0_0_25px_rgba(0,229,255,0.6)]'
                  } active:scale-[0.98]`}
                >
                  {aiMode === 'game' ? (
                    <>
                      <Gamepad2 className="w-4 h-4" />
                      Create Game
                    </>
                  ) : aiMode === 'code' ? (
                    <>
                      <Code2 className="w-4 h-4" />
                      Generate Code
                    </>
                  ) : aiMode === 'think' ? (
                    <>
                      <Brain className="w-4 h-4" />
                      Think & Answer
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Generate Website
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Inspiration Chips for Active Mode */}
            <div className="mt-3.5 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="text-slate-400 font-semibold flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-400" />
                <span>Suggestions:</span>
              </span>
              {currentSamplePrompts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setHeroPrompt(item.prompt);
                    onStartGenerating(item.prompt, aiMode === 'game' ? 'Gaming' : 'Business', aiMode);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#151A2F] border border-[#252F50] text-slate-300 hover:text-[#00E5FF] hover:border-[#00E5FF]/40 transition-all hover:scale-[1.02] flex items-center gap-1"
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof Metric Highlights */}
          <div className="mt-16 pt-12 border-t border-[#1C233C] grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">$0 / Forever</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Free Static Hosting</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-[#00E5FF] font-mono">*.pages.dev</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Free Subdomains</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">&lt; 30s</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">AI Generation Speed</span>
            </div>
            <div className="text-center">
              <span className="block text-2xl sm:text-3xl font-black text-purple-400 font-mono">100%</span>
              <span className="text-xs text-slate-400 uppercase font-semibold">Code Export & Ownership</span>
            </div>
          </div>
        </div>
      </section>

      {/* FREE HOSTING EXPLANATION SECTION */}
      <section className="py-20 bg-[#090C18] border-t border-[#181E34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block mb-2">
              Next-Gen Cloud Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              How Free Hosting Works on HOSTBANGER
            </h2>
            <p className="mt-3 text-slate-400 text-sm sm:text-base">
              Publish static websites using leading global infrastructure without recurring server bills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-[#111528] border border-[#212946] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 mb-6">
                  <Cloud className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Cloudflare Pages</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Static assets are distributed across 300+ edge locations worldwide. Your website receives a free subdomain like <code className="text-[#00E5FF]">yourbrand.pages.dev</code> with zero bandwidth fees on the free tier.
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Automatic Let's Encrypt TLS 1.3</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited monthly static requests</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant republishing & rollback</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#111528] border border-[#00E5FF]/30 shadow-[0_0_30px_rgba(0,229,255,0.1)] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 border border-[#00E5FF]/20 flex items-center justify-center text-[#00E5FF] mb-6">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Free Provider Subdomains</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Choose your personalized site address. HOSTBANGER checks project-name availability before deployment and configures the exact public URL returned by the hosting provider.
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Real-time name availability checker</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Instant one-click Copy URL button</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Easy custom domain setup when ready</li>
              </ul>
            </div>

            <div className="p-8 rounded-2xl bg-[#111528] border border-[#212946] flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-6">
                  <Github className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">GitHub Repos & Pages</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  Want version control for your website? Connect your GitHub account to push source files to an authorized repository and optionally publish via GitHub Pages.
                </p>
              </div>
              <ul className="mt-6 pt-4 border-t border-white/5 space-y-2 text-xs text-slate-400">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Direct Git commit & branch storage</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Username.github.io/repo publishing</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Zero password requests (OAuth/PAT)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* STEP-BY-STEP PUBLISHING GUIDE */}
      <section className="py-20 bg-[#0B0D19] border-t border-[#181E34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Launch Your Site in 4 Simple Steps
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              From natural language idea to live public URL in under 2 minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-[#12162A] border border-[#212946] relative">
              <span className="text-3xl font-black text-[#00E5FF] font-mono">01</span>
              <h4 className="font-bold text-white text-base mt-2">Describe Your Site</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Enter a text prompt or select one of 8 original templates to generate HTML, CSS, and JavaScript.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12162A] border border-[#212946] relative">
              <span className="text-3xl font-black text-purple-400 font-mono">02</span>
              <h4 className="font-bold text-white text-base mt-2">Customize & Preview</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Refine styles through AI conversational chat or directly edit code. Preview on desktop, tablet, and mobile.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12162A] border border-[#212946] relative">
              <span className="text-3xl font-black text-indigo-400 font-mono">03</span>
              <h4 className="font-bold text-white text-base mt-2">Pick Free Subdomain</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Choose a project name like <code className="text-[#00E5FF]">shadowgaming</code> and verify instant availability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#12162A] border border-[#212946] relative">
              <span className="text-3xl font-black text-emerald-400 font-mono">04</span>
              <h4 className="font-bold text-white text-base mt-2">Publish Instantly</h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Click Deploy to push to Cloudflare Pages. Copy your live URL and share your website with the world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATE GALLERY SECTION */}
      <section id="templates-section" className="py-20 bg-[#090B16] border-t border-[#181E34]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#00E5FF] uppercase tracking-wider mb-2">
                <Layers className="w-3.5 h-3.5" />
                Original Template Library
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                Free Website Templates
              </h2>
              <p className="mt-2 text-slate-400 max-w-2xl text-sm sm:text-base">
                Original, fully customizable templates across key categories. Preview instantly in desktop or mobile sandbox before editing.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="mt-6 md:mt-0 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#00E5FF] text-[#0B0D19] shadow-[0_0_12px_rgba(0,229,255,0.3)]'
                      : 'bg-[#14182B] text-slate-400 hover:text-white border border-[#222946]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Template Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group rounded-2xl bg-[#111528] border border-[#212946] hover:border-[#00E5FF]/60 overflow-hidden shadow-xl transition-all duration-300 flex flex-col"
              >
                {/* Thumbnail Header */}
                <div className="relative h-48 overflow-hidden bg-[#0A0D18]">
                  <img
                    src={template.thumbnail}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111528] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-[#0B0D19]/90 border border-white/10 text-[11px] font-bold text-[#00E5FF] backdrop-blur-sm">
                    {template.category}
                  </span>
                  {template.isPopular && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-purple-500/80 text-white text-[10px] font-extrabold uppercase">
                      Popular
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug group-hover:text-[#00E5FF] transition-colors">
                      {template.name}
                    </h3>
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-[#1C233C] grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onPreviewTemplate(template)}
                      className="py-2 px-3 rounded-lg bg-[#182038] hover:bg-[#232E50] text-slate-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      Live Preview
                    </button>
                    <button
                      onClick={() => onSelectTemplate(template)}
                      className="py-2 px-3 rounded-lg bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] font-bold text-xs flex items-center justify-center gap-1 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0B0D19]" />
                      Use Template
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE-FIRST PRICING MATRIX */}
      <section id="pricing-section" className="py-24 bg-[#0B0D19] border-t border-[#181E34] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block mb-2">
              Free-First Pricing
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white">
              Start Free. Scale as You Grow.
            </h2>
            <p className="mt-4 text-slate-300 text-base">
              Publish unlimited static websites on the Free plan. Premium tiers offer team collaboration and increased AI generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOSTING_PLANS.map((plan) => {
              const monthlyCost = plan.priceMonthly ?? plan.priceMonthlyInr ?? 0;
              const isFree = monthlyCost === 0;
              return (
                <div
                  key={plan.id}
                  className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                    plan.isPopular
                      ? 'bg-gradient-to-b from-[#181D38] to-[#12162C] border-2 border-[#00E5FF] shadow-[0_0_40px_rgba(0,229,255,0.2)] md:-translate-y-2'
                      : 'bg-[#111528] border border-[#212946]'
                  }`}
                >
                  {plan.isPopular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#A855F7] text-[#0B0D19] text-xs font-black uppercase tracking-wider shadow-lg">
                      Recommended
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <p className="mt-1 text-xs text-slate-400 min-h-[36px]">{plan.tagline}</p>

                    <div className="mt-6 flex items-baseline gap-1">
                      <span className="text-4xl sm:text-5xl font-black text-white font-mono">
                        {isFree ? '₹0' : `₹${monthlyCost}`}
                      </span>
                      <span className="text-slate-400 text-xs font-semibold">/ month</span>
                    </div>

                    <div className="mt-8 space-y-3.5 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span className="font-semibold text-emerald-400">{plan.features.freePublishing}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span className="font-mono text-[#00E5FF]">{plan.features.freeSubdomain || plan.features.subdomains}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>Cloudflare Pages & GitHub Pages Ready</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>{plan.features.storage}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>{plan.features.bandwidth}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span className="text-[#00E5FF] font-bold">{plan.features.aiCredits}</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>Free Automated SSL (Let's Encrypt / Cloudflare)</span>
                      </div>
                      <div className="flex items-center gap-2.5 text-slate-200">
                        <Check className="w-4 h-4 text-[#00E5FF] shrink-0" />
                        <span>{plan.features.backups}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      onClick={() => onOpenPricingPlan(plan.id)}
                      className={`w-full py-3.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all ${
                        isFree
                          ? 'bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#818CF8] text-[#0B0D19] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
                          : 'bg-[#1A223E] hover:bg-[#253058] text-white border border-[#2B3762]'
                      }`}
                    >
                      {isFree ? 'Get Started Free' : `Upgrade to ${plan.name}`}
                    </button>
                    <p className="text-[10px] text-slate-500 text-center mt-2">
                      {isFree ? 'No credit card required' : 'Configurable tier simulation'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 bg-[#090C18] border-t border-[#181E34]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-slate-400 text-sm">
              Clear answers regarding free hosting, subdomains, and Cloudflare Pages.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#12162A] border border-[#212946] overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-white text-base hover:text-[#00E5FF] transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#00E5FF]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-[#1C233C] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="py-20 bg-gradient-to-r from-[#11152E] via-[#1A1238] to-[#121B35] border-t border-[#232B4A] relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-5xl font-black text-white">
            Build Free. Publish Instantly.
          </h2>
          <p className="mt-4 text-slate-300 text-base max-w-2xl mx-auto">
            Experience the simplest way to turn an idea into a live, published website with zero hosting fees.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => onStartGenerating('Create a modern website with hero, features, and responsive layout')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-base shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:shadow-[0_0_35px_rgba(0,229,255,0.6)] transition-all flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5" />
              Create Free Website Now
            </button>
            <button
              onClick={onExploreTemplates}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#1A2038] hover:bg-[#252F50] text-white font-bold text-base border border-[#2D3960] transition-colors"
            >
              Browse Templates
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
