import React, { useState } from 'react';
import { Logo } from './Logo';
import { User } from '../types';
import {
  Sparkles,
  Server,
  Layers,
  LayoutDashboard,
  ShieldCheck,
  LogOut,
  Menu,
  X,
  ArrowRight,
  Cloud,
  Globe
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'builder' | 'dashboard' | 'admin' | 'templates' | 'domains';
  onNavigate: (view: 'home' | 'builder' | 'dashboard' | 'admin' | 'templates' | 'domains', initialTab?: string) => void;
  currentUser: User | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0D19]/90 backdrop-blur-md border-b border-[#1E2338]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo with Tagline */}
        <Logo onClick={() => onNavigate('home')} size="md" showTagline={false} />

        {/* Navigation: Home | Free Domains | Free Hosting | Website Builder | Templates | My Websites | Login | Sign Up */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
              currentView === 'home'
                ? 'text-[#00E5FF] bg-[#00E5FF]/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('domains')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'domains'
                ? 'text-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Globe className="w-4 h-4 text-[#00E5FF]" />
            Free Domains
          </button>

          <button
            onClick={() => onNavigate('dashboard', 'hosting')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'dashboard'
                ? 'text-[#00E5FF] bg-[#00E5FF]/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Cloud className="w-4 h-4 text-purple-400" />
            <span>Free Hosting</span>
            <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
              FREE
            </span>
          </button>

          <button
            onClick={() => onNavigate('builder')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'builder'
                ? 'text-[#00E5FF] bg-[#00E5FF]/10 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            Website Builder
          </button>

          <button
            onClick={() => onNavigate('templates')}
            className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
              currentView === 'templates'
                ? 'text-[#00E5FF] bg-[#00E5FF]/10'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-400" />
            Templates
          </button>

          <button
            onClick={() => onNavigate('dashboard', 'websites')}
            className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-1.5 transition-all"
          >
            <Server className="w-4 h-4 text-cyan-400" />
            My Websites
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => onNavigate('admin')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all ${
                currentView === 'admin'
                  ? 'text-purple-300 bg-purple-500/20 border border-purple-500/30'
                  : 'text-purple-400 hover:text-purple-200 hover:bg-purple-500/10'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          )}
        </nav>

        {/* Auth & CTA Right Section */}
        <div className="hidden md:flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-[#14182B] border border-[#232946] hover:border-[#00E5FF]/50 transition-all text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#6366F1] to-[#00E5FF] flex items-center justify-center font-bold text-white text-xs">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    currentUser.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-white leading-tight">{currentUser.name}</span>
                  <span className="text-[10px] text-[#00E5FF] font-semibold uppercase">{currentUser.plan} Plan</span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#121629] border border-[#283154] shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-white/5 mb-1">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20">
                      {currentUser.role.toUpperCase()}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('dashboard', 'websites');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#00E5FF]" />
                    My Websites & Dashboard
                  </button>

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onNavigate('builder');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    AI Website Builder
                  </button>

                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        onNavigate('admin');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-purple-300 hover:text-white hover:bg-purple-500/10 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-purple-400" />
                      Admin Control Panel
                    </button>
                  )}

                  <div className="my-1 border-t border-white/5" />

                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-4 py-2 text-sm font-bold text-[#0B0D19] bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] rounded-xl hover:shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all flex items-center gap-1.5"
              >
                Sign Up
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Create Free Website CTA */}
          <button
            onClick={() => onNavigate('builder')}
            className="px-4 py-2 text-sm font-bold text-white bg-gradient-to-r from-[#6366F1] to-[#A855F7] rounded-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all flex items-center gap-1.5 border border-purple-400/30"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            Create Free Website
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-[#14182B] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F1222] border-b border-[#232946] px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4 duration-200">
          <button
            onClick={() => {
              onNavigate('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 font-semibold hover:bg-white/5"
          >
            Home
          </button>
          <button
            onClick={() => {
              onNavigate('domains');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-[#00E5FF] font-semibold flex items-center gap-2 hover:bg-white/5"
          >
            <Globe className="w-4 h-4" />
            Free Domains
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard', 'hosting');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 font-semibold hover:bg-white/5"
          >
            Free Hosting
          </button>
          <button
            onClick={() => {
              onNavigate('builder');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-purple-300 font-semibold flex items-center gap-2 hover:bg-white/5"
          >
            <Sparkles className="w-4 h-4 text-[#00E5FF]" />
            Website Builder
          </button>
          <button
            onClick={() => {
              onNavigate('templates');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 font-semibold hover:bg-white/5"
          >
            Templates
          </button>
          <button
            onClick={() => {
              onNavigate('dashboard', 'websites');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left py-2 px-3 rounded-lg text-slate-200 font-semibold hover:bg-white/5"
          >
            My Websites
          </button>

          {currentUser?.role === 'admin' && (
            <button
              onClick={() => {
                onNavigate('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg text-purple-300 font-semibold hover:bg-purple-500/10 flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Panel
            </button>
          )}

          <div className="pt-4 border-t border-white/5 flex flex-col gap-2">
            {currentUser ? (
              <>
                <div className="px-3 py-1 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{currentUser.name}</p>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                  </div>
                  <span className="text-xs font-bold text-[#00E5FF] uppercase">{currentUser.plan}</span>
                </div>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 px-3 rounded-lg bg-rose-500/10 text-rose-400 font-bold text-center"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    onOpenAuth('login');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg bg-[#191F38] text-white font-bold text-center"
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    onOpenAuth('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 rounded-lg bg-[#00E5FF] text-[#0B0D19] font-bold text-center"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
