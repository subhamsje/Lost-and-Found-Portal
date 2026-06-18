import { useState, FormEvent } from 'react';
import { Item } from '../types';
import { AnimatePresence, motion } from 'motion/react';
import { 
  Building2, CheckCircle, Copy, Calendar, Eye, 
  Lock, Mail, Map, MapPin, Navigation, Send, ShieldAlert, Sparkles, X 
} from 'lucide-react';

interface ItemDetailModalProps {
  item: Item;
  onClose: () => void;
  onStatusChange: (itemId: string, newStatus: 'reunited') => void;
}

export default function ItemDetailModal({ item, onClose, onStatusChange }: ItemDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'verify' | 'messages'>('info');
  
  // Handshake state
  const [verifyStep, setVerifyStep] = useState(1);
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [claimEmail, setClaimEmail] = useState('');
  const [agreement, setAgreement] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [generatedToken, setGeneratedToken] = useState('');
  const [copied, setCopied] = useState(false);

  // Chat message state
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'system', text: string, time: string }>>([
    { sender: 'system', text: `Encrypted connection proxy established for ${item.title}. Chat channels are monitored for campus guidelines.`, time: 'System 12:00PM' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const isReunited = item.status === 'reunited';

  const formatFullDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  const copyToClipboard = (txt: string) => {
    navigator.clipboard.writeText(txt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleVerifySubmit = (e: FormEvent) => {
    e.preventDefault();
    setVerifyError('');

    if (verifyStep === 1) {
      if (!securityAnswer.trim()) {
        setVerifyError('Please enter details of specific markings or keys to verify ownership.');
        return;
      }
      setVerifyStep(2);
    } else if (verifyStep === 2) {
      if (!claimEmail.includes('@') || (!claimEmail.includes('.edu') && !claimEmail.endsWith('.in'))) {
        setVerifyError('A valid educational or college email is required for secure tracking.');
        return;
      }
      if (!agreement) {
        setVerifyError('Please accept the institutional statement to proceed.');
        return;
      }
      
      const randToken = `DSCE-FIND-TOKEN-${Math.floor(1000 + Math.random() * 9000)}-${item.id.toUpperCase()}`;
      setGeneratedToken(randToken);
      setVerifyStep(3);
      onStatusChange(item.id, 'reunited');
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsgs = [...messages, { sender: 'user' as const, text: chatInput, time: 'Just now' }];
    setMessages(newMsgs);
    setChatInput('');

    // Simulate owner response
    setTimeout(() => {
      setMessages(m => [
        ...m,
        {
          sender: 'system',
          text: `Proxy message routed to ${item.founderOrLoserName}. They will receive an email alert and normally respond within a few hours.`,
          time: 'Portal Assistant'
        }
      ]);
    }, 1500);
  };

  // Accent highlights mapping
  const colorMap = {
    blue: 'from-blue-50 to-indigo-50 border-blue-200 text-blue-800 bg-blue-50',
    violet: 'from-violet-50 to-purple-50 border-violet-200 text-violet-800 bg-violet-50',
    cyan: 'from-cyan-50 to-blue-50 border-cyan-200 text-cyan-800 bg-cyan-50',
    emerald: 'from-emerald-50 to-teal-50 border-emerald-200 text-emerald-800 bg-emerald-50',
    amber: 'from-amber-50 to-yellow-50 border-amber-200 text-amber-800 bg-amber-50',
    rose: 'from-rose-50 to-red-50 border-rose-200 text-rose-800 bg-rose-50',
  }[item.accentColor] || 'from-slate-50 to-slate-100 border-slate-200 text-slate-800';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark semi-transparent backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/65 backdrop-blur-sm"
      />

      {/* Main Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 10 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl h-[90vh] md:h-auto md:max-h-[85vh] flex flex-col rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xl select-none"
      >
        {/* Top brand color indicator strip */}
        <div className="absolute top-0 inset-x-0 h-1 bg-blue-600" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 text-2xl rounded-xl bg-white border border-slate-200 shadow-sm shrink-0">
              {item.icon}
            </div>
            <div className="text-left">
              <h2 className="font-display font-bold text-lg text-slate-900 leading-tight tracking-tight">
                {item.title}
              </h2>
              <div className="flex items-center gap-1.5 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border tracking-wider ${item.status === 'found' ? 'bg-cyan-50 border-cyan-100 text-cyan-700' : item.status === 'lost' ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                  {item.status}
                </span>
                <span className="text-xs text-slate-500 font-semibold font-mono">
                  {item.category}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 hover:border-slate-350 text-slate-400 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Navigation */}
        <div className="flex gap-1.5 border-b border-slate-150 px-6 py-2 bg-slate-50">
          <button
            onClick={() => setActiveTab('info')}
            className={`px-4 py-1.5 font-display text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === 'info' ? 'bg-white border-slate-250 text-slate-800 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Details & Map
          </button>
          {!isReunited && (
            <button
              onClick={() => setActiveTab('verify')}
              className={`flex items-center gap-1.5 px-4 py-1.5 font-display text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === 'verify' ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <Lock className="w-3.5 h-3.5" /> Direct Handover Portal
            </button>
          )}
          <button
            onClick={() => setActiveTab('messages')}
            className={`px-4 py-1.5 font-display text-xs font-bold rounded-lg border transition-all cursor-pointer ${activeTab === 'messages' ? 'bg-white border-slate-250 text-slate-800 shadow-sm' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Safe Messenger Proxy
          </button>
        </div>

        {/* Tab Content Panels */}
        <div className="flex-1 overflow-y-auto p-6 bg-white min-h-[300px]">
          <AnimatePresence mode="wait">
            {activeTab === 'info' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Visual Category Spotlight Graphics card */}
                <div className={`relative flex items-center justify-between p-5 rounded-xl border bg-gradient-to-r ${colorMap} overflow-hidden select-none text-left`}>
                  <div className="relative z-10">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block leading-none mb-1">Status Custody Records</span>
                    <h4 className="font-display font-black text-lg text-slate-800 leading-snug flex items-center gap-2">
                      {isReunited ? (
                        <>
                          <Sparkles className="w-4.5 h-4.5 text-emerald-600 inline" /> Asset Secured & Reunited
                        </>
                      ) : item.status === 'found' ? (
                        'Secure Custody Awaiting Claim'
                      ) : (
                        'Active SOS Search Beacon'
                      )}
                    </h4>
                    <p className="text-xs text-slate-500 max-w-[450px] mt-1.5 leading-relaxed">
                      {isReunited 
                        ? 'Successfully secured and hand-delivered back to its verified owner.'
                        : item.status === 'found'
                          ? `Currently securely archived by ${item.founderOrLoserName} in DSCE facilities. Safe verification handshake is required.`
                          : `Currently reported missing. If you have located this item, click on "Direct Handover Portal" above to declare.`}
                    </p>
                  </div>
                </div>

                {/* Grid details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Left Specs */}
                  <div className="space-y-4">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Report Description</span>
                      <p className="text-slate-600 text-sm mt-1 leading-relaxed">{item.description}</p>
                    </div>

                    {item.specs && (
                      <div>
                        <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Identifiable Specifications</span>
                        <div className="mt-1.5 p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-650 leading-normal">
                          {item.specs}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-500 font-mono">
                        <Eye className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.views} views</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-500 font-mono">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{formatFullDate(item.dateReported)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right stylized Interactive Map info */}
                  <div className="flex flex-col gap-3">
                    <span className="block text-[10px] font-bold text-slate-400 font-mono uppercase tracking-wider">Estimated Pinpoint</span>
                    
                    {/* Visual landmark frame */}
                    <div className="relative h-[180px] rounded-xl bg-slate-50 border border-slate-200 overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
                      
                      {/* Geometric buildings outlines */}
                      <div className="absolute top-6 left-6 w-[70px] h-10 bg-white border border-slate-200 text-[8px] font-mono rounded text-slate-400 flex items-center justify-center shadow-sm select-none">CSE DEP BLOCK</div>
                      <div className="absolute bottom-6 left-12 w-16 h-12 bg-white border border-slate-200 text-[8px] font-mono rounded text-slate-400 flex items-center justify-center shadow-sm select-none">LIBRARY</div>
                      <div className="absolute top-12 right-6 w-20 h-10 bg-white border border-slate-200 text-[8px] font-mono rounded text-slate-400 flex items-center justify-center shadow-sm select-none">AUDITORIUM</div>

                      {/* Map Pin Pointing Accent */}
                      <motion.div
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                      >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white shadow-md">
                          <Navigation className="w-4 h-4 fill-white text-white" />
                        </div>
                      </motion.div>

                      {/* Coordinates label */}
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[9px] font-mono text-slate-500 bg-white/95 px-2 py-1.5 rounded border border-slate-200 shadow-sm">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-rose-500 inline" /> {item.location}</span>
                        <span>GRID VERIFIED</span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-500 space-y-1 mt-1 text-left">
                      <div className="flex items-start gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <span>Storage & Claim Location: <strong>{item.location}</strong></span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Handshake Verification tab */}
            {activeTab === 'verify' && !isReunited && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="max-w-md mx-auto"
              >
                {/* Progress Indicators */}
                <div className="flex items-center justify-between mb-8">
                  {[
                    { label: 'Describe Item', num: 1 },
                    { label: 'Verify Affiliation', num: 2 },
                    { label: 'Authorize Claim', num: 3 }
                  ].map((s) => (
                    <div key={s.num} className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${verifyStep >= s.num ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                        {verifyStep > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                      </div>
                      <span className={`text-[11px] font-display font-semibold ${verifyStep === s.num ? 'text-slate-800' : 'text-slate-400'}`}>{s.label}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleVerifySubmit} className="space-y-6 text-left">
                  {verifyStep === 1 && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-xl bg-blue-50 border border-blue-105 text-blue-800 text-xs leading-relaxed flex items-start gap-3">
                        <ShieldAlert className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-blue-900 block mb-0.5 font-bold">Standard Owner Verification</strong>
                          To protect the rightful owners, please type details or descriptors that only the owner would know (such as distinct markings, contents, wallpapers, or receipt documents).
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          Answer verification descriptors *
                        </label>
                        <textarea
                          rows={4}
                          value={securityAnswer}
                          onChange={(e) => setSecurityAnswer(e.target.value)}
                          placeholder="Describe serial keys, background lockscreen images, internal files, engravings, accessory cases, scratch areas or distinctive markings…"
                          className="w-full text-slate-800 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl p-3 text-xs outline-none transition-all resize-none leading-relaxed"
                        />
                        <p className="text-[10px] text-slate-400 leading-normal">
                          The poster or security desk receptionist will read these answers in person to complete the returned log validation.
                        </p>
                      </div>
                    </div>
                  )}

                  {verifyStep === 2 && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                          Educational College Email Address *
                        </label>
                        <input
                          type="email"
                          value={claimEmail}
                          onChange={(e) => setClaimEmail(e.target.value)}
                          placeholder="yourname@domain.edu.in"
                          className="w-full h-11 text-slate-800 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl px-3.5 text-xs outline-none transition-all"
                        />
                      </div>

                      <div className="flex items-start gap-2.5 mt-4">
                        <input
                          type="checkbox"
                          id="agreement"
                          checked={agreement}
                          onChange={(e) => setAgreement(e.target.checked)}
                          className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="agreement" className="text-xs text-slate-500 leading-normal cursor-pointer select-none">
                          I agree to standard codes of conduct. I promise that this item is my personal property, or that I am authorized to secure its retrieval.
                        </label>
                      </div>
                    </div>
                  )}

                  {verifyStep === 3 && (
                    <div className="space-y-5 text-center">
                      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-2 shadow-sm">
                        <CheckCircle className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-lg text-slate-800">Claim Completed Successfully!</h3>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
                          The system has registered your claim, and marked this asset as reunited. Please save your receipt details below.
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 relative overflow-hidden text-left shadow-sm">
                        <span className="block text-[9px] font-bold text-slate-400 tracking-wider font-mono uppercase mb-1">
                          HANDOVER RECEIPTS PASSTOKEN
                        </span>
                        <div className="flex items-center justify-between gap-3 relative mt-1">
                          <code className="text-xs font-mono text-blue-700 font-bold block truncate">
                            {generatedToken}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(generatedToken)}
                            className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-350 transition-all cursor-pointer shadow-sm"
                          >
                            {copied ? <Sparkles className="w-4 h-4 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="text-left text-xs bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                        <strong className="text-slate-800 block mb-1">Retrieval Instructions:</strong>
                        <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                          <span className="text-slate-550">Head over to the <strong className="text-slate-700">{item.location}</strong>.</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
                          <span className="text-slate-550">Present your name, educational affiliation, and this custom passtoken to collect the item.</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Claims error display */}
                  {verifyError && (
                    <div className="p-3 text-xs text-red-700 bg-red-50 border border-red-150 rounded-xl font-medium">
                      {verifyError}
                    </div>
                  )}

                  {/* Claim Controls */}
                  {verifyStep < 3 && (
                    <div className="flex gap-3 justify-end pt-2">
                      {verifyStep > 1 && (
                        <button
                          type="button"
                          onClick={() => setVerifyStep(s => s - 1)}
                          className="h-10 px-5 border border-slate-200 text-slate-600 font-display font-semibold text-xs rounded-lg hover:bg-slate-50 hover:text-slate-800 transition-all cursor-pointer shadow-sm"
                        >
                          Back
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 h-10 bg-blue-600 hover:bg-blue-700 text-white font-display font-bold text-xs rounded-lg shadow-sm transition-all cursor-pointer"
                      >
                        {verifyStep === 1 ? 'Verify Particulars' : 'Complete Verified Claim'}
                      </button>
                    </div>
                  )}
                </form>
              </motion.div>
            )}

            {/* Messenger proxy tab */}
            {activeTab === 'messages' && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col h-[320px] text-left"
              >
                {/* Messages Ledger */}
                <div className="flex-1 overflow-y-auto space-y-3 pb-4 pr-1 font-sans text-xs">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={`flex flex-col max-w-[85%] ${m.sender === 'user' ? 'ml-auto items-end' : 'items-start'}`}
                    >
                      <div className={`p-3 rounded-xl border leading-relaxed ${m.sender === 'user' ? 'bg-blue-50 border-blue-150 text-blue-750' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                        {m.text}
                      </div>
                      <span className="text-[9px] text-slate-400 mt-1 font-mono">{m.time}</span>
                    </div>
                  ))}
                </div>

                {/* Input action toolbar */}
                <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-slate-100 pt-4 mt-auto">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Type encrypted message to owner..."
                    className="flex-1 h-10 text-xs text-slate-800 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 rounded-lg px-4 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all cursor-pointer shadow-sm"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
