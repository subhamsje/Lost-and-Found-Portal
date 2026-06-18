import { Item } from '../types';
import { motion } from 'motion/react';
import { Calendar, Eye, MapPin, Sparkles, Trophy } from 'lucide-react';

interface ItemCardProps {
  item: Item;
  onOpenDetails: (item: Item) => void;
}

export default function ItemCard({ item, onOpenDetails }: ItemCardProps) {
  const isFound = item.status === 'found';
  const isReunited = item.status === 'reunited';

  // Soft, professional color palette mapping for badges & highlights matching a classic corporate layout
  const colorMap = {
    blue: {
      border: 'hover:border-blue-400 dark:hover:border-blue-550 hover:shadow-md dark:hover:shadow-blue-500/10',
      badge: 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-900/40',
      text: 'text-blue-600 dark:text-blue-400',
    },
    violet: {
      border: 'hover:border-violet-400 dark:hover:border-violet-550 hover:shadow-md dark:hover:shadow-violet-500/10',
      badge: 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 border-violet-100 dark:border-violet-900/40',
      text: 'text-violet-600 dark:text-violet-400',
    },
    cyan: {
      border: 'hover:border-cyan-400 dark:hover:border-cyan-550 hover:shadow-md dark:hover:shadow-cyan-500/10',
      badge: 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300 border-cyan-100 dark:border-cyan-900/40',
      text: 'text-cyan-600 dark:text-cyan-400',
    },
    emerald: {
      border: 'hover:border-emerald-400 dark:hover:border-emerald-550 hover:shadow-md dark:hover:shadow-emerald-500/10',
      badge: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/40',
      text: 'text-emerald-600 dark:text-emerald-400',
    },
    amber: {
      border: 'hover:border-amber-400 dark:hover:border-amber-550 hover:shadow-md dark:hover:shadow-amber-500/10',
      badge: 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/40',
      text: 'text-amber-600 dark:text-amber-400',
    },
    rose: {
      border: 'hover:border-rose-400 dark:hover:border-rose-550 hover:shadow-md dark:hover:shadow-rose-500/10',
      badge: 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900/40',
      text: 'text-rose-600 dark:text-rose-400',
    }
  }[item.accentColor] || {
    border: 'hover:border-slate-300 dark:hover:border-slate-705 hover:shadow-md',
    badge: 'bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800',
    text: 'text-slate-600 dark:text-slate-400',
  };

  const formatDate = (isoStr: string) => {
    try {
      const dt = new Date(isoStr);
      return dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <motion.div
      layout
      onClick={() => onOpenDetails(item)}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      className={`group relative flex flex-col justify-between h-[370px] p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 cursor-pointer overflow-hidden transition-all duration-200 ${colorMap.border}`}
    >
      {/* Main Card Content */}
      <div className="text-left">
        {/* Header - Item Categories + Status Badge */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${colorMap.badge}`}>
            {item.category}
          </span>

          <div className="flex items-center gap-2">
            {isReunited ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                <Sparkles className="w-2.5 h-2.5 inline" /> Reunited
              </span>
            ) : isFound ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-100 dark:border-cyan-900/40 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse mr-1" /> Found
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/40 text-[10px] font-bold text-rose-700 dark:text-rose-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse mr-1" /> Lost
              </span>
            )}
          </div>
        </div>

        {/* Brand Icon + Item Title Grid */}
        <div className="flex items-start gap-4 mb-3">
          {/* Institutional Icon Wrapper */}
          <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-2xl group-hover:scale-105 group-hover:bg-slate-100 dark:group-hover:bg-slate-900 group-hover:border-slate-350 dark:group-hover:border-slate-700 transition-all duration-200">
            {item.icon}
          </div>

          <div className="min-w-0">
            <h3 className="font-display font-bold text-base text-slate-800 dark:text-slate-100 group-hover:text-slate-900 dark:group-hover:text-white leading-snug tracking-tight mb-0.5 truncate">
              {item.title}
            </h3>
            {/* Campus Location */}
            <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 flex-shrink-0" />
              <span className="truncate">{item.location}</span>
            </div>
          </div>
        </div>

        {/* Custom Description Text */}
        <p className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 line-clamp-3 leading-relaxed mb-4">
          {item.description}
        </p>

        {/* Auxiliary Specifications Subcard */}
        {item.specs && (
          <div className="px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 text-[10px] font-mono text-slate-500 dark:text-slate-400 select-none mb-4 truncate">
            {item.specs}
          </div>
        )}
      </div>

      {/* Footer Metrics + Action CTA */}
      <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* View Counter */}
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-mono">
              <Eye className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <span>{item.views} views</span>
            </div>
            {/* Date Reported */}
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
              <span>{formatDate(item.dateReported)}</span>
            </div>
          </div>

          {/* Reward Badge */}
          {item.reward && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 text-[9px] font-bold text-amber-700 dark:text-amber-300">
              <Trophy className="w-2.5 h-2.5 text-amber-600 dark:text-amber-400 inline" />
              <span>REWARD</span>
            </div>
          )}
        </div>

        {/* Clean Interactive Action Button */}
        <div className="mt-3">
          <span className="flex items-center justify-center gap-1 w-full py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 font-display text-[11px] font-bold text-slate-600 dark:text-slate-300 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 dark:group-hover:border-blue-600 transition-all duration-250 shadow-sm animate-none">
            {isReunited ? 'View Details' : isFound ? 'Claim This Item' : 'I Found This'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
