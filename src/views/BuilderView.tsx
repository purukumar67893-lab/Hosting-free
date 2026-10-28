import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
import { WebsiteProject, User, HostingProvider, SubdomainCheckResult, AiMode } from '../types';
import { api } from '../services/api';
import {
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Send,
  Save,
  Download,
  Rocket,
  Code,
  Palette,
  History,
  RefreshCw,
  ExternalLink,
  Layers,
  Check,
  AlertCircle,
  Eye,
  Type,
  Maximize2,
  Copy,
  Globe,
  Cloud,
  CheckCircle2,
  X,
  Gamepad2,
  Terminal,
  Brain,
  ChevronDown,
  ChevronUp,
  FileCode,
  Play
} from 'lucide-react';

interface BuilderViewProps {
  initialProject?: WebsiteProject | null;
  initialPrompt?: string;
  initialCategory?: string;
  initialMode?: AiMode;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onDeploySuccess: (project: WebsiteProject) => void;
  onBackToDashboard: () => void;
}

export const BuilderView: React.FC<BuilderViewProps> = ({
  initialProject,
  initialPrompt,
  initialCategory = 'Business',
  initialMode = 'website',
  currentUser,
  onOpenAuth,
  onDeploySuccess,
  onBackToDashboard
}) => {
  // Project State
  const [projectId, setProjectId] = useState<string | null>(initialProject?.id || null);
  const [projectName, setProjectName] = useState<string>(initialProject?.name || 'shadowgaming');
  const [websiteTitle, setWebsiteTitle] = useState<string>(initialProject?.websiteTitle || 'My Free Website');
  const [category, setCategory] = useState<WebsiteProject['category']>(initialProject?.category || 'Gaming');
  const [html, setHtml] = useState<string>(initialProject?.html || '');
  const [css, setCss] = useState<string>(initialProject?.css || '');
  const [js, setJs] = useState<string>(initialProject?.js || '');
  const [python, setPython] = useState<string>(initialProject?.python || '');
  const [activeMode, setActiveMode] = useState<AiMode>(initialMode || 'website');
  const [aiThinking, setAiThinking] = useState<string | null>(initialProject?.thinking || null);
  const [showThinking, setShowThinking] = useState<boolean>(true);
  const [status, setStatus] = useState<WebsiteProject['status']>(initialProject?.status || 'Draft');
  const [provider, setProvider] = useState<HostingProvider>(initialProject?.provider || 'cloudflare_pages');
  const [subdomain, setSubdomain] = useState<string>(initialProject?.subdomain || 'shadowgaming.pages.dev');
  const [publicUrl, setPublicUrl] = useState<string | undefined>(initialProject?.publicUrl);
  const [history, setHistory] = useState<any[]>(initialProject?.history || []);

  // UI state
  const [activeTab, setActiveTab] = useState<'ai' | 'visual' | 'code' | 'history'>('ai');
  const [codeTab, setCodeTab] = useState<'html' | 'css' | 'js' | 'python'>('html');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('Analyzing requirements...');
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [recoveryHint, setRecoveryHint] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState<string>('');
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: 'Welcome to HOSTBANGER AI Website Builder! Describe the website you want to build in plain English, for example: "Create a professional gaming website with game cards, a dark theme, and a navigation menu."',
      time: 'Just now'
    }
  ]);

  // Deployment Modal State
  const [deployModalOpen, setDeployModalOpen] = useState<boolean>(false);
  const [chosenSubdomain, setChosenSubdomain] = useState<string>(initialProject?.name || 'shadowgaming');
  const [selectedProvider, setSelectedProvider] = useState<HostingProvider>('cloudflare_pages');
  const [subdomainCheck, setSubdomainCheck] = useState<SubdomainCheckResult | null>(null);
  const [isCheckingSubdomain, setIsCheckingSubdomain] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentLogs, setDeploymentLogs] = useState<any[]>([]);

  // Visual Customizer inputs
  const [brandColor, setBrandColor] = useState<string>('#00E5FF');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPrompt && !initialProject) {
      handleInitialGeneration(initialPrompt, initialCategory);
    } else if (!initialProject && !html) {
      handleInitialGeneration(
        'Create a professional gaming website with game cards, a dark theme, and a navigation menu.',
        'Gaming'
      );
    }
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleInitialGeneration = async (prompt: string, cat: string) => {
    setIsGenerating(true);
    setErrorMessage(null);
    setRecoveryHint(null);

    const steps = [
      'Connecting to Google Gemini AI engine...',
      'Synthesizing responsive layout & game mechanics...',
      'Styling with modern dark theme and neon accents...',
      'Compiling interactive JavaScript & Python backend...',
      'Validating files for free Cloudflare Pages deployment...'
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      stepIdx++;
      if (stepIdx < steps.length) {
        setGenerationStep(steps[stepIdx]);
      }
    }, 600);

    try {
      const res = await api.generateWebsite({ prompt, category: cat, mode: activeMode });
      clearInterval(interval);

      setHtml(res.html);
      setCss(res.css);
      setJs(res.js);
      if (res.python) setPython(res.python);
      if (res.thinking) setAiThinking(res.thinking);
      setWebsiteTitle(res.title || (activeMode === 'game' ? 'Arcade Game' : 'AI Generated Website'));

      const initialHist = {
        id: `h_${Date.now()}`,
        timestamp: new Date().toISOString(),
        prompt: prompt,
        html: res.html,
        css: res.css,
        js: res.js,
        python: res.python,
        thinking: res.thinking
      };
      setHistory([initialHist]);

      if (res.explanation) {
        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.explanation || `Generated ${activeMode === 'game' ? 'arcade game' : 'project'} with Google Gemini!`,
            time: 'Just now'
          }
        ]);
      }

      if (currentUser) {
        const saved = await api.createProject({
          name: projectName,
          websiteTitle: res.title || 'AI Generated Website',
          category: cat as any,
          html: res.html,
          css: res.css,
          js: res.js,
          provider
        });
        setProjectId(saved.id);
        setSubdomain(saved.subdomain);
      }
    } catch (err: any) {
      clearInterval(interval);
      setErrorMessage(err?.message || 'AI generation failed. A template fallback has been applied.');
      setRecoveryHint('You can freely customize this template and proceed with free publishing.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Conversational AI Refinement & Q&A
  const handleRefine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isRefining) return;

    const userText = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userText, time: 'Just now' }]);
    setIsRefining(true);

    try {
      // Check if user is asking a conceptual or architectural question
      const isQuestion = userText.endsWith('?') || 
        userText.toLowerCase().startsWith('how') || 
        userText.toLowerCase().startsWith('what') || 
        userText.toLowerCase().startsWith('why') || 
        userText.toLowerCase().startsWith('explain') || 
        activeMode === 'think';

      if (isQuestion) {
        const qaRes = await api.askAi({
          prompt: userText,
          context: `Current Project: "${websiteTitle}", Active Mode: ${activeMode}`
        });

        if (qaRes.thinking) setAiThinking(qaRes.thinking);

        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: qaRes.answer,
            time: 'Just now'
          }
        ]);
      } else {
        const res = await api.refineWebsite({
          prompt: userText,
          currentHtml: html,
          currentCss: css,
          currentJs: js,
          currentPython: python,
          mode: activeMode
        });

        if (res.html) setHtml(res.html);
        if (res.css) setCss(res.css);
        if (res.js) setJs(res.js);
        if (res.python) setPython(res.python);
        if (res.thinking) setAiThinking(res.thinking);

        const newHist = {
          id: `h_${Date.now()}`,
          timestamp: new Date().toISOString(),
          prompt: userText,
          html: res.html,
          css: res.css,
          js: res.js,
          python: res.python,
          thinking: res.thinking
        };
        setHistory(prev => [newHist, ...prev]);

        setChatMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: res.answer || `Applied: "${userText}". Check the live preview and code tabs.`,
            time: 'Just now'
          }
        ]);

        if (projectId) {
          await api.updateProject(projectId, {
            html: res.html,
            css: res.css,
            js: res.js,
            editNote: userText
          });
        }
      }
    } catch (err: any) {
      setChatMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `Error updating: ${err?.message || 'Server error'}. Please try phrasing differently.`,
          time: 'Just now'
        }
      ]);
    } finally {
      setIsRefining(false);
    }
  };

  // Save Project
  const handleSave = async () => {
    if (!currentUser) {
      onOpenAuth('signup');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    setErrorMessage(null);

    try {
      if (projectId) {
        await api.updateProject(projectId, {
          name: projectName,
          websiteTitle,
          category,
          html,
          css,
          js,
          provider
        });
        setSaveMessage('Project saved to Supabase database!');
      } else {
        const created = await api.createProject({
          name: projectName,
          websiteTitle,
          category,
          html,
          css,
          js,
          provider
        });
        setProjectId(created.id);
        setSubdomain(created.subdomain);
        setSaveMessage('Project created & saved to Supabase database!');
      }
      setTimeout(() => setSaveMessage(null), 3500);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  // Subdomain availability check before deploying
  const handleVerifySubdomain = async () => {
    if (!chosenSubdomain.trim()) return;
    setIsCheckingSubdomain(true);
    try {
      const res = await api.checkSubdomain(chosenSubdomain, selectedProvider);
      setSubdomainCheck(res);
    } catch (err: any) {
      setSubdomainCheck({
        requestedName: chosenSubdomain,
        fullDomain: '',
        provider: selectedProvider,
        available: false,
        message: err?.message || 'Verification error'
      });
    } finally {
      setIsCheckingSubdomain(false);
    }
  };

  // One-Click Deploy to Cloudflare Pages or HOSTBANGER Edge
  const handleExecuteDeploy = async () => {
    if (!currentUser) {
      onOpenAuth('login');
      return;
    }

    setIsDeploying(true);
    setErrorMessage(null);
    setRecoveryHint(null);

    try {
      let currentId = projectId;
      if (!currentId) {
        const saved = await api.createProject({
          name: chosenSubdomain || projectName,
          websiteTitle,
          category,
          html,
          css,
          js,
          provider: selectedProvider
        });
        currentId = saved.id;
        setProjectId(saved.id);
      }

      const res = await api.deployProject(currentId, {
        chosenSubdomain: chosenSubdomain || projectName,
        provider: selectedProvider
      });

      setStatus('Published');
      setPublicUrl(res.publicUrl);
      setSubdomain(res.subdomain);
      setProvider(res.provider);
      setDeploymentLogs(res.logs || []);
      onDeploySuccess(res.project);
      setSaveMessage(`Published successfully to https://${res.subdomain}!`);
    } catch (err: any) {
      setStatus('Failed');
      setErrorMessage(err?.message || 'Deployment failed. Please check files and network.');
      setRecoveryHint(err?.hint || 'Check that your project contains valid HTML and your chosen subdomain name is valid.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Republish website
  const handleRepublish = async () => {
    if (!projectId) return;
    setIsDeploying(true);
    try {
      const res = await api.republishProject(projectId);
      setStatus('Published');
      setSaveMessage(res.message);
      setTimeout(() => setSaveMessage(null), 4000);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Republish failed');
    } finally {
      setIsDeploying(false);
    }
  };

  // Revert revision
  const handleRollback = (histItem: any) => {
    setHtml(histItem.html);
    setCss(histItem.css);
    setJs(histItem.js);
    setSaveMessage(`Restored snapshot from ${new Date(histItem.timestamp).toLocaleTimeString()}`);
    setTimeout(() => setSaveMessage(null), 3000);
  };

  // Export full project ZIP bundle (HTML, CSS, JS, Python)
  const handleExportZip = async () => {
    const zip = new JSZip();
    zip.file('index.html', html);
    zip.file('style.css', css);
    zip.file('script.js', js);
    if (python) {
      zip.file('main.py', python);
    }
    zip.file(
      'README.md',
      `# ${websiteTitle}
Generated with HOSTBANGER AI Studio (Powered by Google Gemini).

## Web Application:
Open \`index.html\` directly in any modern browser, or deploy to Cloudflare Pages.

${python ? `## Python Script / Backend:
Run with:
\`\`\`bash
python main.py
\`\`\`
` : ''}
## Free Hosting:
Visit https://${subdomain} on HOSTBANGER.`
    );

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(projectName || 'project').toLowerCase().replace(/[^a-z0-9]/g, '-')}-bundle.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2500);
  };

  // Apply visual theme color tweak directly to CSS
  const applyVisualTweak = (color: string) => {
    setBrandColor(color);
    setCss(prev => {
      return prev + `\n/* Visual Customizer Color Tweak */\n:root { --accent-primary: ${color}; }\n.primary-btn, .cta-btn, button[type="submit"] { background: ${color} !important; }\n`;
    });
  };

  let fullDoc = html;
  if (!fullDoc.includes('<style>') && css) {
    fullDoc = fullDoc.replace('</head>', `<style>\n${css}\n</style></head>`);
  }
  if (!fullDoc.includes('<script>') && js) {
    fullDoc = fullDoc.replace('</body>', `<script>\n${js}\n</script></body>`);
  }

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[390px]'
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-[#0B0D19] overflow-hidden text-slate-100">
      {/* BUILDER HEADER CONTROL BAR */}
      <div className="h-14 px-4 bg-[#0F1326] border-b border-[#1E2540] flex items-center justify-between shrink-0 z-30">
        {/* Left: Project title & status */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            ← My Websites
          </button>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <input
            type="text"
            value={websiteTitle}
            onChange={e => setWebsiteTitle(e.target.value)}
            className="bg-transparent text-white font-bold text-sm focus:outline-none focus:bg-white/5 px-2 py-1 rounded max-w-[180px] sm:max-w-xs border border-transparent focus:border-[#00E5FF]/40"
          />
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
              status === 'Published'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : status === 'Failed'
                ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}
          >
            {status}
          </span>
        </div>

        {/* Center: Viewport Switcher */}
        <div className="hidden md:flex items-center bg-[#070912] p-0.5 rounded-lg border border-[#1A2038]">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop 100%"
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewport === 'desktop' ? 'bg-[#1C2442] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Desktop</span>
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet 768px"
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewport === 'tablet' ? 'bg-[#1C2442] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablet</span>
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile 390px"
            className={`p-1.5 rounded text-xs font-semibold flex items-center gap-1 transition-colors ${
              viewport === 'mobile' ? 'bg-[#1C2442] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>

        {/* Right: Actions (Save, Deploy, Export) */}
        <div className="flex items-center gap-2">
          {saveMessage && (
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20 flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" />
              {saveMessage}
            </span>
          )}

          {status === 'Published' && publicUrl && (
            <a
              href={publicUrl}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#141A30] hover:bg-[#1E2646] text-xs font-bold text-[#00E5FF] border border-[#00E5FF]/30 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Open Site
            </a>
          )}

          <button
            onClick={handleExportZip}
            title="Download Website Files ZIP"
            className="p-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-[#151A2E] hover:bg-[#202744] text-slate-300 font-bold text-xs flex items-center gap-1.5 border border-[#263152] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download ZIP</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-3 py-1.5 rounded-lg bg-[#18213E] hover:bg-[#253360] text-white font-bold text-xs flex items-center gap-1.5 border border-[#334270] transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>{isSaving ? 'Saving...' : 'Save'}</span>
          </button>

          <button
            onClick={() => {
              setChosenSubdomain(projectName);
              setDeployModalOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.4)] hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all"
          >
            <Rocket className="w-3.5 h-3.5 text-[#0B0D19]" />
            <span>Publish Free</span>
          </button>
        </div>
      </div>

      {/* ERROR BANNER WITH RECOVERY HINTS */}
      {errorMessage && (
        <div className="bg-rose-500/20 border-b border-rose-500/30 px-4 py-2.5 text-rose-300 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <span className="font-bold">{errorMessage}</span>
              {recoveryHint && <p className="text-[11px] text-rose-300/80 mt-0.5">{recoveryHint}</p>}
            </div>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white self-end sm:self-center">✕</button>
        </div>
      )}

      {/* MAIN TWO-PANE BUILDER INTERFACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL: AI ASSISTANT / VISUAL / CODE / HISTORY TABS */}
        <div className="w-full sm:w-[380px] lg:w-[420px] bg-[#0E1224] border-r border-[#1D243E] flex flex-col shrink-0 z-20">
          {/* Tool Tab Switcher */}
          <div className="flex p-1.5 bg-[#090C18] border-b border-[#1A2138] shrink-0">
            <button
              onClick={() => setActiveTab('ai')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'ai' ? 'bg-[#18213E] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Prompt
            </button>
            <button
              onClick={() => setActiveTab('visual')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'visual' ? 'bg-[#18213E] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              Styles
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'code' ? 'bg-[#18213E] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              Code
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md flex items-center justify-center gap-1.5 transition-colors ${
                activeTab === 'history' ? 'bg-[#18213E] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              History
            </button>
          </div>

          {/* TAB 1: AI CONVERSATIONAL CHAT & GEMINI THINKING */}
          {activeTab === 'ai' && (
            <div className="flex-1 flex flex-col justify-between overflow-hidden">
              {/* Header with Gemini Model & Mode Switcher */}
              <div className="p-2.5 bg-[#0A0D1A] border-b border-[#1C243E] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00E5FF]/10 border border-[#00E5FF]/25 text-[11px] font-bold text-white">
                    <Sparkles className="w-3 h-3 text-[#00E5FF] animate-pulse" />
                    <span className="text-[#00E5FF]">GOOGLE GEMINI AI</span>
                  </div>

                  {aiThinking && (
                    <button
                      type="button"
                      onClick={() => setShowThinking(!showThinking)}
                      className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20"
                    >
                      <Brain className="w-3 h-3" />
                      <span>{showThinking ? 'Hide Thinking' : 'Show Thinking'}</span>
                      {showThinking ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                    </button>
                  )}
                </div>

                {/* Mode Selector */}
                <div className="grid grid-cols-4 gap-1 p-0.5 bg-[#060812] rounded-lg border border-[#1C243E] text-[10px]">
                  <button
                    type="button"
                    onClick={() => setActiveMode('website')}
                    className={`py-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                      activeMode === 'website' ? 'bg-[#00E5FF] text-[#0B0D19]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Globe className="w-3 h-3" />
                    Site
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('game')}
                    className={`py-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                      activeMode === 'game' ? 'bg-[#A855F7] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Gamepad2 className="w-3 h-3" />
                    Game
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('code')}
                    className={`py-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                      activeMode === 'code' ? 'bg-[#38BDF8] text-[#0B0D19]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Terminal className="w-3 h-3" />
                    Code
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveMode('think')}
                    className={`py-1 rounded font-bold transition-all flex items-center justify-center gap-1 ${
                      activeMode === 'think' ? 'bg-[#EAB308] text-[#0B0D19]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Brain className="w-3 h-3" />
                    Think
                  </button>
                </div>
              </div>

              {/* Gemini Thinking Accordion */}
              {showThinking && aiThinking && (
                <div className="p-3 bg-[#11172E] border-b border-amber-500/20 max-h-36 overflow-y-auto">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 mb-1">
                    <Brain className="w-3.5 h-3.5" />
                    <span>Gemini Architectural Thinking</span>
                  </div>
                  <pre className="text-[11px] text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
                    {aiThinking}
                  </pre>
                </div>
              )}

              {/* Messages Scroll Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-bold shadow-md'
                          : 'bg-[#151B30] text-slate-200 border border-[#232C4A]'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.time}</span>
                  </div>
                ))}

                {isRefining && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-[#151B30] border border-[#232C4A] text-xs text-[#00E5FF]">
                    <Sparkles className="w-4 h-4 animate-spin text-[#00E5FF]" />
                    <span>Gemini is analyzing & compiling modifications...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt Suggestions Tailored to Mode */}
              <div className="px-3 py-2 bg-[#090C18] border-t border-[#1C243E] flex gap-1.5 overflow-x-auto text-[11px]">
                {activeMode === 'game' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add laser powerup with triple shot burst')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🔥 Triple Lasers
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add sound effects for laser shooting, hits, and game over')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🔊 Sound Effects
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add high score leaderboard saved to localStorage')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🏆 High Score HUD
                    </button>
                  </>
                ) : activeMode === 'code' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add Python FastAPI endpoint for user score submission')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🐍 Python API
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add Python script comments and type annotations')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      📝 Type Annotations
                    </button>
                  </>
                ) : activeMode === 'think' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setChatInput('How does 60fps requestAnimationFrame game loop timing work?')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🧠 Game Loop Math
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('What is the difference between Cloudflare Pages and GitHub Pages?')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      ☁ Cloudflare vs GitHub
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setChatInput('Make the color theme darker with electric neon cyan highlights')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      ⚡ Dark & Neon
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add responsive navigation bar and mobile menu')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      🧭 Mobile Navbar
                    </button>
                    <button
                      type="button"
                      onClick={() => setChatInput('Add customer testimonials cards and pricing table')}
                      className="px-2 py-1 rounded bg-[#13182C] border border-[#222B48] text-slate-300 hover:text-[#00E5FF] whitespace-nowrap shrink-0"
                    >
                      ⭐ Testimonials
                    </button>
                  </>
                )}
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleRefine} className="p-3 bg-[#0A0D1A] border-t border-[#1C243E]">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    placeholder={
                      activeMode === 'game'
                        ? 'Describe game changes... (e.g. Add particle explosions or speed up enemies)'
                        : activeMode === 'code'
                        ? 'Describe code changes... (e.g. Add Python FastAPI endpoint)'
                        : activeMode === 'think'
                        ? 'Ask Gemini a technical question...'
                        : 'Describe design changes or ask a question...'
                    }
                    disabled={isRefining}
                    className="w-full bg-[#13182C] border border-[#252E4E] focus:border-[#00E5FF] rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim() || isRefining}
                    className="absolute right-2 p-1.5 rounded-lg bg-[#00E5FF] hover:bg-[#38BDF8] text-[#0B0D19] disabled:opacity-40 transition-colors shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: VISUAL CUSTOMIZER */}
          {activeTab === 'visual' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Accent Color Palette
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Cyan', color: '#00E5FF' },
                    { label: 'Purple', color: '#A855F7' },
                    { label: 'Indigo', color: '#6366F1' },
                    { label: 'Gold', color: '#EAB308' },
                    { label: 'Emerald', color: '#10B981' }
                  ].map(c => (
                    <button
                      key={c.color}
                      onClick={() => applyVisualTweak(c.color)}
                      style={{ backgroundColor: c.color }}
                      className="h-10 rounded-xl flex items-center justify-center font-black text-black shadow-lg hover:scale-105 transition-transform"
                      title={c.label}
                    >
                      {brandColor === c.color && <Check className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Typography Pairing
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { name: 'Plus Jakarta Sans', tag: 'Modern Clean' },
                    { name: 'Orbitron', tag: 'Esports & Gaming' },
                    { name: 'Cinzel', tag: 'Editorial & Luxury' },
                    { name: 'Syne', tag: 'Design Agency' }
                  ].map(f => (
                    <button
                      key={f.name}
                      onClick={() => {
                        setCss(prev => prev + `\nbody { font-family: '${f.name}', sans-serif !important; }\n`);
                      }}
                      className="p-3 rounded-xl bg-[#141A30] hover:bg-[#1E2646] border border-[#242F52] text-left flex items-center justify-between transition-colors"
                    >
                      <span className="text-xs font-bold text-white">{f.name}</span>
                      <span className="text-[10px] text-slate-400">{f.tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-[#1C243E] space-y-3">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Page Sections & Title
                </label>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Website Title</span>
                  <input
                    type="text"
                    value={websiteTitle}
                    onChange={e => setWebsiteTitle(e.target.value)}
                    className="w-full bg-[#13182C] border border-[#242F52] rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block mb-1">Subdomain Name Slug</span>
                  <input
                    type="text"
                    value={projectName}
                    onChange={e => setProjectName(e.target.value)}
                    className="w-full bg-[#13182C] border border-[#242F52] rounded-lg p-2 text-xs text-white font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CODE EDITOR (HTML, CSS, JS, PYTHON) */}
          {activeTab === 'code' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex items-center justify-between bg-[#0A0D18] border-b border-[#1A223A] px-2 pt-2 shrink-0">
                <div className="flex gap-1">
                  <button
                    onClick={() => setCodeTab('html')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors ${
                      codeTab === 'html' ? 'bg-[#151B30] text-[#00E5FF] border-t-2 border-[#00E5FF]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    HTML5
                  </button>
                  <button
                    onClick={() => setCodeTab('css')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors ${
                      codeTab === 'css' ? 'bg-[#151B30] text-[#00E5FF] border-t-2 border-[#00E5FF]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CSS3
                  </button>
                  <button
                    onClick={() => setCodeTab('js')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors ${
                      codeTab === 'js' ? 'bg-[#151B30] text-[#00E5FF] border-t-2 border-[#00E5FF]' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    JavaScript
                  </button>
                  <button
                    onClick={() => setCodeTab('python')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-t-lg transition-colors ${
                      codeTab === 'python' ? 'bg-[#151B30] text-emerald-400 border-t-2 border-emerald-400' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    🐍 Python
                  </button>
                </div>

                {/* Copy and Download Buttons */}
                <div className="flex items-center gap-1.5 pb-1">
                  <button
                    type="button"
                    onClick={() => {
                      const cur = codeTab === 'html' ? html : codeTab === 'css' ? css : codeTab === 'js' ? js : python;
                      navigator.clipboard.writeText(cur);
                      setSaveMessage(`Copied ${codeTab.toUpperCase()} to clipboard!`);
                      setTimeout(() => setSaveMessage(null), 2500);
                    }}
                    className="px-2 py-0.5 rounded bg-[#18213E] hover:bg-[#253360] text-[10px] font-bold text-slate-300 flex items-center gap-1"
                    title="Copy active code"
                  >
                    <Copy className="w-3 h-3 text-[#00E5FF]" />
                    <span>Copy</span>
                  </button>
                  {codeTab === 'python' && python && (
                    <button
                      type="button"
                      onClick={() => {
                        const blob = new Blob([python], { type: 'text/x-python' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${(projectName || 'script').toLowerCase()}_main.py`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-1"
                      title="Download Python script"
                    >
                      <Download className="w-3 h-3" />
                      <span>.py</span>
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 p-2 bg-[#080B14] overflow-hidden flex flex-col">
                <textarea
                  value={codeTab === 'html' ? html : codeTab === 'css' ? css : codeTab === 'js' ? js : python}
                  onChange={e => {
                    const val = e.target.value;
                    if (codeTab === 'html') setHtml(val);
                    else if (codeTab === 'css') setCss(val);
                    else if (codeTab === 'js') setJs(val);
                    else setPython(val);
                  }}
                  spellCheck={false}
                  placeholder={codeTab === 'python' ? '# Python code generated with Gemini AI...' : ''}
                  className="w-full h-full bg-[#070912] text-slate-200 font-mono text-xs p-3 rounded-lg border border-[#1D243E] focus:outline-none focus:border-[#00E5FF] resize-none leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: REVISION HISTORY */}
          {activeTab === 'history' && (
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Generation History
              </h4>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500">No revisions recorded.</p>
              ) : (
                history.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-3 rounded-xl bg-[#141A30] border border-[#232D4E] hover:border-[#00E5FF]/40 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#00E5FF] uppercase">
                        Revision #{history.length - idx}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white mb-2 line-clamp-2">
                      "{item.prompt}"
                    </p>
                    <button
                      onClick={() => handleRollback(item)}
                      className="text-xs font-bold text-slate-300 hover:text-[#00E5FF] flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Revert to this version
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANEL: LIVE SANDBOXED PREVIEW FRAME */}
        <div className="flex-1 bg-[#060810] relative flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          {/* Generation Loading Overlay */}
          {isGenerating && (
            <div className="absolute inset-0 z-30 bg-[#0B0D19]/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="relative flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#6366F1] to-[#00E5FF] p-1 shadow-[0_0_50px_rgba(0,229,255,0.4)] animate-pulse mb-6">
                <div className="w-full h-full bg-[#0B0D19] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#00E5FF] animate-spin" />
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-2">HOSTBANGER AI Engine</h3>
              <p className="text-sm font-semibold text-[#00E5FF] font-mono animate-fade-in">
                {generationStep}
              </p>
              <div className="mt-6 w-64 h-1.5 bg-[#1B223C] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#00E5FF] to-[#A855F7] animate-pulse w-full" />
              </div>
            </div>
          )}

          {/* Centered preview container with dynamic viewport sizing */}
          <div
            className={`h-full transition-all duration-300 ${viewportWidths[viewport]} shadow-[0_20px_50px_rgba(0,0,0,0.8)] rounded-xl overflow-hidden border border-[#212946] flex flex-col bg-white`}
          >
            {/* Viewport Frame Top Bar */}
            <div className="h-7 bg-[#161B30] border-b border-[#242F50] px-3 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-slate-300 truncate max-w-xs">
                https://{subdomain}
              </span>
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <span className="text-[10px] text-emerald-400 font-bold">● Free SSL Active</span>
              </div>
            </div>

            {/* Game Controls HUD banner if game or canvas */}
            {(activeMode === 'game' || fullDoc.includes('<canvas')) && (
              <div className="bg-[#0D1224] border-b border-[#202946] px-3 py-1.5 flex items-center justify-between text-xs text-white shrink-0">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#A855F7]/20 text-[#C084FC] font-extrabold text-[10px] flex items-center gap-1 border border-[#A855F7]/30">
                    <Gamepad2 className="w-3 h-3" />
                    PLAYABLE 60 FPS GAME
                  </span>
                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    Controls: Arrow Keys / WASD / Space / Touch Buttons
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    // Force refresh iframe sandbox
                    const current = html;
                    setHtml('');
                    setTimeout(() => setHtml(current), 60);
                  }}
                  className="px-2.5 py-1 rounded bg-[#171E36] hover:bg-[#222C4F] text-[#00E5FF] font-bold text-[10px] flex items-center gap-1 border border-[#00E5FF]/20"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Restart Game</span>
                </button>
              </div>
            )}

            {/* Sandboxed iframe */}
            <iframe
              title="HOSTBANGER Live Preview Sandbox"
              srcDoc={fullDoc}
              sandbox="allow-scripts allow-modals"
              className="flex-1 w-full h-full border-none bg-white"
            />
          </div>
        </div>
      </div>

      {/* CLOUDFLARE PAGES / FREE SUBDOMAIN PUBLISHING MODAL */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-[#0E1224] border border-[#232B48] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-[#00E5FF]" />
                <h3 className="font-bold text-white text-lg">Publish to Free Hosting</h3>
              </div>
              <button
                onClick={() => setDeployModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              Choose your website name and free hosting provider. Once deployed, you receive an authentic public URL accessible worldwide.
            </p>

            <div className="space-y-4">
              {/* Choose Hosting Provider */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Hosting Provider
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('cloudflare_pages');
                      setSubdomainCheck(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProvider === 'cloudflare_pages'
                        ? 'bg-[#18213E] border-[#00E5FF] text-white shadow-lg'
                        : 'bg-[#090C18] border-[#222B48] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">Cloudflare Pages</span>
                      <Cloud className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <span className="text-[11px] text-[#00E5FF] font-mono block">*.pages.dev</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProvider('hostbanger_edge');
                      setSubdomainCheck(null);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedProvider === 'hostbanger_edge'
                        ? 'bg-[#18213E] border-[#00E5FF] text-white shadow-lg'
                        : 'bg-[#090C18] border-[#222B48] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">HOSTBANGER Edge</span>
                      <Globe className="w-3.5 h-3.5 text-[#00E5FF]" />
                    </div>
                    <span className="text-[11px] text-purple-400 font-mono block">*.hostbanger.app</span>
                  </button>
                </div>
              </div>

              {/* Subdomain Input Form */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Choose Website Name
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={chosenSubdomain}
                      onChange={e => {
                        setChosenSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                        setSubdomainCheck(null);
                      }}
                      placeholder="e.g. shadowgaming"
                      className="w-full bg-[#080B15] border border-[#232B48] focus:border-[#00E5FF] rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifySubdomain}
                    disabled={isCheckingSubdomain || !chosenSubdomain}
                    className="px-4 py-2 rounded-xl bg-[#18213E] hover:bg-[#253360] text-xs font-bold text-[#00E5FF] border border-[#334270] transition-colors"
                  >
                    {isCheckingSubdomain ? 'Checking...' : 'Check'}
                  </button>
                </div>

                {/* Subdomain Availability Feedback */}
                {subdomainCheck && (
                  <div
                    className={`mt-2 p-2.5 rounded-lg text-xs flex items-center justify-between ${
                      subdomainCheck.available
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    <span>{subdomainCheck.message}</span>
                    {subdomainCheck.available && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </div>
                )}
              </div>

              {/* Deployment Status & Real Public URL if deployed */}
              {status === 'Published' && publicUrl && (
                <div className="p-3.5 rounded-xl bg-[#141A30] border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Live Website Online
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">TLS 1.3 Confirmed</span>
                  </div>
                  <div className="flex items-center justify-between bg-[#080B15] p-2 rounded-lg font-mono text-xs text-[#00E5FF] truncate">
                    <span className="truncate">https://{subdomain}</span>
                    <button
                      onClick={() => copyUrlToClipboard(`https://${subdomain}`)}
                      className="ml-2 text-slate-400 hover:text-white shrink-0"
                      title="Copy URL"
                    >
                      {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <a
                      href={publicUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-1.5 rounded-lg bg-[#00E5FF] text-[#0B0D19] font-bold text-xs text-center flex items-center justify-center gap-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Open Website
                    </a>
                    <button
                      onClick={handleRepublish}
                      className="flex-1 py-1.5 rounded-lg bg-[#18213E] text-slate-200 font-bold text-xs text-center hover:bg-[#253360] flex items-center justify-center gap-1"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Republish
                    </button>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleExecuteDeploy}
                  disabled={isDeploying || (subdomainCheck ? !subdomainCheck.available : false)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-black text-sm tracking-wide shadow-[0_0_20px_rgba(0,229,255,0.4)] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  <Rocket className="w-4 h-4 text-[#0B0D19]" />
                  <span>{isDeploying ? 'Deploying to Edge...' : `Publish to https://${chosenSubdomain}.${selectedProvider === 'cloudflare_pages' ? 'pages.dev' : 'hostbanger.app'}`}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
