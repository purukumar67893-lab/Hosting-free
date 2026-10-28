import React, { useState } from 'react';
import { api } from '../services/api';
import { SubdomainCheckResult, HostingProvider } from '../types';
import {
  Globe,
  Search,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cloud,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Zap,
  Lock,
  Layers,
  HelpCircle,
  Server
} from 'lucide-react';

interface FreeDomainsViewProps {
  onClaimSubdomain: (subdomain: string, provider: HostingProvider) => void;
  onExploreTemplates: () => void;
}

export const FreeDomainsView: React.FC<FreeDomainsViewProps> = ({
  onClaimSubdomain,
  onExploreTemplates
}) => {
  const [searchName, setSearchName] = useState<string>('shadowgaming');
  const [provider, setProvider] = useState<HostingProvider>('cloudflare_pages');
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [checkResult, setCheckResult] = useState<SubdomainCheckResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const cleanName = (val: string) => {
    return val.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  };

  const handleCheck = async (nameToCheck?: string) => {
    const raw = nameToCheck !== undefined ? nameToCheck : searchName;
    const clean = cleanName(raw).replace(/(^-|-$)/g, '');

    if (!clean || clean.length < 3) {
      setErrorMessage('Subdomain name must be at least 3 characters long.');
      setCheckResult(null);
      return;
    }

    setIsChecking(true);
    setErrorMessage(null);

    try {
      const res = await api.checkSubdomain(clean, provider);
      setCheckResult(res);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to verify subdomain with hosting provider');
      setCheckResult(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const sampleNames = [
    'shadowgaming',
    'apexstudio',
    'cybervault',
    'novaflow',
    'pulseblog',
    'elenarostova'
  ];

  return (
    <div className="min-h-screen bg-[#080A14] text-slate-100 py-12 px-4 sm:px-6 lg:px-8 selection:bg-[#00E5FF] selection:text-[#0B0D19]">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#161B30] border border-[#2B355A] text-xs font-bold text-[#00E5FF] shadow-xl">
            <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>HOSTBANGER FREE DOMAINS</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300">TAGLINE: Get Your Free Website Address!</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Claim Your Free{' '}
            <span className="bg-gradient-to-r from-[#00E5FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent">
              Website Subdomain
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Choose your custom project name and launch online with an authentic, globally accessible public URL powered by Cloudflare Pages and HOSTBANGER Edge.
          </p>
        </div>

        {/* Central Subdomain Search Engine Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0F1428] border border-[#232D4E] shadow-[0_20px_60px_rgba(0,0,0,0.5)] space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-white/5">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-[#00E5FF]" />
                Live Subdomain Availability Checker
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Verified against Cloudflare Pages edge routing and reserved directory policies.
              </p>
            </div>

            {/* Provider Toggle */}
            <div className="flex items-center bg-[#080B16] p-1 rounded-xl border border-[#1E2540] text-xs font-bold">
              <button
                onClick={() => {
                  setProvider('cloudflare_pages');
                  setCheckResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  provider === 'cloudflare_pages'
                    ? 'bg-[#00E5FF] text-[#0B0D19]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                *.pages.dev (Cloudflare)
              </button>
              <button
                onClick={() => {
                  setProvider('hostbanger_edge');
                  setCheckResult(null);
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  provider === 'hostbanger_edge'
                    ? 'bg-[#00E5FF] text-[#0B0D19]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                *.hostbanger.app (Edge)
              </button>
            </div>
          </div>

          {/* Search Input Bar */}
          <form
            onSubmit={e => {
              e.preventDefault();
              handleCheck();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchName}
                onChange={e => {
                  setSearchName(e.target.value);
                  setCheckResult(null);
                  setErrorMessage(null);
                }}
                placeholder="Enter your website name (e.g. shadowgaming)"
                className="w-full bg-[#080B16] border border-[#2B355A] focus:border-[#00E5FF] rounded-2xl px-4 py-3.5 text-sm sm:text-base text-white font-mono placeholder-slate-500 shadow-inner focus:outline-none"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                .{provider === 'cloudflare_pages' ? 'pages.dev' : 'hostbanger.app'}
              </span>
            </div>

            <button
              type="submit"
              disabled={isChecking}
              className="px-8 py-3.5 rounded-2xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] font-black text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 transition-all shrink-0"
            >
              {isChecking ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Check Name
                </>
              )}
            </button>
          </form>

          {/* Quick Suggestions / Test Examples */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-400 font-semibold">Try examples:</span>
            {sampleNames.map(example => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setSearchName(example);
                  handleCheck(example);
                }}
                className="px-2.5 py-1 rounded-lg bg-[#141A30] hover:bg-[#1E274A] border border-[#242F50] text-slate-300 font-mono text-xs transition-colors"
              >
                {example}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Check Result Display */}
          {checkResult && (
            <div
              className={`p-6 rounded-2xl border transition-all animate-in fade-in duration-200 ${
                checkResult.available
                  ? 'bg-emerald-950/30 border-emerald-500/50 text-emerald-200'
                  : 'bg-amber-950/30 border-amber-500/40 text-amber-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {checkResult.available ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                    )}
                    <span className="font-black text-sm uppercase tracking-wide">
                      {checkResult.available ? 'Subdomain Available!' : 'Subdomain Unavailable'}
                    </span>
                  </div>

                  <p className="font-mono text-lg font-bold text-white mt-1">
                    https://{checkResult.fullDomain}
                  </p>

                  <p className="text-xs text-slate-300 mt-1">{checkResult.message}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopy(`https://${checkResult.fullDomain}`)}
                    className="px-3.5 py-2 rounded-xl bg-[#14182E] hover:bg-[#1E2548] text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                  >
                    {copiedText === `https://${checkResult.fullDomain}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    {copiedText === `https://${checkResult.fullDomain}` ? 'Copied' : 'Copy URL'}
                  </button>

                  {checkResult.available && (
                    <button
                      onClick={() => onClaimSubdomain(checkResult.requestedName, checkResult.provider)}
                      className="px-5 py-2.5 rounded-xl bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#0B0D19]" />
                      Claim & Build Website
                    </button>
                  )}
                </div>
              </div>

              {/* Suggestions when unavailable */}
              {!checkResult.available && checkResult.suggestedAlternatives && checkResult.suggestedAlternatives.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                  <span className="text-xs font-bold text-white block">
                    Recommended Available Alternatives:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {checkResult.suggestedAlternatives.map(alt => (
                      <button
                        key={alt}
                        onClick={() => {
                          setSearchName(alt);
                          handleCheck(alt);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0F1426] hover:bg-[#1A223E] border border-amber-500/30 text-xs font-mono text-[#00E5FF] flex items-center gap-1.5"
                      >
                        <span>{alt}.{provider === 'cloudflare_pages' ? 'pages.dev' : 'hostbanger.app'}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Provider Transparency Disclosure */}
          <div className="p-4 rounded-xl bg-[#090C18] border border-[#1A223A] text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#00E5FF]" />
              Free Provider Subdomain Transparency
            </p>
            <p>
              HOSTBANGER provisions free public subdomains directly under Cloudflare Pages (<code className="text-[#00E5FF]">*.pages.dev</code>) and HOSTBANGER Edge (<code className="text-[#00E5FF]">*.hostbanger.app</code>). These are provided at ₹0 without renewal costs. They are supplied under the hosting provider's root domain and do not represent ownership of custom top-level domains like <code className="text-slate-400">.com</code> or <code className="text-slate-400">.in</code>.
            </p>
          </div>
        </div>

        {/* Feature Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#0F1325] border border-[#202846] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Instant Provisioning</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subdomains are registered and mapped instantly to edge container routing with zero DNS propagation delays.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1325] border border-[#202846] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">Automatic SSL (TLS 1.3)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every free subdomain includes Let's Encrypt and Cloudflare Edge TLS certificates pre-configured for full HTTPS protection.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0F1325] border border-[#202846] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Cloud className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-white text-base">DDoS & Edge Caching</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Backed by Cloudflare's 300+ global data centers for lightning-fast asset delivery and unmetered static traffic protection.
            </p>
          </div>
        </div>

        {/* How It Works Pipeline */}
        <div className="p-8 rounded-3xl bg-[#0D1020] border border-[#1E2540] space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h3 className="text-xl font-black text-white">How to Get Your Free Website Online</h3>
            <p className="text-xs text-slate-400 mt-1">Four simple steps from name selection to live global launch</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#12162A] border border-[#232B48] space-y-2">
              <span className="text-xs font-black text-[#00E5FF] font-mono">01. CHOOSE NAME</span>
              <h4 className="font-bold text-white text-sm">Search Subdomain</h4>
              <p className="text-xs text-slate-400">
                Check your preferred name for <code className="text-[#00E5FF]">*.pages.dev</code> with zero registration charges.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12162A] border border-[#232B48] space-y-2">
              <span className="text-xs font-black text-[#00E5FF] font-mono">02. CREATE CODE</span>
              <h4 className="font-bold text-white text-sm">AI Builder or Upload</h4>
              <p className="text-xs text-slate-400">
                Generate with AI, choose from 8 templates, or upload your own HTML/CSS/JS files.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12162A] border border-[#232B48] space-y-2">
              <span className="text-xs font-black text-[#00E5FF] font-mono">03. PUBLISH</span>
              <h4 className="font-bold text-white text-sm">Deploy to Cloudflare</h4>
              <p className="text-xs text-slate-400">
                Our backend validates static assets and deploys your website to the edge.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#12162A] border border-[#232B48] space-y-2">
              <span className="text-xs font-black text-[#00E5FF] font-mono">04. SHARE</span>
              <h4 className="font-bold text-white text-sm">Live Public URL</h4>
              <p className="text-xs text-slate-400">
                Copy your authenticated link and share your website with customers and friends.
              </p>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button
              onClick={onExploreTemplates}
              className="px-6 py-3 rounded-xl bg-[#18213E] hover:bg-[#253360] text-white text-xs font-bold border border-[#2C385E] inline-flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-purple-400" />
              Explore Free Website Templates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
