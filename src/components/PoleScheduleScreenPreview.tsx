import React, { useState, useEffect } from 'react';
import { TransformerIcon } from './TransformerIcon';
import {
  ArrowLeft,
  RefreshCw,
  Table as TableIcon,
  Plus,
  Edit2,
  Trash2,
  FileSpreadsheet,
  Building,
  MapPin,
  Bolt,
  Calendar,
  Layers,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Download,
  AlertCircle,
  GitCommit,
} from 'lucide-react';
import { SplashConfig, PoleModel } from '../types';
import { getActiveTheme, getActiveFont } from '../lib/theme';
import { resequencePolesList } from '../lib/poleUtils';

interface PoleScheduleScreenPreviewProps {
  config: SplashConfig;
  dtr: any;
  onBack: () => void;
  onAddNewPole: () => void;
  onAddMidSpanPole?: (insertIndex: number, context?: { beforePoleNo?: string; afterPoleNo?: string }) => void;
  onEditPole: (pole: PoleModel) => void;
  onEditDtr?: () => void;
}

// Wire configurations list for Dismantle Inventory
const DISMANTLE_WIRE_COLUMNS = [
  { wireType: 'ACSR 30 sqmm', wireConfig: '2 wire', label: 'ACSR 30 sqmm (2 wire)' },
  { wireType: 'ACSR 30 sqmm', wireConfig: '3 wire', label: 'ACSR 30 sqmm (3 wire)' },
  { wireType: 'ACSR 30 sqmm', wireConfig: '4 wire', label: 'ACSR 30 sqmm (4 wire)' },
  { wireType: 'ACSR 30 sqmm', wireConfig: '5 wire', label: 'ACSR 30 sqmm (5 wire)' },
  { wireType: 'ACSR 50 sqmm', wireConfig: '2 wire', label: 'ACSR 50 sqmm (2 wire)' },
  { wireType: 'ACSR 50 sqmm', wireConfig: '3 wire', label: 'ACSR 50 sqmm (3 wire)' },
  { wireType: 'ACSR 50 sqmm', wireConfig: '4 wire', label: 'ACSR 50 sqmm (4 wire)' },
  { wireType: 'ACSR 50 sqmm', wireConfig: '5 wire', label: 'ACSR 50 sqmm (5 wire)' },
  { wireType: 'AAC 50 sqmm', wireConfig: '2 wire', label: 'AAC 50 sqmm (2 wire)' },
  { wireType: 'AAC 50 sqmm', wireConfig: '3 wire', label: 'AAC 50 sqmm (3 wire)' },
  { wireType: 'AAC 50 sqmm', wireConfig: '4 wire', label: 'AAC 50 sqmm (4 wire)' },
  { wireType: 'AAC 50 sqmm', wireConfig: '5 wire', label: 'AAC 50 sqmm (5 wire)' },
  { wireType: 'AAC 25 sqmm', wireConfig: '2 wire', label: 'AAC 25 sqmm (2 wire)' },
  { wireType: 'AAC 25 sqmm', wireConfig: '3 wire', label: 'AAC 25 sqmm (3 wire)' },
  { wireType: 'AAC 25 sqmm', wireConfig: '4 wire', label: 'AAC 25 sqmm (4 wire)' },
  { wireType: 'AAC 25 sqmm', wireConfig: '5 wire', label: 'AAC 25 sqmm (5 wire)' },
  { wireType: 'ACSR 20 sqmm', wireConfig: '2 wire', label: 'ACSR 20 sqmm (2 wire)' },
  { wireType: 'ACSR 20 sqmm', wireConfig: '3 wire', label: 'ACSR 20 sqmm (3 wire)' },
  { wireType: 'ACSR 20 sqmm', wireConfig: '4 wire', label: 'ACSR 20 sqmm (4 wire)' },
  { wireType: 'ACSR 20 sqmm', wireConfig: '5 wire', label: 'ACSR 20 sqmm (5 wire)' },
];

