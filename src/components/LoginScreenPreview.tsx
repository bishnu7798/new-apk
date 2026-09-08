import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, AlertCircle, Sparkles, ShieldCheck, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { SplashConfig } from '../types';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import { signInUser, registerUser, resetUserPassword, saveUserProfile, getFirebaseAuthErrorMessage } from '../lib/firebase';

interface LoginScreenPreviewProps {
  config: SplashConfig;
  onLoginSuccess: (email: string) => void;
  onBackToSplash: () => void;
}

export const LoginScreenPreview: React.FC<LoginScreenPreviewProps> = ({
  config,
  onLoginSuccess,
  onBackToSplash,
}) => {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [rememberSession, setRememberSession] = useState(true);

  const handleLoginOrRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanEmail = email.trim();

    // 1. Strict Empty Checks
    if (!cleanEmail) {
      setErrorMessage('Please enter your email address to continue.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address (e.g. surveyor@ns-power.com).');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      if (isSignUpMode) {
        // Firebase Authentication: Create User Account
        const userCred = await registerUser(cleanEmail, password);
        const user = userCred.user;
        
        // Save initial profile in Firestore
        await saveUserProfile(user.uid, {
          userId: user.uid,
          name: name.trim() || cleanEmail.split('@')[0].toUpperCase(),
          email: cleanEmail,
          designation: 'Field Electrical Surveyor',
          employeeId: `WBSEDCL-${Math.floor(1000 + Math.random() * 9000)}`,
          division: 'RAIGANJ',
          ccc: 'CCC-RAIGANJ-I',
          createdAt: new Date().toISOString(),
        });

        if (rememberSession) {
          localStorage.setItem(
            'ns_persisted_session',
            JSON.stringify({
              email: cleanEmail,
              uid: user.uid,
              timestamp: Date.now(),
              isAuthenticated: true,
            })
          );
        }

        setSuccessMessage('Firebase account created successfully! Logging you in...');
        setTimeout(() => {
          onLoginSuccess(cleanEmail);
        }, 600);
      } else {
        // Firebase Authentication: Sign In User
        try {
          const userCred = await signInUser(cleanEmail, password);
          const user = userCred.user;

          if (rememberSession) {
            localStorage.setItem(
              'ns_persisted_session',
              JSON.stringify({
                email: cleanEmail,
                uid: user.uid,
                timestamp: Date.now(),
                isAuthenticated: true,
              })
            );
          }

          onLoginSuccess(cleanEmail);
        } catch (firebaseErr: any) {
          console.warn('Firebase Sign In error:', firebaseErr);
          const msg = getFirebaseAuthErrorMessage(firebaseErr);
          setErrorMessage(msg);
        }
      }
    } catch (err: any) {
      console.error('Firebase Auth Exception:', err);
      const msg = getFirebaseAuthErrorMessage(err);
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter your email above to receive a password reset link.');
      return;
    }
    try {
      await resetUserPassword(email.trim());
      setSuccessMessage(`Password reset link dispatched to ${email.trim()}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Unable to send password reset email.');
    }
  };

  const handleQuickDemoFill = () => {
    setEmail('operator@ns-power.com');
    setPassword('Firebase@Pass2026');
    setName('Bishnu Sarkar');
    setErrorMessage(null);
  };

  return (
    <div
      id="login-screen-scaffold"
      className="relative w-full h-full select-none overflow-y-auto flex flex-col items-center justify-start p-4 sm:p-6 font-sans"
      style={{
        background: 'linear-gradient(135deg, #0A192F 0%, #0B2D52 50%, #044343 100%)',
      }}
    >
      {/* Ambient Peacock Glow Orbs */}
      <div className="absolute top-[-60px] right-[-60px] w-72 h-72 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-50px] left-[-50px] w-72 h-72 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-[-30px] w-40 h-40 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(6,182,212,0.15)_0%,transparent_70%)] pointer-events-none" />

      {/* Top Bar with Navigation & Persistence Tag */}
      <div className="w-full flex items-center justify-between z-20 mb-3">
        <button
          onClick={onBackToSplash}
          className="p-2 rounded-xl bg-slate-900/50 hover:bg-slate-900/70 text-cyan-200 backdrop-blur-md border border-teal-400/30 shadow-xs transition flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Splash</span>
        </button>

        <div className="flex items-center gap-1.5 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-teal-400/30 text-[11px] font-semibold text-teal-300 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Firebase Auth Active</span>
        </div>
      </div>

      {/* Main Content Area */}
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="w-full max-w-[460px] flex flex-col items-center my-auto py-2 z-10"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-1.5 rounded-full bg-gradient-to-tr from-amber-400/30 via-teal-400/35 to-blue-500/40 border border-amber-300/40 shadow-[0_12px_30px_rgba(0,168,150,0.35)] mb-3 transition-transform hover:scale-105">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white flex items-center justify-center p-2 shadow-inner">
              <img
                src={config.logoUrl || nsLogo}
                alt="NS Logo"
                className="w-full h-full object-contain drop-shadow-xs"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== '/NSLOGO1.jpeg') {
                    target.src = '/NSLOGO1.jpeg';
                  }
                }}
              />
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-50 to-amber-100 tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
            {config.appName}
          </h1>
          <p className="text-sm font-semibold text-amber-300/95 mt-1 max-w-xs drop-shadow-xs tracking-wide">
            {config.appTitle}
          </p>
          <p className="text-xs font-medium text-slate-300/80 mt-0.5 tracking-wide">
            Distribution Project Management System
          </p>
        </div>

        {/* Enhanced Login Card */}
        <div className="w-full bg-white rounded-[24px] shadow-[0_20px_45px_rgba(0,0,0,0.3)] p-6 sm:p-7 text-slate-900 border border-slate-100">
          <div className="text-center mb-5">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {isSignUpMode ? 'Create Surveyor Account' : 'Sign In to Your Account'}
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-1">
              {isSignUpMode
                ? 'Register with Firebase Auth & Project ns-electrical-71572'
                : 'Enter your credentials to continue'}
            </p>
          </div>

          {/* Inline Error Box */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium"
              >
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{errorMessage}</div>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-2.5 text-teal-800 text-xs font-medium"
              >
                <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="flex-1 leading-snug">{successMessage}</div>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleLoginOrRegister} className="space-y-4">
            {/* Full Name field in sign up mode */}
            {isSignUpMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <UserPlus className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B2D52]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Bishnu Sarkar"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 focus:bg-white rounded-2xl text-sm text-slate-900 outline-none transition shadow-xs placeholder:text-slate-400"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B2D52]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="surveyor@ns-power.com"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 focus:bg-white rounded-2xl text-sm text-slate-900 outline-none transition shadow-xs placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 ml-1">
                Password <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B2D52]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder={isSignUpMode ? 'Minimum 6 characters' : 'Enter your password'}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 focus:border-[#00A896] focus:ring-2 focus:ring-[#00A896]/20 focus:bg-white rounded-2xl text-sm text-slate-900 outline-none transition shadow-xs placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Forgot Password & Stay Logged In Toggle */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-600 font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberSession}
                  onChange={(e) => setRememberSession(e.target.checked)}
                  className="rounded text-[#0B2D52] focus:ring-[#00A896]"
                />
                <span>Stay Logged In</span>
              </label>

              {!isSignUpMode && (
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-[#0B2D52] hover:text-[#00A896] font-bold hover:underline cursor-pointer"
                >
                  Forgot Password?
                </button>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-[#0B2D52] via-[#0D4B75] to-[#00A896] hover:opacity-95 active:scale-[0.99] text-white rounded-2xl font-bold text-base shadow-lg shadow-[#0B2D52]/25 transition flex items-center justify-center gap-2 cursor-pointer mt-2 disabled:opacity-75"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : isSignUpMode ? (
                <span className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account with Firebase</span>
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-4 h-4" />
                  <span>Login with Firebase</span>
                </span>
              )}
            </button>

            {/* Quick Demo Fill button for testing */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleQuickDemoFill}
                className="w-full py-2 px-3 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/60 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Fill Demo Operator Credentials</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sign Up / Sign In Mode Switcher */}
        <div className="w-full mt-4 p-4 rounded-2xl bg-slate-950/45 backdrop-blur-md border border-teal-400/25 flex items-center justify-center gap-2 text-sm text-slate-200">
          <span>{isSignUpMode ? 'Already have an account?' : "Don't have an account?"}</span>
          <button
            onClick={() => {
              setIsSignUpMode(!isSignUpMode);
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="font-bold text-amber-300 hover:text-amber-200 hover:underline cursor-pointer"
          >
            {isSignUpMode ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

        {/* Persistence Notice */}
        <div className="mt-4 flex items-center gap-1.5 text-[11px] text-teal-200/80 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
          <span>Persistent Auth Session: No repeat sign-ins required</span>
        </div>
      </motion.div>
    </div>
  );
};
