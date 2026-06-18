import { useState } from 'react';
import { SuccessStory } from '../types';
import { INITIAL_STORIES } from '../data';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Frown, MessageSquare, Quote, Smile, Sparkles } from 'lucide-react';

export default function SuccessStoryBoard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [storyState, setStoryState] = useState<'chaos' | 'relief'>('relief');

  const currentStory = INITIAL_STORIES[activeIndex];

  const handleNext = () => {
    setStoryState('relief');
    setActiveIndex((prev) => (prev + 1) % INITIAL_STORIES.length);
  };

  const handlePrev = () => {
    setStoryState('relief');
    setActiveIndex((prev) => (prev - 1 + INITIAL_STORIES.length) % INITIAL_STORIES.length);
  };

  // Chaos descriptions
  const chaosScenarios: Record<string, { desc: string, emoji: string, tags: string[] }> = {
    'MacBook Pro 16"': {
      desc: 'Elena frantically paced around Level 3 of the library for 40 minutes. She had three distinct finals outlines ready to submit and no carbon cloud synchronizations. Her breathing spiked; her entire graduation year depended on that physical drive!',
      emoji: '😰💻💔',
      tags: ['LIBRARY EXAM PREP', 'URGENT', 'CRITICAL WORK']
    },
    'Diamond Solitaire Ring': {
      desc: 'Sophia reached for her hand and realized her grandmother\'s golden diamond setting was completely gone! She searched through four distinct art studios and humanities fountain gardens, in tears, convinced it was washed down a city drain forever.',
      emoji: '😭💍⛲',
      tags: ['FAMILY HEIRLOOM', 'CAMPUS COURTYARD', 'SENTIMENTAL']
    },
    'Bellroy Leather Wallet': {
      desc: 'Daniel realized his pocket was entirely flat as he queued up for lunch. Inside was $120 cash, his student card, his driver license, and his primary medical cards. He filed a panic SOS, worried about identity theft.',
      emoji: '😰💳💸',
      tags: ['CANTEEN HALL', 'CASH & CARDS', 'LOCKER ROOM']
    }
  };

  const currentChaos = chaosScenarios[currentStory.itemTitle] || {
    desc: 'The student reported feeling absolutely crushed and frantic upon realizing this critical item was completely missing near campus hallways.',
    emoji: '😭💔',
    tags: ['LOST STATE']
  };

  return (
    <div className="relative py-12 border-t border-b border-slate-200 bg-gradient-to-b from-slate-100/50 via-white to-slate-100/30">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header Title with premium display font */}
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-[10px] font-bold text-blue-700 uppercase tracking-wider leading-none">
            <Sparkles className="w-3.5 h-3.5 inline mr-1 text-blue-600" /> Gratitude Journal
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            Stories of <span className="text-blue-600">Reunited</span> Items
          </h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
            Witness the immediate human impact of honest student collaboration on campus.
          </p>
        </div>

        {/* Double State Slider Bento Area */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left testimonial card */}
          <div className="md:col-span-8 relative">
            {/* Carousel navigation overlay bubble trigger */}
            <div className="absolute -top-3 -right-3 flex gap-1.5 z-10">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350 transition-all cursor-pointer shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg flex items-center justify-center bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-350 transition-all cursor-pointer shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Testimonial Panel */}
            <motion.div
              layout
              className="p-6 md:p-8 rounded-2xl border border-slate-200 bg-white shadow-sm relative overflow-hidden"
              style={{ minHeight: '340px' }}
            >
              {/* Massive background quote watermark */}
              <Quote className="absolute right-6 top-8 w-24 h-24 text-slate-100 pointer-events-none select-none" />

              {/* Toggle story STATE switch (Chaos vs Relief) */}
              <div className="inline-flex p-1 bg-slate-50 border border-slate-200 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setStoryState('chaos')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${storyState === 'chaos' ? 'bg-rose-50 border border-rose-100 text-rose-700 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Frown className="w-3.5 h-3.5 inline mr-1 text-rose-500" /> The Panic
                </button>
                <button
                  type="button"
                  onClick={() => setStoryState('relief')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[10px] font-bold tracking-wide uppercase transition-all cursor-pointer ${storyState === 'relief' ? 'bg-emerald-50 border border-emerald-100 text-emerald-700 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <Smile className="w-3.5 h-3.5 inline mr-1 text-emerald-600" /> The Reunion
                </button>
              </div>

              {/* Story presentation details */}
              <AnimatePresence mode="wait">
                {storyState === 'relief' ? (
                  <motion.div
                    key="relief-tab"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4 text-left"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-50 border border-emerald-100 text-[9px] font-bold text-emerald-700 uppercase tracking-wider font-mono">
                      reunion achieved · {currentStory.dateReunited}
                    </span>
                    <h3 className="font-display font-black text-xl md:text-2xl text-slate-800 leading-tight tracking-tight">
                      "{currentStory.title}"
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentStory.description}
                    </p>
                    <div className="pt-4 border-t border-slate-100">
                      <span className="font-display font-bold text-sm text-slate-800 block">{currentStory.author}</span>
                      <span className="text-[10px] text-slate-400 block font-mono mt-0.5">Verified Reunited Student</span>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chaos-tab"
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-4 text-left"
                  >
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-50 border border-rose-100 text-[9px] font-bold text-rose-700 uppercase tracking-wider font-mono">
                      INITIAL LOST REPORT · {currentStory.itemTitle}
                    </span>
                    <h3 className="font-display font-black text-xl md:text-2xl text-slate-800 leading-tight tracking-tight flex items-center gap-2">
                      The Disappearance {currentChaos.emoji}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentChaos.desc}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex gap-2 pt-2">
                      {currentChaos.tags.map((tag) => (
                        <span key={tag} className="px-2 py-0.5 rounded bg-slate-50 border border-slate-200 font-mono text-[9px] text-slate-500 block font-bold">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Right bento details: quick overview */}
          <div className="md:col-span-4 space-y-4 text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-3 relative overflow-hidden">
              <span className="block text-[9px] font-bold text-slate-450 font-mono uppercase tracking-wider">Featured Asset</span>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center text-3xl">
                  {currentStory.emoji}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-850">{currentStory.itemTitle}</h4>
                  <span className="text-xs text-slate-500 font-mono">Returned successfully</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-2 relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-xs text-blue-600 font-bold font-mono">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>INTEGRITY & VALUE</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                By maintaining a mutual security index, we empower Dayananda Sagar students to protect valuable personal belongings collaboratively.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
