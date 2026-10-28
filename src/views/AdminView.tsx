import React, { useState, useEffect } from 'react';
import { Logo } from '../components/Logo';
import { User, WebsiteProject, SupportTicket, AdminMetrics } from '../types';
import { TEMPLATES } from '../data/templates';
import { api } from '../services/api';
import {
  ShieldCheck,
  Users,
  Server,
  Sparkles,
  DollarSign,
  Activity,
  LifeBuoy,
  Layers,
  Database,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Code
} from 'lucide-react';

interface AdminViewProps {
  currentUser: User | null;
  onBackToDashboard: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ currentUser, onBackToDashboard }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'websites' | 'ai' | 'support' | 'templates'>('overview');
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [allProjects, setAllProjects] = useState<WebsiteProject[]>([]);
  const [allTickets, setAllTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [ticketReply, setTicketReply] = useState<string>('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminMetrics();
      setMetrics(data.metrics);
      setAllUsers(data.users);
      setAllProjects(data.projects);
      setAllTickets(data.tickets);
    } catch (err) {
      console.error('Failed to load admin metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminTicketReply = async (tId: string) => {
    if (!ticketReply.trim()) return;
    try {
      const updated = await api.replyTicket(tId, ticketReply);
      setAllTickets(prev => prev.map(t => (t.id === tId ? updated : t)));
      setTicketReply('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#070912] text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <div className="bg-[#0B0D19] border-b border-[#1E2540] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo size="md" />
          <div className="h-4 w-[1px] bg-white/10" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>HOSTBANGER Administrative Control Panel</span>
          </div>
        </div>

        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 rounded-xl bg-[#141A30] hover:bg-[#1E2646] text-xs font-bold text-slate-300"
        >
          ← Return to Dashboard
        </button>
      </div>

      {/* Main Admin Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 p-1 bg-[#0E1224] rounded-2xl border border-[#1E2540]">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Activity },
            { id: 'users', label: `Users (${allUsers.length})`, icon: Users },
            { id: 'websites', label: `Hosted Websites (${allProjects.length})`, icon: Server },
            { id: 'ai', label: 'AI Usage & Models', icon: Sparkles },
            { id: 'support', label: `Support Queue (${allTickets.length})`, icon: LifeBuoy },
            { id: 'templates', label: 'Template Catalog', icon: Layers }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#00E5FF] text-[#0B0D19] shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && metrics && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-[#111528] border border-[#212946]">
                <span className="text-xs font-bold text-slate-400 uppercase">Registered Users</span>
                <div className="text-3xl font-black text-white font-mono mt-1">{metrics.totalUsers}</div>
                <span className="text-[10px] text-emerald-400 font-semibold">+18% this month</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111528] border border-[#212946]">
                <span className="text-xs font-bold text-slate-400 uppercase">Active Deployments</span>
                <div className="text-3xl font-black text-[#00E5FF] font-mono mt-1">{metrics.activeDeployments}</div>
                <span className="text-[10px] text-slate-400">Total sites: {metrics.totalProjects}</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111528] border border-[#212946]">
                <span className="text-xs font-bold text-slate-400 uppercase">AI Generations</span>
                <div className="text-3xl font-black text-purple-400 font-mono mt-1">{metrics.totalAiGenerations}</div>
                <span className="text-[10px] text-purple-300 font-semibold">Gemini 3.8 Flash Engine</span>
              </div>

              <div className="p-5 rounded-2xl bg-[#111528] border border-[#212946]">
                <span className="text-xs font-bold text-slate-400 uppercase">Platform Uptime</span>
                <div className="text-3xl font-black text-emerald-400 font-mono mt-1">{metrics.serverUptime}%</div>
                <span className="text-[10px] text-slate-400">Zero edge incidents</span>
              </div>
            </div>

            {/* Edge Node Status */}
            <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
              <h3 className="font-bold text-white text-base mb-4">Edge Cluster Infrastructure</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">US-East Region (Virginia)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Memory: 2.1 GB / 8 GB • CPU: 18%</p>
                </div>
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">EU-Central Region (Frankfurt)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Memory: 3.4 GB / 8 GB • CPU: 24%</p>
                </div>
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-white text-xs">AP-Southeast (Singapore)</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <p className="text-xs text-slate-400">Memory: 1.8 GB / 8 GB • CPU: 14%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USERS */}
        {activeTab === 'users' && (
          <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
            <h3 className="font-bold text-white text-base mb-4">Registered Platform Accounts</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E2540] text-slate-400 uppercase font-bold">
                    <th className="py-2.5">User</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5">Active Tier</th>
                    <th className="py-2.5">Member Since</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182038]">
                  {allUsers.map(u => (
                    <tr key={u.id}>
                      <td className="py-3 font-bold text-white flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-purple-500 to-[#00E5FF] flex items-center justify-center text-[10px] font-black text-black">
                          {u.name.charAt(0)}
                        </div>
                        <span>{u.name}</span>
                      </td>
                      <td className="py-3 text-slate-300 font-mono">{u.email}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            u.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className="text-[#00E5FF] font-bold uppercase">{u.plan}</span>
                      </td>
                      <td className="py-3 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: WEBSITES */}
        {activeTab === 'websites' && (
          <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
            <h3 className="font-bold text-white text-base mb-4">All Hosted Websites Across Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#1E2540] text-slate-400 uppercase font-bold">
                    <th className="py-2.5">Website Name</th>
                    <th className="py-2.5">Category</th>
                    <th className="py-2.5">Subdomain</th>
                    <th className="py-2.5">Status</th>
                    <th className="py-2.5">Storage</th>
                    <th className="py-2.5">Visits</th>
                    <th className="py-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#182038]">
                  {allProjects.map(p => (
                    <tr key={p.id}>
                      <td className="py-3 font-bold text-white">{p.name}</td>
                      <td className="py-3 text-[#00E5FF] font-semibold">{p.category}</td>
                      <td className="py-3 font-mono text-slate-300">{p.subdomain}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-slate-400">{p.storageMb} MB</td>
                      <td className="py-3 font-mono text-slate-300">{p.visits.toLocaleString()}</td>
                      <td className="py-3">
                        <a
                          href={p.publicUrl || `/deployed/${p.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#00E5FF] hover:underline font-semibold flex items-center gap-1"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: AI USAGE & TELEMETRY */}
        {activeTab === 'ai' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
              <h3 className="font-bold text-white text-base mb-2">Gemini Model Configuration</h3>
              <p className="text-xs text-slate-400 mb-6">
                Active generation model: <code className="text-[#00E5FF]">gemini-3.8-flash</code> via the official <code className="text-[#00E5FF]">@google/genai</code> server SDK.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Input Tokens</span>
                  <div className="text-2xl font-black text-white font-mono mt-1">284,500</div>
                  <span className="text-[10px] text-slate-500">Structured system prompt instructions</span>
                </div>
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Output Tokens</span>
                  <div className="text-2xl font-black text-[#00E5FF] font-mono mt-1">892,100</div>
                  <span className="text-[10px] text-slate-500">HTML5, CSS3 & JavaScript code parts</span>
                </div>
                <div className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Average Latency</span>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">1.84s</div>
                  <span className="text-[10px] text-slate-500">Response turnaround time</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SUPPORT QUEUE */}
        {activeTab === 'support' && (
          <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946] space-y-4">
            <h3 className="font-bold text-white text-base">User Support Ticket Queue</h3>
            {allTickets.map(t => (
              <div key={t.id} className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white text-sm">
                    {t.subject} <span className="text-xs text-slate-400 font-normal">({t.userEmail})</span>
                  </span>
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400">
                    {t.status}
                  </span>
                </div>
                <div className="space-y-2 mt-3 pt-3 border-t border-white/5">
                  {t.messages.map((m, i) => (
                    <div key={i} className="text-xs p-2.5 rounded-lg bg-[#141A30]">
                      <span className="font-bold text-[#00E5FF]">{m.sender}: </span>
                      <span className="text-slate-300">{m.text}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={selectedTicketId === t.id ? ticketReply : ''}
                    onFocus={() => setSelectedTicketId(t.id)}
                    onChange={e => setTicketReply(e.target.value)}
                    placeholder="Admin engineer reply..."
                    className="flex-1 bg-[#060810] border border-[#232B48] rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    onClick={() => handleAdminTicketReply(t.id)}
                    className="px-4 py-1.5 rounded-lg bg-[#00E5FF] text-[#0B0D19] font-bold text-xs"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 6: TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="p-6 rounded-2xl bg-[#111528] border border-[#212946]">
            <h3 className="font-bold text-white text-base mb-4">System Template Catalog ({TEMPLATES.length})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {TEMPLATES.map(tpl => (
                <div key={tpl.id} className="p-4 rounded-xl bg-[#090C18] border border-[#1E2540]">
                  <span className="text-[10px] font-bold text-[#00E5FF] uppercase">{tpl.category}</span>
                  <h4 className="font-bold text-white text-sm mt-1">{tpl.name}</h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{tpl.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
