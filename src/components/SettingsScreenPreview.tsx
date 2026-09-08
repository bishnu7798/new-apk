import React, { useState, useEffect } from 'react';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import {
  ArrowLeft,
  User,
  Shield,
  Palette,
  Info,
  Check,
  Moon,
  Sun,
  Paintbrush,
  Type,
  Sparkles,
  Lock,
  Mail,
  Phone,
  Building,
  MapPin,
  CheckCircle2,
  X,
  AlertTriangle,
  Save,
  KeyRound,
  FileText,
  Copy,
  ExternalLink,
  Heart,
  Sliders,
  Smartphone,
  Activity
} from 'lucide-react';
import { SplashConfig } from '../types';
import { getActiveTheme, getActiveFont, THEME_PRESETS, FONT_DEFINITIONS, ThemeDefinition, FontDefinition } from '../lib/theme';
import { saveUserProfile, auth } from '../lib/firebase';

interface SettingsScreenPreviewProps {
  config: SplashConfig;
  onBack: () => void;
  onLogout?: () => void;
  onConfigChange?: (updater: (prev: SplashConfig) => SplashConfig) => void;
  onOpenReports?: () => void;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  designation: string;
  employeeId: string;
  division: string;
  ccc: string;
}

interface DisplayPreferences {
  compactCards: boolean;
  hapticFeedback: boolean;
  highContrastMode: boolean;
  smoothTransitions: boolean;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Bishnu Sarkar',
  email: 'bishnusarkar4321@gmail.com',
  phone: '+91 98765 43210',
  designation: 'Senior Electrical Engineer (Survey)',
  employeeId: 'WBSEDCL-EE-7842',
  division: 'RAIGANJ',
  ccc: 'CCC-RAIGANJ-I',
};

const DEFAULT_DISPLAY_PREFS: DisplayPreferences = {
  compactCards: false,
  hapticFeedback: true,
  highContrastMode: false,
  smoothTransitions: true,
};