export const PoleScheduleScreenPreview: React.FC<PoleScheduleScreenPreviewProps> = ({
  config,
  dtr,
  onBack,
  onAddNewPole,
  onAddMidSpanPole,
  onEditPole,
  onEditDtr,
}) => {
  const currentDtr = dtr || {
    id: 'dtr_1',
    dtrCode: 'DTR-WB-7401',
    capacity: '100',
    village: 'Kashibati',
    location: 'Near Primary School',
    landMarks: 'Banyan Tree',
    ccc: 'RAIGANJ-RURAL',
    feeder: '11KV KASHIBATI',
    substation: 'RAIGANJ 33/11KV',
    drgNo: 'DRG-2024-88',
    docDate: '2024-05-12',
    jmcNo: 'JMC-9921',
    gp: 'BINDOL',
    censusCode: '309112',
    block: 'RAIGANJ',
    division: 'RAIGANJ',
    user: 'operator@ns-power.com',
  };

  const [poles, setPoles] = useState<PoleModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showOptionsModal, setShowOptionsModal] = useState<boolean>(false);
  const [showSelectPoleModal, setShowSelectPoleModal] = useState<boolean>(false);
  const [showMidSpanModal, setShowMidSpanModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load poles for this DTR
  const loadPoles = () => {
    setIsLoading(true);
    try {
      const storageKey = `ns_poles_${currentDtr.id || 'default'}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPoles(Array.isArray(parsed) ? parsed : []);
      } else {
        // Default seed poles
        const initialPoles: PoleModel[] = [
          {
            id: 'pole_1',
            slNo: 1,
            typeOfPole: 'New pole',
            gpsNo: '',
            poleNo: 'P1',
            routhLength: 40.0,
            newPole: 1,
            staySet: 1,
            stayClampType1: 1,
            stayClampType2: 0,
            giEarthSpike: 1,
            suspension: 1,
            deadEnd: 0,
            distributionJunctionBox: 1,
            eyeHook: 1,
            ltPoleClampType1: 1,
            ltPoleClampType2: 0,
            ipcForDB50To70: 4,
            ipcFor16SQMM: 0,
            ipcForAbcToAbc50To70SQMM: 0,
            straightThroughJoint70SQMM: 0,
            straightThroughJoint16SQMM: 0,
            straightThroughJoint50SQMM: 0,
            serviceConnection1ph: 2,
            serviceConnection3ph: 0,
            remarks: '',
            dtrId: currentDtr.id,
            ltBracket1Ph: 0,
            ltBracket3Ph: 0,
            backClamp: 0,
            dIronClamp: 0,
            shackleInsulator: 0,
            ciReel: 0,
            shackleStrap: 0,
            boxBracket: 0,
            lc: 0,
            exStay: 0,
            wireType: 'ACSR 50 sqmm',
            wireConfiguration: '3 wire',
          },
          {
            id: 'pole_2',
            slNo: 2,
            typeOfPole: 'New pole',
            gpsNo: '',
            poleNo: 'P2',
            routhLength: 35.5,
            newPole: 1,
            staySet: 2,
            stayClampType1: 1,
            stayClampType2: 1,
            giEarthSpike: 1,
            suspension: 0,
            deadEnd: 1,
            distributionJunctionBox: 1,
            eyeHook: 1,
            ltPoleClampType1: 1,
            ltPoleClampType2: 0,
            ipcForDB50To70: 4,
            ipcFor16SQMM: 2,
            ipcForAbcToAbc50To70SQMM: 0,
            straightThroughJoint70SQMM: 0,
            straightThroughJoint16SQMM: 0,
            straightThroughJoint50SQMM: 0,
            serviceConnection1ph: 1,
            serviceConnection3ph: 1,
            remarks: '',
            dtrId: currentDtr.id,
            ltBracket1Ph: 0,
            ltBracket3Ph: 0,
            backClamp: 0,
            dIronClamp: 0,
            shackleInsulator: 0,
            ciReel: 0,
            shackleStrap: 0,
            boxBracket: 0,
            lc: 0,
            exStay: 0,
            wireType: 'ACSR 50 sqmm',
            wireConfiguration: '3 wire',
          },
          {
            id: 'pole_3',
            slNo: 3,
            typeOfPole: 'Ex Pole',
            gpsNo: 'GPS-8812',
            poleNo: 'E1',
            routhLength: 50.0,
            newPole: 0,
            staySet: 0,
            stayClampType1: 0,
            stayClampType2: 0,
            giEarthSpike: 0,
            suspension: 1,
            deadEnd: 0,
            distributionJunctionBox: 0,
            eyeHook: 1,
            ltPoleClampType1: 1,
            ltPoleClampType2: 1,
            ipcForDB50To70: 0,
            ipcFor16SQMM: 1,
            ipcForAbcToAbc50To70SQMM: 0,
            straightThroughJoint70SQMM: 0,
            straightThroughJoint16SQMM: 0,
            straightThroughJoint50SQMM: 0,
            serviceConnection1ph: 0,
            serviceConnection3ph: 0,
            remarks: 'EX STAY 1',
            dtrId: currentDtr.id,
            ltBracket1Ph: 0,
            ltBracket3Ph: 1,
            backClamp: 4,
            dIronClamp: 3,
            shackleInsulator: 3,
            ciReel: 2,
            shackleStrap: 1,
            boxBracket: 0,
            lc: 1,
            exStay: 1,
            wireType: 'ACSR 30 sqmm',
            wireConfiguration: '3 wire',
          },
        ];
        localStorage.setItem(storageKey, JSON.stringify(initialPoles));
        setPoles(initialPoles);
      }
    } catch (_) {}
    setTimeout(() => setIsLoading(false), 200);
  };

  useEffect(() => {
    loadPoles();
  }, [currentDtr.id]);

  // Pole Schedule Calculations
  const totalRouteLength = poles.reduce((acc, p) => acc + (p.routhLength || 0), 0);
  const totalNewPoles = poles.reduce((acc, p) => acc + (p.newPole === 1 ? 1 : 0), 0);
  const totalStaySet = poles.reduce((acc, p) => acc + (p.staySet || 0), 0);
  const totalStayClampType1 = poles.reduce((acc, p) => acc + (p.stayClampType1 || 0), 0);
  const totalStayClampType2 = poles.reduce((acc, p) => acc + (p.stayClampType2 || 0), 0);
  const totalGiEarthSpike = poles.reduce((acc, p) => acc + (p.giEarthSpike || 0), 0);
  const totalSuspension = poles.reduce((acc, p) => acc + (p.suspension || 0), 0);
  const totalDeadEnd = poles.reduce((acc, p) => acc + (p.deadEnd || 0), 0);
  const totalDistributionJunctionBox = poles.reduce(
    (acc, p) => acc + (p.distributionJunctionBox || 0),
    0
  );
  const totalEyeHook = poles.reduce((acc, p) => acc + (p.eyeHook || 0), 0);
  const totalLtPoleClampType1 = poles.reduce(
    (acc, p) => acc + (p.ltPoleClampType1 || 0),
    0
  );
  const totalLtPoleClampType2 = poles.reduce(
    (acc, p) => acc + (p.ltPoleClampType2 || 0),
    0
  );
  const totalIpcForDB50To70 = poles.reduce(
    (acc, p) => acc + (p.ipcForDB50To70 || 0),
    0
  );
  const totalIpcFor16SQMM = poles.reduce((acc, p) => acc + (p.ipcFor16SQMM || 0), 0);
  const totalIpcForAbcToAbc50To70SQMM = poles.reduce(
    (acc, p) => acc + (p.ipcForAbcToAbc50To70SQMM || 0),
    0
  );
  const totalStraightThroughJoint70SQMM = poles.reduce(
    (acc, p) => acc + (p.straightThroughJoint70SQMM || 0),
    0
  );
  const totalStraightThroughJoint16SQMM = poles.reduce(
    (acc, p) => acc + (p.straightThroughJoint16SQMM || 0),
    0
  );
  const totalStraightThroughJoint50SQMM = poles.reduce(
    (acc, p) => acc + (p.straightThroughJoint50SQMM || 0),
    0
  );
  const totalServiceConnection1ph = poles.reduce(
    (acc, p) => acc + (p.serviceConnection1ph || 0),
    0
  );
  const totalServiceConnection3ph = poles.reduce(
    (acc, p) => acc + (p.serviceConnection3ph || 0),
    0
  );

  // Dismantle Inventory Calculations
  const totalLtBracket1Ph = poles.reduce((acc, p) => acc + (p.ltBracket1Ph || 0), 0);
  const totalLtBracket3Ph = poles.reduce((acc, p) => acc + (p.ltBracket3Ph || 0), 0);
  const totalBackClamp = poles.reduce((acc, p) => acc + (p.backClamp || 0), 0);
  const totalDIronClamp = poles.reduce((acc, p) => acc + (p.dIronClamp || 0), 0);
  const totalShackleInsulator = poles.reduce(
    (acc, p) => acc + (p.shackleInsulator || 0),
    0
  );
  const totalCiReel = poles.reduce((acc, p) => acc + (p.ciReel || 0), 0);
  const totalShackleStrap = poles.reduce((acc, p) => acc + (p.shackleStrap || 0), 0);
  const totalBoxBracket = poles.reduce((acc, p) => acc + (p.boxBracket || 0), 0);
  const totalLc = poles.reduce((acc, p) => acc + (p.lc || 0), 0);
  const totalExStay = poles.reduce((acc, p) => acc + (p.exStay || 0), 0);

  // Wire Route Length helper
  const getWireRouteLength = (pole: PoleModel, wireType: string, wireConfig: string) => {
    if (pole.wireType === wireType && pole.wireConfiguration === wireConfig) {
      return pole.routhLength.toFixed(2);
    }
    return '';
  };

  const calculateTotalRouteLengthForWire = (wireType: string, wireConfig: string) => {
    return poles
      .filter((p) => p.wireType === wireType && p.wireConfiguration === wireConfig)
      .reduce((sum, p) => sum + (p.routhLength || 0), 0)
      .toFixed(2);
  };

  // CSV Export
  const handleExportCSV = () => {
    const lines: string[] = [];

    lines.push(`"DTR Code :","${currentDtr.dtrCode}"," POLE SCHEDULE"`);
    lines.push('');
    lines.push(`"Report Generated:","${new Date().toISOString()}"`);
    lines.push(
      `"Report Generated by ","${currentDtr.user || 'Operator'}","Using Ns Electrical Mobile App"`
    );
    lines.push('');
    lines.push('"DTR INFORMATION"');
    lines.push(`"DTR Code","${currentDtr.dtrCode}"`);
    lines.push(`"Capacity","${currentDtr.capacity} KVA"`);
    lines.push(`"Village","${currentDtr.village}"`);
    lines.push(`"Location","${currentDtr.location}"`);
    lines.push(`"Land Marks","${currentDtr.landMarks}"`);
    lines.push(`"CCC","${currentDtr.ccc}"`);
    lines.push(`"Feeder","${currentDtr.feeder}"`);
    lines.push(`"Substation","${currentDtr.substation}"`);
    lines.push(`"DRG No","${currentDtr.drgNo}"`);
    lines.push(`"DOC Date","${currentDtr.docDate}"`);
    lines.push(`"JMC No","${currentDtr.jmcNo}"`);
    lines.push(`"GP","${currentDtr.gp}"`);
    lines.push(`"Census Code","${currentDtr.censusCode}"`);
    lines.push(`"Block","${currentDtr.block}"`);
    lines.push(`"Division","${currentDtr.division}"`);
    lines.push(`"User","${currentDtr.user || 'operator'}"`);
    lines.push('');
    lines.push('"POLE SCHEDULE"');
    lines.push(
      '"SL NO","Pole No.","Route Length (Mtr.)","New PCC Pole","LT Stay set","LT Stay clamp (Type-I)","LT Stay clamp (Type-II)","GI Earth Spike","Suspension","Dead End","Distribution Junction Box","Eye hook","LT pole clamp (Type-I)","LT pole clamp (Type-II)","IPC (ABC) to DB charging set 50-70 sq.mm","IPC (ABC) for 16 sq.mm","IPC ABC TEE joint for 70 sq.mm","Straight through joint (ABC) 70 sq.mm power cable","Straight through joint (ABC) 16 sq.mm power cable","Straight through joint (ABC) 50 sq.mm neutral wire","Service Connection (1Ph)","Service Connection (3Ph)","Remarks","GPS No"'
    );
    lines.push(
      '"Unit","No","Mtr.","Nos.","Set.","Pair.","Pair.","Nos.","Nos.","Nos.","Nos.","Nos.","Pair.","Pair.","Nos.","Nos.","Nos.","Nos.","Nos.","Nos.","Nos.","Nos.","","No"'
    );

    poles.forEach((p) => {
      lines.push(
        `"${p.slNo}","${p.poleNo}","${p.routhLength.toFixed(2)}","${p.newPole === 1 ? '1' : '0'}","${p.staySet}","${p.stayClampType1}","${p.stayClampType2}","${p.giEarthSpike}","${p.suspension}","${p.deadEnd}","${p.distributionJunctionBox}","${p.eyeHook}","${p.ltPoleClampType1}","${p.ltPoleClampType2}","${p.ipcForDB50To70}","${p.ipcFor16SQMM}","${p.ipcForAbcToAbc50To70SQMM}","${p.straightThroughJoint70SQMM}","${p.straightThroughJoint16SQMM}","${p.straightThroughJoint50SQMM}","${p.serviceConnection1ph}","${p.serviceConnection3ph}","${p.remarks || ''}","${p.gpsNo || ''}"`
      );
    });

    lines.push(
      `"TOTAL","","${totalRouteLength.toFixed(2)}","${totalNewPoles}","${totalStaySet}","${totalStayClampType1}","${totalStayClampType2}","${totalGiEarthSpike}","${totalSuspension}","${totalDeadEnd}","${totalDistributionJunctionBox}","${totalEyeHook}","${totalLtPoleClampType1}","${totalLtPoleClampType2}","${totalIpcForDB50To70}","${totalIpcFor16SQMM}","${totalIpcForAbcToAbc50To70SQMM}","${totalStraightThroughJoint70SQMM}","${totalStraightThroughJoint16SQMM}","${totalStraightThroughJoint50SQMM}","${totalServiceConnection1ph}","${totalServiceConnection3ph}","",""`
    );
    lines.push('');
    lines.push('"DISMANTLE INVENTORY"');
    const dismantleHeaders = [
      'S.No',
      'Pole No.',
      'LT Bracket 1Ph',
      'LT Bracket 3Ph',
      'Back Clamp',
      'D-Iron Clamp',
      'Shackle Insulator',
      'CI Reel',
      'Shackle Strap',
      'Box Bracket',
      'L.C',
      'Ex-STAY',
      ...DISMANTLE_WIRE_COLUMNS.map((c) => c.label),
      'Remarks',
    ];
    lines.push(dismantleHeaders.map((h) => `"${h}"`).join(','));

    poles.forEach((p, idx) => {
      const row = [
        `${idx + 1}`,
        p.poleNo,
        `${p.ltBracket1Ph}`,
        `${p.ltBracket3Ph}`,
        `${p.backClamp}`,
        `${p.dIronClamp}`,
        `${p.shackleInsulator}`,
        `${p.ciReel}`,
        `${p.shackleStrap}`,
        `${p.boxBracket}`,
        `${p.lc}`,
        `${p.exStay}`,
        ...DISMANTLE_WIRE_COLUMNS.map((col) => getWireRouteLength(p, col.wireType, col.wireConfig)),
        p.remarks || '',
      ];
      lines.push(row.map((val) => `"${val}"`).join(','));
    });

    const totalRow = [
      'TOTAL',
      '',
      `${totalLtBracket1Ph}`,
      `${totalLtBracket3Ph}`,
      `${totalBackClamp}`,
      `${totalDIronClamp}`,
      `${totalShackleInsulator}`,
      `${totalCiReel}`,
      `${totalShackleStrap}`,
      `${totalBoxBracket}`,
      `${totalLc}`,
      `${totalExStay}`,
      ...DISMANTLE_WIRE_COLUMNS.map((col) => calculateTotalRouteLengthForWire(col.wireType, col.wireConfig)),
      '',
    ];
    lines.push(totalRow.map((val) => `"${val}"`).join(','));

    const actualRow = [
      'ACTUAL',
      '',
      `${totalLtBracket1Ph}`,
      `${totalLtBracket3Ph}`,
      `${totalBackClamp - totalExStay * 2}`,
      `${totalDIronClamp - totalDistributionJunctionBox}`,
      `${totalShackleInsulator - totalDistributionJunctionBox}`,
      `${totalCiReel}`,
      `${totalShackleStrap}`,
      `${totalBoxBracket}`,
      `${totalLc}`,
      '-',
      ...DISMANTLE_WIRE_COLUMNS.map((col) => calculateTotalRouteLengthForWire(col.wireType, col.wireConfig)),
      '',
    ];
    lines.push(actualRow.map((val) => `"${val}"`).join(','));

    const csvBlob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(csvBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentDtr.village || 'DTR'}_${currentDtr.dtrCode}_Pole_Schedule.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('CSV Pole Schedule exported and downloaded!');
  };

  const activeTheme = getActiveTheme(config);
  const activeFont = getActiveFont(config);
  const isDark = !!config.darkMode;

  return (
    <div
      style={{ fontFamily: activeFont.fontFamily }}
      className={`w-full h-full flex flex-col overflow-hidden select-none transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
      }`}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl border border-slate-700/80 backdrop-blur-md animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Options Bottom Sheet Modal */}
      {showOptionsModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
          <div className={`rounded-t-3xl p-5 w-full shadow-2xl border-t animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-4" />
            <div className="text-center mb-4">
              <h3 className="font-extrabold text-base tracking-tight">
                Pole Schedule Actions
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Manage feeder sequence, mid-span insertion &amp; pole details
              </p>
            </div>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowOptionsModal(false);
                  onAddNewPole();
                }}
                style={{
                  backgroundColor: `${activeTheme.primary}12`,
                  borderColor: `${activeTheme.primary}35`,
                  color: activeTheme.primary,
                }}
                className="w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center gap-3 transition hover:brightness-105 active:scale-[0.99] cursor-pointer shadow-xs"
              >
                <div
                  style={{ backgroundColor: activeTheme.primary }}
                  className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Add New Pole</div>
                  <div className="text-[10px] opacity-80 font-normal">Append next sequential pole to this line</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowOptionsModal(false);
                  if (poles.length === 0) {
                    onAddNewPole();
                  } else {
                    setShowMidSpanModal(true);
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center gap-3 transition active:scale-[0.99] cursor-pointer ${
                  isDark
                    ? 'bg-cyan-950/40 border-cyan-500/40 hover:bg-cyan-900/50 text-cyan-300'
                    : 'bg-cyan-50/80 border-cyan-200 hover:bg-cyan-100 text-cyan-900'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-500 text-white flex items-center justify-center shadow-xs">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center gap-1.5">
                    <span>Add Mid Span Pole</span>
                    <span className="text-[9px] bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 px-2 py-0.5 rounded-full font-bold border border-cyan-500/30">
                      Auto-Sequence
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                    Insert between poles with automatic re-numbering
                  </div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowOptionsModal(false);
                  setShowSelectPoleModal(true);
                }}
                className={`w-full p-3.5 rounded-2xl border font-bold text-xs flex items-center gap-3 transition active:scale-[0.99] cursor-pointer ${
                  isDark ? 'bg-slate-800/90 border-slate-700 text-slate-200 hover:bg-slate-800' : 'bg-slate-100/90 border-slate-200 text-slate-800 hover:bg-slate-200/70'
                }`}
              >
                <div className="w-8 h-8 rounded-xl bg-slate-700 text-white flex items-center justify-center shadow-xs">
                  <Edit2 className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Edit Individual Poles</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">Select a specific pole from list to modify</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowOptionsModal(false);
                  if (poles.length > 0) {
                    onEditPole(poles[0]);
                  }
                }}
                className="w-full p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-xs flex items-center gap-3 transition active:scale-[0.99] cursor-pointer"
              >
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-xs">
                  <Layers className="w-4 h-4" />
                </div>
                <div className="text-left flex-1">
                  <div className="font-bold">Edit All Poles ({poles.length})</div>
                  <div className="text-[10px] opacity-80 font-normal">Open master editor starting from Pole 1</div>
                </div>
              </button>

              <button
                onClick={() => setShowOptionsModal(false)}
                className="w-full p-3 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Mid Span Pole Modal */}
      {showMidSpanModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
          <div className={`rounded-t-3xl p-5 w-full max-h-[82vh] flex flex-col shadow-2xl border-t animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center border border-cyan-500/25">
                  <GitCommit className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight text-slate-900 dark:text-white">Add Mid Span Pole</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    Choose line span to insert pole
                  </p>
                </div>
              </div>
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/30">
                Auto-Sequence
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-slate-700 dark:text-cyan-200 text-[11px] mb-3 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed">
                Inserting a mid-span pole automatically shifts and renumbers all subsequent poles (<strong className="font-bold text-cyan-700 dark:text-cyan-300">E1, E2..</strong> / <strong className="font-bold text-cyan-700 dark:text-cyan-300">P1, P2..</strong>) and serial numbers.
              </span>
            </div>

            {/* Available Spans List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {/* Option 0: Insert at Start */}
              <button
                onClick={() => {
                  setShowMidSpanModal(false);
                  if (onAddMidSpanPole) {
                    onAddMidSpanPole(0, { afterPoleNo: poles[0]?.poleNo });
                  } else {
                    onAddNewPole();
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-[0.99] ${
                  isDark ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50' : 'bg-slate-50 border-slate-200 hover:bg-cyan-50/60 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/15 text-teal-600 dark:text-teal-400 flex items-center justify-center font-black text-xs">
                    #1
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>At Line Start (Before {poles[0]?.poleNo})</span>
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        Pos #1
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Inserts as first pole in route sequence
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* Spans between consecutive poles */}
              {poles.map((pole, idx) => {
                if (idx === poles.length - 1) return null;
                const nextPole = poles[idx + 1];
                const spanIndex = idx + 1;
                return (
                  <button
                    key={`span_${pole.id}_${nextPole.id}`}
                    onClick={() => {
                      setShowMidSpanModal(false);
                      if (onAddMidSpanPole) {
                        onAddMidSpanPole(spanIndex, {
                          beforePoleNo: pole.poleNo,
                          afterPoleNo: nextPole.poleNo,
                        });
                      } else {
                        onAddNewPole();
                      }
                    }}
                    className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-[0.99] ${
                      isDark ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50' : 'bg-slate-50 border-slate-200 hover:bg-cyan-50/60 hover:border-cyan-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-black text-xs">
                        #{spanIndex + 1}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                          <span className="text-teal-600 dark:text-teal-400 font-mono font-black">{pole.poleNo}</span>
                          <span className="text-slate-400 text-[10px]">────⚲────</span>
                          <span className="text-teal-600 dark:text-teal-400 font-mono font-black">{nextPole.poleNo}</span>
                          <span className="text-[9px] bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 px-1.5 py-0.5 rounded font-mono font-bold">
                            Mid Span
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Between Pole {pole.poleNo} &amp; {nextPole.poleNo} (Span: {pole.routhLength || 0}m)
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </button>
                );
              })}

              {/* Option Last: Insert at End */}
              <button
                onClick={() => {
                  setShowMidSpanModal(false);
                  if (onAddMidSpanPole) {
                    onAddMidSpanPole(poles.length, {
                      beforePoleNo: poles[poles.length - 1]?.poleNo,
                    });
                  } else {
                    onAddNewPole();
                  }
                }}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-[0.99] ${
                  isDark ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800 hover:border-cyan-500/50' : 'bg-slate-50 border-slate-200 hover:bg-cyan-50/60 hover:border-cyan-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-black text-xs">
                    #{poles.length + 1}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>At Line End (After {poles[poles.length - 1]?.poleNo})</span>
                      <span className="text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded font-mono font-bold">
                        Pos #{poles.length + 1}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Appends as terminal pole at end of line
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <button
              onClick={() => setShowMidSpanModal(false)}
              className="w-full p-3 mt-3 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Select Pole Modal */}
      {showSelectPoleModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-end animate-in fade-in duration-150">
          <div className={`rounded-t-3xl p-5 w-full max-h-[75vh] flex flex-col shadow-2xl border-t animate-in slide-in-from-bottom duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3" />
            <div className="text-center mb-3">
              <h3 className="font-extrabold text-base tracking-tight">
                Select Pole to Edit
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Click any pole to edit its schedule attributes and hardware
              </p>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {poles.map((pole) => (
                <button
                  key={pole.id}
                  onClick={() => {
                    setShowSelectPoleModal(false);
                    onEditPole(pole);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer active:scale-[0.99] ${
                    isDark ? 'bg-slate-800/80 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`inline-block px-2.5 py-1 rounded-xl font-mono font-black text-xs ${
                      pole.typeOfPole === 'New pole'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    }`}>
                      {pole.poleNo}
                    </span>
                    <div>
                      <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-2">
                        <span>Pole #{pole.slNo}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({pole.typeOfPole})</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Route: <strong className="font-bold text-slate-700 dark:text-slate-300">{pole.routhLength}m</strong> • DB: {pole.distributionJunctionBox} • Stay: {pole.staySet}
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSelectPoleModal(false)}
              className="w-full p-3 mt-3 text-center text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Top AppBar */}
      <div
        style={{
          background: `linear-gradient(135deg, ${activeTheme.gradient.start}, ${activeTheme.gradient.middle}, ${activeTheme.gradient.end})`,
        }}
        className="px-3 sm:px-4 pt-10 pb-3 text-white shadow-lg flex items-center justify-between z-20 shrink-0 border-b border-white/15 gap-2 w-full"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-center gap-1.5 min-w-0">
              <h2 className="font-black text-sm leading-tight truncate text-white tracking-tight">
                {currentDtr.village || 'DTR Feeder'}
              </h2>
              <span className="px-1.5 py-0.5 rounded bg-amber-400/25 border border-amber-300/40 text-amber-200 font-mono text-[9.5px] font-bold shrink-0 whitespace-nowrap">
                {currentDtr.dtrCode}
              </span>
            </div>
            <p className="text-[10px] text-white/80 font-medium flex items-center gap-1 truncate mt-0.5">
              <span className="truncate">Pole Schedule</span>
              <span>•</span>
              <span className="shrink-0 whitespace-nowrap">{poles.length} Poles</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={loadPoles}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center text-white transition active:scale-95 cursor-pointer shadow-xs shrink-0"
            title="Refresh Data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-white" />
          </button>
          <button
            onClick={handleExportCSV}
            className="h-8 px-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 border border-amber-200/50 flex items-center gap-1 text-slate-950 font-black text-[11px] transition active:scale-95 cursor-pointer shadow-md shadow-amber-500/25 shrink-0 whitespace-nowrap"
            title="Export CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-950 stroke-[2.5] shrink-0" />
            <span className="shrink-0">CSV</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading Pole Schedule...</span>
        </div>
      ) : poles.length === 0 ? (
        /* Empty State */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4 border border-teal-500/20 shadow-inner">
            <FileSpreadsheet className="w-8 h-8 text-teal-600 dark:text-teal-400" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">No Poles Recorded</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mt-1 leading-relaxed">
            No poles have been surveyed for this DTR feeder line yet. Start by logging the first pole.
          </p>
          <button
            onClick={onAddNewPole}
            style={{
              background: `linear-gradient(135deg, ${activeTheme.gradient.start}, ${activeTheme.gradient.end})`,
            }}
            className="mt-5 px-5 py-2.5 text-white font-bold text-xs rounded-2xl shadow-lg shadow-teal-500/25 border border-white/20 flex items-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-amber-300" />
            <span>Add First Pole</span>
          </button>
        </div>
      ) : (
        /* Main Scrollable View */
        <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-28 text-xs">
          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs transition ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Poles</span>
              <span className="font-black text-base text-teal-600 dark:text-teal-400 mt-0.5">{poles.length}</span>
              <span className="text-[9px] text-slate-400 font-medium">Recorded</span>
            </div>
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs transition ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Route</span>
              <span className="font-black text-base text-slate-900 dark:text-white mt-0.5">{totalRouteLength.toFixed(0)}<span className="text-[11px] font-semibold text-slate-400">m</span></span>
              <span className="text-[9px] text-slate-400 font-medium">Span Length</span>
            </div>
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs transition ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">New (PCC)</span>
              <span className="font-black text-base text-emerald-600 dark:text-emerald-400 mt-0.5">{totalNewPoles}</span>
              <span className="text-[9px] text-slate-400 font-medium">P1..Pn</span>
            </div>
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center text-center shadow-xs transition ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/80 hover:border-slate-300'
            }`}>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Existing</span>
              <span className="font-black text-base text-amber-600 dark:text-amber-400 mt-0.5">{poles.length - totalNewPoles}</span>
              <span className="text-[9px] text-slate-400 font-medium">E1..En</span>
            </div>
          </div>

          {/* Card 1: DTR Header Information */}
          <div className={`rounded-3xl p-4.5 border shadow-sm space-y-4 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            {/* Header Title with Badges */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/25 shadow-xs">
                  <TransformerIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight tracking-tight">
                    DTR - INFORMATION
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    Technical Specifications &amp; Line Feeder
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    if (onEditDtr) onEditDtr();
                    else showToast('Opening DTR Edit...');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-500/25 text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95 cursor-pointer shadow-2xs"
                  title="Edit DTR Details"
                >
                  <Edit2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Edit DTR</span>
                </button>
              </div>
            </div>

            {/* Main Identification Banner */}
            <div className={`p-3.5 rounded-2xl border flex items-center justify-between shadow-xs ${
              isDark
                ? 'bg-gradient-to-r from-slate-950 to-slate-900 border-slate-800 text-white'
                : 'bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 text-white border-slate-800'
            }`}>
              <div className="space-y-0.5">
                <div className="text-[9px] font-bold text-teal-300/90 uppercase tracking-widest">
                  Transformer Code
                </div>
                <div className="text-base font-black text-white tracking-tight flex items-center gap-2">
                  <span>{currentDtr.dtrCode}</span>
                </div>
                <div className="text-[11px] text-slate-300 font-medium">
                  {currentDtr.village || 'Village'} {currentDtr.location ? `• ${currentDtr.location}` : ''}
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 rounded-xl bg-amber-400/20 border border-amber-400/40 text-amber-300 font-black text-xs font-mono shadow-xs">
                  {currentDtr.capacity || 25} kVA
                </span>
                <div className="text-[9px] text-teal-200/70 font-semibold mt-1">Capacity Rating</div>
              </div>
            </div>

            {/* Clean Grid Layout for Parameters */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
              {[
                { label: 'Feeder', value: currentDtr.feeder || '11KV Feeder', icon: Bolt, color: 'text-amber-500' },
                { label: 'Substation', value: currentDtr.substation || 'Raiganj 33/11KV', icon: Building, color: 'text-indigo-500' },
                { label: 'CCC', value: currentDtr.ccc || 'RAIGANJ-RURAL', icon: Building, color: 'text-blue-500' },
                { label: 'Block', value: currentDtr.block || 'RAIGANJ', icon: Building, color: 'text-teal-500' },
                { label: 'GP', value: currentDtr.gp || 'BINDOL', icon: MapPin, color: 'text-emerald-500' },
                { label: 'Division', value: currentDtr.division || 'RAIGANJ', icon: Layers, color: 'text-slate-400' },
                { label: 'DRG No', value: currentDtr.drgNo || 'DRG-2024-88', icon: Layers, color: 'text-slate-400' },
                { label: 'DOC Date', value: currentDtr.docDate || '2024-05-12', icon: Calendar, color: 'text-teal-500' },
                { label: 'JMC No', value: currentDtr.jmcNo || 'JMC-9921', icon: Layers, color: 'text-slate-400' },
                { label: 'Census Code', value: currentDtr.censusCode || '309112', icon: Layers, color: 'text-slate-400' },
                { label: 'Landmarks', value: currentDtr.landMarks || 'Near Primary School', icon: MapPin, color: 'text-emerald-500', fullWidth: true },
              ]
                .filter((item) => item.value !== undefined && item.value !== null && item.value !== '')
                .map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <div
                      key={item.label}
                      className={`p-2.5 rounded-2xl border flex items-start gap-2.5 transition ${
                        item.fullWidth ? 'col-span-2' : 'col-span-1'
                      } ${
                        isDark
                          ? 'bg-slate-950/40 border-slate-800/80 hover:bg-slate-800/50'
                          : 'bg-slate-50/80 border-slate-200/70 hover:bg-teal-50/40 hover:border-teal-200/60'
                      }`}
                    >
                      <div className="p-1.5 rounded-xl bg-slate-200/50 dark:bg-slate-800/60 shrink-0 mt-0.5">
                        <IconComponent className={`w-3.5 h-3.5 ${item.color}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          {item.label}
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {item.value}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Card 2: Pole Schedule Spreadsheet Table */}
          <div className={`rounded-3xl p-4.5 border shadow-sm space-y-3.5 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-teal-500/10 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/25 shadow-xs">
                  <TableIcon className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight tracking-tight">
                    Pole Schedule Table
                  </h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    {poles.length} Surveyed Route Poles • Click any row to edit
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowOptionsModal(true)}
                  style={{
                    background: `linear-gradient(135deg, ${activeTheme.gradient.start}, ${activeTheme.gradient.end})`,
                  }}
                  className="px-3 py-1.5 rounded-xl text-white text-[11px] font-bold flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer border border-white/20 hover:brightness-105"
                >
                  <Edit2 className="w-3 h-3 text-amber-300" />
                  <span>Manage</span>
                </button>
              </div>
            </div>

            {/* Horizontally & Vertically Scrollable Spreadsheet */}
            <div className={`overflow-x-auto border rounded-2xl max-h-80 shadow-inner ${
              isDark ? 'border-slate-800 bg-slate-950/50' : 'border-slate-200/90 bg-white'
            }`}>
              <table
                style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                className="w-full text-[10px] text-center border-collapse font-sans"
              >
                <thead className={`sticky top-0 z-10 font-bold border-b backdrop-blur-md ${
                  isDark ? 'bg-slate-900/95 text-slate-200 border-slate-800' : 'bg-slate-100/95 text-slate-900 border-slate-200'
                }`}>
                  <tr className="whitespace-nowrap uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-2 min-w-[55px] border-r border-slate-200 dark:border-slate-800">SL NO</th>
                    <th className="py-2.5 px-2 min-w-[80px] border-r border-slate-200 dark:border-slate-800">Pole No.</th>
                    <th className="py-2.5 px-2 min-w-[110px] border-r border-slate-200 dark:border-slate-800">Route (Mtr.)</th>
                    <th className="py-2.5 px-2 min-w-[90px] border-r border-slate-200 dark:border-slate-800">New PCC</th>
                    <th className="py-2.5 px-2 min-w-[85px] border-r border-slate-200 dark:border-slate-800">LT Stay set</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Stay clamp (Type-I)</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Stay clamp (Type-II)</th>
                    <th className="py-2.5 px-2 min-w-[100px] border-r border-slate-200 dark:border-slate-800">GI Earth Spike</th>
                    <th className="py-2.5 px-2 min-w-[85px] border-r border-slate-200 dark:border-slate-800">Suspension</th>
                    <th className="py-2.5 px-2 min-w-[80px] border-r border-slate-200 dark:border-slate-800">Dead End</th>
                    <th className="py-2.5 px-2 min-w-[145px] border-r border-slate-200 dark:border-slate-800">Dist. Junction Box</th>
                    <th className="py-2.5 px-2 min-w-[75px] border-r border-slate-200 dark:border-slate-800">Eye hook</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Pole clamp (Type-I)</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Pole clamp (Type-II)</th>
                    <th className="py-2.5 px-2 min-w-[180px] border-r border-slate-200 dark:border-slate-800">IPC (ABC) 50-70 sq.mm</th>
                    <th className="py-2.5 px-2 min-w-[135px] border-r border-slate-200 dark:border-slate-800">IPC (ABC) 16 sq.mm</th>
                    <th className="py-2.5 px-2 min-w-[160px] border-r border-slate-200 dark:border-slate-800">IPC ABC TEE 70 sq.mm</th>
                    <th className="py-2.5 px-2 min-w-[200px] border-r border-slate-200 dark:border-slate-800">Joint 70 sq.mm cable</th>
                    <th className="py-2.5 px-2 min-w-[200px] border-r border-slate-200 dark:border-slate-800">Joint 16 sq.mm cable</th>
                    <th className="py-2.5 px-2 min-w-[200px] border-r border-slate-200 dark:border-slate-800">Joint 50 sq.mm neutral</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Service Conn (1Ph)</th>
                    <th className="py-2.5 px-2 min-w-[130px] border-r border-slate-200 dark:border-slate-800">Service Conn (3Ph)</th>
                    <th className="py-2.5 px-2 min-w-[110px] border-r border-slate-200 dark:border-slate-800">Remarks</th>
                    <th className="py-2.5 px-2 min-w-[80px]">GPS No</th>
                  </tr>
                  {/* Units Row */}
                  <tr className={`border-b text-[9px] font-semibold whitespace-nowrap ${
                    isDark ? 'bg-slate-900/80 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800 font-bold">Unit</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">No</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Mtr.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Set.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Pair.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Pair.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Pair.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Pair.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">Nos.</td>
                    <td className="p-1 border-r border-slate-200 dark:border-slate-800">-</td>
                    <td className="p-1">No</td>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}`}>
                  {poles.map((p, idx) => (
                    <tr
                      key={p.id}
                      onClick={() => onEditPole(p)}
                      className={`cursor-pointer transition whitespace-nowrap ${
                        idx % 2 === 1
                          ? (isDark ? 'bg-slate-900/30' : 'bg-slate-50/50')
                          : ''
                      } ${
                        isDark ? 'hover:bg-teal-500/15' : 'hover:bg-teal-50/80'
                      }`}
                    >
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-white">
                        {p.slNo}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">
                        <span className={`inline-block px-2 py-0.5 rounded-lg font-mono font-black text-[10px] ${
                          p.typeOfPole === 'New pole'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.poleNo}
                        </span>
                      </td>
                      <td
                        style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                        className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100 font-sans tabular-nums"
                      >
                        {p.routhLength.toFixed(2)}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.newPole}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.staySet}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.stayClampType1}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.stayClampType2}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.giEarthSpike}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.suspension}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.deadEnd}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.distributionJunctionBox}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.eyeHook}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.ltPoleClampType1}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.ltPoleClampType2}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.ipcForDB50To70}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.ipcFor16SQMM}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.ipcForAbcToAbc50To70SQMM}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {p.straightThroughJoint70SQMM}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {p.straightThroughJoint16SQMM}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">
                        {p.straightThroughJoint50SQMM}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.serviceConnection1ph}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300">{p.serviceConnection3ph}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 text-slate-500 italic truncate max-w-[120px]">
                        {p.remarks || '-'}
                      </td>
                      <td className="p-2.5 text-slate-500 font-medium">{p.gpsNo || '-'}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`sticky bottom-0 font-bold border-t-2 whitespace-nowrap backdrop-blur-md ${
                  isDark ? 'bg-slate-900/95 text-white border-slate-700' : 'bg-slate-100/95 text-slate-950 border-slate-300'
                }`}>
                  <tr>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700 font-black">TOTAL</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">-</td>
                    <td
                      style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                      className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700 text-teal-600 dark:text-teal-400 font-bold text-[11px] font-sans tabular-nums"
                    >
                      {totalRouteLength.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalNewPoles}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalStaySet}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalStayClampType1}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalStayClampType2}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalGiEarthSpike}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalSuspension}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalDeadEnd}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalDistributionJunctionBox}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalEyeHook}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalLtPoleClampType1}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalLtPoleClampType2}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalIpcForDB50To70}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalIpcFor16SQMM}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalIpcForAbcToAbc50To70SQMM}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">
                      {totalStraightThroughJoint70SQMM}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">
                      {totalStraightThroughJoint16SQMM}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">
                      {totalStraightThroughJoint50SQMM}
                    </td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalServiceConnection1ph}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">{totalServiceConnection3ph}</td>
                    <td className="py-2.5 px-2 border-r border-slate-200 dark:border-slate-700">-</td>
                    <td className="py-2.5 px-2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Card 3: Dismantle Inventory Table */}
          <div className={`rounded-3xl p-4.5 border shadow-sm space-y-3.5 ${
            isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
              <div className="flex items-center gap-3 text-amber-700 dark:text-amber-400 font-extrabold text-sm">
                <div className="w-9 h-9 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/25 shadow-xs">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-slate-900 dark:text-white leading-tight tracking-tight">
                    Dismantle Inventory
                  </h3>
                  <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-medium">
                    Recoverable Hardware &amp; Conductor Schedule Ledger
                  </p>
                </div>
              </div>
            </div>

            <div className={`overflow-x-auto border rounded-2xl max-h-80 shadow-inner ${
              isDark ? 'border-amber-950/60 bg-slate-950/50' : 'border-amber-200/80 bg-white'
            }`}>
              <table
                style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
                className="w-full text-[10px] text-center border-collapse font-sans"
              >
                <thead className={`sticky top-0 z-10 font-bold border-b backdrop-blur-md ${
                  isDark ? 'bg-amber-950/95 text-amber-200 border-amber-800/60' : 'bg-amber-50/95 text-amber-950 border-amber-200'
                }`}>
                  <tr className="whitespace-nowrap uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-2 min-w-[50px] border-r border-amber-200 dark:border-amber-900/50">S.No</th>
                    <th className="py-2.5 px-2 min-w-[75px] border-r border-amber-200 dark:border-amber-900/50">Pole No.</th>
                    <th className="py-2.5 px-2 min-w-[95px] border-r border-amber-200 dark:border-amber-900/50">LT Bracket 1Ph</th>
                    <th className="py-2.5 px-2 min-w-[95px] border-r border-amber-200 dark:border-amber-900/50">LT Bracket 3Ph</th>
                    <th className="py-2.5 px-2 min-w-[85px] border-r border-amber-200 dark:border-amber-900/50">Back Clamp</th>
                    <th className="py-2.5 px-2 min-w-[95px] border-r border-amber-200 dark:border-amber-900/50">D-Iron Clamp</th>
                    <th className="py-2.5 px-2 min-w-[105px] border-r border-amber-200 dark:border-amber-900/50">Shackle Insulator</th>
                    <th className="py-2.5 px-2 min-w-[65px] border-r border-amber-200 dark:border-amber-900/50">CI Reel</th>
                    <th className="py-2.5 px-2 min-w-[90px] border-r border-amber-200 dark:border-amber-900/50">Shackle Strap</th>
                    <th className="py-2.5 px-2 min-w-[85px] border-r border-amber-200 dark:border-amber-900/50">Box Bracket</th>
                    <th className="py-2.5 px-2 min-w-[55px] border-r border-amber-200 dark:border-amber-900/50">L.C</th>
                    <th className="py-2.5 px-2 min-w-[75px] border-r border-amber-200 dark:border-amber-900/50">Ex-STAY</th>
                    {DISMANTLE_WIRE_COLUMNS.map((col) => (
                      <th
                        key={col.label}
                        className="py-2.5 px-2 min-w-[130px] border-r border-amber-200 dark:border-amber-900/50 bg-amber-500/10 text-amber-900 dark:text-amber-200 font-black"
                      >
                        {col.label}
                      </th>
                    ))}
                    <th className="py-2.5 px-2 min-w-[95px]">Remarks</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/70' : 'divide-slate-100'}`}>
                  {poles.map((p, idx) => (
                    <tr
                      key={p.id}
                      className={`transition whitespace-nowrap ${
                        idx % 2 === 1
                          ? (isDark ? 'bg-amber-950/15' : 'bg-amber-50/30')
                          : ''
                      } ${
                        isDark ? 'hover:bg-amber-500/15' : 'hover:bg-amber-50/80'
                      }`}
                    >
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold">{idx + 1}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-bold text-slate-800 dark:text-slate-200">
                        {p.poleNo}
                      </td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.ltBracket1Ph}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.ltBracket3Ph}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.backClamp}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.dIronClamp}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.shackleInsulator}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.ciReel}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.shackleStrap}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.boxBracket}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.lc}</td>
                      <td className="p-2.5 border-r border-slate-200 dark:border-slate-800">{p.exStay}</td>
                      {DISMANTLE_WIRE_COLUMNS.map((col) => (
                        <td
                          key={col.label}
                          className="p-2.5 border-r border-slate-200 dark:border-slate-800 font-medium text-slate-700 dark:text-slate-300"
                        >
                          {getWireRouteLength(p, col.wireType, col.wireConfig)}
                        </td>
                      ))}
                      <td className="p-2.5 text-slate-500 italic truncate max-w-[100px]">
                        {p.remarks || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className={`sticky bottom-0 font-bold border-t-2 whitespace-nowrap backdrop-blur-md ${
                  isDark ? 'bg-amber-950/95 text-amber-200 border-amber-800' : 'bg-amber-100/95 text-slate-900 border-amber-300'
                }`}>
                  <tr className="border-b border-amber-200 dark:border-amber-800/60">
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800 font-black">TOTAL</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">-</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLtBracket1Ph}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLtBracket3Ph}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalBackClamp}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalDIronClamp}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalShackleInsulator}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalCiReel}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalShackleStrap}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalBoxBracket}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLc}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalExStay}</td>
                    {DISMANTLE_WIRE_COLUMNS.map((col) => (
                      <td key={col.label} className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">
                        {calculateTotalRouteLengthForWire(col.wireType, col.wireConfig)}
                      </td>
                    ))}
                    <td className="py-2.5 px-2">-</td>
                  </tr>
                  {/* ACTUAL ROW FORMULA */}
                  <tr className={isDark ? 'bg-amber-900/60 text-amber-300 font-black' : 'bg-amber-200/90 text-amber-950 font-black'}>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">ACTUAL</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">-</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLtBracket1Ph}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLtBracket3Ph}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">
                      {totalBackClamp - totalExStay * 2}
                    </td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">
                      {totalDIronClamp - totalDistributionJunctionBox}
                    </td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">
                      {totalShackleInsulator - totalDistributionJunctionBox}
                    </td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalCiReel}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalShackleStrap}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalBoxBracket}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">{totalLc}</td>
                    <td className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">-</td>
                    {DISMANTLE_WIRE_COLUMNS.map((col) => (
                      <td key={col.label} className="py-2.5 px-2 border-r border-amber-200 dark:border-amber-800">
                        {calculateTotalRouteLengthForWire(col.wireType, col.wireConfig)}
                      </td>
                    ))}
                    <td className="py-2.5 px-2">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button (+ Add Pole) */}
      <div className="absolute bottom-14 right-5 z-30">
        <button
          onClick={onAddNewPole}
          style={{
            background: `linear-gradient(135deg, ${activeTheme.gradient.start}, ${activeTheme.gradient.end})`,
          }}
          className="text-white font-black text-xs px-4 py-3 rounded-2xl shadow-xl shadow-teal-500/25 border border-white/25 flex items-center gap-2 transition transform active:scale-95 cursor-pointer hover:brightness-110"
        >
          <Plus className="w-4.5 h-4.5 text-amber-300" />
          <span>Add Pole</span>
        </button>
      </div>
    </div>
  );
};
