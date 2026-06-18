import { useState, useEffect } from 'react';
import { Item, ItemStatus } from './types';
import { CATEGORIES, INITIAL_ITEMS } from './data';
import { supabase, mapRowToItem, mapItemToRow } from './supabaseClient';
import BackgroundGlow from './components/BackgroundGlow';
import FloatingHeroCard from './components/FloatingHeroCard';
import ItemCard from './components/ItemCard';
import ItemDetailModal from './components/ItemDetailModal';
import ReportItemModal from './components/ReportItemModal';
import SuccessStoryBoard from './components/SuccessStoryBoard';
import CampusMap from './components/CampusMap';
import LoginScreen from './components/LoginScreen';
import LoadingScreen from './components/LoadingScreen';
import Hero3D from './components/Hero3D';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Bell, CheckCircle, Search, Sparkles, 
  MapPin, Radio, Terminal, LogIn, Sun, Moon 
} from 'lucide-react';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  // Theme state for Dayananda Sagar portal
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('dsce_theme') as 'light' | 'dark') || 'light';
    } catch (e) {
      return 'light';
    }
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('dsce_theme', theme);
    } catch (e) {}
  }, [theme]);

  // Authentication session state
  const [userSession, setUserSession] = useState<{ email: string; name: string } | null>(() => {
    try {
      const saved = localStorage.getItem('dsce_user_session');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });
  const [viewMode, setViewMode] = useState<'feed' | 'map'>('feed');

  // Database states
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInitialStatus, setReportInitialStatus] = useState<ItemStatus>('lost');

  // Supabase cloud synchronization on mount
  useEffect(() => {
    async function syncSupabase() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .order('date_reported', { ascending: false });

        if (error) {
          console.error('[Supabase Error] Failing to fetch items:', error.message);
        } else if (data && data.length > 0) {
          const mapped = data.map(mapRowToItem);
          setItems(mapped);
          console.log('[Supabase Sync] Successfully synchronized items:', mapped.length);
        } else {
          // Table is empty. Let's attempt to seed our initial items to establish mock records in the cloud db
          console.log('[Supabase Sync] Supabase table is empty. Seeding initial listings...');
          const seedData = INITIAL_ITEMS.map(mapItemToRow);
          const { error: seedError } = await supabase.from('items').insert(seedData);
          if (seedError) {
            console.error('[Supabase Sync] Seeding error:', seedError.message);
          } else {
            console.log('[Supabase Sync] Root seed items saved into cloud database.');
          }
        }
      } catch (err) {
        console.error('[Supabase Connection] Unexpected error while downloading entries:', err);
      }
    }

    syncSupabase();
  }, []);

  // Search & Filters states
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | ItemStatus>('all');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Live broadcast system notifications state
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([
    { id: 1, text: 'Custom key fob securely reunited 12 minutes ago with its owner!', read: false },
    { id: 2, text: 'New AirPods reported missing in library quiet study zone.', read: false },
    { id: 3, text: 'Gold Cartier Love Ring matching listed in Science Annex.', read: true }
  ]);

  // Toast message states
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Safe handover protocol: update item status to 'reunited' when claimed
  const handleItemClaimed = async (itemId: string, newStatus: 'reunited') => {
    setItems((prevItems) =>
      prevItems.map((it) =>
        it.id === itemId
          ? { ...it, status: newStatus, accentColor: 'emerald' as const, views: it.views + 1 }
          : it
      )
    );
    
    const matchedItem = items.find((i) => i.id === itemId);
    const text = matchedItem 
      ? `"${matchedItem.title}" has been successfully reunited with its owner!` 
      : 'An item was securely claimed!';
    setNotifs((prev) => [{ id: Date.now(), text, read: false }, ...prev]);

    // Update in Supabase Database
    try {
      const { error } = await supabase
        .from('items')
        .update({ 
          status: newStatus, 
          accent_color: 'emerald', 
          views: (matchedItem?.views || 0) + 1 
        })
        .eq('id', itemId);

      if (error) {
        console.error('[Supabase Error] Failed to update item status:', error.message);
      } else {
        console.log('[Supabase Sync] Handover synchronized securely.');
      }
    } catch (err) {
      console.error('[Supabase connection] Unexpected error during status change:', err);
    }
  };

  // Add new item from report wizard modal
  const handleCreateReport = async (newItem: Item) => {
    // Add to local state first (optimistic UI update response)
    setItems((prevItems) => [newItem, ...prevItems]);
    setIsReportOpen(false);
    triggerToast(`"${newItem.title}" was declared on the campus board!`);
    
    setNotifs((prev) => [
      { id: Date.now(), text: `New ${newItem.status} post: "${newItem.title}" declared inside campus listings.`, read: false },
      ...prev
    ]);

    // Push new entry row directly into Supabase database table
    try {
      const dbRow = mapItemToRow(newItem);
      const { error } = await supabase.from('items').insert([dbRow]);

      if (error) {
        console.error('[Supabase Error] Failed to save new report:', error.message);
        triggerToast('Local post completed. Failed to sink into cloud Supabase.');
      } else {
        triggerToast(`"${newItem.title}" synced to Supabase! ⚡`);
      }
    } catch (err) {
      console.error('[Supabase connection] Network error while saving report:', err);
    }
  };

  // Statistics calculation helpers
  const totalCount = items.length;
  const lostCount = items.filter((i) => i.status === 'lost').length;
  const foundCount = items.filter((i) => i.status === 'found').length;
  const reunitedCount = items.filter((i) => i.status === 'reunited').length;

  // Filter listings based on selections
  const filteredItems = items.filter((it) => {
    const matchesSearch = 
      it.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      it.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || it.status === activeFilter;
    const matchesCategory = activeCategory === 'All' || it.category === activeCategory;

    return matchesSearch && matchesFilter && matchesCategory;
  });

  if (!userSession) {
    return (
      <>
        <AnimatePresence>
          {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>
        <div className="min-h-screen relative font-sans text-slate-700 dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-350" id="auth-root-wrapper">
          <BackgroundGlow />
        
        {/* Floating Corner Theme Toggle on Login Screen */}
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
            className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer shadow-sm"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-500" />
            ) : (
              <Sun className="w-4 h-4 text-amber-500" />
            )}
          </button>
        </div>

        <LoginScreen onLoginSuccess={setUserSession} />
      </div>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>
      <div className="min-h-screen relative font-sans text-slate-755 dark:text-slate-300 bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-350 overflow-x-hidden" id="app-root-shell">
        {/* 1. Atmospheric grid and linear blue gradients */}
      <BackgroundGlow />

      {/* 2. Brand navigation header (Clean, professional light theme) */}
      <nav className="sticky top-0 z-40 h-16 bg-white/85 dark:bg-[#0B0F19]/80 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md px-6 select-none transition-colors duration-350" id="nav-primary">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between">
          
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-display font-black text-white shadow-lg text-sm shrink-0">
              CF
            </div>
            <div className="hidden sm:block text-left">
              <span className="font-display font-black text-xs text-slate-850 tracking-wider block">CAMPUSFIND @ DSCE</span>
              <span className="text-[7.5px] font-mono font-bold text-blue-600 tracking-wider block uppercase">Dayananda Sagar College of Engineering</span>
            </div>
          </div>

          {/* Quick search input (Middle) */}
          <div className="relative w-full max-w-xs md:max-w-md mx-4 hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search lost items, textbooks, electronic accessories..."
              className="w-full h-9 bg-slate-100 hover:bg-slate-200/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-full pl-10 pr-4 text-xs text-slate-800 placeholder-slate-400 outline-none transition-all"
            />
          </div>

          {/* Navbar actions */}
          <div className="flex items-center gap-3">
            {/* Quick stats indicator */}
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 font-mono text-[9px] font-bold text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>{reunitedCount} Reunited On Campus</span>
            </div>

            {/* Notification bell dropdown trigger */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-450 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
              >
                <Bell className="w-4 h-4 text-slate-500" />
                {notifs.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {isNotifOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsNotifOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-80 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-4 z-20 space-y-3 text-left"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-850 pb-2 mb-2">
                        <span className="font-display font-bold text-xs text-slate-800 dark:text-slate-200">Operational Updates</span>
                        <button 
                          onClick={() => setNotifs(n => n.map(o => ({...o, read: true})))}
                          className="text-[9px] font-mono uppercase text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 cursor-pointer"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1">
                        {notifs.map(n => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-955 border border-slate-200 dark:border-slate-850 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 space-y-1">
                            <p>{n.text}</p>
                            <span className="text-[9px] text-slate-400 dark:text-slate-500 block font-mono">System Broadcast</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100 transition-all cursor-pointer shadow-sm shrink-0"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? (
                <Moon className="w-4 h-4 text-slate-500" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500 font-bold" />
              )}
            </button>

            {/* Registered User Profile Badge */}
            {userSession && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-left" id="navbar-user-session">
                <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300 shrink-0">
                  {userSession.name.charAt(0)}
                </div>
                <div className="leading-none max-w-[100px] hidden lg:block">
                  <span className="block text-[9px] font-bold text-slate-800 dark:text-slate-200 truncate">{userSession.name}</span>
                  <span className="text-[8px] text-slate-400 dark:text-slate-500 font-mono truncate block">{userSession.email}</span>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem('dsce_user_session');
                    setUserSession(null);
                  }}
                  className="text-[9px] font-mono text-rose-600 hover:text-rose-700 uppercase py-0.5 px-1 ml-1 cursor-pointer font-bold"
                  title="Logout from Portal"
                >
                  Exit
                </button>
              </div>
            )}

            {/* Post Action Button */}
            <button
              onClick={() => setIsReportOpen(true)}
              className="h-9 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-display font-extrabold text-xs shadow-sm shadow-blue-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-white" /> Post Listing
            </button>
          </div>

        </div>
      </nav>

      {/* 3. Hero Copywriting & Layout */}
      <section className="relative px-6 pt-16 md:pt-24 pb-12 text-center max-w-7xl mx-auto select-none" id="hero-portal-entrance">
        <Hero3D />
        
        {/* Floating cards decoration (suspends in 3D atmosphere) */}
        <FloatingHeroCard
          emoji="🎧"
          title="Sony WH-1000XM5"
          statusText="Reunited"
          timeText="L3 Library"
          accent="emerald"
          initialX={-280}
          initialY={10}
          floatDelay={0}
        />
        <FloatingHeroCard
          emoji="🔑"
          title="Vehicle Case Fob"
          statusText="Found"
          timeText="CS Dept Walk"
          accent="cyan"
          initialX={280}
          initialY={-40}
          floatDelay={1.5}
        />
        <FloatingHeroCard
          emoji="🎒"
          title="Leather Briefcase"
          statusText="Lost SOS"
          timeText="CD Sagar Lobby"
          accent="violet"
          initialX={-320}
          initialY={160}
          floatDelay={0.8}
        />

        {/* Hero Copywriting */}
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 animate-fade-in shadow-xs">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            <span className="font-mono text-[9px] text-blue-700 font-extrabold uppercase tracking-wider leading-none">
              Direct Locator • Dayananda Sagar Campus Find
            </span>
          </div>

          <div className="flex flex-col items-center">
            <h1 className="font-display text-[55px] sm:text-[85px] md:text-[95px] leading-[0.88] font-black tracking-tighter text-slate-900 dark:text-white block">
              <span className="block">REUNITED.</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">ON CAMPUS.</span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto leading-relaxed font-medium">
            Streamlining lost property recovery inside <strong>Dayananda Sagar College of Engineering (DSCE)</strong>. Connect directly with other students, preview active map beacons, and claim items through protected safety codes.
          </p>

          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={() => {
                setReportInitialStatus('lost');
                setIsReportOpen(true);
              }}
              className="h-11 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer border border-blue-600/35"
            >
              Report Lost Item
            </button>
            <button
              onClick={() => {
                setReportInitialStatus('found');
                setIsReportOpen(true);
              }}
              className="h-11 px-6 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-205 transition-all font-display font-bold text-xs cursor-pointer shadow-sm"
            >
              Found Something
            </button>
          </div>
        </div>
      </section>

      {/* 4. Live statistics bento grid */}
      <section className="px-6 py-8 max-w-7xl mx-auto select-none" id="analytics-statistics">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden text-left">
            <span className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Active SOS Requests</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-3xl text-slate-900 tracking-tight">{lostCount}</span>
              <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">↑ 2 reported</span>
            </div>
            <p className="text-[11px] text-slate-500">Unresolved belongings awaiting verification from students.</p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden text-left">
            <span className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Safe Custody archived</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-3xl text-slate-900 tracking-tight">{foundCount}</span>
              <span className="text-[10px] text-cyan-705 font-bold bg-cyan-50 px-2 py-0.5 rounded-full border border-cyan-100">Secured Depot</span>
            </div>
            <p className="text-[11px] text-slate-500">Materials securely documented at college departments.</p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden text-left">
            <span className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Campus return Rate</span>
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-3xl text-[#10B981] tracking-tight">89.4%</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">DSCE Record</span>
            </div>
            <p className="text-[11px] text-slate-500">Peer verified handover speed normally under 24 hours.</p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden text-left">
            <span className="block text-[10px] font-mono font-bold text-slate-400 tracking-wider uppercase">Active reward pledges</span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-display font-black text-3xl text-amber-500 tracking-tight">$365</span>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">Gratitude Pledges</span>
            </div>
            <p className="text-[11px] text-slate-500">Incentives voluntarily filed to award honest students.</p>
          </div>

        </div>
      </section>

      {/* 5. Search Filters and Main Workspace */}
      <section className="px-6 py-8 max-w-7xl mx-auto space-y-6" id="board-search-feed">
        
        {/* Controls header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div className="space-y-3 text-left">
            <div className="space-y-1">
              <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">DSCE Finder Dashboard</h2>
              <p className="text-xs text-slate-500 font-semibold">Track lost devices, keychains or notebooks inside campus blocks</p>
            </div>
            
            {/* Tab switch mode list vs map */}
            <div className="inline-flex p-1 bg-slate-100 border border-slate-300 rounded-xl shadow-xs">
              <button
                onClick={() => setViewMode('feed')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${viewMode === 'feed' ? 'bg-white text-slate-800 font-black border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <Terminal className="w-3.5 h-3.5 text-blue-600" />
                <span>List Board ({filteredItems.length})</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all flex items-center gap-2 cursor-pointer ${viewMode === 'map' ? 'bg-white text-slate-800 font-black border border-slate-200 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Interact Map</span>
                <span className="inline-flex px-1.5 py-0.5 rounded text-[8px] font-black tracking-widest bg-blue-600 text-white animate-pulse">LIVE</span>
              </button>
            </div>
          </div>

          {viewMode === 'feed' && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Inline search for mobile */}
              <div className="relative block md:hidden w-full max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search item..."
                  className="w-full h-8.5 bg-white border border-slate-200 rounded-lg pl-9 pr-3 text-xs text-slate-800 outline-none"
                />
              </div>

              {/* Status pills selector */}
              <div className="inline-flex p-1 bg-slate-150 border border-slate-300 rounded-xl shadow-xs">
                {[
                  { filter: 'all', label: 'All Items', badge: totalCount },
                  { filter: 'lost', label: 'Missing', badge: lostCount },
                  { filter: 'found', label: 'Found', badge: foundCount },
                  { filter: 'reunited', label: 'Returned', badge: reunitedCount }
                ].map((pill) => (
                  <button
                    key={pill.filter}
                    onClick={() => setActiveFilter(pill.filter as 'all' | ItemStatus)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all tracking-wide flex items-center gap-1.5 cursor-pointer ${activeFilter === pill.filter ? 'bg-white text-slate-800 font-black border border-slate-200 shadow-xs' : 'text-slate-500 hover:text-slate-800'}`}
                  >
                    {pill.label}
                    <span className={`inline-flex items-center justify-center h-4 px-1.5 rounded text-[8px] font-bold ${activeFilter === pill.filter ? 'bg-slate-100 text-slate-800' : 'bg-slate-200 text-slate-500'}`}>
                      {pill.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {viewMode === 'map' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full"
          >
            <CampusMap items={items} onSelectItem={setSelectedItem} />
          </motion.div>
        ) : (
          <>
            {/* Category horizontal quick filter row */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 select-none pr-4 max-w-full">
              <button
                onClick={() => setActiveCategory('All')}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold leading-none border transition-all cursor-pointer ${activeCategory === 'All' ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'}`}
              >
                All Categories
              </button>
              
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 px-3.5 py-1.5 rounded-lg text-xs font-bold leading-none border transition-all cursor-pointer ${activeCategory === cat ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-800'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* List Board Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((it) => (
                  <motion.div
                    key={it.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                  >
                    <ItemCard item={it} onOpenDetails={setSelectedItem} />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty state view */}
              {filteredItems.length === 0 && (
                <div className="col-span-full py-16 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-2xl">
                    🔎
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-700 text-base">No corresponding reports detected</h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed mt-1">
                      Reset your search string or adjust operations filters to locate what you are looking for.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}

      </section>

      {/* 6. Success Stories Gratitude Ledger */}
      <SuccessStoryBoard />

      {/* 7. Footer Details */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-200 text-center sm:text-left select-none space-y-6 text-slate-500 bg-[#F8FAFC]">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-blue-600 flex items-center justify-center font-display font-black text-xs text-white">
              CF
            </div>
            <span className="text-xs text-slate-700 font-bold font-display">CampusFind Dayananda Sagar</span>
          </div>

          <div className="flex gap-6 text-xs text-slate-405 font-medium">
            <a href="#" className="hover:text-blue-600 transition-all">Verification code guidelines</a>
            <a href="#" className="hover:text-blue-600 transition-all">Security policies</a>
            <a href="#" className="hover:text-blue-600 transition-all">Contact center</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-[10px] font-mono text-slate-400">
          <span>© 2026 Dayananda Sagar College of Engineering. Peer-to-peer lost property registry network.</span>
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-blue-600" />
            <span>Proxy secure handshakes: verified operational</span>
          </div>
        </div>
      </footer>

      {/* 8. Overlay Modals */}
      <AnimatePresence>
        {selectedItem && (
          <ItemDetailModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onStatusChange={handleItemClaimed}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isReportOpen && (
          <ReportItemModal
            onClose={() => setIsReportOpen(false)}
            onSubmit={handleCreateReport}
            initialStatus={reportInitialStatus}
          />
        )}
      </AnimatePresence>

      {/* Toast Alert Notifier Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-4.5 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-2xl"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </>
  );
}
