import React, { useState } from 'react';
import { WebsiteTemplate } from '../types';
import { X, Monitor, Tablet, Smartphone, Sparkles, Check } from 'lucide-react';

interface TemplatePreviewModalProps {
  template: WebsiteTemplate | null;
  onClose: () => void;
  onSelect: (template: WebsiteTemplate) => void;
}

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  template,
  onClose,
  onSelect
}) => {
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!template) return null;

  // Combine template HTML with CSS and JS for live preview
  let fullDoc = template.html;
  if (!fullDoc.includes('<style>') && template.css) {
    fullDoc = fullDoc.replace('</head>', `<style>\n${template.css}\n</style></head>`);
  }
  if (!fullDoc.includes('<script>') && template.js) {
    fullDoc = fullDoc.replace('</body>', `<script>\n${template.js}\n</script></body>`);
  }

  const viewportWidths = {
    desktop: 'w-full',
    tablet: 'max-w-[768px]',
    mobile: 'max-w-[390px]'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-6xl h-[92vh] bg-[#0E1222] border border-[#232B48] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#1F2742] bg-[#12172C]">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#00E5FF] px-2 py-0.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/20">
              {template.category}
            </span>
            <h3 className="font-bold text-white text-base truncate max-w-sm sm:max-w-md">
              {template.name}
            </h3>
          </div>

          {/* Viewport Toggles */}
          <div className="hidden sm:flex items-center bg-[#090C16] p-1 rounded-xl border border-[#1F2742]">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewport === 'desktop' ? 'bg-[#1E2744] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              Desktop
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewport === 'tablet' ? 'bg-[#1E2744] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              Tablet
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewport === 'mobile' ? 'bg-[#1E2744] text-[#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Mobile
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSelect(template)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#38BDF8] text-[#0B0D19] font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,229,255,0.3)] hover:opacity-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#0B0D19]" />
              Use This Template
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Features Sub-Bar */}
        <div className="px-6 py-2 bg-[#090C16] border-b border-[#1A223A] flex flex-wrap items-center gap-2 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">Template Features:</span>
          {template.features.map((feat, idx) => (
            <span key={idx} className="flex items-center gap-1 text-slate-300 bg-[#141A2E] px-2 py-0.5 rounded-md border border-white/5">
              <Check className="w-3 h-3 text-emerald-400" />
              {feat}
            </span>
          ))}
        </div>

        {/* Sandboxed Live Preview Frame */}
        <div className="flex-1 bg-[#06080F] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
          <div className={`w-full h-full transition-all duration-300 ${viewportWidths[viewport]} shadow-2xl rounded-lg overflow-hidden border border-[#232B48]`}>
            <iframe
              title={`Preview: ${template.name}`}
              srcDoc={fullDoc}
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-none bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
