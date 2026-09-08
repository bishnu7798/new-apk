import React, { useState, useEffect, useRef } from 'react';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import { TransformerIcon } from './TransformerIcon';
import {
  Search,
  Mic,
  MicOff,
  MoreVertical,
  Plus,
  BarChart2,
  Settings,
  LogOut,
  MapPin,
  Clock,
  Sun,
  CloudSun,
  Moon,
  Zap,
  Ticket,
  Navigation,
  ChevronRight,
  Trash2,
  Edit3,
  X,
  CheckCircle2,
  List,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  Check
} from 'lucide-react';
import { SplashConfig, DTRModel } from '../types';
import { getActiveTheme, getActiveFont } from '../lib/theme';
import {
  getStoredDTRs,
  saveOrUpdateDTR,
  deleteDTR,
  subscribeToDTRsRealtime,
  auth
} from '../lib/firebase';

interface DTRItem extends DTRModel {
  id: string;
  dtrCode: string;
  village: string;
  location: string;
  capacity: number | string;
  ccc: string;
  routeLength?: number;
}

interface HomeScreenPreviewProps {
  config: SplashConfig;
  onLogout: () => void;
  onBackToSplash: () => void;
  onOpenNewDtr?: () => void;
  onOpenReports?: () => void;
  onOpenSettings?: () => void;
  onEditDtr?: (dtr: any) => void;
  onOpenPoleSchedule?: (dtr: any) => void;
  onOpenAddPole?: (dtr: any) => void;
}

