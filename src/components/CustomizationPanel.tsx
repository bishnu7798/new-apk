import React from 'react';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import { Sliders, Sparkles, Wifi, WifiOff, UserCheck, UserX, Clock, Play, RotateCcw, Palette, Image as ImageIcon, Zap, Type } from 'lucide-react';
import { SplashConfig } from '../types';
import { THEME_PRESETS } from '../lib/theme';

interface CustomizationPanelProps {
  config: SplashConfig;
  onChange: (updater: (prev: SplashConfig) => SplashConfig) => void;
  onResetSplash: () => void;
}

const fontPresets: {
  id: 'syne' | 'orbitron' | 'rajdhani' | 'cinzel' | 'outfit' | 'plus_jakarta' | 'jetbrains';
  name: string;
  fontClass: string;
  badge: string;
}[] = [
  {
    id: 'syne',
    name: 'Syne Display',
    fontClass: 'font-syne font-extrabold',
    badge: 'Modern Bold',
  },
  {
    id: 'orbitron',
    name: 'Orbitron Cyber',
    fontClass: 'font-orbitron font-bold',
    badge: 'Futuristic',
  },
  {
    id: 'rajdhani',
    name: 'Rajdhani Tech',
    fontClass: 'font-rajdhani font-bold',
    badge: 'Power & Grid',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Royal',
    fontClass: 'font-cinzel font-bold',
    badge: 'Luxury Serif',
  },
  {
    id: 'outfit',
    name: 'Outfit Geometric',
    fontClass: 'font-outfit font-extrabold',
    badge: 'Clean Tech',
  },
  {
    id: 'plus_jakarta',
    name: 'Jakarta Sans',
    fontClass: 'font-sans font-black',
    badge: 'Neo Sans',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    fontClass: 'font-mono-jb font-bold',
    badge: 'Monospace',
  },
];

const logoPresets = [
  {
    id: 'ns_jpeg',
    name: 'NS Logo (JPEG)',
    subtitle: 'NSLOGO1.jpeg Original Photo',
    url: nsLogo,
  },
  {
    id: 'ns_png',
    name: 'NS Logo (PNG)',
    subtitle: 'NSLOGO1.png Compatible Format',
    url: '/assets/images/NSLOGO1.png',
  },
];

const colorPresets = [
  {
    name: 'NS Peacock Royal (Logo Theme)',
    start: '#0A192F',
    middle: '#0B2D52',
    end: '#044343',
  },
  {
    name: 'Peacock Aurora & Gold',
    start: '#061A23',
    middle: '#0E3B43',
    end: '#1B4965',
  },
  {
    name: 'Midnight Sapphire & Cyan',
    start: '#03071E',
    middle: '#0C1844',
    end: '#004B6E',
  },
  {
    name: 'Pure Pearl & Royal Navy',
    start: '#F8FAFC',
    middle: '#E2E8F0',
    end: '#CBD5E1',
  },
];

