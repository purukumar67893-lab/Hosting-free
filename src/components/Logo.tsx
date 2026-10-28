import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  onClick
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
    xl: 'w-14 h-14 text-lg'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3.5xl font-extrabold'
  };

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 select-none ${onClick ? 'cursor-pointer hover:opacity-95 transition-opacity' : ''} ${className}`}
    >
      {/* Unique Geometric Server/Bolt Mark */}
      <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-[#00E5FF] via-[#6366F1] to-[#A855F7] p-[1.5px] shadow-[0_0_20px_rgba(0,229,255,0.35)] ${iconSizes[size]}`}>
        <div className="w-full h-full bg-[#0B0D19] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#6366F1]/20 to-[#00E5FF]/20" />
          <svg
            className="w-3/5 h-3/5 text-[#00E5FF] filter drop-shadow-[0_0_6px_#00E5FF]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Stylized electric server lightning bolt */}
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="currentColor" fillOpacity="0.2" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col leading-tight">
        <div className={`font-black tracking-tight text-white flex items-center gap-1.5 ${textSizes[size]}`}>
          <span>HOST</span>
          <span className="bg-gradient-to-r from-[#00E5FF] via-[#818CF8] to-[#C084FC] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(0,229,255,0.4)]">
            BANGER
          </span>
          <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 hidden sm:inline-block">
            CLOUD
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Next-Gen AI Website Builder & Cloud Hosting
          </span>
        )}
      </div>
    </div>
  );
};
