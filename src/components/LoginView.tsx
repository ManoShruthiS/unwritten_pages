import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eye, EyeOff, BookOpen, User, Lock, ArrowLeft, Feather } from 'lucide-react';
import { UserProfile } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface LoginViewProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToHome: () => void;
}

type AuthScreen = 'choose' | 'author_signin' | 'reader_signin' | 'reader_signup';

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [screen, setScreen] = useState<AuthScreen>('choose');
  const [username, setUsername] = useState('');
  const [code, setCode] = useState('');
  const [confirmCode, setConfirmCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');

  // Validations & Account simulation (Connected to MongoDB Backend)
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username) {
      setError('Username is required.');
      return;
    }

    try {
      if (screen === 'author_signin') {
        if (code.length !== 4 || !/^\d+$/.test(code)) {
          setError('Code must be a 4-digit number.');
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, code, role: 'Admin' })
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Login failed.');
          return;
        }

        onLoginSuccess(data);
      } else if (screen === 'reader_signin') {
        if (code.length !== 4 || !/^\d+$/.test(code)) {
          setError('Code must be a 4-digit number.');
          return;
        }
        
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, code, role: 'Reader' })
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Sign in failed.');
          return;
        }

        onLoginSuccess(data);
      } else if (screen === 'reader_signup') {
        if (code !== confirmCode) {
          setError('Codes do not match.');
          return;
        }
        if (code.length !== 4 || !/^\d+$/.test(code)) {
          setError('Code must be exactly 4 digits.');
          return;
        }
        if (username.length < 3 || username.length > 20) {
          setError('Username must be between 3 and 20 characters.');
          return;
        }
        if (!/^[a-z0-9_]+$/.test(username)) {
          setError('Username can only contain lowercase letters, numbers, and underscores.');
          return;
        }

        const response = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, code })
        });

        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Registration failed.');
          return;
        }

        onLoginSuccess(data);
      }
    } catch (err) {
      setError('Cannot connect to the server. Please ensure the backend is running.');
    }
  };

  const handleScreenChange = (newScreen: AuthScreen) => {
    setScreen(newScreen);
    setUsername('');
    setCode('');
    setConfirmCode('');
    setError('');
  };

  return (
    <div className="bg-[#050403] text-[#e5e5e5] min-h-screen flex flex-col justify-between font-serif relative overflow-hidden select-none">
      
      {/* ─── HEADER ─── */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-[#d4af37] text-4xl sm:text-5xl font-bold tracking-widest uppercase mb-1">
          The Unwritten Pages
        </h1>
        <p className="text-[#8c8075] text-sm tracking-widest italic uppercase mb-2">
          Thoughts Nobody Ordered.
        </p>
        <div className="flex items-center justify-center gap-3 text-[#d4af37]/60 text-xs">
          <div className="h-px w-8 bg-[#d4af37]/30" />
          <span>Choose your path to enter the library</span>
          <div className="h-px w-8 bg-[#d4af37]/30" />
        </div>
      </div>

      {/* ─── MAIN PORTAL BODY ─── */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          
          {/* SCREEN: CHOOSE PATH */}
          {screen === 'choose' && (
            <motion.div
              key="choose"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full"
            >
              {/* I AM THE AUTHOR */}
              <div className="bg-[#0b0a08] border border-[#d4af37]/15 rounded-sm p-6 flex flex-col justify-between items-center text-center shadow-2xl relative min-h-[360px]">
                <div className="flex flex-col items-center">
                  <span className="text-[#d4af37] text-xs font-sans tracking-[0.25em] uppercase mb-1">I am the Author</span>
                  <span className="text-[#8c8075] text-[11px] font-sans mb-8">Sign in to your author account</span>
                  <div className="w-20 h-20 rounded-full border border-[#d4af37]/10 flex items-center justify-center bg-black/45 shadow-inner mb-6 text-[#d4af37]/80">
                    <Feather className="w-10 h-10" />
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={() => handleScreenChange('author_signin')}
                    className="w-full py-2.5 bg-[#4c1515] hover:bg-[#5c1e1e] border border-[#7d2020] text-[#f3e8d4] text-xs tracking-widest uppercase transition-all duration-300 rounded-sm mb-4 cursor-pointer"
                  >
                    Author Sign In
                  </button>
                  <p className="text-[#8c8075] text-[11px] font-sans">Create, write and manage your diaries</p>
                </div>
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#d4af37]/35" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#d4af37]/35" />
              </div>

              {/* CENTER ARCHWAY */}
              <div className="relative rounded-sm overflow-hidden min-h-[360px] border border-[#d4af37]/20 shadow-2xl flex flex-col items-center justify-center">
                <img
                  src="/library-archway.png"
                  alt="The Library Awaits"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.4]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="relative z-10 flex flex-col items-center text-center p-4">
                  <div className="text-[#d4af37] text-2xl mb-2">✦</div>
                  <div className="border border-[#d4af37]/30 bg-black/75 px-5 py-2.5 shadow-lg backdrop-blur-sm">
                    <h2 className="text-[#f3efe6] text-xs tracking-[0.4em] uppercase font-bold" style={{ fontFamily: "'Georgia', serif" }}>
                      The Library Awaits
                    </h2>
                  </div>
                </div>
              </div>

              {/* I AM A READER */}
              <div className="bg-[#0b0a08] border border-[#d4af37]/15 rounded-sm p-6 flex flex-col justify-between items-center text-center shadow-2xl relative min-h-[360px]">
                <div className="flex flex-col items-center">
                  <span className="text-[#d4af37] text-xs font-sans tracking-[0.25em] uppercase mb-1">I am a Reader</span>
                  <span className="text-[#8c8075] text-[11px] font-sans mb-8">Sign in to your reader account</span>
                  <div className="w-20 h-20 rounded-full border border-[#d4af37]/10 flex items-center justify-center bg-black/45 shadow-inner mb-6 text-[#d4af37]/80">
                    <BookOpen className="w-10 h-10" />
                  </div>
                </div>

                <div className="w-full">
                  <button
                    onClick={() => handleScreenChange('reader_signin')}
                    className="w-full py-2.5 bg-[#172d1f] hover:bg-[#203c2a] border border-[#2d563c] text-[#f3e8d4] text-xs tracking-widest uppercase transition-all duration-300 rounded-sm mb-4 cursor-pointer"
                  >
                    Reader Sign In
                  </button>
                  <p className="text-[#8c8075] text-[11px] font-sans">Read, explore and be part of the journey</p>
                </div>
                <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#d4af37]/35" />
                <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#d4af37]/35" />
              </div>

            </motion.div>
          )}

          {/* SIGN IN / SIGN UP PANELS */}
          {screen !== 'choose' && (
            <motion.div
              key="auth-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl w-full bg-[#0a0907] border border-[#d4af37]/15 rounded-sm shadow-2xl relative p-6 flex flex-col md:flex-row gap-6"
            >
              {/* Back button */}
              <button
                onClick={() => {
                  handleScreenChange('choose');
                }}
                className="absolute top-4 left-4 flex items-center gap-1 text-[#8c8075] hover:text-[#d4af37] text-[11px] tracking-wider uppercase font-sans cursor-pointer z-20"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Choose Path
              </button>

              {/* Left Side: Table Vignette Image */}
              <div className="hidden md:block w-1/3 relative rounded-sm overflow-hidden min-h-[320px] border border-[#d4af37]/10">
                <img
                  src="/library-desk-vignette.png"
                  alt="Scholar Sanctuary"
                  className="absolute inset-0 w-full h-full object-cover brightness-[0.5]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              {/* Center Column: Form */}
              <div className="flex-1 flex flex-col justify-center py-4">
                <div className="mb-6">
                  <h2 className="text-[#d4af37] text-xl font-bold tracking-widest uppercase">
                    {screen.replace('_', ' ')}
                  </h2>
                  <p className="text-[#8c8075] text-xs font-sans mt-0.5">
                    {screen === 'author_signin' && 'Welcome back, Mahi'}
                    {screen === 'reader_signin' && 'Welcome back to the library'}
                    {screen === 'reader_signup' && 'Join the library community'}
                  </p>
                </div>

                {error && (
                  <div className="bg-[#4c1515]/20 border border-[#7d2020]/45 text-[#ff8080] text-xs px-3 py-2 rounded-sm mb-4 font-sans">
                    {error}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {/* Username */}
                  <div className="relative">
                    <User className="absolute left-3 top-2.5 w-4 h-4 text-[#8c8075]" />
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="w-full bg-[#110f0d] border border-[#3d2b1e] text-[#f3efe6] placeholder-[#5a4a3a] text-xs pl-10 pr-3 py-2.5 focus:outline-none focus:border-[#d4af37] font-sans rounded-sm"
                    />
                  </div>

                  {/* 4-digit Code */}
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8c8075]" />
                    <input
                      type={showCode ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={4}
                      placeholder="4-digit code"
                      value={code}
                      onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-[#110f0d] border border-[#3d2b1e] text-[#f3efe6] placeholder-[#5a4a3a] text-xs pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#d4af37] font-sans rounded-sm tracking-[0.25em]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-2.5 text-[#8c8075] hover:text-[#d4af37] cursor-pointer"
                    >
                      {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Confirm 4-digit Code (for signup only) */}
                  {screen.endsWith('signup') && (
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#8c8075]" />
                      <input
                        type={showCode ? 'text' : 'password'}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={4}
                        placeholder="confirm 4-digit code"
                        value={confirmCode}
                        onChange={e => setConfirmCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-[#110f0d] border border-[#3d2b1e] text-[#f3efe6] placeholder-[#5a4a3a] text-xs pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#d4af37] font-sans rounded-sm tracking-[0.25em]"
                      />
                    </div>
                  )}

                  {/* Remember Me */}
                  {!screen.endsWith('signup') && (
                    <div className="flex items-center text-[11px] font-sans text-[#8c8075]">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={e => setRememberMe(e.target.checked)}
                          className="accent-[#d4af37] bg-black border-[#3d2b1e]"
                        />
                        Remember me
                      </label>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className={`w-full py-2.5 text-[#f3e8d4] text-xs tracking-widest uppercase transition-all duration-300 rounded-sm cursor-pointer ${
                      screen.startsWith('author')
                        ? 'bg-[#4c1515] hover:bg-[#5c1e1e] border border-[#7d2020]'
                        : 'bg-[#172d1f] hover:bg-[#203c2a] border border-[#2d563c]'
                    }`}
                  >
                    {screen === 'author_signin' && 'Sign In as Author'}
                    {screen === 'reader_signin' && 'Sign In as Reader'}
                    {screen === 'reader_signup' && 'Create Reader Account'}
                  </button>
                </form>

                {/* Footer Switch Link */}
                <div className="mt-5 text-center text-xs font-sans text-[#8c8075]">
                  {screen === 'reader_signin' && (
                    <p>
                      New reader?{' '}
                      <button
                        onClick={() => handleScreenChange('reader_signup')}
                        className="text-[#d4af37] hover:underline cursor-pointer"
                      >
                        Create account
                      </button>
                    </p>
                  )}
                  {screen === 'reader_signup' && (
                    <p>
                      Already have an account?{' '}
                      <button
                        onClick={() => handleScreenChange('reader_signin')}
                        className="text-[#d4af37] hover:underline cursor-pointer"
                      >
                        Sign in
                      </button>
                    </p>
                  )}
                </div>
              </div>

              {/* Right Side: Parchment Info Card */}
              <div className="w-full md:w-[240px] flex-shrink-0 flex flex-col justify-center">
                {screen.endsWith('signin') ? (
                  <div
                    className="relative bg-[#ebdcb9] text-[#2b1f14] p-5 rounded-sm shadow-xl border-l-[6px] border-[#cbb382] transform rotate-1"
                    style={{
                      backgroundImage: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.03) 100%)',
                    }}
                  >
                    <h3 className="text-xs uppercase tracking-wider font-sans font-bold border-b border-[#2b1f14]/15 pb-1.5 mb-2">
                      {screen === 'author_signin' ? 'Author Access' : 'Reader Access'}
                    </h3>
                    <p className="text-[11px] leading-relaxed italic" style={{ fontFamily: "'Georgia', serif" }}>
                      {screen === 'author_signin'
                        ? 'This space is your canvas. Write freely. Build endlessly.'
                        : 'Every page has a story. Every story has a reader.'}
                    </p>
                    <div className="text-center text-[10px] mt-4 text-[#2b1f14]/50">✦</div>
                  </div>
                ) : (
                  <div className="bg-[#110f0d] border border-[#3d2b1e] rounded-sm p-4 text-[11px] space-y-4 font-sans text-[#8c8075]">
                    <div>
                      <h4 className="text-[#d4af37] uppercase tracking-wider font-semibold mb-1">Username Rules</h4>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        <li>3 to 20 characters</li>
                        <li>Only lowercase letters</li>
                        <li>Numbers and underscores</li>
                        <li>No spaces or special characters</li>
                        <li>Must be unique</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#d4af37] uppercase tracking-wider font-semibold mb-1">Code Rules</h4>
                      <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                        <li>4 digits only</li>
                        <li>Easy for you to remember</li>
                        <li>Keep it private</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
};
