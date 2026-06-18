import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, ShieldCheck, ArrowRight, User, CheckCircle, School } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (session: { email: string; name: string }) => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);
  
  // Loading & feedback states
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-fill preset for Dayananda Sagar student
  const handleQuickDemo = (profile: 'student' | 'officer') => {
    if (profile === 'student') {
      setEmail('rahul.sharma@dsce.edu.in');
      setPassword('dscecse2026');
      setName('Rahul Sharma');
    } else {
      setEmail('campus.security@dsce.edu.in');
      setPassword('securegate@dsce');
      setName('Officer Gowda');
    }
  };

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please supply a valid secure educational email and passkey.');
      return false;
    }
    if (!email.includes('@')) {
      setErrorMsg('Incorrect email structure. Please verify formatting.');
      return false;
    }
    if (password.length < 6) {
      setErrorMsg('Your passkey must contain at least 6 characters.');
      return false;
    }
    if (isRegistering && !name.trim()) {
      setErrorMsg('Your full name is required for registration.');
      return false;
    }
    if (!termsAccepted) {
      setErrorMsg('Please review and accept our Dayananda Sagar privacy statement.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!validateForm()) return;

    setLoading(true);

    // Simulate verification delay
    setTimeout(() => {
      setLoading(false);
      const computedName = name.trim() || (email.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      
      setSuccessMsg(isRegistering ? 'DSCE profile created successfully!' : 'Access approved. Loading student feed...');
      
      setTimeout(() => {
        const session = { email, name: computedName };
        localStorage.setItem('dsce_user_session', JSON.stringify(session));
        onLoginSuccess(session);
      }, 750);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#F8FAFC] dark:bg-[#0B0F19] transition-colors duration-350 flex items-center justify-center p-6" id="dsce-login-overlay">
      {/* Background elegant grid */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.02)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:40px_40px] opacity-100" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-[24px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 shadow-xl z-10 space-y-6"
      >
        {/* Institutional Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/40 mb-1">
            <School className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-blue-700 dark:text-blue-300">Official DSCE Portal</span>
          </div>

          <h2 className="font-display font-black text-2xl tracking-tight text-slate-900 dark:text-slate-100 uppercase">
            CampusFind
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
            Dayananda Sagar College of Engineering lost & found management system.
          </p>
        </div>

        {/* Demo Fast shortcuts helper */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 space-y-2 text-left">
          <span className="block text-[8px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">Fast-Track Demonstration Logins</span>
          <div className="flex gap-2 justify-center">
            <button
              type="button"
              onClick={() => handleQuickDemo('student')}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-blue-300 dark:hover:border-blue-500 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-450 transition-colors cursor-pointer"
            >
              Rahul Sharma (Student)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('officer')}
              className="px-3 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:border-blue-300 dark:hover:border-blue-500 text-[10px] font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-450 transition-colors cursor-pointer"
            >
              Security Officer
            </button>
          </div>
        </div>

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isRegistering && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-1 text-left"
              >
                <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider pl-1 font-semibold">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-550" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your profile name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-11 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl pl-11 pr-4 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 outline-none transition-all"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1 text-left">
            <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider pl-1 font-semibold">College Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-550" />
              <input
                type="email"
                required
                placeholder="e.g. rahul.sharma@dsce.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl pl-11 pr-4 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center px-1">
              <label className="block text-[9px] font-mono font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider font-semibold">Passkey</label>
              {!isRegistering && (
                <button 
                  type="button"
                  onClick={() => alert('Demo Mode Tip: Use any password with 6 or more characters.')}
                  className="text-[9px] text-blue-600 dark:text-blue-405 hover:text-blue-700 dark:hover:text-blue-300 uppercase font-mono font-bold cursor-pointer"
                >
                  Forgot Key?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-450 dark:text-slate-550" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 focus:bg-white dark:focus:bg-slate-950 border border-slate-200 dark:border-slate-850 focus:border-blue-500 focus:ring-1 focus:ring-blue-100 rounded-xl pl-11 pr-4 text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 outline-none transition-all"
              />
            </div>
          </div>

          {/* Validation Feedback */}
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-red-500/10 border border-red-200 dark:border-red-900/50 text-[11px] text-red-600 dark:text-red-400 font-medium"
            >
              {errorMsg}
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </motion.div>
          )}

          {/* Privacy authorization checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1" id="agree-policy-label">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal select-none text-left">
              I certify that I am a registered student or staff member at DSCE Bangalore, and I agree to use this directory honestly and protect found assets.
            </span>
          </label>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-display font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer border border-blue-500/20"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>{isRegistering ? 'Create Student Profile' : 'Sign In To Portal'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Register Account tab toggle */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setErrorMsg('');
              setSuccessMsg('');
            }}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
          >
            {isRegistering ? (
              <span>Already have an account? <strong className="text-blue-600 dark:text-blue-400 font-bold">Sign In</strong></span>
            ) : (
              <span>Need a portal profile? <strong className="text-blue-600 dark:text-blue-400 font-bold">Register Profile</strong></span>
            )}
          </button>
        </div>

        {/* Footer info lock */}
        <div className="flex justify-between items-center text-[9px] text-slate-405 dark:text-slate-500 font-mono uppercase pt-2 select-none">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-500" />
            <span>Secure Database Verified</span>
          </div>
          <span>DSCE INST : 560078</span>
        </div>
      </motion.div>
    </div>
  );
}
