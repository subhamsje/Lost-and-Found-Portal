import { motion } from 'motion/react';
import { CheckCircle2, Flame, Sparkles } from 'lucide-react';

interface FloatingHeroCardProps {
  emoji: string;
  title: string;
  statusText: string;
  timeText: string;
  accent: 'violet' | 'emerald' | 'cyan' | 'amber';
  initialX: number;
  initialY: number;
  floatDelay: number;
}

export default function FloatingHeroCard({
  emoji,
  title,
  statusText,
  timeText,
  accent,
  initialX,
  initialY,
  floatDelay
}: FloatingHeroCardProps) {
  const accentClasses = {
    violet: {
      glow: 'shadow-violet-200/40',
      border: 'border-violet-100',
      badgeBg: 'bg-violet-50 text-violet-700',
      icon: <Sparkles className="w-3.5 h-3.5 text-violet-600 animate-pulse" />
    },
    emerald: {
      glow: 'shadow-emerald-200/40',
      border: 'border-emerald-100',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
    },
    cyan: {
      glow: 'shadow-cyan-200/40',
      border: 'border-cyan-100',
      badgeBg: 'bg-cyan-50 text-cyan-700',
      icon: <Flame className="w-3.5 h-3.5 text-cyan-600" />
    },
    amber: {
      glow: 'shadow-amber-200/40',
      border: 'border-amber-100',
      badgeBg: 'bg-amber-50 text-amber-700',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-600" />
    }
  }[accent];

  return (
    <motion.div
      drag
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      dragElastic={0.4}
      whileDrag={{ scale: 1.03, cursor: 'grabbing', zIndex: 30 }}
      initial={{ opacity: 0, x: initialX, y: initialY + 20 }}
      animate={{
        opacity: 1,
        x: initialX,
        y: [initialY, initialY - 10, initialY],
      }}
      transition={{
        opacity: { duration: 0.8, delay: 0.1 },
        x: { type: 'spring', stiffness: 50 },
        y: {
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay
        }
      }}
      className={`absolute hidden md:flex items-center gap-3.5 p-3.5 pr-5 rounded-2xl bg-white/95 border border-slate-200 shadow-lg ${accentClasses.glow} backdrop-blur-md select-none cursor-grab active:cursor-grabbing`}
      style={{
        zIndex: 10,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Category Icon */}
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 text-2xl font-semibold">
        {emoji}
        <div className="absolute -bottom-1 -right-1 w-5.5 h-5.5 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm">
          {accentClasses.icon}
        </div>
      </div>

      <div className="flex flex-col text-left">
        <span className="font-display font-bold text-sm text-slate-800 tracking-tight">{title}</span>
        <div className="flex items-center gap-2 mt-1">
          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wide leading-none uppercase ${accentClasses.badgeBg}`}>
            {statusText}
          </span>
          <span className="text-[9px] text-slate-400 font-mono tracking-tighter">{timeText}</span>
        </div>
      </div>
    </motion.div>
  );
}
