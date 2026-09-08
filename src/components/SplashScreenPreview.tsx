import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { WifiOff, RefreshCw, ChevronRight } from 'lucide-react';
import { SplashConfig } from '../types';
import nsLogo from '../assets/images/NSLOGO1.jpeg';

interface SplashScreenPreviewProps {
  config: SplashConfig;
  onNavigate: () => void;
  onRetryConnection: () => void;
  onDismissDialog: () => void;
  isSimulatorActive?: boolean;
}

export const SplashScreenPreview: React.FC<SplashScreenPreviewProps> = ({
  config,
  onNavigate,
  onRetryConnection,
  onDismissDialog,
}) => {
  const [imageError, setImageError] = useState(false);
  const [progress, setProgress] = useState(0);

  const speedMult = 1 / (config.animationSpeed || 1);
  const totalDuration = (config.splashDuration || 3) / (config.animationSpeed || 1);

  // Smooth progress timer
  useEffect(() => {
    setImageError(false);
    setProgress(0);

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const rawPct = Math.min(100, Math.round((elapsed / totalDuration) * 100));
      setProgress(rawPct);
    }, 40);

    let timeout: NodeJS.Timeout;
    if (config.autoNavigate && config.isConnected) {
      timeout = setTimeout(() => {
        onNavigate();
      }, totalDuration * 1000);
    }

    return () => {
      clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [
    config.autoNavigate,
    config.isConnected,
    config.splashDuration,
    config.animationSpeed,
    onNavigate,
    totalDuration,
  ]);

  // Font family selector class
  const getFontFamilyClass = () => {
    switch (config.fontStyle) {
      case 'orbitron':
        return 'font-orbitron tracking-wider';
      case 'rajdhani':
        return 'font-rajdhani tracking-widest uppercase font-bold';
      case 'cinzel':
        return 'font-cinzel tracking-widest font-bold';
      case 'outfit':
        return 'font-outfit tracking-tight font-extrabold';
      case 'jetbrains':
        return 'font-mono-jb tracking-tight font-bold';
      case 'plus_jakarta':
        return 'font-sans tracking-tight font-black';
      case 'syne':
      default:
        return 'font-syne tracking-wide font-extrabold';
    }
  };

  return (
    <div
      id="splash-screen-container"
      onClick={onNavigate}
      className="relative w-full h-full select-none overflow-hidden flex flex-col justify-between items-center py-10 px-6 font-sans cursor-pointer"
      style={{
        background: `linear-gradient(180deg, ${config.themeGradient.start} 0%, ${config.themeGradient.middle} 50%, ${config.themeGradient.end} 100%)`,
      }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Top Spacer */}
      <div className="w-full flex justify-end items-center z-10 min-h-[28px]">
        {config.autoNavigate && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNavigate();
            }}
            className="text-[11px] font-medium text-white/50 hover:text-white/90 transition flex items-center gap-0.5 px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10"
          >
            <span>Skip</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Center Stage: Clean Logo & Brand Identity */}
      <div className="flex-1 flex flex-col items-center justify-center w-full z-10 my-auto">
        {/* Logo Container */}
        <motion.div
          id="splash-logo-wrapper"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 0.8 * speedMult,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="relative mb-6"
        >
          {/* Soft outer halo */}
          <div className="absolute -inset-2 rounded-full bg-white/10 blur-md pointer-events-none" />

          {/* Clean White Circle Badge */}
          <div className="w-32 h-32 sm:w-36 sm:h-36 bg-white rounded-full p-2 shadow-2xl flex items-center justify-center border border-white/20">
            {!imageError ? (
              <img
                src={config.logoUrl || nsLogo}
                alt="Logo"
                className="w-full h-full object-contain rounded-full"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (
                    target.src !== '/NSLOGO1.jpeg' &&
                    target.src !== '/assets/images/NSLOGO1.jpeg'
                  ) {
                    target.src = '/NSLOGO1.jpeg';
                  } else {
                    setImageError(true);
                  }
                }}
              />
            ) : (
              <div className="w-full h-full rounded-full bg-slate-900 flex flex-col items-center justify-center text-white">
                <span className="text-2xl font-black tracking-widest text-teal-400">NS</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* App Title & Subtitle */}
        <motion.div
          id="splash-text-container"
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.15 * speedMult,
            duration: 0.6 * speedMult,
            ease: 'easeOut',
          }}
          className="text-center space-y-1.5 px-4"
        >
          <h1
            id="splash-app-name"
            className={`text-3xl sm:text-4xl font-extrabold text-white tracking-tight ${getFontFamilyClass()}`}
          >
            {config.appName}
          </h1>

          <p
            id="splash-app-title"
            className="text-xs sm:text-sm font-medium text-white/70 tracking-[0.25em] uppercase"
          >
            {config.appTitle || 'ns creaction'}
          </p>
        </motion.div>
      </div>

      {/* Bottom Stage: Minimal Progress Bar & Status */}
      <div className="w-full max-w-xs flex flex-col items-center gap-3 z-10">
        {!config.isConnected ? (
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-rose-200 bg-rose-950/60 px-4 py-2 rounded-full border border-rose-500/30">
            <WifiOff className="w-3.5 h-3.5 text-rose-400" />
            <span>Offline Mode</span>
          </div>
        ) : (
          <div className="w-full space-y-2">
            {/* Minimal Progress Bar */}
            <div className="w-full h-1 bg-white/15 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-teal-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>

            {/* Subtle percentage and prompt */}
            <div className="flex justify-between items-center text-[10px] font-medium text-white/40 px-0.5">
              <span>Loading...</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}
      </div>

      {/* No Internet Connection Modal */}
      <AnimatePresence>
        {config.showNoInternetDialog && !config.isConnected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl max-w-xs w-full border border-slate-800"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-500/15 text-rose-400 flex items-center justify-center mx-auto mb-4 border border-rose-500/20">
                <WifiOff className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-bold text-center text-white mb-1.5">
                No Internet Connection
              </h3>
              <p className="text-xs text-center text-slate-400 mb-6 leading-relaxed">
                Please check your network settings to sync data, or continue in offline mode.
              </p>

              <div className="flex flex-col gap-2">
                <button
                  id="retry-connection-btn"
                  onClick={onRetryConnection}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Retry Connection
                </button>
                <button
                  id="dismiss-dialog-btn"
                  onClick={onDismissDialog}
                  className="w-full py-2 px-4 text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
                >
                  Continue Offline
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