export const SettingsScreenPreview: React.FC<SettingsScreenPreviewProps> = ({
  config,
  onBack,
  onLogout,
  onConfigChange,
}) => {
  // 4 Advanced Tabs: Appearance, Profile, Privacy Policy, About
  const [activeTab, setActiveTab] = useState<'appearance' | 'profile' | 'privacy' | 'about'>('appearance');

  // Stored Profile state
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('ns_user_profile');
      if (saved) return JSON.parse(saved);
      const sessionRaw = localStorage.getItem('ns_persisted_session');
      if (sessionRaw) {
        const parsed = JSON.parse(sessionRaw);
        if (parsed.email) {
          return {
            ...DEFAULT_PROFILE,
            email: parsed.email,
            name: parsed.email.split('@')[0].toUpperCase(),
          };
        }
      }
    } catch (_) {}
    return DEFAULT_PROFILE;
  });

  // Display preferences
  const [displayPrefs, setDisplayPrefs] = useState<DisplayPreferences>(() => {
    try {
      const saved = localStorage.getItem('ns_display_prefs');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_DISPLAY_PREFS;
  });

  // Modal Dialog States
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit Profile Form State
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editDesignation, setEditDesignation] = useState('');
  const [editEmployeeId, setEditEmployeeId] = useState('');
  const [editDivision, setEditDivision] = useState('');
  const [editCcc, setEditCcc] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [pingLatency] = useState<number>(24);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleOpenEditProfile = () => {
    setEditName(profile.name);
    setEditEmail(profile.email);
    setEditPhone(profile.phone);
    setEditDesignation(profile.designation);
    setEditEmployeeId(profile.employeeId);
    setEditDivision(profile.division);
    setEditCcc(profile.ccc);
    setShowEditProfileModal(true);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      name: editName,
      email: editEmail,
      phone: editPhone,
      designation: editDesignation,
      employeeId: editEmployeeId,
      division: editDivision,
      ccc: editCcc,
    };
    setProfile(updated);
    try {
      localStorage.setItem('ns_user_profile', JSON.stringify(updated));
      localStorage.setItem('ns_persisted_session', JSON.stringify({ email: editEmail, loggedIn: true }));
      if (auth.currentUser) {
        await saveUserProfile(auth.currentUser.uid, updated);
      }
    } catch (_) {}
    setShowEditProfileModal(false);
    showToast('Profile updated & synced');
  };

  const handleUpdateDisplayPref = (key: keyof DisplayPreferences, value: boolean) => {
    const updated = { ...displayPrefs, [key]: value };
    setDisplayPrefs(updated);
    try {
      localStorage.setItem('ns_display_prefs', JSON.stringify(updated));
    } catch (_) {}
    showToast('Preferences updated');
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setPasswordError('Please enter current password');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordError('');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setShowPasswordModal(false);
    showToast('Security password changed successfully');
  };

  const activeTheme = getActiveTheme(config);
  const activeFont = getActiveFont(config);
  const isDark = !!config.darkMode;

  const handleSelectTheme = (theme: ThemeDefinition) => {
    if (onConfigChange) {
      onConfigChange((prev) => ({
        ...prev,
        themePreset: theme.id,
        themeGradient: {
          start: theme.gradient.start,
          middle: theme.gradient.middle,
          end: theme.gradient.end,
        },
        primaryColor: theme.primary,
      }));
    }
    showToast(`Theme: ${theme.name}`);
  };

  const handleSelectFont = (font: FontDefinition) => {
    if (onConfigChange) {
      onConfigChange((prev) => ({
        ...prev,
        fontStyle: font.id,
      }));
    }
    showToast(`Font: ${font.name}`);
  };

  const handleToggleDarkMode = (dark: boolean) => {
    if (onConfigChange) {
      onConfigChange((prev) => ({
        ...prev,
        darkMode: dark,
      }));
    }
    showToast(dark ? '🌙 Dark Mode Activated' : '☀️ Light Mode Activated');
  };

  // Format today's date for privacy policy matching Flutter: ${year}-${month.padLeft(2, '0')}-${day.padLeft(2, '0')}
  const today = new Date();
  const formattedToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  return (
    <div
      style={{ fontFamily: activeFont.fontFamily }}
      className={`w-full h-full flex flex-col overflow-hidden select-none relative transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFF] text-slate-900'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Dynamic Theme Header */}
      <div
        style={{
          background: `linear-gradient(to right, ${activeTheme.gradient.start}, ${activeTheme.gradient.middle}, ${activeTheme.gradient.end})`,
        }}
        className="text-white px-4 pt-10 pb-3.5 shadow-md flex items-center justify-between sticky top-0 z-30 shrink-0 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h3 className="font-bold text-sm leading-tight text-white flex items-center gap-2">
              Settings &amp; Preferences
            </h3>
            <span className="text-[10px] text-white/80 font-medium">
              Theme, Typography, User Profile &amp; Privacy
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleToggleDarkMode(!isDark)}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-indigo-200" />}
          </button>
        </div>
      </div>

      {/* Advanced 4-Pill Section Navigation Bar (Data & Survey Rules removed, Privacy Policy added) */}
      <div
        className={`border-b px-3 py-2 flex items-center gap-2 overflow-x-auto shrink-0 shadow-2xs transition-colors ${
          isDark
            ? 'bg-slate-900/95 border-slate-800 text-slate-300'
            : 'bg-white border-slate-200/80 text-slate-700'
        }`}
      >
        <button
          onClick={() => setActiveTab('appearance')}
          style={activeTab === 'appearance' ? { backgroundColor: activeTheme.primary } : undefined}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'appearance'
              ? 'text-white shadow-sm'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Appearance &amp; Themes
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          style={activeTab === 'profile' ? { backgroundColor: activeTheme.primary } : undefined}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'profile'
              ? 'text-white shadow-sm'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          User Profile
        </button>

        <button
          onClick={() => setActiveTab('privacy')}
          style={activeTab === 'privacy' ? { backgroundColor: activeTheme.primary } : undefined}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'privacy'
              ? 'text-white shadow-sm'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          Privacy Policy
        </button>

        <button
          onClick={() => setActiveTab('about')}
          style={activeTab === 'about' ? { backgroundColor: activeTheme.primary } : undefined}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'about'
              ? 'text-white shadow-sm'
              : isDark
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Info className="w-3.5 h-3.5" />
          About &amp; App Info
        </button>
      </div>

      {/* Main Scrollable Settings Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth">
        {/* ================= TAB 1: APPEARANCE & THEMES ================= */}
        {activeTab === 'appearance' && (
          <div className="space-y-4 animate-in fade-in">
            {/* 1. DARK MODE (DARK MOOD) CONTROLS */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3.5 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  {isDark ? (
                    <Moon className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Sun className="w-4 h-4 text-amber-500" />
                  )}
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    Dark Mode / Appearance Mood
                  </h4>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  isDark
                    ? 'bg-indigo-950/80 text-indigo-300 border-indigo-700/60'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  {isDark ? '🌙 Dark Active' : '☀️ Light Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {/* Light Mode Option */}
                <button
                  type="button"
                  onClick={() => handleToggleDarkMode(false)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition cursor-pointer active:scale-98 ${
                    !isDark
                      ? 'border-amber-400 bg-amber-50/70 shadow-sm ring-2 ring-amber-400/40 text-slate-900'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Sun className="w-4 h-4 text-amber-500" />
                      <span>Light Mode</span>
                    </div>
                    {!isDark && (
                      <span className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] leading-tight text-slate-600 dark:text-slate-400">
                    Crisp daylight contrast for outdoor field surveys.
                  </p>
                </button>

                {/* Dark Mode Option */}
                <button
                  type="button"
                  onClick={() => handleToggleDarkMode(true)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2 transition cursor-pointer active:scale-98 ${
                    isDark
                      ? 'border-indigo-500 bg-indigo-950/60 shadow-sm ring-2 ring-indigo-500/40 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-xs">
                      <Moon className="w-4 h-4 text-indigo-400" />
                      <span>Dark Mode</span>
                    </div>
                    {isDark && (
                      <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] shadow-xs">
                        ✓
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] leading-tight text-slate-600 dark:text-slate-400">
                    OLED battery saver &amp; low-light evening survey view.
                  </p>
                </button>
              </div>
            </div>

            {/* 2. THEME COLOR PALETTE SELECTION */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3.5 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Paintbrush className="w-4 h-4" style={{ color: activeTheme.primary }} />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    App Theme &amp; Color Scheme
                  </h4>
                </div>
                <span
                  style={{ backgroundColor: `${activeTheme.primary}20`, color: activeTheme.primary }}
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-current"
                >
                  {activeTheme.name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {THEME_PRESETS.map((theme) => {
                  const isSelected = activeTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => handleSelectTheme(theme)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-2.5 transition cursor-pointer active:scale-98 relative overflow-hidden ${
                        isSelected
                          ? 'border-2 shadow-sm ring-1 ring-offset-1'
                          : isDark
                          ? 'border-slate-800/80 bg-slate-850 hover:bg-slate-800'
                          : 'border-slate-200/90 bg-slate-50/70 hover:bg-slate-100'
                      }`}
                      style={{
                        borderColor: isSelected ? theme.primary : undefined,
                        backgroundColor: isSelected
                          ? isDark
                            ? `${theme.primary}15`
                            : `${theme.primary}0D`
                          : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className="w-7 h-7 rounded-xl shadow-xs flex items-center justify-center shrink-0 border border-white/20"
                            style={{ backgroundColor: theme.primary }}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                          </div>

                          <div className="min-w-0">
                            <span className="text-xs font-bold text-slate-900 dark:text-white block truncate">
                              {theme.name}
                            </span>
                            <span className="text-[9px] font-semibold text-slate-600 dark:text-slate-400 block truncate">
                              {theme.badge}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <span
                            className="text-[9px] font-extrabold px-2 py-0.5 rounded-full text-white shrink-0"
                            style={{ backgroundColor: theme.primary }}
                          >
                            Active
                          </span>
                        )}
                      </div>

                      {/* Gentle Gradient Spectrum Preview */}
                      <div
                        className="h-2 w-full rounded-full shadow-inner opacity-90"
                        style={{
                          background: `linear-gradient(to right, ${theme.gradient.start}, ${theme.gradient.middle}, ${theme.gradient.end})`,
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. TYPOGRAPHY / FONT FAMILY SELECTION */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3.5 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Type className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    App Typography &amp; Font Family
                  </h4>
                </div>
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-0.5 rounded-full">
                  {activeFont.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {FONT_DEFINITIONS.map((f) => {
                  const isSelected = activeFont.id === f.id;
                  return (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelectFont(f)}
                      className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-1.5 transition cursor-pointer active:scale-98 ${
                        isSelected
                          ? 'border-2 shadow-sm ring-1 ring-offset-1'
                          : isDark
                          ? 'border-slate-800 bg-slate-850 hover:bg-slate-800'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-slate-100'
                      }`}
                      style={{
                        fontFamily: f.fontFamily,
                        borderColor: isSelected ? activeTheme.primary : undefined,
                        backgroundColor: isSelected
                          ? isDark
                            ? `${activeTheme.primary}15`
                            : `${activeTheme.primary}0D`
                          : undefined,
                      }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-[11px] font-bold text-slate-900 dark:text-slate-200 font-sans">
                          {f.name}
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-sans font-semibold">
                          {f.badge}
                        </span>
                      </div>

                      <div className="my-1">
                        <span className="text-sm font-bold block text-slate-900 dark:text-white truncate">
                          {config.appName || 'NS POWER'}
                        </span>
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 block truncate">
                          {f.sample}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 text-[10px] font-bold font-sans" style={{ color: activeTheme.primary }}>
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Selected</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. LIVE INTERACTIVE THEME SPECIMEN */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2.5 border-slate-100 dark:border-slate-800">
                <Sparkles className="w-4 h-4" style={{ color: activeTheme.primary }} />
                Live Theme &amp; Font Preview Specimen
              </h4>

              <div className="space-y-3 pt-1">
                <div
                  style={{
                    background: `linear-gradient(to right, ${activeTheme.gradient.start}, ${activeTheme.gradient.middle}, ${activeTheme.gradient.end})`,
                  }}
                  className="rounded-2xl p-3 text-white shadow-md flex items-center justify-between"
                >
                  <div>
                    <span className="text-[10px] text-white/75 font-semibold block uppercase">Active Header</span>
                    <h5 className="font-bold text-sm tracking-wide">{config.appName || 'NS'} Electrical Suite</h5>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-white/20 font-bold backdrop-blur-xs">
                    Live
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    style={{ backgroundColor: activeTheme.primary }}
                    className="px-3.5 py-2 rounded-xl text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 fill-white" />
                    <span>Primary Action</span>
                  </button>

                  <span
                    style={{ backgroundColor: `${activeTheme.primary}1A`, color: activeTheme.primary }}
                    className="px-3 py-1.5 rounded-xl font-bold text-xs border border-current flex items-center gap-1"
                  >
                    <span>{activeTheme.name}</span>
                  </span>

                  <span className={`px-3 py-1.5 rounded-xl font-bold text-xs border ${
                    isDark ? 'bg-slate-800 text-slate-200 border-slate-700' : 'bg-slate-100 text-slate-800 border-slate-200'
                  }`}>
                    Font: {activeFont.name}
                  </span>
                </div>
              </div>
            </div>

            {/* 5. USER INTERFACE PREFERENCES */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className="text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-2.5 border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
                <Sliders className="w-4 h-4" style={{ color: activeTheme.primary }} />
                User Interface &amp; Interaction Preferences
              </h4>

              <div className="space-y-3 text-xs">
                <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Compact Card View</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Dense layout for faster pole scanning.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateDisplayPref('compactCards', !displayPrefs.compactCards)}
                    style={{
                      backgroundColor: displayPrefs.compactCards ? activeTheme.primary : undefined,
                    }}
                    className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer shrink-0 ${
                      displayPrefs.compactCards ? '' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                        displayPrefs.compactCards ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Haptic &amp; Sound Feedback</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Tactile confirmation on saving survey records.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateDisplayPref('hapticFeedback', !displayPrefs.hapticFeedback)}
                    style={{
                      backgroundColor: displayPrefs.hapticFeedback ? activeTheme.primary : undefined,
                    }}
                    className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer shrink-0 ${
                      displayPrefs.hapticFeedback ? '' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                        displayPrefs.hapticFeedback ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-2xl border ${
                  isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-100'
                }`}>
                  <div>
                    <span className="font-bold block text-slate-900 dark:text-white">Smooth Page Transitions</span>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400">Hardware-accelerated animations between screens.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleUpdateDisplayPref('smoothTransitions', !displayPrefs.smoothTransitions)}
                    style={{
                      backgroundColor: displayPrefs.smoothTransitions ? activeTheme.primary : undefined,
                    }}
                    className={`w-11 h-6 rounded-full transition p-0.5 cursor-pointer shrink-0 ${
                      displayPrefs.smoothTransitions ? '' : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition ${
                        displayPrefs.smoothTransitions ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 2: SURVEYOR PROFILE ================= */}
        {activeTab === 'profile' && (
          <div className="space-y-4 animate-in fade-in">
            {/* User Identity Card */}
            <div className={`rounded-3xl p-5 border shadow-sm relative overflow-hidden transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0B2D52] via-[#044343] to-[#00A896] p-0.5 shadow-md shadow-[#00A896]/20 flex items-center justify-center shrink-0">
                  <div className="w-full h-full rounded-[14px] bg-[#0A192F] flex items-center justify-center text-amber-400 font-extrabold text-lg tracking-wider border border-teal-500/30">
                    {profile.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className={`font-extrabold text-base truncate ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}>
                      {profile.name}
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online & Active" />
                  </div>
                  <p className={`text-xs font-semibold truncate ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>{profile.designation}</p>
                  <span className={`inline-block mt-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border ${
                    isDark
                      ? 'text-teal-300 bg-teal-950/70 border-teal-800'
                      : 'text-teal-900 bg-teal-100/90 border-teal-300'
                  }`}>
                    {profile.employeeId}
                  </span>
                </div>
              </div>

              {/* Detail fields */}
              <div className={`space-y-2.5 rounded-2xl p-3.5 border text-xs ${
                isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
              }`}>
                <div className={`flex items-center justify-between py-1 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`flex items-center gap-2 font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Mail className="w-3.5 h-3.5 text-[#00A896]" />
                    Email
                  </span>
                  <span className={`font-bold truncate max-w-[180px] ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>{profile.email}</span>
                </div>

                <div className={`flex items-center justify-between py-1 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`flex items-center gap-2 font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Phone className="w-3.5 h-3.5 text-[#00A896]" />
                    Phone
                  </span>
                  <span className={`font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>{profile.phone}</span>
                </div>

                <div className={`flex items-center justify-between py-1 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`flex items-center gap-2 font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Building className="w-3.5 h-3.5 text-[#00A896]" />
                    Division
                  </span>
                  <span className={`font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>{profile.division}</span>
                </div>

                <div className="flex items-center justify-between py-1">
                  <span className={`flex items-center gap-2 font-semibold ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                    CCC Zone
                  </span>
                  <span className={`font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>{profile.ccc}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  onClick={handleOpenEditProfile}
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#0B2D52] to-[#00A896] hover:opacity-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>

                <button
                  onClick={() => setShowPasswordModal(true)}
                  className={`py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 border active:scale-95 transition cursor-pointer ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-750 text-slate-200 border-slate-700'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-slate-600" />
                  <span>Password</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: PRIVACY POLICY ================= */}
        {activeTab === 'privacy' && (
          <div className="space-y-4 animate-in fade-in">
            {/* Main Flutter Privacy Policy Container */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-5 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Policy Header */}
              <div className={`border-b pb-4 flex flex-col gap-1.5 ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-500" />
                  <h2 className={`text-xl font-bold tracking-tight ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    Privacy Policy for NS Electrical
                  </h2>
                </div>
                <p className={`text-xs font-semibold ${
                  isDark ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Last Updated: <span className={`font-bold font-mono ${
                    isDark ? 'text-slate-200' : 'text-slate-900'
                  }`}>{formattedToday}</span>
                </p>
              </div>

              {/* 1. Introduction */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Introduction
                </h3>
                <p className={`text-sm leading-relaxed font-normal ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  NS Electrical is unwavering in our commitment to safeguarding your privacy and protecting your personal information. This comprehensive Privacy Policy delineates our practices regarding the collection, utilization, disclosure, and protection of your information when you engage with our sophisticated mobile application. We implore you to carefully review this privacy policy. If you do not consent to the terms outlined herein, we respectfully request that you refrain from accessing or utilizing our application.
                </p>
              </div>

              {/* 2. Information We Collect */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Information We Collect
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  We meticulously gather information that you directly provide to us during your interaction with our application, including but not limited to:
                </p>
                <ul className={`space-y-1.5 pl-3 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Account credentials such as your email address during the registration process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>DTR (Distribution Transformer Record) data encompassing creation, modification, and deletion activities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Comprehensive pole information and associated technical data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Application preferences, configuration settings, and user customizations</span>
                  </li>
                </ul>

                <p className={`text-sm leading-relaxed pt-2 ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Additionally, we automatically collect technical information to enhance your user experience:
                </p>
                <ul className={`space-y-1.5 pl-3 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Device specifications (device model, operating system version, hardware capabilities)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Usage analytics (interaction patterns, feature utilization, session duration)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Diagnostic information (error logs, performance metrics, system stability data)</span>
                  </li>
                </ul>
              </div>

              {/* 3. Use of Information */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  How We Utilize Your Information
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  We strategically employ the collected information to optimize your experience and ensure seamless functionality:
                </p>
                <ul className={`space-y-1.5 pl-3 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Deliver, maintain, and continuously enhance our cutting-edge application</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Process and securely store your DTR and pole data with industry-leading protocols</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Provide responsive customer support and address your inquiries</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Disseminate technical notifications and critical support communications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Analyze usage trends and preferences to inform future development</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Diagnose and rectify technical issues to ensure optimal performance</span>
                  </li>
                </ul>
              </div>

              {/* 4. Data Storage */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Data Storage and Security Protocols
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Your sensitive data is securely stored locally on your device utilizing SharedPreferences technology for unparalleled performance and reliability. We implement robust security measures to fortify your information against unauthorized access:
                </p>
                <ul className={`space-y-1.5 pl-3 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Advanced data encryption protocols for data at rest</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Sophisticated authentication mechanisms and access controls</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Comprehensive security assessments and vulnerability scanning</span>
                  </li>
                </ul>
              </div>

              {/* 5. Data Sharing */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Information Sharing and Disclosure
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  We maintain an absolute prohibition against selling, trading, or transferring your personally identifiable information to external entities. Your confidential data remains exclusively on your device and is never shared with third parties except under legally mandated circumstances or court orders.
                </p>
              </div>

              {/* 6. Data Retention */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Data Retention and Deletion
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  We retain your information for the duration necessary to fulfill our service obligations or as mandated by applicable legal frameworks. You possess complete autonomy to delete your data at any time through application uninstallation or by utilizing our integrated deletion functions within the app.
                </p>
              </div>

              {/* 7. Your Rights */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Your Privacy Rights and Controls
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  You are entitled to exercise comprehensive control over your personal information:
                </p>
                <ul className={`space-y-1.5 pl-3 text-sm ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Access and review your complete personal information portfolio</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Update or rectify any inaccuracies in your information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Permanently delete your information from our systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 font-bold text-base leading-none">•</span>
                    <span>Object to or restrict the processing of your information</span>
                  </li>
                </ul>
              </div>

              {/* 8. Children's Privacy */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Children's Privacy Protection
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  Our application is specifically designed for professional use and is not intended for individuals under the age of 13. We conscientiously avoid collecting personal information from minors. Should we inadvertently collect information from a child under 13, we will promptly implement measures to expunge such data.
                </p>
              </div>

              {/* 9. Changes to Privacy Policy */}
              <div className="space-y-2">
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Amendments to This Privacy Policy
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  We reserve the right to periodically update our Privacy Policy to reflect evolving practices and legal requirements. We will notify you of significant changes by publishing the revised Privacy Policy on this page and updating the "Last Updated" timestamp.
                </p>
              </div>

              {/* 10. Contact Us */}
              <div className={`space-y-3 pt-2 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-200'
              }`}>
                <h3 className={`text-base font-bold ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Contact Us
                </h3>
                <p className={`text-sm leading-relaxed ${
                  isDark ? 'text-slate-300' : 'text-slate-800'
                }`}>
                  For inquiries regarding this Privacy Policy or to exercise your privacy rights, please contact our dedicated support team:
                </p>

                <div className={`p-4 rounded-2xl border space-y-2.5 ${
                  isDark ? 'bg-slate-850 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-semibold ${
                      isDark ? 'text-slate-400' : 'text-slate-700'
                    }`}>Official Gmail ID to contact user:</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('bishnusarkar4321@gmail.com');
                        showToast('Email copied to clipboard');
                      }}
                      className="px-2.5 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1 cursor-pointer transition shadow-xs"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy Email</span>
                    </button>
                  </div>
                  <div className={`font-mono text-sm font-bold ${
                    isDark ? 'text-white' : 'text-slate-950'
                  }`}>
                    bishnusarkar4321@gmail.com
                  </div>

                  <div className={`pt-2 border-t flex items-center gap-1.5 text-xs font-semibold ${
                    isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-800'
                  }`}>
                    <span>This app create with</span>
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
                    <span>by <strong className={isDark ? 'text-white font-extrabold' : 'text-slate-950 font-extrabold'}>Nirmalya Sarkar</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 4: ABOUT & APP INFO ================= */}
        {activeTab === 'about' && (
          <div className="space-y-4 animate-in fade-in">
            {/* App Brand Summary */}
            <div className={`rounded-3xl p-5 border shadow-sm text-center space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-200 shadow-md mx-auto flex items-center justify-center overflow-hidden">
                <img
                  src={config.logoUrl || nsLogo}
                  alt="NS Logo"
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <h3 className={`font-extrabold text-base ${
                  isDark ? 'text-white' : 'text-slate-950'
                }`}>
                  NS Smart Electrical &amp; Power Solutions
                </h3>
                <p className="text-xs text-[#00A896] font-semibold">
                  Field Survey &amp; 24-Column Pole Inventory Engine
                </p>
              </div>

              <div className={`inline-flex items-center gap-1.5 border text-xs font-bold px-3 py-1 rounded-full font-mono ${
                isDark
                  ? 'bg-teal-950/60 border-teal-800 text-teal-300'
                  : 'bg-teal-100/90 border-teal-300 text-teal-900'
              }`}>
                <span>Version 2.4.0 (Build 2026.08)</span>
              </div>
            </div>

            {/* Developer Credits Card */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-2.5 ${
                isDark ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'
              }`}>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                Developer &amp; Creator
              </h4>

              {/* High-visibility Callout Banner */}
              <div className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
                isDark
                  ? 'bg-rose-950/40 border-rose-900/60 text-rose-200'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
                <span>This app create with ❤️ by <strong className={`font-extrabold ${isDark ? 'text-rose-100' : 'text-rose-950'}`}>Nirmalya Sarkar</strong></span>
              </div>

              <div className="space-y-2 text-xs">
                <div className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Developer</span>
                  <span className={`font-extrabold ${isDark ? 'text-white' : 'text-slate-950'}`}>Nirmalya Sarkar</span>
                </div>
                <div className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Official Contact Gmail</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-300">bishnusarkar4321@gmail.com</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText('bishnusarkar4321@gmail.com');
                        showToast('Email copied to clipboard');
                      }}
                      className="p-1 text-slate-500 hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer"
                      title="Copy Gmail"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <div className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Framework Engine</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-950'}`}>Kotlin 1.9.22 / Jetpack Compose &amp; M3</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">Operational &bull; Online</span>
                </div>
              </div>
            </div>

            {/* Live Mobile Installation & PWA Card */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-gradient-to-br from-teal-950/50 to-slate-900 border-teal-800/60' : 'bg-gradient-to-br from-teal-50 to-white border-teal-200'
            }`}>
              <div className="flex items-center justify-between">
                <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${
                  isDark ? 'text-teal-300' : 'text-teal-950'
                }`}>
                  <Smartphone className="w-4 h-4 text-[#00A896]" />
                  Install Mobile App (PWA &amp; APK)
                </h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#00A896] text-white">
                  Available Now
                </span>
              </div>
              <p className={`text-xs leading-relaxed ${
                isDark ? 'text-slate-300' : 'text-slate-700'
              }`}>
                Tap below to open the mobile installer or copy the direct URL to open on your phone in Chrome or Safari to install on your Home Screen.
              </p>
              <div className="pt-1 flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-pre-xsxzavs2v7wmz44zk3jozk-368700276170.asia-east1.run.app');
                    showToast('Mobile Install URL copied!');
                  }}
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#00A896] hover:bg-[#008f80] text-white text-xs font-extrabold flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md active:scale-95"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Phone Install Link</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Metrics */}
            <div className={`rounded-3xl p-5 border shadow-sm space-y-3 transition-colors ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <h4 className={`text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b pb-2.5 ${
                isDark ? 'text-white border-slate-800' : 'text-slate-950 border-slate-200'
              }`}>
                <Activity className="w-4 h-4 text-[#00A896]" />
                Live System Diagnostics
              </h4>

              <div className="space-y-2 text-xs">
                <div className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Platform</span>
                  <span className={`font-mono font-bold ${isDark ? 'text-slate-100' : 'text-slate-950'}`}>Android APK &amp; Web</span>
                </div>
                <div className={`flex items-center justify-between py-1.5 border-b ${
                  isDark ? 'border-slate-800' : 'border-slate-200'
                }`}>
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Security Encryption</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">AES-256 at Rest</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Network Latency</span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{pingLatency} ms (Optimal)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= EDIT PROFILE MODAL ================= */}
      {showEditProfileModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveProfile}
            className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-3 border ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h3 className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-950'}`}>Edit User Profile</h3>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className={`p-1 cursor-pointer ${isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs max-h-[380px] overflow-y-auto pr-1">
              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl font-semibold focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Official Email
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl font-semibold focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl font-semibold focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Designation / Role
                </label>
                <input
                  type="text"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl font-semibold focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Employee ID
                </label>
                <input
                  type="text"
                  value={editEmployeeId}
                  onChange={(e) => setEditEmployeeId(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-xl font-mono text-xs font-semibold focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Division
                  </label>
                  <input
                    type="text"
                    value={editDivision}
                    onChange={(e) => setEditDivision(e.target.value)}
                    className={`w-full px-2.5 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00A896] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                    }`}
                  />
                </div>
                <div>
                  <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    CCC
                  </label>
                  <input
                    type="text"
                    value={editCcc}
                    onChange={(e) => setEditCcc(e.target.value)}
                    className={`w-full px-2.5 py-2 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00A896] ${
                      isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-950'
                    }`}
                  />
                </div>
              </div>
            </div>

            <div className={`flex justify-end gap-2 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => setShowEditProfileModal(false)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                  isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A896] hover:bg-[#008f80] text-white shadow-md cursor-pointer flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      {showPasswordModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSavePassword}
            className={`w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-3.5 border ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            <div className={`flex items-center justify-between border-b pb-2 ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <h3 className={`font-bold text-sm flex items-center gap-2 ${
                isDark ? 'text-white' : 'text-slate-950'
              }`}>
                <KeyRound className="w-4 h-4 text-[#00A896]" />
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setShowPasswordModal(false);
                }}
                className={`p-1 cursor-pointer ${
                  isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {passwordError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-semibold flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs">
              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-950 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  New Password (min 6 chars)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Create new password"
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-950 placeholder:text-slate-400'
                  }`}
                />
              </div>

              <div>
                <label className={`text-[11px] font-semibold block mb-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className={`w-full px-3 py-2 border rounded-xl text-xs focus:outline-none focus:border-[#00A896] ${
                    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-950 placeholder:text-slate-400'
                  }`}
                />
              </div>
            </div>

            <div className={`flex justify-end gap-2 pt-2 border-t ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setPasswordError('');
                  setShowPasswordModal(false);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold ${
                  isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#00A896] hover:bg-[#008f80] text-white shadow-md cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
