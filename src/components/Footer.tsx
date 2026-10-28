import React from 'react';
import { Logo } from './Logo';
import { Shield, Database, Cloud, Terminal, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenLegal: (modal: 'privacy' | 'terms' | 'schema' | 'integrations') => void;
  onNavigate: (view: 'home' | 'builder' | 'dashboard' | 'admin' | 'templates', initialTab?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenLegal, onNavigate }) => {
  return (
    <footer className="w-full bg-[#080A14] border-t border-[#191E32] text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm mt-3">
              The high-performance AI website generator and cloud hosting infrastructure. Launch bespoke web applications, enterprise landing pages, and production stores in seconds.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-emerald-400">HOSTBANGER Global Edge: 99.98% Uptime</span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onNavigate('builder')} className="hover:text-[#00E5FF] transition-colors">
                  AI Website Builder
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('templates')} className="hover:text-[#00E5FF] transition-colors">
                  Website Templates
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'websites')} className="hover:text-[#00E5FF] transition-colors">
                  Cloud Web Hosting
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'domains')} className="hover:text-[#00E5FF] transition-colors">
                  Domain Names & DNS
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'deployments')} className="hover:text-[#00E5FF] transition-colors">
                  One-Click Publishing
                </button>
              </li>
            </ul>
          </div>

          {/* Infrastructure & Architecture */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider">Architecture & Docs</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onOpenLegal('schema')} className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-indigo-400" />
                  PostgreSQL Schema
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('integrations')} className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Cloud className="w-3.5 h-3.5 text-cyan-400" />
                  Integrations Guide
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'files')} className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  Virtual File System
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'support')} className="hover:text-[#00E5FF] transition-colors">
                  Support Helpdesk
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Governance */}
          <div className="space-y-3">
            <h4 className="text-white font-bold uppercase text-xs tracking-wider">Trust & Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button onClick={() => onOpenLegal('privacy')} className="hover:text-[#00E5FF] transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-purple-400" />
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onOpenLegal('terms')} className="hover:text-[#00E5FF] transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard', 'settings')} className="hover:text-[#00E5FF] transition-colors">
                  Account Management
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-500 block pt-1">
                  Edge TLS 1.3 Encryption Active
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-[#141829] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} HOSTBANGER Inc. All rights reserved. Next-Gen Web Solutions.
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#00E5FF]/80 font-mono">HOSTBANGER Cloud Core v2.4</span>
            <span>•</span>
            <span className="text-slate-400">Zero Proprietary Assets • Original Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
