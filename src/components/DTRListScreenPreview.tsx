import React, { useState } from 'react';
import { TransformerIcon } from './TransformerIcon';
import {
  ArrowLeft,
  RotateCw,
  Search,
  Zap,
  ListOrdered,
  Package,
  Recycle,
  Table,
  ChevronRight,
  X,
  Hammer,
  MapPin,
  FileText,
  Building,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { SplashConfig } from '../types';

interface DTRListScreenPreviewProps {
  config: SplashConfig;
  onBack: () => void;
  onSelectDtr?: (dtr: any) => void;
  onOpenPoleSchedule?: (dtr: any) => void;
}

// All 50+ table columns exactly from Flutter code
const TABLE_COLUMNS = [
  { key: 'dtrCode', label: 'DTR Code', width: 110 },
  { key: 'village', label: 'Village', width: 120 },
  { key: 'routeLength', label: 'Route Length (Mtr)', width: 130 },
  { key: 'newPole', label: 'New PCC Pole', width: 100 },
  { key: 'staySet', label: 'LT Stay set', width: 100 },
  { key: 'stayClampType1', label: 'LT Stay clamp (Type-I)', width: 140 },
  { key: 'stayClampType2', label: 'LT Stay clamp (Type-II)', width: 140 },
  { key: 'giEarthSpike', label: 'GI Earth Spike', width: 110 },
  { key: 'suspension', label: 'Suspension', width: 100 },
  { key: 'deadEnd', label: 'Dead End', width: 90 },
  { key: 'distributionJunctionBox', label: 'Distribution Junction Box', width: 160 },
  { key: 'eyeHook', label: 'Eye hook', width: 90 },
  { key: 'ltPoleClampType1', label: 'LT pole clamp (Type-I)', width: 150 },
  { key: 'ltPoleClampType2', label: 'LT pole clamp (Type-II)', width: 150 },
  { key: 'ipcForDB50To70', label: 'IPC (ABC) to DB 50-70', width: 150 },
  { key: 'ipcFor16SQMM', label: 'IPC (ABC) for 16', width: 130 },
  { key: 'ipcForAbcToAbc50To70SQMM', label: 'IPC ABC TEE 70', width: 130 },
  { key: 'straightThroughJoint70SQMM', label: 'STJ 70 sq.mm', width: 120 },
  { key: 'straightThroughJoint16SQMM', label: 'STJ 16 sq.mm', width: 120 },
  { key: 'straightThroughJoint50SQMM', label: 'STJ 50 sq.mm', width: 120 },
  { key: 'serviceConnection1ph', label: 'Service Conn (1Ph)', width: 140 },
  { key: 'serviceConnection3ph', label: 'Service Conn (3Ph)', width: 140 },
  { key: 'ltBracket1Ph', label: 'LT BRACKET 1 PH', width: 130 },
  { key: 'ltBracket3Ph', label: 'LT BRACKET 3 PH', width: 130 },
  { key: 'backClamp', label: 'Back Clamp', width: 110 },
  { key: 'dIronClamp', label: 'D IRON CLAMP', width: 120 },
  { key: 'shackleInsulator', label: 'SHACKLE INSULATOR', width: 150 },
  { key: 'ciReel', label: 'CI REEL', width: 90 },
  { key: 'shackleStrap', label: 'SHACKLE STRAP', width: 130 },
  { key: 'boxBracket', label: 'BOX BRACKET', width: 120 },
  { key: 'lc', label: 'L.C', width: 80 },
  { key: 'exStay', label: 'Ex-STAY', width: 90 },
  { key: 'acsr50_2', label: 'ACSR 50 2-wire (Mtr)', width: 150 },
  { key: 'acsr50_3', label: 'ACSR 50 3-wire (Mtr)', width: 150 },
  { key: 'acsr50_4', label: 'ACSR 50 4-wire (Mtr)', width: 150 },
  { key: 'acsr50_5', label: 'ACSR 50 5-wire (Mtr)', width: 150 },
  { key: 'acsr30_2', label: 'ACSR 30 2-wire (Mtr)', width: 150 },
  { key: 'acsr30_3', label: 'ACSR 30 3-wire (Mtr)', width: 150 },
  { key: 'acsr30_4', label: 'ACSR 30 4-wire (Mtr)', width: 150 },
  { key: 'acsr30_5', label: 'ACSR 30 5-wire (Mtr)', width: 150 },
  { key: 'aac50_2', label: 'AAC 50 2-wire (Mtr)', width: 150 },
  { key: 'aac50_3', label: 'AAC 50 3-wire (Mtr)', width: 150 },
  { key: 'aac50_4', label: 'AAC 50 4-wire (Mtr)', width: 150 },
  { key: 'aac50_5', label: 'AAC 50 5-wire (Mtr)', width: 150 },
  { key: 'aac25_2', label: 'AAC 25 2-wire (Mtr)', width: 150 },
  { key: 'aac25_3', label: 'AAC 25 3-wire (Mtr)', width: 150 },
  { key: 'aac25_4', label: 'AAC 25 4-wire (Mtr)', width: 150 },
  { key: 'aac25_5', label: 'AAC 25 5-wire (Mtr)', width: 150 },
  { key: 'acsr20_2', label: 'ACSR 20 2-wire (Mtr)', width: 150 },
  { key: 'acsr20_3', label: 'ACSR 20 3-wire (Mtr)', width: 150 },
  { key: 'acsr20_4', label: 'ACSR 20 4-wire (Mtr)', width: 150 },
  { key: 'acsr20_5', label: 'ACSR 20 5-wire (Mtr)', width: 150 },
];

export const DTRListScreenPreview: React.FC<DTRListScreenPreviewProps> = ({
  config,
  onBack,
  onSelectDtr,
  onOpenPoleSchedule,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDtrForDetails, setSelectedDtrForDetails] = useState<any | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic DTRs with materials data
  const [dtrs, setDtrs] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ns_dtrs_data');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'dtr-1',
        dtrCode: 'DTR-WB-7401',
        village: 'Sonarpur',
        location: 'North Feeder Grid #4',
        landMarks: 'Near Primary Health Center',
        block: 'BLOCK 1',
        division: 'RAIGANJ',
        capacity: 100,
        feeder: '11kV Sonarpur Feeder',
        substation: 'Sonarpur 33/11kV Substation',
        drgNo: 'RNJ01',
        docDate: '12-04-2024',
        jmcNo: 'JMC-981',
        censusCode: '312450',
        routeLength: 1250,
        newPole: 18,
        staySet: 6,
        stayClampType1: 8,
        stayClampType2: 4,
        giEarthSpike: 18,
        suspension: 12,
        deadEnd: 6,
        distributionJunctionBox: 4,
        eyeHook: 18,
        ltPoleClampType1: 18,
        ltPoleClampType2: 12,
        ipcForDB50To70: 8,
        ipcFor16SQMM: 24,
        ipcForAbcToAbc50To70SQMM: 4,
        straightThroughJoint70SQMM: 2,
        straightThroughJoint16SQMM: 6,
        straightThroughJoint50SQMM: 2,
        serviceConnection1ph: 35,
        serviceConnection3ph: 8,
        ltBracket1Ph: 14,
        ltBracket3Ph: 6,
        backClamp: 10,
        dIronClamp: 8,
        shackleInsulator: 16,
        ciReel: 12,
        shackleStrap: 16,
        boxBracket: 4,
        lc: 2,
        exStay: 2,
        acsr50_3: 650,
        aac25_3: 600,
      },
      {
        id: 'dtr-2',
        dtrCode: 'DTR-WB-7402',
        village: 'Baruipur',
        location: 'Industrial Zone Sub-12',
        landMarks: 'Opposite Cold Storage',
        block: 'BLOCK 2',
        division: 'RAIGANJ',
        capacity: 160,
        feeder: '11kV Baruipur Feeder',
        substation: 'Baruipur Central Substation',
        drgNo: 'RNJ02',
        docDate: '20-05-2024',
        jmcNo: 'JMC-982',
        censusCode: '312451',
        routeLength: 940,
        newPole: 14,
        staySet: 4,
        stayClampType1: 6,
        stayClampType2: 2,
        giEarthSpike: 14,
        suspension: 10,
        deadEnd: 4,
        distributionJunctionBox: 3,
        eyeHook: 14,
        ltPoleClampType1: 14,
        ltPoleClampType2: 8,
        ipcForDB50To70: 6,
        ipcFor16SQMM: 18,
        ipcForAbcToAbc50To70SQMM: 2,
        straightThroughJoint70SQMM: 1,
        straightThroughJoint16SQMM: 4,
        straightThroughJoint50SQMM: 1,
        serviceConnection1ph: 28,
        serviceConnection3ph: 12,
        ltBracket1Ph: 10,
        ltBracket3Ph: 8,
        backClamp: 8,
        dIronClamp: 6,
        shackleInsulator: 12,
        ciReel: 8,
        shackleStrap: 12,
        boxBracket: 3,
        lc: 1,
        exStay: 1,
        acsr50_4: 940,
      },
      {
        id: 'dtr-3',
        dtrCode: 'DTR-WB-7403',
        village: 'Rajpur',
        location: 'East Substation Sector C',
        landMarks: 'Near High School',
        block: 'BLOCK 1',
        division: 'RAIGANJ',
        capacity: 63,
        feeder: '11kV Rajpur Feeder',
        substation: 'Rajpur Substation',
        drgNo: 'RNJ03',
        docDate: '01-06-2024',
        jmcNo: 'JMC-983',
        censusCode: '312452',
        routeLength: 1120,
        newPole: 16,
        staySet: 5,
        stayClampType1: 6,
        stayClampType2: 3,
        giEarthSpike: 16,
        suspension: 11,
        deadEnd: 5,
        distributionJunctionBox: 3,
        eyeHook: 16,
        ltPoleClampType1: 16,
        ltPoleClampType2: 10,
        ipcForDB50To70: 6,
        ipcFor16SQMM: 20,
        ipcForAbcToAbc50To70SQMM: 3,
        straightThroughJoint70SQMM: 2,
        straightThroughJoint16SQMM: 5,
        straightThroughJoint50SQMM: 2,
        serviceConnection1ph: 30,
        serviceConnection3ph: 4,
        ltBracket1Ph: 12,
        ltBracket3Ph: 4,
        backClamp: 8,
        dIronClamp: 6,
        shackleInsulator: 14,
        ciReel: 10,
        shackleStrap: 14,
        boxBracket: 3,
        lc: 2,
        exStay: 2,
        acsr30_3: 1120,
      },
      {
        id: 'dtr-4',
        dtrCode: 'DTR-WB-7404',
        village: 'Garia',
        location: 'South Grid Junction 08',
        landMarks: 'Market Complex',
        block: 'BLOCK 3',
        division: 'RAIGANJ',
        capacity: 250,
        feeder: '11kV Garia Feeder',
        substation: 'Garia Main Substation',
        drgNo: 'RNJ04',
        docDate: '15-06-2024',
        jmcNo: 'JMC-984',
        censusCode: '312453',
        routeLength: 520,
        newPole: 8,
        staySet: 2,
        stayClampType1: 4,
        stayClampType2: 2,
        giEarthSpike: 8,
        suspension: 6,
        deadEnd: 2,
        distributionJunctionBox: 2,
        eyeHook: 8,
        ltPoleClampType1: 8,
        ltPoleClampType2: 6,
        ipcForDB50To70: 4,
        ipcFor16SQMM: 12,
        ipcForAbcToAbc50To70SQMM: 2,
        straightThroughJoint70SQMM: 1,
        straightThroughJoint16SQMM: 2,
        straightThroughJoint50SQMM: 1,
        serviceConnection1ph: 15,
        serviceConnection3ph: 10,
        ltBracket1Ph: 6,
        ltBracket3Ph: 6,
        backClamp: 4,
        dIronClamp: 4,
        shackleInsulator: 8,
        ciReel: 6,
        shackleStrap: 8,
        boxBracket: 2,
        lc: 1,
        exStay: 1,
        aac50_4: 520,
      },
    ];
  });

  // Filtered DTRs
  const filteredDTRs = dtrs.filter((dtr) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      dtr.dtrCode.toLowerCase().includes(query) ||
      dtr.village.toLowerCase().includes(query) ||
      dtr.location.toLowerCase().includes(query)
    );
  });

  // Totals calculations
  const totalDTRs = dtrs.length;
  const totalPoles = dtrs.reduce((sum, d) => sum + (d.newPole || 12), 0);
  const totalMaterials = dtrs.reduce((sum, d) => {
    return (
      sum +
      (d.newPole || 0) +
      (d.staySet || 0) +
      (d.stayClampType1 || 0) +
      (d.stayClampType2 || 0) +
      (d.giEarthSpike || 0) +
      (d.suspension || 0) +
      (d.deadEnd || 0) +
      (d.distributionJunctionBox || 0) +
      (d.eyeHook || 0) +
      (d.ltPoleClampType1 || 0) +
      (d.ltPoleClampType2 || 0) +
      (d.ipcForDB50To70 || 0) +
      (d.ipcFor16SQMM || 0) +
      (d.ipcForAbcToAbc50To70SQMM || 0) +
      (d.straightThroughJoint70SQMM || 0) +
      (d.straightThroughJoint16SQMM || 0) +
      (d.straightThroughJoint50SQMM || 0) +
      (d.serviceConnection1ph || 0) +
      (d.serviceConnection3ph || 0)
    );
  }, 0);

  const totalDismantle = dtrs.reduce((sum, d) => {
    return (
      sum +
      (d.ltBracket1Ph || 0) +
      (d.ltBracket3Ph || 0) +
      (d.backClamp || 0) +
      (d.dIronClamp || 0) +
      (d.shackleInsulator || 0) +
      (d.ciReel || 0) +
      (d.shackleStrap || 0) +
      (d.boxBracket || 0) +
      (d.lc || 0) +
      (d.exStay || 0)
    );
  }, 0);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="w-full h-full bg-[#F8FAFF] flex flex-col font-sans overflow-hidden select-none relative">
      {/* Modern Glassmorphism AppBar */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0B2D52] to-[#044343] text-white px-4 pt-10 pb-3.5 shadow-md flex items-center justify-between sticky top-0 z-30 shrink-0 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <h3 className="font-extrabold text-base leading-tight text-white tracking-tight">
              Reports &amp; Analytics
            </h3>
            <span className="text-[11px] text-teal-300/85 font-medium block">
              {dtrs.length} Transformers
            </span>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition active:scale-95 cursor-pointer"
        >
          <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-20 scroll-smooth">
        {/* Search Bar */}
        <div className="bg-white rounded-2xl p-2 border border-slate-200/80 shadow-md shadow-[#00A896]/5 flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs shrink-0">
            <Search className="w-4 h-4 text-amber-300" />
          </div>
          <input
            type="text"
            placeholder="Search by DTR code, village..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* DTRs */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-md shadow-[#00A896]/20 mb-2">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{totalDTRs}</span>
            <span className="text-[11px] font-semibold text-slate-500">DTRs</span>
          </div>

          {/* Poles */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#044343] to-[#00A896] text-white flex items-center justify-center shadow-md shadow-[#00A896]/20 mb-2">
              <ListOrdered className="w-5 h-5 text-cyan-200" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{totalPoles}</span>
            <span className="text-[11px] font-semibold text-slate-500">Poles</span>
          </div>

          {/* Materials */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#D97706] to-[#F59E0B] text-white flex items-center justify-center shadow-md shadow-amber-500/20 mb-2">
              <Package className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{totalMaterials}</span>
            <span className="text-[11px] font-semibold text-slate-500">Materials</span>
          </div>

          {/* Dismantle */}
          <div className="bg-white rounded-2xl p-3.5 border border-slate-200/80 shadow-sm flex flex-col items-center text-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#0A192F] to-[#0B2D52] text-white flex items-center justify-center shadow-md shadow-slate-900/20 mb-2">
              <Recycle className="w-5 h-5 text-teal-300" />
            </div>
            <span className="text-xl font-extrabold text-slate-900">{totalDismantle}</span>
            <span className="text-[11px] font-semibold text-slate-500">Dismantle</span>
          </div>
        </div>

        {/* Section Table Header */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs">
              <Table className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-sm font-bold text-slate-900">DTR Materials Table</span>
          </div>

          <span className="bg-gradient-to-r from-[#0B2D52] to-[#00A896] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
            {filteredDTRs.length} DTRs
          </span>
        </div>

        {/* Horizontal & Vertical Scrollable Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full text-left border-collapse">
              <thead>
                <tr className="bg-teal-50/70 border-b border-teal-100">
                  {TABLE_COLUMNS.map((col) => (
                    <th
                      key={col.key}
                      style={{ minWidth: col.width }}
                      className="px-3 py-3 text-[11px] font-extrabold text-slate-900 whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredDTRs.map((dtr) => (
                  <tr
                    key={dtr.id}
                    onClick={() => setSelectedDtrForDetails(dtr)}
                    className="hover:bg-teal-50/50 transition cursor-pointer"
                  >
                    {TABLE_COLUMNS.map((col) => {
                      const val = dtr[col.key];
                      const isPrimary = col.key === 'dtrCode' || col.key === 'village';
                      const numVal = typeof val === 'number' ? val : parseFloat(val);
                      const isNonZero = !isNaN(numVal) && numVal > 0;

                      return (
                        <td
                          key={col.key}
                          className="px-3 py-2.5 whitespace-nowrap text-[11px] font-medium text-slate-900"
                        >
                          {isPrimary ? (
                            <span className="font-bold text-[#00A896]">{val || '-'}</span>
                          ) : isNonZero ? (
                            <span className="inline-block bg-teal-50 text-[#044343] font-bold px-2 py-0.5 rounded-md border border-teal-100">
                              {val}
                            </span>
                          ) : (
                            <span className="text-slate-400">{val || '0'}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* DTR Cards Quick Tap View */}
        <div className="space-y-2.5 pt-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Tap Any DTR for Detailed Inventory Sheet
          </h4>
          {filteredDTRs.map((dtr) => (
            <div
              key={dtr.id}
              onClick={() => setSelectedDtrForDetails(dtr)}
              className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs hover:shadow-md transition flex items-center justify-between cursor-pointer active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-xs shrink-0">
                  <TransformerIcon className="w-6 h-6 text-cyan-200" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight">
                    {dtr.dtrCode}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {dtr.village}, {dtr.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#00A896]">{dtr.capacity} kVA</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------- FULL BOTTOM SHEET (DraggableScrollableSheet) ----------------- */}
      {selectedDtrForDetails && (
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs z-50 flex flex-col justify-end animate-in fade-in">
          <div className="bg-[#F8FAFF] rounded-t-3xl max-h-[90%] flex flex-col shadow-2xl border-t border-slate-200 animate-in slide-in-from-bottom">
            {/* Sheet Handle */}
            <div className="w-10 h-1 bg-slate-300 rounded-full mx-auto my-3 shrink-0" />

            {/* Header Row */}
            <div className="px-5 pb-3 flex items-center justify-between border-b border-slate-200 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0B2D52] to-[#00A896] text-white flex items-center justify-center shadow-md">
                  <Zap className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {selectedDtrForDetails.dtrCode}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedDtrForDetails.village}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedDtrForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-300 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Sheet Scrollable Body */}
            <div className="p-4 overflow-y-auto space-y-4">
              {/* Quick Action: Open Pole Schedule */}
              <button
                onClick={() => {
                  const dtrToOpen = selectedDtrForDetails;
                  setSelectedDtrForDetails(null);
                  if (onOpenPoleSchedule) {
                    onOpenPoleSchedule(dtrToOpen);
                  }
                }}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-[#0B2D52] to-[#00A896] hover:opacity-95 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-[#00A896]/20 transition cursor-pointer"
              >
                <Table className="w-4 h-4 text-amber-300" />
                <span>Open Pole Schedule &amp; Dismantle</span>
              </button>

              {/* Summary Cards */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-[#00A896] block">Construction</span>
                  <span className="text-base font-extrabold text-slate-900">124</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-amber-600 block">Dismantle</span>
                  <span className="text-base font-extrabold text-slate-900">46</span>
                </div>
                <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
                  <span className="text-xs font-bold text-[#0B2D52] block">Total Items</span>
                  <span className="text-base font-extrabold text-slate-900">170</span>
                </div>
              </div>

              {/* Construction Materials Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-teal-50/70 p-3 border-b border-teal-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Hammer className="w-4 h-4 text-[#00A896]" />
                    <span className="text-xs font-bold text-slate-900">Construction Materials</span>
                  </div>
                  <span className="bg-[#00A896] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    19 items
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between p-2.5">
                    <span>New PCC Pole</span>
                    <span className="font-bold text-[#00A896]">
                      {selectedDtrForDetails.newPole || 18}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>LT Stay set</span>
                    <span className="font-bold text-[#00A896]">
                      {selectedDtrForDetails.staySet || 6}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>GI Earth Spike</span>
                    <span className="font-bold text-[#00A896]">
                      {selectedDtrForDetails.giEarthSpike || 18}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>Distribution Junction Box</span>
                    <span className="font-bold text-[#00A896]">
                      {selectedDtrForDetails.distributionJunctionBox || 4}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>Service Connection (1Ph)</span>
                    <span className="font-bold text-[#00A896]">
                      {selectedDtrForDetails.serviceConnection1ph || 35}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dismantle Inventory Table */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="bg-amber-50/70 p-3 border-b border-amber-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Recycle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-900">Dismantle Inventory</span>
                  </div>
                  <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    10 items
                  </span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="flex justify-between p-2.5">
                    <span>LT BRACKET 1 PH</span>
                    <span className="font-bold text-amber-600">
                      {selectedDtrForDetails.ltBracket1Ph || 14}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>Shackle Insulator</span>
                    <span className="font-bold text-amber-600">
                      {selectedDtrForDetails.shackleInsulator || 16}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>D Iron Clamp</span>
                    <span className="font-bold text-amber-600">
                      {selectedDtrForDetails.dIronClamp || 8}
                    </span>
                  </div>
                  <div className="flex justify-between p-2.5">
                    <span>CI Reel</span>
                    <span className="font-bold text-amber-600">
                      {selectedDtrForDetails.ciReel || 12}
                    </span>
                  </div>
                </div>
              </div>

              {/* Location & Technical Breakdown */}
              <div className="bg-white rounded-2xl p-3.5 border border-slate-200 text-xs space-y-2">
                <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#00A896]" />
                  <span>Location &amp; Technical</span>
                </h5>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div>
                    <span className="text-slate-400 block">Village</span>
                    <span className="font-bold text-slate-800">
                      {selectedDtrForDetails.village}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Location</span>
                    <span className="font-bold text-slate-800">
                      {selectedDtrForDetails.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Feeder</span>
                    <span className="font-bold text-slate-800">
                      {selectedDtrForDetails.feeder || '11kV Feeder A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Substation</span>
                    <span className="font-bold text-slate-800">
                      {selectedDtrForDetails.substation || 'Main Substation'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
