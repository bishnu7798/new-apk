import React, { useState, useEffect } from 'react';
import nsLogo from '../assets/images/NSLOGO1.jpeg';
import { TransformerIcon, DTRHeroLogo } from './TransformerIcon';
import {
  ArrowLeft,
  QrCode,
  RotateCw,
  Bolt,
  Building2,
  GitFork,
  Landmark,
  Users,
  MapPin,
  Map,
  Trees,
  FileText,
  Hash,
  Calendar,
  Award,
  Zap,
  Power,
  Save,
  PlusCircle,
  History,
  CheckCircle2,
  Trash2,
  Sparkles,
  Edit3,
  Sliders,
  CloudCheck,
  RefreshCw,
} from 'lucide-react';
import { SplashConfig } from '../types';
import { saveOrUpdateDTR, auth } from '../lib/firebase';

const STANDARD_CAPACITIES = [
  '10',
  '16',
  '25',
  '63',
  '100',
  '160',
  '200',
  '250',
  '315',
  '400',
  '500',
  '630',
  '750',
  '1000',
  '1250',
  '1600',
];

interface DTRScreenPreviewProps {
  config: SplashConfig;
  dtrToEdit?: any;
  onBack: () => void;
  onSaved: (dtr: any) => void;
}

export const DTRScreenPreview: React.FC<DTRScreenPreviewProps> = ({
  config,
  dtrToEdit,
  onBack,
  onSaved,
}) => {
  const isEditing = Boolean(dtrToEdit);

  // Form State
  const [dtrCode, setDtrCode] = useState(dtrToEdit?.dtrCode || '');
  const [capacity, setCapacity] = useState(dtrToEdit?.capacity?.toString() || '100');
  const [isManualCapacity, setIsManualCapacity] = useState<boolean>(() => {
    const initCap = dtrToEdit?.capacity?.toString() || '';
    return Boolean(initCap && !STANDARD_CAPACITIES.includes(initCap));
  });
  const [division, setDivision] = useState(dtrToEdit?.division || 'RAIGANJ');
  const [block, setBlock] = useState(dtrToEdit?.block || '');
  const [ccc, setCcc] = useState(dtrToEdit?.ccc || '');
  const [gp, setGp] = useState(dtrToEdit?.gp || '');
  const [village, setVillage] = useState(dtrToEdit?.village || '');
  const [location, setLocation] = useState(dtrToEdit?.location || '');
  const [landMarks, setLandMarks] = useState(dtrToEdit?.landMarks || '');
  const [drgNo, setDrgNo] = useState(dtrToEdit?.drgNo || '');
  const [censusCode, setCensusCode] = useState(dtrToEdit?.censusCode || '');
  const [docDate, setDocDate] = useState(dtrToEdit?.docDate || '');
  const [jmcNo, setJmcNo] = useState(dtrToEdit?.jmcNo || '');
  const [feeder, setFeeder] = useState(dtrToEdit?.feeder || '');
  const [substation, setSubstation] = useState(dtrToEdit?.substation || '');

  // Synchronize state if dtrToEdit changes
  useEffect(() => {
    if (dtrToEdit) {
      setDtrCode(dtrToEdit.dtrCode || '');
      setCapacity(dtrToEdit.capacity?.toString() || '100');
      const capStr = dtrToEdit.capacity?.toString() || '';
      setIsManualCapacity(Boolean(capStr && !STANDARD_CAPACITIES.includes(capStr)));
      setDivision(dtrToEdit.division || 'RAIGANJ');
      setBlock(dtrToEdit.block || '');
      setCcc(dtrToEdit.ccc || '');
      setGp(dtrToEdit.gp || '');
      setVillage(dtrToEdit.village || '');
      setLocation(dtrToEdit.location || '');
      setLandMarks(dtrToEdit.landMarks || '');
      setDrgNo(dtrToEdit.drgNo || '');
      setCensusCode(dtrToEdit.censusCode || '');
      setDocDate(dtrToEdit.docDate || '');
      setJmcNo(dtrToEdit.jmcNo || '');
      setFeeder(dtrToEdit.feeder || '');
      setSubstation(dtrToEdit.substation || '');
    }
  }, [dtrToEdit]);

  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Recent DTRs
  const [recentDTRs, setRecentDTRs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recent_dtr_codes');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return ['DTR-WB-7401', 'DTR-WB-7402', 'DTR-WB-7403', 'DTR-WB-7404'];
  });

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Auto-fill CCC with Block value
  const handleBlockChange = (val: string) => {
    setBlock(val);
    if (!ccc || ccc === block) {
      setCcc(val);
    }
  };

  // Check local database for DTR code
  const handleCheckCode = (code: string) => {
    if (!code) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Demo autofill for existing codes
      if (code === 'DTR-WB-7401') {
        setCapacity('100');
        setIsManualCapacity(false);
        setVillage('Kalyanpur');
        setLocation('Near Primary School');
        setLandMarks('Near Banyan Tree');
        setCcc('Raiganj-I');
        setBlock('Raiganj-I');
        setFeeder('11kV Town Feeder');
        setSubstation('33/11kV Raiganj Substation');
        setDrgNo('DRG-2024-001');
        setDocDate('15-08-2024');
        setJmcNo('JMC-9874');
        setGp('Kalyanpur GP');
        setCensusCode('314201');
        showToast('DTR found locally 😊');
      } else if (code === 'DTR-WB-7402') {
        setCapacity('63');
        setIsManualCapacity(false);
        setVillage('Sonarpur');
        setLocation('Market Feeder Junction');
        setLandMarks('Near Kali Temple');
        setCcc('Raiganj-II');
        setBlock('Raiganj-II');
        setFeeder('11kV Bazaar Feeder');
        setSubstation('33/11kV Sonarpur Substation');
        setDrgNo('DRG-2024-002');
        setDocDate('18-08-2024');
        setJmcNo('JMC-9875');
        setGp('Sonarpur GP');
        setCensusCode('314202');
        showToast('DTR found locally 😊');
      } else if (code === 'DTR-WB-7403') {
        setCapacity('250');
        setIsManualCapacity(false);
        setVillage('Hemtabad');
        setLocation('Industrial Area Phase 2');
        setLandMarks('Opposite Rice Mill');
        setCcc('Hemtabad');
        setBlock('Hemtabad');
        setFeeder('11kV Industrial Feeder');
        setSubstation('33/11kV Hemtabad Substation');
        setDrgNo('DRG-2024-003');
        setDocDate('20-08-2024');
        setJmcNo('JMC-9876');
        setGp('Hemtabad GP');
        setCensusCode('314203');
        showToast('DTR found locally 😊');
      } else if (code === 'DTR-WB-7404') {
        setCapacity('75');
        setIsManualCapacity(true);
        setVillage('Kaliyaganj');
        setLocation('Sub-Urban Grid Sector 3');
        setLandMarks('Beside Canal Bridge');
        setCcc('Kaliyaganj');
        setBlock('Kaliyaganj');
        setFeeder('11kV Agrarian Feeder');
        setSubstation('33/11kV Kaliyaganj Substation');
        setDrgNo('DRG-2024-004');
        setDocDate('22-08-2024');
        setJmcNo('JMC-9877');
        setGp('Kaliyaganj GP');
        setCensusCode('314204');
        showToast('DTR found (75 kVA Manual Rating) 😊');
      } else {
        showToast('Ready for new survey');
      }
    }, 400);
  };

  // Handle Save with Real-Time Persistence
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dtrCode || !village) {
      showToast('Please enter DTR Code and Village (*)');
      return;
    }

    setIsLoading(true);

    const newRecent = Array.from(new Set([dtrCode, ...recentDTRs])).slice(0, 8);
    setRecentDTRs(newRecent);
    try {
      localStorage.setItem('recent_dtr_codes', JSON.stringify(newRecent));
    } catch (_) {}

    const savedDtr = {
      id: dtrToEdit?.id || `dtr-${Date.now()}`,
      dtrCode: dtrCode.trim(),
      capacity: Number(capacity) || 100,
      village: village.trim(),
      location: (location || 'Main Grid Sector').trim(),
      landMarks: landMarks.trim(),
      ccc: ccc.trim() || 'N/A',
      feeder: feeder.trim() || '11kV Feeder',
      substation: substation.trim() || 'Main Substation',
      drgNo: drgNo.trim(),
      docDate: docDate.trim() || '15-08-2024',
      jmcNo: jmcNo.trim(),
      gp: gp.trim(),
      censusCode: censusCode.trim(),
      block: block.trim() || 'RAIGANJ',
      division: division.trim() || 'RAIGANJ',
      routeLength: dtrToEdit?.routeLength || Math.floor(500 + Math.random() * 800),
      user: auth.currentUser?.email || 'operator@ns-power.com',
    };

    // Instant Real-Time Persistence to LocalStorage & Firestore
    try {
      const persisted = await saveOrUpdateDTR(savedDtr, auth.currentUser?.uid);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        onSaved(persisted || savedDtr);
      }, 1000);
    } catch (err) {
      console.error('Error saving DTR record:', err);
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => {
        onSaved(savedDtr);
      }, 1000);
    }
  };

  const handleClearRecent = () => {
    setRecentDTRs([]);
    localStorage.removeItem('recent_dtr_codes');
    showToast('Recent DTRs cleared');
  };

  const handleFieldKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allInputs = Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLSelectElement>(
          '#dtr-form input:not([type="hidden"]):not([disabled]):not([readonly]), #dtr-form select:not([disabled]):not([readonly])'
        )
      );
      const currentIndex = allInputs.indexOf(e.currentTarget);
      if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
      }
    }
  };

  return (
    <div className="w-full h-full bg-[#F8FAFF] flex flex-col font-sans overflow-hidden select-none relative">
      {/* Toast Notification */}
      {notification && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-xl border border-slate-700/60 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Modern Gradient App Bar */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0B2D52] to-[#044343] px-4 pt-10 pb-4 text-white shadow-lg flex items-center justify-between z-10 shrink-0 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-xs flex items-center justify-center transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs">
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
              <h1 className="font-extrabold text-sm tracking-tight leading-tight">
                {isEditing ? 'Edit DTR' : 'New DTR'}
              </h1>
              <p className="text-[10px] text-teal-300/85 font-medium">
                {isEditing ? 'Modify Transformer Data' : 'Survey & Register Transformer'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setDtrCode('');
            setCapacity('');
            setIsManualCapacity(false);
            setVillage('');
            setLocation('');
            setLandMarks('');
            setCcc('');
            setFeeder('');
            setSubstation('');
            setDrgNo('');
            setDocDate('');
            setJmcNo('');
            setGp('');
            setCensusCode('');
            setBlock('');
            showToast('Form Reset');
          }}
          title="Reset Form"
          className="w-9 h-9 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 backdrop-blur-xs flex items-center justify-center transition active:scale-95 cursor-pointer"
        >
          <RotateCw className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Main Scrollable Content */}
      <div id="dtr-form" className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth">
        {/* Modern Hero Header with Electrical Distribution Transformer Logo */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-md shadow-[#00A896]/5 flex items-center gap-4">
          <DTRHeroLogo className="w-14 h-14" />

          <div>
            <span className="inline-block bg-gradient-to-r from-[#0B2D52] to-[#00A896] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider mb-1 shadow-xs">
              DTR Management
            </span>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {isEditing ? 'Edit Transformer' : 'New Transformer'}
            </h2>
            <p className="text-xs text-slate-500">
              {isEditing ? 'Update distribution transformer details' : 'Enter distribution transformer details'}
            </p>
          </div>
        </div>

        {/* Recent DTRs Section */}
        {recentDTRs.length > 0 && !isEditing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs">
                  <History className="w-3.5 h-3.5 text-amber-300" />
                </div>
                <span className="text-xs font-bold text-slate-900">Recent &amp; Demo DTRs</span>
              </div>
              <button
                onClick={handleClearRecent}
                className="text-[11px] font-semibold text-rose-500 hover:text-rose-600 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-wrap gap-2">
              {recentDTRs.map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => {
                    setDtrCode(code);
                    handleCheckCode(code);
                  }}
                  className="bg-gradient-to-r from-[#0B2D52] to-[#00A896] hover:opacity-90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                >
                  <Zap className="w-3 h-3 text-amber-300" />
                  <span>{code}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 1. Primary Information Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50/50 p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs">
              <QrCode className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Primary Information</h4>
              <p className="text-[11px] text-slate-500">Key identification and capacity specifications</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {/* DTR Code */}
            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <QrCode className="w-3 h-3 text-[#00A896]" />
                <span>DTR Code *</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="e.g., DTR-WB-7401"
                  value={dtrCode}
                  onChange={(e) => setDtrCode(e.target.value.toUpperCase())}
                  onKeyDown={handleFieldKeyDown}
                  className="flex-1 px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 tracking-wide uppercase focus:outline-none focus:border-[#00A896]"
                />
                <button
                  type="button"
                  onClick={() => handleCheckCode(dtrCode)}
                  disabled={isLoading}
                  title="Check Code"
                  className="px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-[#0B2D52] to-[#00A896] text-white font-bold text-xs flex items-center gap-1 shadow-md shadow-[#00A896]/20 active:scale-95 transition cursor-pointer"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Sync</span>
                </button>
              </div>
            </div>

            {/* Capacity & Division */}
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Capacity (kVA) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                      <Bolt className="w-3 h-3 text-amber-500" />
                      <span>Capacity (kVA) *</span>
                    </label>
                    
                    {/* Mode Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setIsManualCapacity(!isManualCapacity)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all flex items-center gap-1 cursor-pointer ${
                        isManualCapacity
                          ? 'bg-amber-50 text-amber-700 border-amber-300 hover:bg-amber-100'
                          : 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100'
                      }`}
                      title={isManualCapacity ? 'Switch to standard ratings dropdown' : 'Switch to manual kVA typing'}
                    >
                      {isManualCapacity ? (
                        <>
                          <Sliders className="w-2.5 h-2.5" />
                          <span>Use Presets</span>
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-2.5 h-2.5" />
                          <span>Manual Entry</span>
                        </>
                      )}
                    </button>
                  </div>

                  {!isManualCapacity ? (
                    <div className="relative">
                      <select
                        value={capacity}
                        onChange={(e) => {
                          if (e.target.value === '__manual__') {
                            setIsManualCapacity(true);
                          } else {
                            setCapacity(e.target.value);
                          }
                        }}
                        onKeyDown={handleFieldKeyDown}
                        className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00A896] transition"
                      >
                        <option value="">Select standard kVA</option>
                        {STANDARD_CAPACITIES.map((k) => (
                          <option key={k} value={k}>
                            {k} kVA
                          </option>
                        ))}
                        <option value="__manual__">
                          ✏️ Custom / Manual Entry...
                        </option>
                      </select>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="relative flex items-center">
                        <input
                          type="number"
                          step="any"
                          min="1"
                          placeholder="Type custom kVA (e.g., 75, 125, 750)"
                          value={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                          onKeyDown={handleFieldKeyDown}
                          autoFocus
                          className="w-full pl-3.5 pr-14 py-2.5 bg-[#F8FAFC] border-2 border-amber-400/80 rounded-2xl text-xs font-extrabold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:border-amber-500 transition shadow-xs"
                        />
                        <span className="absolute right-3 text-[11px] font-extrabold text-amber-600 bg-amber-100/80 px-1.5 py-0.5 rounded-md pointer-events-none">
                          kVA
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Division */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-teal-600" />
                      <span>Division</span>
                    </label>
                  </div>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder="e.g., RAIGANJ"
                    className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">Operational electrical division</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Grid & Substation Information */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50/50 p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#044343] text-white flex items-center justify-center shadow-xs">
              <GitFork className="w-4 h-4 text-cyan-300" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Grid Network Info</h4>
              <p className="text-[11px] text-slate-500">Source feeder and substation association</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <GitFork className="w-3 h-3 text-teal-600" />
                <span>11kV Feeder Name</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 11kV Hospital Feeder"
                value={feeder}
                onChange={(e) => setFeeder(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <Power className="w-3 h-3 text-[#0B2D52]" />
                <span>Source Substation (33/11kV)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., 33/11kV Raiganj Town Substation"
                value={substation}
                onChange={(e) => setSubstation(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>
        </div>

        {/* 3. Administrative Hierarchy Section */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50/50 p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#044343] to-[#00A896] text-white flex items-center justify-center shadow-xs">
              <Landmark className="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Administrative Hierarchy</h4>
              <p className="text-[11px] text-slate-500">Jurisdiction and local governance boundaries</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-teal-600" />
                  <span>Block</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., Raiganj-I"
                  value={block}
                  onChange={(e) => handleBlockChange(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Landmark className="w-3 h-3 text-cyan-600" />
                  <span>Customer Care Center (CCC)</span>
                </label>
                <input
                  type="text"
                  placeholder="Auto-synced with block"
                  value={ccc}
                  onChange={(e) => setCcc(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-teal-600" />
                <span>Gram Panchayat (GP)</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Bahin Gram Panchayat"
                value={gp}
                onChange={(e) => setGp(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>
        </div>

        {/* 4. Geographic & Location Details */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-amber-50/50 p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white flex items-center justify-center shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Geographic Details</h4>
              <p className="text-[11px] text-slate-500">Physical site, landmark and village information</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <Map className="w-3 h-3 text-amber-600" />
                <span>Village / Town *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Bahin Uttar Para"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-bold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Exact Location / Street *</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Near Uttar Para Community Hall"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                <Trees className="w-3 h-3 text-amber-600" />
                <span>Landmarks &amp; Notes</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Behind Old Shiva Mandir, near Banyan Tree"
                value={landMarks}
                onChange={(e) => setLandMarks(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>
        </div>

        {/* 5. Technical & Compliance Records */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-teal-50/50 p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#044343] text-white flex items-center justify-center shadow-xs">
              <FileText className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Technical &amp; Statutory Records</h4>
              <p className="text-[11px] text-slate-500">Commissioning date, drawing and census codes</p>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#00A896]" />
                  <span>Drawing No. (DRG No)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., WBSEDCL/DRG/2024/74"
                  value={drgNo}
                  onChange={(e) => setDrgNo(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Hash className="w-3 h-3 text-[#00A896]" />
                  <span>Census Code</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 314201"
                  value={censusCode}
                  onChange={(e) => setCensusCode(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#00A896]" />
                  <span>DOC Date (Commissioning)</span>
                </label>
                <input
                  type="text"
                  placeholder="DD-MM-YYYY"
                  value={docDate}
                  onChange={(e) => setDocDate(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-900 mb-1 flex items-center gap-1">
                  <Award className="w-3 h-3 text-amber-500" />
                  <span>JMC Number</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., JMC-8871"
                  value={jmcNo}
                  onChange={(e) => setJmcNo(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button: Save / Update */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0B2D52] via-[#0D4B75] to-[#00A896] hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-[#00A896]/25 active:scale-98 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Update DTR Record' : 'Create DTR Record'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Success Animation Dialog */}
      {showSuccess && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 text-center shadow-2xl space-y-3 max-w-xs w-full animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-extrabold text-lg text-slate-900">
              {isEditing ? 'DTR Updated!' : 'DTR Created!'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEditing
                ? 'Transformer details updated successfully.'
                : 'New transformer record has been registered.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
