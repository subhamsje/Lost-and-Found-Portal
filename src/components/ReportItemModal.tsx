import { useState, useRef, FormEvent } from 'react';
import { Item, ItemStatus } from '../types';
import { CAMPUS_LOCATIONS, CATEGORIES } from '../data';
import { AnimatePresence, motion } from 'motion/react';
import { 
  AlertTriangle, Calendar, ChevronRight, Check, HelpCircle, 
  MapPin, ShieldCheck, Sparkles, Trophy, Upload, User, X 
} from 'lucide-react';

interface ReportItemModalProps {
  onClose: () => void;
  onSubmit: (newItem: Item) => void;
  initialStatus?: ItemStatus;
}

export default function ReportItemModal({ onClose, onSubmit, initialStatus }: ReportItemModalProps) {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Form states
  const [status, setStatus] = useState<ItemStatus>(initialStatus || 'lost');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Item['category']>('Electronics');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('📦');
  const [accentColor, setAccentColor] = useState<Item['accentColor']>('violet');
  const [specs, setSpecs] = useState('');

  // Step 2
  const [location, setLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [dateReported, setDateReported] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD
  const [hasReward, setHasReward] = useState(false);
  const [rewardAmount, setRewardAmount] = useState('');

  // Step 3
  const [founderOrLoserName, setFounderOrLoserName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [secretQuestion, setSecretQuestion] = useState('');

  // Dropzone attachment mock uploader
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojiOptions = ['🎧', '🔑', '💍', '📱', '🧥', '🎒', '🧮', '📓', '🕶️', '📦', '🪪', '🚗', '💵', '🚲', '👟'];

  const handleMockUpload = () => {
    if (uploadedFile || uploading) return;
    setUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadedFile('campus_upload_preview.jpg');
          return 100;
        }
        return p + 25;
      });
    }, 120);
  };

  const validateStep = () => {
    const errs: Record<string, string> = {};
    if (step === 1) {
      if (!title.trim()) errs.title = 'Item title is required';
      else if (title.length < 3) errs.title = 'Title must be at least 3 characters';
      if (!description.trim()) errs.description = 'Description is required';
    } else if (step === 2) {
      if (!location) errs.location = 'Please select a location';
      if (!dateReported) errs.dateReported = 'Please pick a date';
      if (hasReward && !rewardAmount.trim()) errs.reward = 'Please describe the reward (e.g., Coffee, cash reward)';
    } else if (step === 3) {
      if (!founderOrLoserName.trim()) errs.name = 'Your name is required';
      if (!contactEmail.trim()) errs.email = 'A valid contact email is required';
      else if (!contactEmail.includes('@')) errs.email = 'Email format invalid';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    setStep((s) => Math.max(1, s - 1));
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    const newItem: Item = {
      id: `item-${Date.now()}`,
      title,
      description,
      category,
      location,
      dateReported: new Date(dateReported).toISOString(),
      status,
      reward: hasReward ? rewardAmount : undefined,
      contactEmail,
      founderOrLoserName,
      accentColor,
      icon,
      specs: specs.trim() || undefined,
      views: 1
    };

    onSubmit(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark tint backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-2xl select-none"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 text-2xl rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm text-blue-600 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <h2 className="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight tracking-tight">
                Report Campus Finder Entry
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Post lost belongings or recovered student assets to secure logs
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-slate-350 text-slate-400 hover:text-slate-900 dark:text-white dark:text-slate-100 transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard progress tabs indicator */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-slate-150 bg-slate-50 dark:bg-slate-800 text-[10px] uppercase font-mono select-none">
          {[
            { num: 1, label: 'Descriptors', done: step > 1, active: step === 1 },
            { num: 2, label: 'Location/Time', done: step > 2, active: step === 2 },
            { num: 3, label: 'Affiliation', done: step > 3, active: step === 3 }
          ].map((s) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center text-[9px] font-bold ${s.active ? 'bg-blue-600 text-white' : s.done ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-200 text-slate-450'}`}>
                {s.done ? <Check className="w-3 h-3" /> : s.num}
              </div>
              <span className={s.active ? 'text-slate-800 font-bold' : s.done ? 'text-emerald-700' : 'text-slate-400'}>
                {s.label}
              </span>
              {s.num < 3 && <ChevronRight className="w-3 h-3 text-slate-300" />}
            </div>
          ))}
        </div>

        {/* Scrollable form body */}
        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-slate-900 min-h-[300px]">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="space-y-4"
              >
                {/* Selector lost found status */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Report Classification</span>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setStatus('lost')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${status === 'lost' ? 'bg-rose-50 border-rose-200 text-rose-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'}`}
                    >
                      <AlertTriangle className="w-5 h-5 text-rose-500 mb-1" />
                      <span className="text-xs font-semibold">I Lost Something</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus('found')}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${status === 'found' ? 'bg-cyan-50 border-cyan-200 text-cyan-800 shadow-sm' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800'}`}
                    >
                      <ShieldCheck className="w-5 h-5 text-cyan-500 mb-1" />
                      <span className="text-xs font-semibold">I Found Something</span>
                    </button>
                  </div>
                </div>

                {/* Grid Title - Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Item Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Blue Jansport Backpack"
                      className={`w-full h-10 text-slate-900 dark:text-white dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border rounded-lg px-3.5 text-xs focus:outline-none focus:border-blue-500 transition-all ${errors.title ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                    {errors.title && <span className="text-[10px] text-rose-500 block">{errors.title}</span>}
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Category</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as Item['category'])}
                      className="w-full h-10 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-800">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Description input */}
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Descriptive Characteristics *</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Provide details such as colors, wallpapers, accessories, pocket contents or identifiable wear to secure quick claims alignment."
                    className={`w-full text-slate-900 dark:text-white dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border rounded-lg p-3 text-xs focus:outline-none focus:border-blue-500 transition-all resize-none leading-relaxed ${errors.description ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700'}`}
                  />
                  {errors.description && <span className="text-[10px] text-rose-500 block">{errors.description}</span>}
                </div>

                {/* Specifications optional detail */}
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Distinct Specs / Carving Marks (Optional)</label>
                  <input
                    type="text"
                    value={specs}
                    onChange={(e) => setSpecs(e.target.value)}
                    placeholder="e.g. Serial #CF502, NASA sticker on bottom left, initials engraved..."
                    className="w-full h-10 text-slate-900 dark:text-white dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 text-xs focus:outline-none focus:border-blue-500 transition-all shadow-none"
                  />
                </div>

                {/* Emoji Select Grid */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Select Design representation Symbol</span>
                  <div className="flex flex-wrap gap-2 max-h-[75px] overflow-y-auto p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {emojiOptions.map((e) => (
                      <button
                        key={e}
                        type="button"
                        onClick={() => setIcon(e)}
                        className={`text-lg p-1.5 rounded-md flex items-center justify-center transition-all hover:scale-105 hover:bg-slate-200/50 cursor-pointer ${icon === e ? 'bg-white dark:bg-slate-900 scale-105 shadow-sm border border-slate-300' : ''}`}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accent customization selections */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Visual Accent theme</span>
                  <div className="flex flex-wrap gap-2.5">
                    {[
                      { col: 'violet', label: 'Indigo', dot: 'bg-violet-500' },
                      { col: 'blue', label: 'Blue', dot: 'bg-blue-500' },
                      { col: 'cyan', label: 'Cyan', dot: 'bg-cyan-500' },
                      { col: 'emerald', label: 'Mint', dot: 'bg-emerald-500' },
                      { col: 'amber', label: 'Amber', dot: 'bg-amber-500' }
                    ].map((opt) => (
                      <button
                        key={opt.col}
                        type="button"
                        onClick={() => setAccentColor(opt.col as Item['accentColor'])}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-semibold transition-all cursor-pointer ${accentColor === opt.col ? 'bg-slate-100 text-slate-800 border-slate-300 font-bold shadow-sm' : 'bg-transparent border-transparent text-slate-450 hover:text-slate-700 dark:text-slate-200'}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${opt.dot}`} />
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="space-y-5"
              >
                {/* Location selector dropdown */}
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Campus Landmarks Pinpoint *</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-450 shadow-sm shrink-0">
                      <MapPin className="w-5 h-5 text-rose-500" />
                    </span>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="flex-1 h-10 text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 text-xs focus:outline-none focus:border-blue-500 cursor-pointer shadow-sm"
                    >
                      {CAMPUS_LOCATIONS.map((loc) => (
                        <option key={loc} value={loc} className="bg-white dark:bg-slate-900 text-slate-800">{loc}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calendar date picker selection */}
                <div className="space-y-2 text-left">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Date Reported *</label>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-450 shadow-sm shrink-0">
                      <Calendar className="w-5 h-5 text-blue-500" />
                    </span>
                    <input
                      type="date"
                      value={dateReported}
                      onChange={(e) => setDateReported(e.target.value)}
                      className="flex-1 h-10 text-slate-800 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 text-xs focus:outline-none focus:border-blue-500 shadow-sm"
                    />
                  </div>
                </div>

                {/* Reward custom configuration */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Incentivize with a Reward / Token</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={hasReward}
                      onChange={(e) => setHasReward(e.target.checked)}
                      className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 cursor-pointer h-4 w-4"
                    />
                  </div>

                  <AnimatePresence>
                    {hasReward && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <input
                          type="text"
                          value={rewardAmount}
                          onChange={(e) => setRewardAmount(e.target.value)}
                          placeholder="e.g. Starbucks gift card, box of donuts..."
                          className="w-full h-10 text-slate-855 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3.5 text-xs outline-none focus:border-amber-500"
                        />
                        <span className="text-[10px] text-amber-600 block font-semibold leading-normal">
                          Adding gratitude rewards promotes campus-wide engagement. Reward handovers are fully self-directed.
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Image uploader mockup */}
                <div className="space-y-2 text-left">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Attachment Attachment</span>
                  
                  <div 
                    onClick={handleMockUpload}
                    className="border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/55 hover:bg-slate-100/40 transition-all rounded-xl p-5 text-center cursor-pointer select-none"
                  >
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2 text-emerald-600 text-xs font-bold">
                        <Check className="w-4 h-4 bg-emerald-100 text-emerald-650 rounded-full p-0.5" />
                        <span>Mock {uploadedFile} parsed (100% processed)</span>
                      </div>
                    ) : uploading ? (
                      <div className="space-y-2.5">
                        <span className="text-xs text-slate-500">Uploading and hashing: {uploadProgress}%</span>
                        <div className="w-1/2 mx-auto h-1 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 transition-all duration-100" 
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-450">
                          <Upload className="w-4 h-4 text-blue-600" />
                        </div>
                        <h4 className="text-xs text-slate-700 dark:text-slate-200 font-bold">Import Image Asset</h4>
                        <p className="text-[10px] text-slate-400 max-w-[280px] mx-auto leading-normal">
                          Drag and drop or select file. JPG, PNG limits (Max 4MB).
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="space-y-4 text-left"
              >
                {/* Visual Alert Badge */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-205 text-amber-800 text-xs leading-normal flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-amber-900 block font-bold mb-0.5">Campus Verification Protocols</strong>
                    To protect privacy, students must verify descriptive questions before your direct contact details are shown. Falsified listings are reported.
                  </div>
                </div>

                {/* Name field */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Your Profile Name *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={founderOrLoserName}
                      onChange={(e) => setFounderOrLoserName(e.target.value)}
                      placeholder="e.g. Elena R."
                      className={`w-full h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border rounded-lg pl-11 pr-3.5 text-xs focus:outline-none focus:border-blue-500 transition-all ${errors.name ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                  </div>
                  {errors.name && <span className="text-[10px] text-rose-500 block">{errors.name}</span>}
                </div>

                {/* Email field */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Contact University Email *</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="e.g. elena@dsce.edu.in"
                      className={`w-full h-10 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border rounded-lg pl-11 pr-3.5 text-xs focus:outline-none focus:border-blue-500 transition-all ${errors.email ? 'border-rose-300' : 'border-slate-200 dark:border-slate-700'}`}
                    />
                  </div>
                  {errors.email && <span className="text-[10px] text-rose-500 block">{errors.email}</span>}
                </div>

                {/* Security question verification protection */}
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Ownership Handshake Challenge Question (Required)</label>
                  <div className="relative">
                    <HelpCircle className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={secretQuestion}
                      onChange={(e) => setSecretQuestion(e.target.value)}
                      placeholder="e.g. 'What stickers are on the back casing?'"
                      className="w-full h-10 text-slate-900 dark:text-white dark:text-slate-100 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100/50 focus:bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg pl-11 pr-3.5 text-xs focus:outline-none focus:border-blue-500 transition-all"
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 leading-normal block">
                    Claimants must write custom responses answering this challenge statement before we open safe direct chat channels.
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Modal bottom actions bar */}
        <div className="flex gap-2.5 p-6 border-t border-slate-100 bg-slate-50 dark:bg-slate-800/50">
          {step > 1 ? (
            <button
              onClick={handleBack}
              type="button"
              className="h-10 px-5 border border-slate-200 dark:border-slate-700 text-slate-650 font-semibold text-xs rounded-lg hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
            >
              Previous
            </button>
          ) : (
            <button
              onClick={onClose}
              type="button"
              className="h-10 px-5 border border-slate-200 dark:border-slate-700 text-slate-650 font-semibold text-xs rounded-lg hover:bg-slate-100 transition-all cursor-pointer shadow-sm"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              type="button"
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm flex items-center justify-center gap-1 cursor-pointer"
            >
              Next Step <ChevronRight className="w-4 h-4 text-white" />
            </button>
          ) : (
            <button
              onClick={handleFormSubmit}
              type="button"
              className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-all shadow-sm cursor-pointer"
            >
              Publish on Campus Board
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
