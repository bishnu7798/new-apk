import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Battery, RotateCcw, Smartphone, Shield, Play, Pause, Layers, Moon, Sun, Palette, Type } from 'lucide-react';
import { DeviceType, ScreenState, SplashConfig, PoleModel } from '../types';
import { getActiveTheme, getActiveFont, THEME_PRESETS, FONT_DEFINITIONS } from '../lib/theme';
import { SplashScreenPreview } from './SplashScreenPreview';
import { LoginScreenPreview } from './LoginScreenPreview';
import { HomeScreenPreview } from './HomeScreenPreview';
import { DTRScreenPreview } from './DTRScreenPreview';
import { DTRListScreenPreview } from './DTRListScreenPreview';
import { AddPoleScreenPreview } from './AddPoleScreenPreview';
import { PoleScheduleScreenPreview } from './PoleScheduleScreenPreview';
import { SettingsScreenPreview } from './SettingsScreenPreview';
import { subscribeToAuthState, logoutUser, auth } from '../lib/firebase';

interface DeviceSimulatorProps {
  config: SplashConfig;
  screenState: ScreenState;
  onScreenChange: (state: ScreenState) => void;
  onConfigChange: (updater: (prev: SplashConfig) => SplashConfig) => void;
  onResetSplash: () => void;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  config,
  screenState,
  onScreenChange,
  onConfigChange,
  onResetSplash,
}) => {
  const [deviceType, setDeviceType] = useState<DeviceType>('android_pixel');
  const [androidNavMode, setAndroidNavMode] = useState<'3button' | 'gesture'>('3button');
  const [showAndroidRecents, setShowAndroidRecents] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState('10:30');
  const [editingDtr, setEditingDtr] = useState<any | null>(null);
  const [editingPole, setEditingPole] = useState<PoleModel | null>(null);
  const [midSpanInsertIndex, setMidSpanInsertIndex] = useState<number | null>(null);
  const [midSpanContext, setMidSpanContext] = useState<{ beforePoleNo?: string; afterPoleNo?: string } | null>(null);
  const [currentFirebaseUser, setCurrentFirebaseUser] = useState<any | null>(auth.currentUser);

  const handleAndroidBack = () => {
    setShowAndroidRecents(false);
    if (screenState === 'add_pole') {
      setMidSpanInsertIndex(null);
      setMidSpanContext(null);
      onScreenChange('pole_schedule');
    } else if (
      screenState === 'pole_schedule' ||
      screenState === 'dtr_form' ||
      screenState === 'dtr_list' ||
      screenState === 'settings'
    ) {
      onScreenChange('home');
    } else if (screenState === 'login') {
      onResetSplash();
      onScreenChange('splash');
    }
  };

  const handleAndroidHome = () => {
    setShowAndroidRecents(false);
    if (config.isLoggedIn) {
      onScreenChange('home');
    } else {
      onScreenChange('login');
    }
  };

  // Real-time Firebase Authentication State Listener
  useEffect(() => {
    const unsubscribe = subscribeToAuthState((user) => {
      setCurrentFirebaseUser(user);
      if (user) {
        onConfigChange((prev) => ({ ...prev, isLoggedIn: true }));
      } else {
        onConfigChange((prev) => ({ ...prev, isLoggedIn: false }));
      }
    });

    return () => unsubscribe();
  }, [onConfigChange]);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleRetryConnection = () => {
    onConfigChange((prev) => ({
      ...prev,
      isConnected: true,
      showNoInternetDialog: false,
    }));
  };

  const handleDismissDialog = () => {
    onConfigChange((prev) => ({
      ...prev,
      showNoInternetDialog: false,
    }));
  };

  const activeTheme = getActiveTheme(config);
  const activeFont = getActiveFont(config);
  const isDark = !!config.darkMode;

  const handleToggleDarkMode = () => {
    onConfigChange((prev) => ({
      ...prev,
      darkMode: !prev.darkMode,
    }));
  };

  const handleNextTheme = () => {
    const currentIndex = THEME_PRESETS.findIndex((t) => t.id === activeTheme.id);
    const nextTheme = THEME_PRESETS[(currentIndex + 1) % THEME_PRESETS.length];
    onConfigChange((prev) => ({
      ...prev,
      themePreset: nextTheme.id,
      themeGradient: {
        start: nextTheme.gradient.start,
        middle: nextTheme.gradient.middle,
        end: nextTheme.gradient.end,
      },
      primaryColor: nextTheme.primary,
    }));
  };

  const handleNextFont = () => {
    const currentIndex = FONT_DEFINITIONS.findIndex((f) => f.id === activeFont.id);
    const nextFont = FONT_DEFINITIONS[(currentIndex + 1) % FONT_DEFINITIONS.length];
    onConfigChange((prev) => ({
      ...prev,
      fontStyle: nextFont.id,
    }));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Device Frame Controls / Quick Switcher */}
      <div className="w-full max-w-md flex flex-wrap items-center justify-between bg-slate-900/90 border border-slate-800 backdrop-blur-md rounded-2xl p-2 mb-3 text-xs shadow-xl gap-2">
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl">
          <button
            onClick={() => setDeviceType('android_pixel')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-xs flex items-center gap-1.5 ${
              deviceType === 'android_pixel'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-300" />
            <span>Pixel (Android)</span>
          </button>
          <button
            onClick={() => setDeviceType('android_samsung')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-xs flex items-center gap-1.5 ${
              deviceType === 'android_samsung'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Galaxy (Android)</span>
          </button>
          <button
            onClick={() => setDeviceType('fullscreen')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer text-xs flex items-center gap-1.5 ${
              deviceType === 'fullscreen'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Full-Screen</span>
          </button>
        </div>

        {/* Android Nav Bar mode switcher */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setAndroidNavMode((m) => (m === '3button' ? 'gesture' : '3button'))}
            title={androidNavMode === '3button' ? 'Switch to Android Gesture Pill' : 'Switch to Android 3-Button Nav'}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
          >
            <span>Nav: {androidNavMode === '3button' ? '3-Button' : 'Gesture'}</span>
          </button>
        </div>

        {/* Quick Theme, Font, and Dark Mode shortcuts */}
        <div className="flex items-center gap-1.5">
          {/* Quick Dark Mode toggle */}
          <button
            onClick={handleToggleDarkMode}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer border ${
              isDark
                ? 'bg-indigo-950 text-indigo-300 border-indigo-500/40 shadow-xs'
                : 'bg-amber-100 text-amber-900 border-amber-300 shadow-xs'
            }`}
          >
            {isDark ? (
              <>
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
                <span>Dark</span>
              </>
            ) : (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-600" />
                <span>Light</span>
              </>
            )}
          </button>

          {/* Quick Theme Cycle */}
          <button
            onClick={handleNextTheme}
            title={`Active Theme: ${activeTheme.name}. Click to cycle.`}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 transition cursor-pointer"
          >
            <div
              className="w-3 h-3 rounded-full shadow-xs shrink-0"
              style={{ backgroundColor: activeTheme.primary }}
            />
            <span className="truncate max-w-[80px] font-semibold text-[11px]">{activeTheme.name.split(' ')[0]}</span>
          </button>

          {/* Quick Font Cycle */}
          <button
            onClick={handleNextFont}
            title={`Active Font: ${activeFont.name}. Click to cycle.`}
            className="px-2 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center gap-1 transition cursor-pointer text-[11px] font-semibold"
          >
            <Type className="w-3.5 h-3.5 text-cyan-400" />
            <span className="truncate max-w-[70px]">{activeFont.name.split(' ')[0]}</span>
          </button>
        </div>

        {/* Screen State Tabs */}
        <div className="w-full flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl overflow-x-auto">
          <button
            onClick={() => {
              onResetSplash();
              onScreenChange('splash');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'splash'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Splash
          </button>
          <button
            onClick={() => onScreenChange('login')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'login'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => onScreenChange('home')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'home'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => {
              setEditingDtr(null);
              onScreenChange('dtr_form');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'dtr_form'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            New DTR
          </button>
          <button
            onClick={() => onScreenChange('dtr_list')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'dtr_list'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Reports
          </button>
          <button
            onClick={() => onScreenChange('pole_schedule')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'pole_schedule'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Pole Schedule
          </button>
          <button
            onClick={() => {
              setEditingPole(null);
              onScreenChange('add_pole');
            }}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'add_pole'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Add Pole
          </button>
          <button
            onClick={() => onScreenChange('settings')}
            className={`px-2 py-1 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              screenState === 'settings'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Settings
          </button>
          <button
            onClick={onResetSplash}
            title="Restart Splash Sequence"
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition cursor-pointer flex items-center justify-center shrink-0 ml-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* The Physical Android Mobile Frame Container */}
      <div
        className={`relative transition-all duration-300 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ${
          deviceType === 'fullscreen'
            ? 'w-full max-w-[420px] h-[780px] sm:h-[820px] rounded-[28px] border-2 border-slate-700/80 bg-slate-950 shadow-2xl'
            : deviceType === 'android_samsung'
            ? 'w-[340px] sm:w-[375px] h-[730px] rounded-[30px] border-[7px] border-slate-900 bg-slate-950 ring-2 ring-slate-800 shadow-2xl'
            : 'w-[340px] sm:w-[375px] h-[730px] rounded-[44px] border-[8px] border-slate-900 bg-slate-950 ring-2 ring-slate-800 shadow-2xl'
        }`}
      >
        {/* Android Punch Hole Camera (Centered) */}
        {deviceType !== 'fullscreen' && (
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-black rounded-full z-40 border border-slate-700/80 flex items-center justify-center shadow-xs pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900 ring-1 ring-emerald-500/20" />
          </div>
        )}

        {/* Android Status Bar (Material 3) */}
        <div className="absolute top-0 inset-x-0 h-9 z-30 flex items-center justify-between px-6 text-xs font-semibold select-none pointer-events-none text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[12px] tracking-tight font-sans">{currentTime}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold tracking-wider bg-white/10 px-1 rounded text-slate-200">5G</span>
            {config.isConnected ? (
              <Wifi className="w-3.5 h-3.5 stroke-[2.2]" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-rose-400 stroke-[2.5]" />
            )}
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-mono font-bold">98%</span>
              <Battery className="w-4 h-4 stroke-[2.2] fill-white" />
            </div>
          </div>
        </div>

        {/* Mobile Screen Viewport with Global Theme & Font Context */}
        <div
          style={{ fontFamily: activeFont.fontFamily }}
          className={`w-full h-full rounded-[42px] overflow-hidden relative transition-colors duration-300 ${
            isDark ? 'dark bg-slate-950 text-slate-100' : 'bg-[#F8FAFF] text-slate-900'
          }`}
        >
          {screenState === 'splash' && (
            <SplashScreenPreview
              config={config}
              onNavigate={() => {
                if (config.isLoggedIn) {
                  onScreenChange('home');
                } else {
                  onScreenChange('login');
                }
              }}
              onRetryConnection={handleRetryConnection}
              onDismissDialog={handleDismissDialog}
            />
          )}

          {screenState === 'login' && (
            <LoginScreenPreview
              config={config}
              onLoginSuccess={() => {
                onConfigChange((prev) => ({ ...prev, isLoggedIn: true }));
                onScreenChange('home');
              }}
              onBackToSplash={() => {
                onResetSplash();
                onScreenChange('splash');
              }}
            />
          )}

          {screenState === 'home' && (
            <HomeScreenPreview
              config={config}
              onLogout={async () => {
                try {
                  await logoutUser();
                } catch (_) {}
                onConfigChange((prev) => ({ ...prev, isLoggedIn: false }));
                onScreenChange('login');
              }}
              onBackToSplash={() => {
                onResetSplash();
                onScreenChange('splash');
              }}
              onOpenNewDtr={() => {
                setEditingDtr(null);
                onScreenChange('dtr_form');
              }}
              onOpenReports={() => {
                onScreenChange('dtr_list');
              }}
              onOpenSettings={() => {
                onScreenChange('settings');
              }}
              onEditDtr={(dtr) => {
                setEditingDtr(dtr);
                onScreenChange('dtr_form');
              }}
              onOpenPoleSchedule={(dtr) => {
                setEditingDtr(dtr);
                onScreenChange('pole_schedule');
              }}
              onOpenAddPole={(dtr) => {
                setEditingDtr(dtr);
                setEditingPole(null);
                onScreenChange('add_pole');
              }}
            />
          )}

          {screenState === 'settings' && (
            <SettingsScreenPreview
              config={config}
              onBack={() => onScreenChange('home')}
              onLogout={async () => {
                try {
                  await logoutUser();
                } catch (_) {}
                onConfigChange((prev) => ({ ...prev, isLoggedIn: false }));
                onScreenChange('login');
              }}
              onConfigChange={onConfigChange}
              onOpenReports={() => onScreenChange('dtr_list')}
            />
          )}

          {screenState === 'dtr_form' && (
            <DTRScreenPreview
              config={config}
              dtrToEdit={editingDtr}
              onBack={() => onScreenChange('home')}
              onSaved={(saved) => {
                onScreenChange('home');
              }}
            />
          )}

          {screenState === 'dtr_list' && (
            <DTRListScreenPreview
              config={config}
              onBack={() => onScreenChange('home')}
              onSelectDtr={(dtr) => {
                setEditingDtr(dtr);
                onScreenChange('dtr_form');
              }}
              onOpenPoleSchedule={(dtr) => {
                setEditingDtr(dtr);
                onScreenChange('pole_schedule');
              }}
            />
          )}

          {screenState === 'pole_schedule' && (
            <PoleScheduleScreenPreview
              config={config}
              dtr={editingDtr}
              onBack={() => onScreenChange('home')}
              onAddNewPole={() => {
                setEditingPole(null);
                setMidSpanInsertIndex(null);
                setMidSpanContext(null);
                onScreenChange('add_pole');
              }}
              onAddMidSpanPole={(insertIndex, context) => {
                setEditingPole(null);
                setMidSpanInsertIndex(insertIndex);
                setMidSpanContext(context || null);
                onScreenChange('add_pole');
              }}
              onEditPole={(pole) => {
                setEditingPole(pole);
                setMidSpanInsertIndex(null);
                setMidSpanContext(null);
                onScreenChange('add_pole');
              }}
              onEditDtr={() => {
                onScreenChange('dtr_form');
              }}
            />
          )}

          {screenState === 'add_pole' && (
            <AddPoleScreenPreview
              config={config}
              dtr={editingDtr}
              poleToEdit={editingPole}
              insertAtIndex={midSpanInsertIndex}
              insertContext={midSpanContext}
              onBack={() => {
                setMidSpanInsertIndex(null);
                setMidSpanContext(null);
                onScreenChange('pole_schedule');
              }}
              onSaved={() => {
                setMidSpanInsertIndex(null);
                setMidSpanContext(null);
                onScreenChange('pole_schedule');
              }}
              onDeleted={() => {
                setMidSpanInsertIndex(null);
                setMidSpanContext(null);
                onScreenChange('pole_schedule');
              }}
            />
          )}
        </div>

        {/* Android System Navigation Bar */}
        <div className="absolute bottom-0 inset-x-0 h-10 bg-black/90 backdrop-blur-md z-40 flex items-center justify-around px-8 border-t border-white/5 select-none">
          {androidNavMode === '3button' ? (
            <>
              {/* Back button (◀) */}
              <button
                type="button"
                onClick={handleAndroidBack}
                title="Android Back"
                className="w-12 h-9 flex items-center justify-center text-slate-300 hover:text-white active:scale-75 transition cursor-pointer"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>

              {/* Home button (●) */}
              <button
                type="button"
                onClick={handleAndroidHome}
                title="Android Home"
                className="w-12 h-9 flex items-center justify-center text-slate-300 hover:text-white active:scale-75 transition cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full border-2 border-current" />
              </button>

              {/* Recents button (■) */}
              <button
                type="button"
                onClick={() => setShowAndroidRecents((prev) => !prev)}
                title="Android Recents / Task Switcher"
                className="w-12 h-9 flex items-center justify-center text-slate-300 hover:text-white active:scale-75 transition cursor-pointer"
              >
                <div className="w-3.5 h-3.5 rounded-xs border-2 border-current" />
              </button>
            </>
          ) : (
            /* Android Gesture Pill */
            <div
              onClick={handleAndroidHome}
              title="Android Gesture Bar (Tap for Home, Swipe Back)"
              className="w-32 h-1.5 bg-slate-400/80 hover:bg-white rounded-full cursor-pointer transition active:scale-90 my-auto"
            />
          )}
        </div>

        {/* Android Recents / App Task Switcher Overlay */}
        {showAndroidRecents && (
          <div
            onClick={() => setShowAndroidRecents(false)}
            className="absolute inset-0 bg-black/80 backdrop-blur-xs z-50 p-4 flex flex-col justify-end animate-in fade-in duration-150"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-700/80 rounded-3xl p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Android Task Switcher
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAndroidRecents(false)}
                  className="text-slate-400 hover:text-white text-xs font-semibold px-2 py-0.5 rounded-lg bg-slate-800 cursor-pointer"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    onScreenChange('home');
                    setShowAndroidRecents(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                    screenState === 'home'
                      ? 'bg-emerald-950/60 border-emerald-500/50 text-emerald-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block text-white">Home</span>
                  <span className="text-[10px] text-slate-400">DTR Route Dashboard</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onScreenChange('pole_schedule');
                    setShowAndroidRecents(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                    screenState === 'pole_schedule'
                      ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block text-white">Pole Schedule</span>
                  <span className="text-[10px] text-slate-400">24-Col Conductor Grid</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onScreenChange('add_pole');
                    setShowAndroidRecents(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                    screenState === 'add_pole'
                      ? 'bg-rose-950/60 border-rose-500/50 text-rose-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block text-white">Add Pole</span>
                  <span className="text-[10px] text-slate-400">GPS Waypoint Survey</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onScreenChange('dtr_form');
                    setShowAndroidRecents(false);
                  }}
                  className={`p-2.5 rounded-2xl border text-left transition cursor-pointer ${
                    screenState === 'dtr_form'
                      ? 'bg-purple-950/60 border-purple-500/50 text-purple-200'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span className="font-bold block text-white">New DTR</span>
                  <span className="text-[10px] text-slate-400">Transformer Passport</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Android System Subtext under device */}
      <div className="flex items-center gap-2 mt-4 text-xs text-slate-400">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-semibold text-[11px]">
          <Smartphone className="w-3 h-3" />
          Android App Ready (API 34)
        </span>
        <span>•</span>
        <span>Use ◀ Back, ● Home, ■ Recents to navigate</span>
      </div>

    </div>
  );
};
