import { useEffect, useState } from 'react';

export default function BackgroundGlow() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-350 select-none pointer-events-none">
      {/* 1. Subtle, elegant light gradient accents to add depth but keep it clean (DSCE Royal Blue brand) */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-50/50 dark:bg-blue-900/10 blur-[130px] transition-all duration-350" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-slate-100/60 dark:bg-slate-900/10 blur-[120px] transition-all duration-350" />

      {/* 2. Professional linear grid pattern for engineering campus archetype */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-80" />

      {/* 3. Subtle vignette for standard framing */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-50/30 dark:to-slate-950/40 transition-colors duration-350" />
      
      {/* 4. Fine separation line in header area */}
      <div className="absolute top-16 left-0 right-0 h-[1px] bg-slate-200/50 dark:bg-slate-800/40 transition-colors duration-350" />
    </div>
  );
}