export const CustomizationPanel: React.FC<CustomizationPanelProps> = ({
  config,
  onChange,
  onResetSplash,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl space-y-6 text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Live Simulator Controls</h3>
        </div>
        <button
          onClick={onResetSplash}
          className="px-2.5 py-1 text-xs font-semibold bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 rounded-lg border border-blue-500/30 transition cursor-pointer flex items-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Replay
        </button>
      </div>

      {/* Brand Texts */}
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            App Name
          </label>
          <input
            type="text"
            value={config.appName}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, appName: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 font-bold"
            placeholder="NS"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1">
            App Title / Tagline
          </label>
          <input
            type="text"
            value={config.appTitle}
            onChange={(e) =>
              onChange((prev) => ({ ...prev, appTitle: e.target.value }))
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            placeholder="ns creaction"
          />
        </div>
      </div>

      {/* Font Style Selection */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-amber-400" />
            App Name Font Style
          </span>
          <span className="text-[10px] text-amber-400 font-semibold bg-amber-950/60 px-2 py-0.5 rounded-full border border-amber-500/30">
            {fontPresets.find((f) => (config.fontStyle || 'syne') === f.id)?.badge || 'Syne'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fontPresets.map((preset) => {
            const isSelected =
              (config.fontStyle || 'syne') === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    fontStyle: preset.id,
                  }))
                }
                className={`p-2.5 rounded-xl border text-left flex flex-col justify-between gap-1 transition cursor-pointer ${
                  isSelected
                    ? 'border-amber-400 bg-amber-500/15 shadow-sm shadow-amber-500/20 ring-1 ring-amber-400/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-[11px] font-semibold text-slate-300">
                    {preset.name}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-800 text-slate-400">
                    {preset.badge}
                  </span>
                </div>
                <span className={`text-base text-white ${preset.fontClass} truncate`}>
                  {config.appName || 'NS'}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Logo Picker */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            Active Brand Logo
          </span>
          <span className="text-[10px] text-cyan-400 font-bold bg-cyan-950/60 px-2 py-0.5 rounded-full border border-cyan-500/30">
            NSLOGO1
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2">
          {logoPresets.map((preset) => {
            const isSelected =
              config.logoUrl === preset.url ||
              (!config.logoUrl && preset.id === 'ns_jpeg');
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    logoUrl: preset.url,
                  }))
                }
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition cursor-pointer ${
                  isSelected
                    ? 'border-cyan-500 bg-cyan-500/15 shadow-sm shadow-cyan-500/20 ring-1 ring-cyan-500/50'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div className="w-9 h-9 rounded-lg bg-white p-1 border border-white/20 shrink-0 overflow-hidden flex items-center justify-center">
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-bold text-white block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {preset.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Network & Auth State Simulations */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-400">
          Simulation States
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {/* Internet Toggle */}
          <button
            type="button"
            onClick={() => {
              onChange((prev) => ({
                ...prev,
                isConnected: !prev.isConnected,
                showNoInternetDialog: prev.isConnected, // open dialog if switching to offline
              }));
            }}
            className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
              config.isConnected
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
            }`}
          >
            {config.isConnected ? (
              <>
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span>Internet: Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-5 h-5 text-rose-400 animate-pulse" />
                <span>Internet: Offline</span>
              </>
            )}
          </button>

          {/* Auth State Toggle */}
          <button
            type="button"
            onClick={() => {
              onChange((prev) => ({
                ...prev,
                isLoggedIn: !prev.isLoggedIn,
              }));
            }}
            className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
              config.isLoggedIn
                ? 'bg-blue-950/40 border-blue-500/40 text-blue-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}
          >
            {config.isLoggedIn ? (
              <>
                <UserCheck className="w-5 h-5 text-blue-400" />
                <span>User: Logged In (Home)</span>
              </>
            ) : (
              <>
                <UserX className="w-5 h-5 text-amber-400" />
                <span>User: Guest (Login)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Animation & Duration Controls */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>Splash Duration</span>
          <span className="font-mono text-cyan-300">{config.splashDuration} seconds</span>
        </div>
        <input
          type="range"
          min="1"
          max="6"
          step="0.5"
          value={config.splashDuration}
          onChange={(e) =>
            onChange((prev) => ({
              ...prev,
              splashDuration: parseFloat(e.target.value),
            }))
          }
          className="w-full accent-blue-500 bg-slate-950 rounded-lg cursor-pointer"
        />

        <div className="flex items-center justify-between text-xs font-semibold text-slate-400 pt-2">
          <span>Playback Speed</span>
          <span className="font-mono text-cyan-300">{config.animationSpeed}x</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[0.5, 1, 1.5, 2].map((spd) => (
            <button
              key={spd}
              onClick={() =>
                onChange((prev) => ({ ...prev, animationSpeed: spd }))
              }
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                config.animationSpeed === spd
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>

      {/* Gentle & Professional Theme Presets */}
      <div className="space-y-2.5">
        <label className="block text-xs font-semibold text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            Gentle &amp; Professional Themes
          </span>
          <span className="text-[10px] text-teal-400 font-bold bg-teal-950/60 px-2 py-0.5 rounded-full border border-teal-500/30">
            {THEME_PRESETS.find((t) => t.id === config.themePreset)?.name || 'Custom'}
          </span>
        </label>
        <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
          {THEME_PRESETS.map((preset) => {
            const isSelected =
              config.themePreset === preset.id ||
              (config.themeGradient.start === preset.gradient.start &&
                config.themeGradient.middle === preset.gradient.middle);
            return (
              <button
                key={preset.id}
                onClick={() =>
                  onChange((prev) => ({
                    ...prev,
                    themePreset: preset.id,
                    primaryColor: preset.primary,
                    themeGradient: {
                      start: preset.gradient.start,
                      middle: preset.gradient.middle,
                      end: preset.gradient.end,
                    },
                  }))
                }
                className={`p-2 rounded-xl border text-left flex items-center gap-2 transition cursor-pointer ${
                  isSelected
                    ? 'border-teal-400 bg-teal-500/15 ring-1 ring-teal-400/50 shadow-sm'
                    : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full border border-white/20 shrink-0 shadow-xs"
                  style={{
                    background: `linear-gradient(135deg, ${preset.gradient.start}, ${preset.gradient.middle}, ${preset.gradient.end})`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[11px] font-semibold text-slate-200 block truncate">
                    {preset.name}
                  </span>
                  <span className="text-[9px] text-slate-400 block truncate">
                    {preset.badge}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
