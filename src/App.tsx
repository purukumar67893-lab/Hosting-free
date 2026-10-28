import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './views/LandingPage';
import { FreeDomainsView } from './views/FreeDomainsView';
import { BuilderView } from './views/BuilderView';
import { DashboardView } from './views/DashboardView';
import { AdminView } from './views/AdminView';
import { AuthModal } from './views/AuthModal';
import { TemplatePreviewModal } from './components/TemplatePreviewModal';
import { LegalModals } from './components/LegalModals';
import { TEMPLATES } from './data/templates';
import { User, WebsiteProject, WebsiteTemplate, HostingProvider, AiMode } from './types';
import { getStoredUser, clearStoredSession, api } from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'builder' | 'dashboard' | 'admin' | 'templates' | 'domains'>('home');
  const [dashboardTab, setDashboardTab] = useState<string>('websites');
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());

  // Active builder payload
  const [builderProject, setBuilderProject] = useState<WebsiteProject | null>(null);
  const [builderPrompt, setBuilderPrompt] = useState<string>('');
  const [builderCategory, setBuilderCategory] = useState<string>('Business');
  const [builderMode, setBuilderMode] = useState<AiMode>('website');

  // Modals state
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | 'schema' | 'integrations' | null>(null);

  // Validate active session
  useEffect(() => {
    api.getMe()
      .then(res => setCurrentUser(res.user))
      .catch(() => {
        // Fallback to existing stored or keep null
      });
  }, []);

  const handleNavigate = (view: 'home' | 'builder' | 'dashboard' | 'admin' | 'templates' | 'domains', initialTab?: string) => {
    if (initialTab) setDashboardTab(initialTab);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleClaimSubdomain = (subdomain: string, provider: HostingProvider = 'cloudflare_pages') => {
    setBuilderProject(null);
    setBuilderPrompt(`Build a modern website for ${subdomain} with responsive sections, hero banner, and clean layout`);
    setBuilderCategory('Business');
    setCurrentView('builder');
  };

  const handleStartGenerating = (prompt: string, category: string = 'Business', mode: AiMode = 'website') => {
    setBuilderProject(null);
    setBuilderPrompt(prompt);
    setBuilderCategory(category);
    setBuilderMode(mode);
    setCurrentView('builder');
  };

  const handleSelectTemplate = (template: WebsiteTemplate) => {
    setPreviewTemplate(null);
    setBuilderProject(null);
    setBuilderPrompt(`A customized modern website inspired by ${template.name}: ${template.description}`);
    setBuilderCategory(template.category);
    setCurrentView('builder');
  };

  const handleEditProject = (project: WebsiteProject) => {
    setBuilderProject(project);
    setBuilderPrompt('');
    setBuilderCategory(project.category);
    setCurrentView('builder');
  };

  const handleCreateNewWebsite = () => {
    setBuilderProject(null);
    setBuilderPrompt('');
    setBuilderCategory('Business');
    setCurrentView('builder');
  };

  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0B0D19] flex flex-col font-sans selection:bg-[#00E5FF] selection:text-[#0B0D19]">
      {/* Navigation Header */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'home' && (
          <LandingPage
            onStartGenerating={handleStartGenerating}
            onExploreTemplates={() => handleNavigate('templates')}
            onSelectTemplate={handleSelectTemplate}
            onPreviewTemplate={tpl => setPreviewTemplate(tpl)}
            onClaimSubdomain={handleClaimSubdomain}
            onNavigateToDomains={() => handleNavigate('domains')}
            onOpenPricingPlan={planId => {
              if (!currentUser) {
                handleOpenAuth('signup');
              } else {
                api.updateProfile(undefined, planId).then(u => {
                  setCurrentUser(u);
                  handleNavigate('dashboard', 'plans');
                });
              }
            }}
          />
        )}

        {currentView === 'domains' && (
          <FreeDomainsView
            onClaimSubdomain={handleClaimSubdomain}
            onExploreTemplates={() => handleNavigate('templates')}
          />
        )}

        {currentView === 'builder' && (
          <BuilderView
            initialProject={builderProject}
            initialPrompt={builderPrompt}
            initialCategory={builderCategory}
            initialMode={builderMode}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onDeploySuccess={proj => {
              setBuilderProject(proj);
            }}
            onBackToDashboard={() => handleNavigate('dashboard', 'websites')}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            initialTab={dashboardTab}
            currentUser={currentUser}
            onOpenAuth={handleOpenAuth}
            onEditProject={handleEditProject}
            onCreateNewWebsite={handleCreateNewWebsite}
            onSelectTemplate={handleSelectTemplate}
            onPreviewTemplate={tpl => setPreviewTemplate(tpl)}
            onLogout={handleLogout}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            currentUser={currentUser}
            onBackToDashboard={() => handleNavigate('dashboard', 'websites')}
          />
        )}

        {currentView === 'templates' && (
          <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-[#00E5FF] uppercase tracking-wider block mb-2">
                Original Foundations
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white">
                All Website Templates
              </h1>
              <p className="mt-3 text-slate-400 text-sm sm:text-base">
                Click "Live Preview" to test across desktop and mobile devices, or "Use Template" to launch straight into the HOSTBANGER AI Studio.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  className="rounded-2xl bg-[#111528] border border-[#212946] overflow-hidden flex flex-col justify-between hover:border-[#00E5FF]/50 transition-all shadow-xl"
                >
                  <div className="h-44 overflow-hidden relative bg-black">
                    <img src={tpl.thumbnail} alt={tpl.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity" />
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
                        onClick={() => setPreviewTemplate(tpl)}
                        className="py-2 px-3 rounded-lg bg-[#18213E] hover:bg-[#253360] text-slate-200 text-xs font-bold text-center"
                      >
                        Preview
                      </button>
                      <button
                        onClick={() => handleSelectTemplate(tpl)}
                        className="py-2 px-3 rounded-lg bg-[#00E5FF] text-[#0B0D19] text-xs font-black text-center hover:bg-[#38BDF8]"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      {currentView !== 'builder' && (
        <Footer
          onOpenLegal={type => setLegalModalType(type)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={user => {
          setCurrentUser(user);
          setAuthModalOpen(false);
        }}
      />

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onSelect={tpl => handleSelectTemplate(tpl)}
      />

      <LegalModals
        activeModal={legalModalType}
        onClose={() => setLegalModalType(null)}
      />
    </div>
  );
}
