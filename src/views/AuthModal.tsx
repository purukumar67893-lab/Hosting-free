import React, { useState } from 'react';
import { Logo } from '../components/Logo';
import { api } from '../services/api';
import { User } from '../types';
import { X, Lock, Mail, User as UserIcon, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'signup';
  onClose: () => void;
  onSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await api.login(email, role);
        onSuccess(res.user);
        onClose();
      } else {
        const res = await api.register(name, email, password, role);
        onSuccess(res.user);
        onClose();
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = (demoType: 'admin' | 'creator') => {
    if (demoType === 'admin') {
      setEmail('admin@hostbanger.io');
      setName('Alexander Cross');
      setPassword('admin1234');
      setRole('admin');
    } else {
      setEmail('creator@hostbanger.io');
      setName('Sarah Lin');
      setPassword('creator1234');
      setRole('user');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-[#0F1325] border border-[#232B4A] rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00E5FF]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#A855F7]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6">
          <Logo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 bg-[#090C18] rounded-xl border border-[#1E2540] mb-6">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] shadow-[0_0_15px_rgba(0,229,255,0.25)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Elena Rostova"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#090C18] border border-[#212946] focus:border-[#00E5FF] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#090C18] border border-[#212946] focus:border-[#00E5FF] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#090C18] border border-[#212946] focus:border-[#00E5FF] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Account Role Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Account Privilege</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('user')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                  role === 'user'
                    ? 'bg-[#18213E] border-[#00E5FF] text-white'
                    : 'bg-[#090C18] border-[#212946] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Creator / Client</span>
                {role === 'user' && <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5FF]" />}
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all text-left flex items-center justify-between ${
                  role === 'admin'
                    ? 'bg-[#2E183E] border-purple-400 text-white'
                    : 'bg-[#090C18] border-[#212946] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Platform Admin</span>
                {role === 'admin' && <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-[#00E5FF] via-[#38BDF8] to-[#818CF8] text-[#0B0D19] font-black text-sm tracking-wide hover:shadow-[0_0_25px_rgba(0,229,255,0.4)] transition-all disabled:opacity-50"
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Sign In to HOSTBANGER' : 'Create Free Account'}
          </button>
        </form>

        {/* Quick Demo Fill Buttons */}
        <div className="mt-6 pt-5 border-t border-[#1C233C]">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5 text-center">
            Instant Demo Sign-in
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('creator')}
              className="py-1.5 px-3 rounded-lg bg-[#141A30] hover:bg-[#1C2544] border border-[#242F52] text-xs font-semibold text-slate-300 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
              Creator Demo
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="py-1.5 px-3 rounded-lg bg-[#1F1735] hover:bg-[#2A2046] border border-[#3E2D64] text-xs font-semibold text-purple-300 flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Admin Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