export const HomeScreenPreview: React.FC<HomeScreenPreviewProps> = ({
  config,
  onLogout,
  onBackToSplash,
  onOpenNewDtr,
  onOpenReports,
  onOpenSettings,
  onEditDtr,
  onOpenPoleSchedule,
  onOpenAddPole,
}) => {
  // User Authentication Context
  let savedEmail = 'operator@ns-power.com';
  try {
    const raw = localStorage.getItem('ns_persisted_session');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.email) savedEmail = parsed.email;
    }
  } catch (_) {
    // fallback default
  }

  const userName = savedEmail.split('@')[0] || 'Operator';
  const userInitials = userName.substring(0, 2).toUpperCase();

  // Screen States matching Flutter HomeScreen with Real-Time Data
  const [dtrs, setDtrs] = useState<DTRItem[]>(() => getStoredDTRs());

  // Real-Time DTR listener
  useEffect(() => {
    // Initial sync from local storage
    setDtrs(getStoredDTRs());

    // Subscribe to real-time updates (Local broadcast + Firestore onSnapshot)
    const unsubscribe = subscribeToDTRsRealtime((updatedList) => {
      if (Array.isArray(updatedList) && updatedList.length > 0) {
        setDtrs(updatedList);
      }
    });

    return () => unsubscribe();
  }, []);

  const [searchText, setSearchText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [deletingDtrId, setDeletingDtrId] = useState<string | null>(null);

  // Dialog & Modal States
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [selectedDtrForMenu, setSelectedDtrForMenu] = useState<DTRItem | null>(null);
  const [dtrToDelete, setDtrToDelete] = useState<DTRItem | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingDtr, setEditingDtr] = useState<DTRItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add/Edit Form State
  const [formCode, setFormCode] = useState('');
  const [formVillage, setFormVillage] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formCapacity, setFormCapacity] = useState('100');
  const [formCcc, setFormCcc] = useState('');

  // Location & Time State
  const [locationName, setLocationName] = useState('Kolkata Sub-division, North');
  const [currentTime, setCurrentTime] = useState('');

  // Live time & location simulation
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
      setCurrentTime(`${timeStr}, ${dateStr}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Filtered DTRs
  const filteredDtrs = dtrs.filter((d) => {
    if (!searchText.trim()) return true;
    const term = searchText.toLowerCase();
    return (
      (d.dtrCode || '').toLowerCase().includes(term) ||
      (d.village || '').toLowerCase().includes(term) ||
      (d.location || '').toLowerCase().includes(term) ||
      (d.ccc || '').toLowerCase().includes(term)
    );
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Determine Greeting & Icon
  const currentHour = new Date().getHours();
  let greeting = 'Good Evening';
  let GreetingIcon = Moon;
  if (currentHour < 12) {
    greeting = 'Good Morning';
    GreetingIcon = Sun;
  } else if (currentHour < 17) {
    greeting = 'Good Afternoon';
    GreetingIcon = CloudSun;
  }

  // Handle Speech simulation
  const toggleSpeechSearch = () => {
    if (!isListening) {
      setIsListening(true);
      const voiceSamples = ['Sonarpur', '100 kVA', 'Baruipur', 'CCC-492', 'DTR-WB-7401'];
      const sample = voiceSamples[Math.floor(Math.random() * voiceSamples.length)];
      setTimeout(() => {
        setSearchText(sample);
        setIsListening(false);
        showToast(`Voice recognized: "${sample}"`);
      }, 1800);
    } else {
      setIsListening(false);
    }
  };

  // Handle Delete in Real Time
  const handleDeleteConfirm = async () => {
    if (!dtrToDelete) return;
    const target = dtrToDelete;
    setDtrToDelete(null);
    setDeletingDtrId(target.id);

    try {
      await deleteDTR(target.id);
      setDtrs((prev) => prev.filter((item) => item.id !== target.id));
      setDeletingDtrId(null);
      showToast('DTR deleted in real-time');
    } catch (err) {
      setDtrs((prev) => prev.filter((item) => item.id !== target.id));
      setDeletingDtrId(null);
      showToast('DTR deleted locally');
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingDtr(null);
    setFormCode(`DTR-WB-${Math.floor(7400 + Math.random() * 90)}`);
    setFormVillage('');
    setFormLocation('');
    setFormCapacity('100');
    setFormCcc(`CCC-${Math.floor(100 + Math.random() * 800)}`);
    setShowAddEditModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (item: DTRItem) => {
    setEditingDtr(item);
    setFormCode(item.dtrCode || '');
    setFormVillage(item.village || '');
    setFormLocation(item.location || '');
    setFormCapacity(item.capacity?.toString() || '100');
    setFormCcc(item.ccc || '');
    setShowAddEditModal(true);
    setSelectedDtrForMenu(null);
  };

  // Save Add/Edit Real-Time
  const handleSaveDtr = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCode || !formVillage) return;

    const dtrToSave: any = {
      ...(editingDtr || {}),
      id: editingDtr?.id || `dtr-${Date.now()}`,
      dtrCode: formCode.trim(),
      village: formVillage.trim(),
      location: (formLocation || 'Main Feeder').trim(),
      capacity: Number(formCapacity) || 100,
      ccc: formCcc.trim() || 'N/A',
      routeLength: editingDtr?.routeLength || Math.floor(400 + Math.random() * 900),
      user: auth.currentUser?.email || 'operator@ns-power.com',
    };

    try {
      const saved = await saveOrUpdateDTR(dtrToSave, auth.currentUser?.uid);
      setDtrs((prev) => {
        const idx = prev.findIndex((d) => d.id === saved.id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = saved;
          return next;
        }
        return [saved, ...prev];
      });
      showToast(editingDtr ? 'DTR updated in real-time!' : 'DTR created in real-time!');
    } catch (err) {
      console.error('Error saving DTR:', err);
    }
    setShowAddEditModal(false);
  };

  const activeTheme = getActiveTheme(config);
  const activeFont = getActiveFont(config);
  const isDark = !!config.darkMode;

  return (
    <div
      style={{ fontFamily: activeFont.fontFamily }}
      className={`w-full h-full flex flex-col overflow-hidden select-none relative transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8F9FA] text-slate-900'
      }`}
    >
      {/* Toast Notification (Simulating Flutter SnackBar) */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700/60 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Dynamic Modern AppBar matching Theme */}
      <div
        style={{
          background: `linear-gradient(to right, ${activeTheme.gradient.start}, ${activeTheme.gradient.middle}, ${activeTheme.gradient.end})`,
        }}
        className="text-white px-4 pt-10 pb-3.5 shadow-md flex items-center justify-between sticky top-0 z-30 shrink-0 border-b border-white/10"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white p-1 border border-white/20 shadow-inner flex items-center justify-center overflow-hidden">
            <img
              src={config.logoUrl || nsLogo}
              alt="NS Logo"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.currentTarget;
                if (target.src !== '/NSLOGO1.jpeg') {
                  target.src = '/NSLOGO1.jpeg';
                }
              }}
            />
          </div>
          <div>
            <h3 className="font-bold text-sm leading-tight text-white tracking-wide">
              {config.appName || 'NS'}
            </h3>
            <span className="text-[11px] text-white/80 font-normal block">
              Electrical Management
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Button */}
          <button
            onClick={() => setShowSearchModal(true)}
            title="Search DTRs"
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Profile Circle with Popup Menu */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400/40 via-teal-400/40 to-blue-400/40 hover:brightness-110 border border-amber-300/40 flex items-center justify-center text-white font-bold text-xs shadow-xs transition active:scale-95 cursor-pointer"
            >
              {userInitials}
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className={`absolute right-0 top-12 w-48 rounded-2xl shadow-2xl border py-1.5 z-50 animate-in fade-in zoom-in-95 ${
                isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
              }`}>
                <div className={`px-3 py-2 border-b mb-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <p className="text-xs font-bold capitalize">{userName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{savedEmail}</p>
                </div>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenSettings) onOpenSettings();
                    else showToast('Opening Settings...');
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 transition cursor-pointer ${
                    isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    if (onOpenReports) onOpenReports();
                    else showToast('Opening Reports...');
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-medium flex items-center gap-2.5 transition cursor-pointer ${
                    isDark ? 'text-slate-200 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <BarChart2 className="w-4 h-4 text-amber-400" />
                  <span>Reports &amp; Analytics</span>
                </button>
                <div className={`border-t my-1 ${isDark ? 'border-slate-800' : 'border-slate-100'}`} />
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowLogoutModal(true);
                  }}
                  className={`w-full px-3 py-2 text-left text-xs font-semibold text-rose-500 flex items-center gap-2.5 transition cursor-pointer ${
                    isDark ? 'hover:bg-rose-950/40' : 'hover:bg-rose-50'
                  }`}
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Scrollable Content */}
      <div
        onClick={() => {
          if (showProfileMenu) setShowProfileMenu(false);
        }}
        className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 scroll-smooth"
      >
        {/* 2. Modern Welcome Card */}
        <div className={`rounded-3xl p-5 border shadow-sm relative overflow-hidden transition-colors ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80'
        }`}>
          <div className="flex items-center gap-3.5 mb-4">
            <div
              style={{
                background: `linear-gradient(to bottom right, ${activeTheme.gradient.middle}, ${activeTheme.primary})`,
              }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md shrink-0"
            >
              <GreetingIcon className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold">{greeting}</p>
              <h2 className="text-xl font-bold tracking-tight capitalize text-slate-900 dark:text-white">
                {userName}
              </h2>
            </div>
          </div>

          {/* Location & Real-time Clock pill */}
          <div className={`border rounded-xl px-3 py-2 flex items-center gap-2 text-xs ${
            isDark ? 'bg-slate-800/80 border-slate-700/60 text-slate-300' : 'bg-teal-50/80 border-teal-200/80 text-slate-800'
          }`}>
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <span className="font-semibold truncate flex-1">{locationName}</span>
            <span className="w-1 h-1 rounded-full bg-teal-500 shrink-0" />
            <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
            <span className="font-mono text-[11px] shrink-0 text-slate-700 font-semibold">
              {currentTime.split(',')[0] || '10:30 AM'}
            </span>
          </div>
        </div>

        {/* 3. Quick Actions Row */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 tracking-wide mb-2.5 uppercase">
            Quick Actions
          </h4>
          <div className="grid grid-cols-3 gap-2.5">
            {/* New DTR */}
            <button
              onClick={() => {
                if (onOpenNewDtr) onOpenNewDtr();
                else handleOpenAddModal();
              }}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-teal-300 transition flex flex-col items-center justify-center gap-2 text-center group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center group-hover:bg-[#00A896] group-hover:text-white transition">
                <Plus className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">New DTR</span>
            </button>

            {/* Reports */}
            <button
              onClick={() => {
                if (onOpenReports) onOpenReports();
                else showToast('Opening Electrical Reports & Analytics');
              }}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-amber-300 transition flex flex-col items-center justify-center gap-2 text-center group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition">
                <BarChart2 className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Reports</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => {
                if (onOpenSettings) onOpenSettings();
                else showToast('Opening Application Settings');
              }}
              className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition flex flex-col items-center justify-center gap-2 text-center group cursor-pointer active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-[#0B2D52] flex items-center justify-center group-hover:bg-[#0B2D52] group-hover:text-white transition">
                <Settings className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Settings</span>
            </button>
          </div>
        </div>

        {/* 4. Section Header with record count */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs">
              <List className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">Your DTRs</h3>
              <p className="text-[11px] text-slate-600 font-medium">
                {filteredDtrs.length === 0
                  ? 'No records found'
                  : `${filteredDtrs.length} ${filteredDtrs.length === 1 ? 'record' : 'records'} available`}
              </p>
            </div>
          </div>

          {filteredDtrs.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
              <span>{filteredDtrs.length}</span>
            </div>
          )}
        </div>

        {/* Active Search Filter Badge */}
        {searchText && (
          <div className="bg-teal-100/70 border border-teal-200 rounded-xl p-2 px-3 flex items-center justify-between text-xs text-teal-900">
            <span>
              Searching: <strong className="font-bold">"{searchText}"</strong>
            </span>
            <button
              onClick={() => setSearchText('')}
              className="text-teal-700 hover:text-teal-900 font-bold p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* 5. DTR Cards List */}
        {filteredDtrs.length === 0 ? (
          /* Empty State Widget */
          <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-sm space-y-3 mt-4">
            <div className="w-16 h-16 rounded-2xl bg-teal-50 text-[#00A896] flex items-center justify-center mx-auto">
              <Zap className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">
              {searchText ? 'No Results Found' : 'No DTRs Yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              {searchText
                ? 'Try adjusting your search terms or clearing the filter.'
                : 'Create your first DTR to get started with electrical management.'}
            </p>
            {searchText ? (
              <button
                onClick={() => setSearchText('')}
                className="mt-2 px-4 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold text-xs transition"
              >
                Clear Search
              </button>
            ) : (
              <button
                onClick={handleOpenAddModal}
                className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#0B2D52] to-[#00A896] hover:opacity-95 text-white font-bold text-xs shadow-md transition"
              >
                + Create First DTR
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDtrs.map((dtr) => {
              const isDeleting = deletingDtrId === dtr.id;

              return (
                <div
                  key={dtr.id}
                  onClick={() => {
                    if (onOpenPoleSchedule) {
                      onOpenPoleSchedule(dtr);
                    }
                  }}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    setSelectedDtrForMenu(dtr);
                  }}
                  className={`bg-white dark:bg-slate-900 rounded-2xl border transition-all duration-200 overflow-hidden relative select-none cursor-pointer border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md hover:border-teal-300 dark:hover:border-teal-700 ${
                    isDeleting ? 'opacity-0 scale-90 translate-y-2 duration-500' : 'opacity-100 scale-100'
                  }`}
                >
                  {/* Top Card Header */}
                  <div className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* DTR Transformer Icon Box */}
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-md shrink-0 transition-transform overflow-hidden bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white shadow-[#00A896]/20">
                        <TransformerIcon className="w-7 h-7 text-cyan-200" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight tracking-tight truncate">
                            {dtr.dtrCode}
                          </h4>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate max-w-[170px]">
                            {dtr.village}, {dtr.location}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setSelectedDtrForMenu(dtr);
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
                        onPointerUp={(e) => e.stopPropagation()}
                        onTouchStart={(e) => e.stopPropagation()}
                        onTouchEnd={(e) => e.stopPropagation()}
                        title="DTR Options Menu"
                        className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-teal-100 dark:hover:bg-teal-900/60 text-slate-600 dark:text-slate-300 hover:text-teal-900 dark:hover:text-teal-200 flex items-center justify-center transition cursor-pointer active:scale-90 border border-transparent hover:border-teal-200 dark:hover:border-teal-700"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      <div className="w-7 h-7 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-[#00A896] dark:text-teal-400 flex items-center justify-center">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* 3-Column Stats Row */}
                  <div className="border-t border-slate-100 grid grid-cols-3 py-2.5 px-2 text-center bg-slate-50/70">
                    <div className="flex flex-col items-center justify-center border-r border-slate-200/80 px-1">
                      <div className="flex items-center gap-1 text-amber-700 mb-0.5">
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span className="text-xs font-bold text-slate-900">
                          {dtr.capacity} kVA
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">Capacity</span>
                    </div>

                    <div className="flex flex-col items-center justify-center border-r border-slate-200/80 px-1">
                      <div className="flex items-center gap-1 text-teal-800 mb-0.5">
                        <Ticket className="w-3.5 h-3.5 text-teal-600" />
                        <span className="text-xs font-bold text-slate-900">{dtr.ccc}</span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">CCC Code</span>
                    </div>

                    <div className="flex flex-col items-center justify-center px-1">
                      <div className="flex items-center gap-1 text-emerald-700 mb-0.5">
                        <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-xs font-bold text-slate-900">
                          {dtr.routeLength} m
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-600 font-bold">Route</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating Action Button (+ Add DTR) */}
      <div className="absolute bottom-20 right-5 z-30">
        <button
          type="button"
          onClick={() => {
            if (onOpenNewDtr) onOpenNewDtr();
            else handleOpenAddModal();
          }}
          title="Add New DTR Record"
          className="h-13 px-5 rounded-2xl bg-gradient-to-r from-[#00A896] via-[#028090] to-[#0B2D52] hover:brightness-110 active:scale-95 text-white font-extrabold text-sm shadow-[0_10px_28px_rgba(0,168,150,0.45)] border-2 border-white/30 flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer whitespace-nowrap select-none"
        >
          <Plus className="w-5 h-5 text-white stroke-[2.8] shrink-0 drop-shadow-xs" />
          <span className="text-sm font-black text-white tracking-wide leading-none drop-shadow-xs">Add DTR</span>
        </button>
      </div>

      {/* ----------------- MODALS & DIALOGS ----------------- */}

      {/* 1. Search Modal Dialog (with Speech to Text simulation) */}
      {showSearchModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Search DTRs</h3>
              <button
                onClick={() => setShowSearchModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                autoFocus
                placeholder="Search by code, village, CCC..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-medium"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={toggleSpeechSearch}
                title="Voice Search"
                className={`absolute right-2.5 top-2.5 p-1 rounded-lg transition ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'text-slate-400 hover:text-blue-600'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
              </button>
            </div>

            {isListening && (
              <div className="flex items-center justify-center gap-2 py-1 text-rose-600 text-xs font-bold animate-pulse">
                <Mic className="w-4 h-4" />
                <span>Listening for speech...</span>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setSearchText('');
                  setShowSearchModal(false);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition"
              >
                Reset
              </button>
              <button
                onClick={() => setShowSearchModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0B2D52] to-[#00A896] text-white hover:opacity-95 shadow-sm transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. DTR Actions Bottom Sheet (matching Flutter _showModernDtrOptions) */}
      {/* 2. DTR 3-Dot Options Bottom Sheet Menu */}
      {selectedDtrForMenu && (
        <div
          onClick={() => setSelectedDtrForMenu(null)}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`rounded-t-3xl p-5 shadow-2xl space-y-4 border-t ${
              isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto" />

            {/* DTR Info Header */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
              isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-teal-50/70 border-teal-100'
            }`}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-md shrink-0 border border-teal-500/30">
                  <TransformerIcon className="w-6 h-6 text-cyan-200" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
                    {selectedDtrForMenu.dtrCode}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium">
                    {selectedDtrForMenu.village}, {selectedDtrForMenu.location}
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-lg bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold text-xs shrink-0 font-mono">
                {selectedDtrForMenu.capacity} kVA
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenPoleSchedule) {
                    onOpenPoleSchedule(selectedDtrForMenu);
                  }
                  setSelectedDtrForMenu(null);
                }}
                className="w-full p-3 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 hover:bg-teal-100/80 dark:hover:bg-teal-900/50 border border-teal-200/80 dark:border-teal-800/80 flex items-center justify-between text-left transition cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#00A896] text-white flex items-center justify-center shadow-xs">
                    <List className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-teal-950 dark:text-teal-200 block">
                      Pole Schedule &amp; Inventory
                    </span>
                    <span className="text-[10px] text-teal-700/80 dark:text-teal-400 font-medium">
                      View 24-col schedule, dismantle &amp; CSV export
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-teal-500" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onOpenAddPole) {
                    onOpenAddPole(selectedDtrForMenu);
                  }
                  setSelectedDtrForMenu(null);
                }}
                className="w-full p-3 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/80 flex items-center justify-between text-left transition cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 block">
                      Add New Pole
                    </span>
                    <span className="text-[10px] text-emerald-600/80 dark:text-emerald-400 font-medium">
                      Record new GPS survey waypoint &amp; clamps
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  if (onEditDtr) {
                    onEditDtr(selectedDtrForMenu);
                    setSelectedDtrForMenu(null);
                  } else {
                    handleOpenEditModal(selectedDtrForMenu);
                  }
                }}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 flex items-center justify-between text-left transition cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-xs">
                    <Edit3 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      Edit DTR Passport
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                      Modify details, location, feeder &amp; capacity
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setDtrToDelete(selectedDtrForMenu);
                  setSelectedDtrForMenu(null);
                }}
                className="w-full p-3 rounded-2xl bg-rose-50/80 dark:bg-rose-950/40 hover:bg-rose-100/80 dark:hover:bg-rose-900/50 border border-rose-200/80 dark:border-rose-800/80 flex items-center justify-between text-left transition cursor-pointer shadow-2xs active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shadow-xs">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-rose-700 dark:text-rose-300 block">
                      Delete DTR &amp; Route
                    </span>
                    <span className="text-[10px] text-rose-500 dark:text-rose-400 font-medium">
                      Permanently remove transformer record
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </button>

              <button
                type="button"
                onClick={() => setSelectedDtrForMenu(null)}
                className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-center text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog */}
      {dtrToDelete && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Delete DTR</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete DTR <strong>{dtrToDelete.dtrCode}</strong>? This
                action cannot be undone.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDtrToDelete(null)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Logout Confirmation Dialog */}
      {showLogoutModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-4 border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Logout</h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to log out of your NS Control session?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false);
                  localStorage.removeItem('ns_persisted_session');
                  onLogout();
                }}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add / Edit DTR Modal */}
      {showAddEditModal && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <form
            onSubmit={handleSaveDtr}
            className="bg-white w-full max-w-xs rounded-3xl p-5 shadow-2xl space-y-3.5 border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingDtr ? 'Edit DTR' : 'New DTR Transformer'}
              </h3>
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  DTR Code
                </label>
                <input
                  type="text"
                  required
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  placeholder="e.g. DTR-WB-7405"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Village / Town
                  </label>
                  <input
                    type="text"
                    required
                    value={formVillage}
                    onChange={(e) => setFormVillage(e.target.value)}
                    placeholder="e.g. Baruipur"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Capacity (kVA)
                  </label>
                  <select
                    value={formCapacity}
                    onChange={(e) => setFormCapacity(e.target.value)}
                    className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00A896] font-semibold"
                  >
                    <option value="25">25 kVA</option>
                    <option value="63">63 kVA</option>
                    <option value="100">100 kVA</option>
                    <option value="160">160 kVA</option>
                    <option value="250">250 kVA</option>
                    <option value="500">500 kVA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  Location / Feeder Point
                </label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={(e) => setFormLocation(e.target.value)}
                  placeholder="e.g. Industrial Substation Line 4"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                  CCC Code
                </label>
                <input
                  type="text"
                  value={formCcc}
                  onChange={(e) => setFormCcc(e.target.value)}
                  placeholder="e.g. CCC-492"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddEditModal(false)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-[#0B2D52] to-[#00A896] hover:opacity-95 text-white shadow-md cursor-pointer"
              >
                {editingDtr ? 'Update DTR' : 'Add DTR'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
