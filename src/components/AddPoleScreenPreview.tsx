import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Trash2,
  Check,
  Plus,
  Radio,
  Zap,
  Info,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Sparkles,
} from 'lucide-react';
import { SplashConfig, PoleModel } from '../types';
import { syncPolesToCloud } from '../lib/firebase';
import { calculateProspectivePoleNo, resequencePolesList } from '../lib/poleUtils';

interface AddPoleScreenPreviewProps {
  config: SplashConfig;
  dtr: any;
  poleToEdit?: PoleModel | null;
  insertAtIndex?: number | null;
  insertContext?: { beforePoleNo?: string; afterPoleNo?: string } | null;
  onBack: () => void;
  onSaved?: (savedPole: PoleModel) => void;
  onDeleted?: (poleId: string) => void;
}

export const AddPoleScreenPreview: React.FC<AddPoleScreenPreviewProps> = ({
  config,
  dtr,
  poleToEdit,
  insertAtIndex,
  insertContext,
  onBack,
  onSaved,
  onDeleted,
}) => {
  const isMidSpan = insertAtIndex !== null && insertAtIndex !== undefined && !poleToEdit;
  const [currentInsertIndex, setCurrentInsertIndex] = useState<number | null>(
    insertAtIndex !== undefined ? insertAtIndex : null
  );
  const [midSpanShiftNotice, setMidSpanShiftNotice] = useState<string | null>(null);

  // Form State
  const [slNo, setSlNo] = useState<number>(1);
  const [typeOfPole, setTypeOfPole] = useState<string>('');
  const [showGpsField, setShowGpsField] = useState<boolean>(false);
  const [gpsNo, setGpsNo] = useState<string>('');
  const [poleNo, setPoleNo] = useState<string>('');
  const [isPoleNoReadOnly, setIsPoleNoReadOnly] = useState<boolean>(true);
  const [routhLength, setRouthLength] = useState<string>('');
  const [newPole, setNewPole] = useState<string>('');
  const [remarks, setRemarks] = useState<string>('');

  // Accessories
  const [staySet, setStaySet] = useState<string>('');
  const [stayClampType1, setStayClampType1] = useState<string>('');
  const [stayClampType2, setStayClampType2] = useState<string>('');
  const [giEarthSpike, setGiEarthSpike] = useState<string>('');
  const [suspension, setSuspension] = useState<string>('');
  const [deadEnd, setDeadEnd] = useState<string>('');
  const [distributionJunctionBox, setDistributionJunctionBox] = useState<string>('');
  const [eyeHook, setEyeHook] = useState<string>('');
  const [ltPoleClampType1, setLtPoleClampType1] = useState<string>('');
  const [ltPoleClampType2, setLtPoleClampType2] = useState<string>('');
  const [ipcForDB50To70, setIpcForDB50To70] = useState<string>('');
  const [ipcFor16SQMM, setIpcFor16SQMM] = useState<string>('');
  const [ipcForAbcToAbc50To70SQMM, setIpcForAbcToAbc50To70SQMM] = useState<string>('');

  // Straight Through Joint
  const [showStraightThroughJoint, setShowStraightThroughJoint] = useState<boolean>(false);
  const [stj70, setStj70] = useState<string>('');
  const [stj16, setStj16] = useState<string>('');
  const [stj50, setStj50] = useState<string>('');

  // Service Connection
  const [serviceConnection1ph, setServiceConnection1ph] = useState<string>('');
  const [serviceConnection3ph, setServiceConnection3ph] = useState<string>('');

  // Ex-Stay Option: 0 = No Ex Stay, 1 = 1 Ex Stay, 2 = Enter Value
  const [exStayOption, setExStayOption] = useState<number>(0);
  const [exStayValue, setExStayValue] = useState<string>('');

  // Wire specs & configs
  const [selectedWireType, setSelectedWireType] = useState<string>('');
  const [selectedWireConfig, setSelectedWireConfig] = useState<string>('');

  // Dismantle Inventory
  const [isDismantle, setIsDismantle] = useState<boolean>(false);
  const [ltBracket1Ph, setLtBracket1Ph] = useState<string>('');
  const [ltBracket3Ph, setLtBracket3Ph] = useState<string>('');
  const [backClamp, setBackClamp] = useState<string>('');
  const [dIronClamp, setDIronClamp] = useState<string>('');
  const [shackleInsulator, setShackleInsulator] = useState<string>('');
  const [ciReel, setCiReel] = useState<string>('');
  const [shackleStrap, setShackleStrap] = useState<string>('');
  const [boxBracket, setBoxBracket] = useState<string>('');
  const [lc, setLc] = useState<string>('');

  // Auto Jump to next text field on Enter / Next key
  const handleFieldKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const allInputs = Array.from(
        document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          '#add-pole-form input:not([type="hidden"]):not([disabled]):not([readonly]):not([type="checkbox"]):not([type="radio"]), #add-pole-form textarea:not([disabled]):not([readonly])'
        )
      );
      const currentIndex = allInputs.indexOf(e.currentTarget);
      if (currentIndex !== -1 && currentIndex < allInputs.length - 1) {
        allInputs[currentIndex + 1].focus();
      }
    }
  };

  // UI state
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper to load existing poles for this DTR
  const getExistingPoles = (): PoleModel[] => {
    try {
      const saved = localStorage.getItem(`ns_poles_${dtr?.id || 'default'}`);
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      {
        id: 'pole_1',
        slNo: 1,
        typeOfPole: 'New pole',
        gpsNo: '',
        poleNo: 'P1',
        routhLength: 45.0,
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
        dtrId: dtr?.id || 'dtr_1',
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
    ];
  };

  // Initialize data
  useEffect(() => {
    if (poleToEdit) {
      setSlNo(poleToEdit.slNo);
      setTypeOfPole(poleToEdit.typeOfPole);
      setGpsNo(poleToEdit.gpsNo || '');
      setShowGpsField(!!poleToEdit.gpsNo);
      setPoleNo(poleToEdit.poleNo);
      setIsPoleNoReadOnly(
        poleToEdit.typeOfPole === 'New pole' || poleToEdit.typeOfPole === 'Ex Pole'
      );
      setRouthLength(poleToEdit.routhLength.toString());
      setNewPole(poleToEdit.newPole.toString());
      setStaySet(poleToEdit.staySet.toString());
      setStayClampType1(poleToEdit.stayClampType1.toString());
      setStayClampType2(poleToEdit.stayClampType2.toString());
      setGiEarthSpike(poleToEdit.giEarthSpike.toString());
      setSuspension(poleToEdit.suspension.toString());
      setDeadEnd(poleToEdit.deadEnd.toString());
      setDistributionJunctionBox(poleToEdit.distributionJunctionBox.toString());
      setEyeHook(poleToEdit.eyeHook.toString());
      setLtPoleClampType1(poleToEdit.ltPoleClampType1.toString());
      setLtPoleClampType2(poleToEdit.ltPoleClampType2.toString());
      setIpcForDB50To70(poleToEdit.ipcForDB50To70.toString());
      setIpcFor16SQMM(poleToEdit.ipcFor16SQMM.toString());
      setIpcForAbcToAbc50To70SQMM(poleToEdit.ipcForAbcToAbc50To70SQMM.toString());
      setStj70(poleToEdit.straightThroughJoint70SQMM.toString());
      setStj16(poleToEdit.straightThroughJoint16SQMM.toString());
      setStj50(poleToEdit.straightThroughJoint50SQMM.toString());
      setShowStraightThroughJoint(
        poleToEdit.straightThroughJoint70SQMM > 0 ||
          poleToEdit.straightThroughJoint16SQMM > 0 ||
          poleToEdit.straightThroughJoint50SQMM > 0
      );
      setServiceConnection1ph(poleToEdit.serviceConnection1ph.toString());
      setServiceConnection3ph(poleToEdit.serviceConnection3ph.toString());
      setRemarks(poleToEdit.remarks || '');

      setLtBracket1Ph(poleToEdit.ltBracket1Ph.toString());
      setLtBracket3Ph(poleToEdit.ltBracket3Ph.toString());
      setSelectedWireType(poleToEdit.wireType || '');
      setSelectedWireConfig(poleToEdit.wireConfiguration || '');

      setBackClamp(poleToEdit.backClamp.toString());
      setDIronClamp(poleToEdit.dIronClamp.toString());
      setShackleInsulator(poleToEdit.shackleInsulator.toString());
      setCiReel(poleToEdit.ciReel.toString());
      setShackleStrap(poleToEdit.shackleStrap.toString());
      setBoxBracket(poleToEdit.boxBracket.toString());
      setLc(poleToEdit.lc.toString());
      setExStayValue(poleToEdit.exStay.toString());

      if (poleToEdit.exStay === 0) setExStayOption(0);
      else if (poleToEdit.exStay === 1) setExStayOption(1);
      else setExStayOption(2);

      const isNoDismantle =
        poleToEdit.ltBracket1Ph === 0 &&
        poleToEdit.ltBracket3Ph === 0 &&
        poleToEdit.backClamp === 0 &&
        poleToEdit.dIronClamp === 0 &&
        poleToEdit.shackleInsulator === 0 &&
        poleToEdit.ciReel === 0 &&
        poleToEdit.shackleStrap === 0 &&
        poleToEdit.boxBracket === 0 &&
        poleToEdit.lc === 0 &&
        poleToEdit.exStay === 0;
      setIsDismantle(isNoDismantle);
    } else {
      // Calculate next SL NO
      const existing = getExistingPoles();
      if (insertAtIndex !== null && insertAtIndex !== undefined && insertAtIndex >= 0) {
        setSlNo(insertAtIndex + 1);
        setCurrentInsertIndex(insertAtIndex);
      } else {
        setSlNo(existing.length + 1);
        setCurrentInsertIndex(null);
      }
      setExStayOption(0);
      setExStayValue('');
      setStj70('');
      setStj16('');
      setStj50('');
    }
  }, [poleToEdit, insertAtIndex]);

  // Auto-calculation: Stay Clamp Types from Stay Set
  const handleStaySetChange = (val: string) => {
    setStaySet(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      if (num === 1) {
        setStayClampType1('1');
        setStayClampType2('');
      } else if (num === 2) {
        setStayClampType1('1');
        setStayClampType2('1');
      } else if (num === 3) {
        setStayClampType1('2');
        setStayClampType2('1');
      } else if (num === 4) {
        setStayClampType1('2');
        setStayClampType2('2');
      } else {
        setStayClampType1(val);
        setStayClampType2('');
      }
    } else {
      setStayClampType1('');
      setStayClampType2('');
    }
  };

  // Auto-calculation: Eye Hook = Suspension + Dead End
  const handleSuspensionOrDeadEndChange = (
    suspVal: string,
    deadEndVal: string
  ) => {
    const s = parseInt(suspVal, 10) || 0;
    const d = parseInt(deadEndVal, 10) || 0;
    const total = s + d > 0 ? (s + d).toString() : '';
    setEyeHook(total);
    setLtPoleClampType1(total);
  };

  // Auto-calculation: Distribution Junction Box -> IPC DB 50-70 = DB * 4
  const handleDistributionJunctionBoxChange = (val: string) => {
    setDistributionJunctionBox(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setIpcForDB50To70((num * 4).toString());
    } else {
      setIpcForDB50To70('');
    }
  };

  // Auto-fill DB from Service Connections if DB is empty/0
  const handleServiceConnectionChange = (ph1: string, ph3: string) => {
    const s1 = parseInt(ph1, 10) || 0;
    const s3 = parseInt(ph3, 10) || 0;
    if ((s1 > 0 || s3 > 0) && (!distributionJunctionBox || distributionJunctionBox === '0')) {
      setDistributionJunctionBox('1');
      setIpcForDB50To70('4');
    }
  };

  // Generate Pole Number based on prefix & existing poles
  const generatePoleNumber = (type: string) => {
    const existing = getExistingPoles();
    if (type === 'New pole') {
      setIsPoleNoReadOnly(true);
    } else if (type === 'Ex Pole') {
      setIsPoleNoReadOnly(false);
    } else {
      setIsPoleNoReadOnly(false);
    }

    const targetIndex = currentInsertIndex !== null && currentInsertIndex !== undefined
      ? currentInsertIndex
      : existing.length;

    const { prospectivePoleNo, shiftMessage } = calculateProspectivePoleNo(existing, targetIndex, type);
    setPoleNo(prospectivePoleNo);

    if (currentInsertIndex !== null && currentInsertIndex !== undefined && currentInsertIndex < existing.length) {
      setMidSpanShiftNotice(shiftMessage);
    } else {
      setMidSpanShiftNotice(null);
    }
  };

  // Handle Type of Pole Selection
  const handleSelectPoleType = (type: string) => {
    setTypeOfPole(type);
    if (type === 'New pole') {
      setNewPole('1');
      setGiEarthSpike('1');
      setIsDismantle(true);
      setLtBracket1Ph('');
      setLtBracket3Ph('');
      setBackClamp('');
      setDIronClamp('');
      setShackleInsulator('');
      setCiReel('');
      setShackleStrap('');
      setBoxBracket('');
      setLc('');
      setExStayValue('');
      setExStayOption(0);
      // For New Pole, do not show 'NO DISMANTLE' in remarks
      if (remarks === 'NO DISMANTLE') {
        setRemarks('');
      }
    } else {
      setNewPole('');
      setGiEarthSpike('');
      setIsDismantle(false);
      if (remarks === 'NO DISMANTLE') {
        setRemarks('');
      }
    }
    generatePoleNumber(type);
  };

  // Wire Configuration logic
  const handleSelectWireConfig = (configVal: string) => {
    const newConfig = selectedWireConfig === configVal ? '' : configVal;
    setSelectedWireConfig(newConfig);

    if (newConfig === '2 wire') {
      setLtBracket1Ph('1');
      setLtBracket3Ph('');
      setBackClamp('4');
      setDIronClamp('2');
      setShackleInsulator('2');
    } else if (
      newConfig === '3 wire' ||
      newConfig === '4 wire' ||
      newConfig === '5 wire'
    ) {
      setLtBracket1Ph('');
      setLtBracket3Ph('1');
      setBackClamp('4');
      const clampQty =
        newConfig === '3 wire' ? '3' : newConfig === '4 wire' ? '4' : '5';
      setDIronClamp(clampQty);
      setShackleInsulator(clampQty);
    } else {
      setLtBracket1Ph('');
      setLtBracket3Ph('');
      setBackClamp('');
      setDIronClamp('');
      setShackleInsulator('');
    }
  };

  // Ex-Stay selection logic
  const handleSelectExStayOption = (option: number) => {
    setExStayOption(option);
    if (option === 0) {
      setExStayValue('');
      if (!isDismantle && typeOfPole !== 'New pole' && remarks.startsWith('EX STAY')) {
        setRemarks('');
      }
    } else if (option === 1) {
      setExStayValue('1');
      if (!isDismantle && typeOfPole !== 'New pole') {
        setRemarks('EX STAY 1');
      }
    } else {
      setExStayValue('');
    }
  };

  const handleExStayCustomChange = (val: string) => {
    setExStayValue(val);
    if (val.trim() && val.trim() !== '0' && !isDismantle && typeOfPole !== 'New pole') {
      setRemarks(`EX STAY ${val.trim()}`);
    }
  };

  // Dismantle toggle logic
  const handleToggleNoDismantle = (checked: boolean) => {
    setIsDismantle(checked);
    if (checked) {
      setLtBracket1Ph('');
      setLtBracket3Ph('');
      setBackClamp('');
      setDIronClamp('');
      setShackleInsulator('');
      setCiReel('');
      setShackleStrap('');
      setBoxBracket('');
      setLc('');
      setExStayValue('');
      setExStayOption(0);
      // ONLY set remarks to 'NO DISMANTLE' if user selects 'Ex Pole' or 'Others' (NOT for 'New pole')
      if (typeOfPole !== 'New pole' && (typeOfPole === 'Ex Pole' || typeOfPole === 'Others')) {
        setRemarks('NO DISMANTLE');
      }
    } else {
      if (remarks === 'NO DISMANTLE') {
        setRemarks('');
      }
    }
  };

  // Validation - Type of Pole, Route Length, Wire Specification & Wire Configuration are mandatory
  const isMandatoryFilled = () => {
    return (
      typeOfPole !== '' &&
      routhLength.trim() !== '' &&
      selectedWireType.trim() !== '' &&
      selectedWireConfig.trim() !== ''
    );
  };

  const savePoleData = (andAddNew: boolean = false) => {
    if (!typeOfPole) {
      showToast('⚠️ Mandatory: Please select Type of Pole');
      return;
    }
    if (!routhLength.trim() || isNaN(parseFloat(routhLength))) {
      showToast('⚠️ Mandatory: Please enter Route Length (mtr)');
      return;
    }
    if (!selectedWireType.trim()) {
      showToast('⚠️ Mandatory: Wire Specification must be selected');
      return;
    }
    if (!selectedWireConfig.trim()) {
      showToast('⚠️ Mandatory: Wire Configuration must be selected');
      return;
    }

    const poleData: PoleModel = {
      id: poleToEdit?.id || `pole_${Date.now()}`,
      slNo,
      typeOfPole,
      gpsNo,
      poleNo,
      routhLength: parseFloat(routhLength) || 0,
      newPole: parseInt(newPole, 10) || 0,
      staySet: parseInt(staySet, 10) || 0,
      stayClampType1: parseInt(stayClampType1, 10) || 0,
      stayClampType2: parseInt(stayClampType2, 10) || 0,
      giEarthSpike: parseInt(giEarthSpike, 10) || 0,
      suspension: parseInt(suspension, 10) || 0,
      deadEnd: parseInt(deadEnd, 10) || 0,
      distributionJunctionBox: parseInt(distributionJunctionBox, 10) || 0,
      eyeHook: parseInt(eyeHook, 10) || 0,
      ltPoleClampType1: parseInt(ltPoleClampType1, 10) || 0,
      ltPoleClampType2: parseInt(ltPoleClampType2, 10) || 0,
      ipcForDB50To70: parseInt(ipcForDB50To70, 10) || 0,
      ipcFor16SQMM: parseInt(ipcFor16SQMM, 10) || 0,
      ipcForAbcToAbc50To70SQMM: parseInt(ipcForAbcToAbc50To70SQMM, 10) || 0,
      straightThroughJoint70SQMM: showStraightThroughJoint ? parseInt(stj70, 10) || 0 : 0,
      straightThroughJoint16SQMM: showStraightThroughJoint ? parseInt(stj16, 10) || 0 : 0,
      straightThroughJoint50SQMM: showStraightThroughJoint ? parseInt(stj50, 10) || 0 : 0,
      serviceConnection1ph: parseInt(serviceConnection1ph, 10) || 0,
      serviceConnection3ph: parseInt(serviceConnection3ph, 10) || 0,
      remarks,
      dtrId: dtr?.id || 'dtr_1',
      ltBracket1Ph: isDismantle ? 0 : parseInt(ltBracket1Ph, 10) || 0,
      ltBracket3Ph: isDismantle ? 0 : parseInt(ltBracket3Ph, 10) || 0,
      backClamp: isDismantle ? 0 : parseInt(backClamp, 10) || 0,
      dIronClamp: isDismantle ? 0 : parseInt(dIronClamp, 10) || 0,
      shackleInsulator: isDismantle ? 0 : parseInt(shackleInsulator, 10) || 0,
      ciReel: isDismantle ? 0 : parseInt(ciReel, 10) || 0,
      shackleStrap: isDismantle ? 0 : parseInt(shackleStrap, 10) || 0,
      boxBracket: isDismantle ? 0 : parseInt(boxBracket, 10) || 0,
      lc: isDismantle ? 0 : parseInt(lc, 10) || 0,
      exStay: isDismantle ? 0 : parseInt(exStayValue, 10) || 0,
      wireType: selectedWireType,
      wireConfiguration: selectedWireConfig,
    };

    // Save to LocalStorage with automatic sequence renumbering
    try {
      const storageKey = `ns_poles_${dtr?.id || 'default'}`;
      const existing = getExistingPoles();
      let updated: PoleModel[];
      if (poleToEdit) {
        const replaced = existing.map((p) => (p.id === poleToEdit.id ? poleData : p));
        updated = resequencePolesList(replaced);
      } else if (
        currentInsertIndex !== null &&
        currentInsertIndex !== undefined &&
        currentInsertIndex >= 0 &&
        currentInsertIndex <= existing.length
      ) {
        const copy = [...existing];
        copy.splice(currentInsertIndex, 0, poleData);
        updated = resequencePolesList(copy);
      } else {
        const copy = [...existing, poleData];
        updated = resequencePolesList(copy);
      }
      localStorage.setItem(storageKey, JSON.stringify(updated));
      // Cloud sync to Firebase Firestore
      syncPolesToCloud(updated).catch((e) => console.warn('Firestore Pole sync notice:', e));
    } catch (_) {}

    if (onSaved) onSaved(poleData);

    if (andAddNew) {
      showToast('Pole saved & re-sequenced! Ready for next pole.');
      // Reset form
      setSlNo((prev) => prev + 1);
      if (currentInsertIndex !== null) {
        setCurrentInsertIndex((prev) => (prev !== null ? prev + 1 : null));
      }
      setTypeOfPole('');
      setGpsNo('');
      setPoleNo('');
      setMidSpanShiftNotice(null);
      setIsPoleNoReadOnly(true);
      setRouthLength('');
      setNewPole('');
      setStaySet('');
      setStayClampType1('');
      setStayClampType2('');
      setGiEarthSpike('');
      setSuspension('');
      setDeadEnd('');
      setDistributionJunctionBox('');
      setEyeHook('');
      setLtPoleClampType1('');
      setLtPoleClampType2('');
      setIpcForDB50To70('');
      setIpcFor16SQMM('');
      setIpcForAbcToAbc50To70SQMM('');
      setStj70('');
      setStj16('');
      setStj50('');
      setShowStraightThroughJoint(false);
      setServiceConnection1ph('');
      setServiceConnection3ph('');
      setRemarks('');
      setLtBracket1Ph('');
      setLtBracket3Ph('');
      setBackClamp('');
      setDIronClamp('');
      setShackleInsulator('');
      setCiReel('');
      setShackleStrap('');
      setBoxBracket('');
      setLc('');
      setExStayOption(0);
      setExStayValue('');
      setSelectedWireType('');
      setSelectedWireConfig('');
      setIsDismantle(false);
    } else {
      showToast(
        poleToEdit
          ? 'Pole updated successfully'
          : isMidSpan
          ? 'Mid-span pole inserted & re-sequenced!'
          : 'Pole added successfully'
      );
      setTimeout(() => onBack(), 400);
    }
  };

  const handleDeletePole = () => {
    if (!poleToEdit) return;
    try {
      const storageKey = `ns_poles_${dtr?.id || 'default'}`;
      const existing = getExistingPoles();
      const filtered = existing.filter((p) => p.id !== poleToEdit.id);
      const updated = resequencePolesList(filtered);
      localStorage.setItem(storageKey, JSON.stringify(updated));
      syncPolesToCloud(updated).catch((e) => console.warn('Firestore Pole sync notice:', e));
    } catch (_) {}

    if (onDeleted) onDeleted(poleToEdit.id);
    setShowDeleteModal(false);
    showToast('Pole deleted! Remaining poles re-sequenced.');
    setTimeout(() => onBack(), 400);
  };

  const isFormValid = isMandatoryFilled();

  return (
    <div className="w-full h-full bg-[#f8fafc] text-slate-800 flex flex-col font-['Plus_Jakarta_Sans',sans-serif] overflow-hidden select-none">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="absolute inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-5 max-w-xs w-full shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <h3 className="font-bold text-base text-slate-900">Delete Pole</h3>
            <p className="text-xs text-slate-600 mt-2">
              Are you sure you want to delete Pole {poleNo}? Remaining poles will be automatically re-sequenced.
            </p>
            <div className="flex gap-2.5 mt-5">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePole}
                className="flex-1 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modern Flutter AppBar */}
      <div className="bg-gradient-to-r from-[#0A192F] via-[#0B2D52] to-[#044343] px-4 pt-10 pb-3.5 text-white shadow-md flex items-center justify-between z-20 shrink-0 border-b border-teal-500/20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 flex items-center justify-center transition active:scale-95 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </button>
          <div>
            <h2 className="font-extrabold text-base leading-tight">
              {poleToEdit ? 'Edit Pole' : isMidSpan ? 'Add Mid Span Pole' : 'Add New Pole'}
            </h2>
            <p className="text-[11px] text-teal-300/85 font-medium">
              {dtr?.dtrCode ? `DTR: ${dtr.dtrCode}` : 'Electrical Survey'}
            </p>
          </div>
        </div>

        {poleToEdit && (
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-8 h-8 rounded-xl bg-rose-500/30 hover:bg-rose-500/50 border border-rose-300/40 flex items-center justify-center text-white transition cursor-pointer"
            title="Delete Pole"
          >
            <Trash2 className="w-4 h-4 text-white" />
          </button>
        )}
      </div>

      {/* Scrollable Form Body */}
      <div id="add-pole-form" className="flex-1 overflow-y-auto p-4 space-y-4 pb-36 text-xs">
        {/* Mid Span Insertion Context Banner */}
        {isMidSpan && currentInsertIndex !== null && (
          <div className="bg-gradient-to-r from-cyan-950 via-teal-950 to-slate-900 border border-cyan-500/40 rounded-2xl p-3.5 flex items-center justify-between text-cyan-200 shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-300 flex items-center justify-center border border-cyan-400/30 shrink-0">
                <GitCommit className="w-4 h-4 text-cyan-300" />
              </div>
              <div>
                <div className="font-bold text-xs text-white flex items-center gap-1.5">
                  <span>Mid-Span Pole Insertion</span>
                  <span className="text-[9px] bg-cyan-400/20 text-cyan-300 px-2 py-0.5 rounded-full font-mono font-bold">
                    Pos #{currentInsertIndex + 1}
                  </span>
                </div>
                <div className="text-[11px] text-cyan-200/85 font-medium mt-0.5">
                  {insertContext?.beforePoleNo && insertContext?.afterPoleNo ? (
                    <span>
                      Inserting between <strong className="text-white font-mono">{insertContext.beforePoleNo}</strong> and <strong className="text-white font-mono">{insertContext.afterPoleNo}</strong>
                    </span>
                  ) : insertContext?.beforePoleNo ? (
                    <span>
                      Inserting after <strong className="text-white font-mono">{insertContext.beforePoleNo}</strong>
                    </span>
                  ) : insertContext?.afterPoleNo ? (
                    <span>
                      Inserting before <strong className="text-white font-mono">{insertContext.afterPoleNo}</strong>
                    </span>
                  ) : (
                    <span>Mid-span route insertion</span>
                  )}
                </div>
              </div>
            </div>
            <span className="text-[9px] bg-teal-400/15 text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded-full font-semibold shrink-0">
              Auto Shift
            </span>
          </div>
        )}

        {/* Section 1: Basic Information */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A896]" />
            Basic Information
          </h3>

          {/* SL NO Read Only */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 flex items-center justify-between">
            <span className="font-medium text-slate-600">Sl No:</span>
            <span className="font-bold text-slate-900">{slNo}</span>
          </div>

          {/* Type of Pole Selection */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1.5">
              Type of Pole
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['New pole', 'Ex Pole', 'Others'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectPoleType(type)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition border cursor-pointer text-center ${
                    typeOfPole === type
                      ? 'bg-teal-50 border-[#00A896] text-[#044343] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            {!typeOfPole && (
              <p className="text-rose-500 text-[11px] mt-1 italic">
                * Please select a pole type
              </p>
            )}

            {/* Mid Span Shift Notice */}
            {midSpanShiftNotice && (
              <div className="mt-2 p-2.5 rounded-xl bg-cyan-50 border border-cyan-200 text-cyan-900 text-[11px] font-medium flex items-center gap-2 animate-in fade-in">
                <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>{midSpanShiftNotice}</span>
              </div>
            )}
          </div>

          {/* Add GPS No Toggle */}
          <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={showGpsField}
              onChange={(e) => setShowGpsField(e.target.checked)}
              className="rounded border-slate-300 text-[#00A896] focus:ring-[#00A896] w-4 h-4 cursor-pointer"
            />
            <span>Add GPS Number</span>
          </label>

          {showGpsField && (
            <div>
              <label className="block text-slate-600 font-semibold mb-1">
                GPS No (Optional)
              </label>
              <input
                type="text"
                value={gpsNo}
                onChange={(e) => setGpsNo(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder="Enter GPS coordinates or waypoint"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          )}

          {/* Pole No */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Pole No
            </label>
            <input
              type="text"
              value={poleNo}
              readOnly={isPoleNoReadOnly}
              onChange={(e) => setPoleNo(e.target.value)}
              onKeyDown={handleFieldKeyDown}
              placeholder="e.g. P1, E1"
              className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none ${
                isPoleNoReadOnly
                  ? 'bg-slate-100 border-slate-200 text-slate-600 cursor-not-allowed font-bold'
                  : 'bg-white border-slate-300 text-slate-900 focus:border-[#00A896]'
              }`}
            />
          </div>

          {/* Route Length (mtr) */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              Route Length (mtr) *
            </label>
            <input
              type="number"
              step="0.1"
              value={routhLength}
              onChange={(e) => setRouthLength(e.target.value)}
              onKeyDown={handleFieldKeyDown}
              placeholder="e.g. 45.0"
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
            />
          </div>

          {/* New Pole 8mtr PCC */}
          <div>
            <label className="block text-slate-600 font-semibold mb-1">
              New Pole 8mtr PCC
            </label>
            <input
              type="number"
              value={newPole}
              onChange={(e) => setNewPole(e.target.value)}
              onKeyDown={handleFieldKeyDown}
              placeholder=""
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
            />
          </div>
        </div>

        {/* Section 2: Accessories */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B2D52]" />
            Accessories (Auto-Calculated)
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Stay Set
              </label>
              <input
                type="number"
                value={staySet}
                onChange={(e) => handleStaySetChange(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Stay Clamp Type 1
              </label>
              <input
                type="number"
                value={stayClampType1}
                onChange={(e) => setStayClampType1(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] font-semibold text-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Stay Clamp Type 2
              </label>
              <input
                type="number"
                value={stayClampType2}
                onChange={(e) => setStayClampType2(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                GI Earth Spike
              </label>
              <input
                type="number"
                value={giEarthSpike}
                onChange={(e) => setGiEarthSpike(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Suspension
              </label>
              <input
                type="number"
                value={suspension}
                onChange={(e) => {
                  setSuspension(e.target.value);
                  handleSuspensionOrDeadEndChange(e.target.value, deadEnd);
                }}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Dead End
              </label>
              <input
                type="number"
                value={deadEnd}
                onChange={(e) => {
                  setDeadEnd(e.target.value);
                  handleSuspensionOrDeadEndChange(suspension, e.target.value);
                }}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Distribution DB
              </label>
              <input
                type="number"
                value={distributionJunctionBox}
                onChange={(e) => handleDistributionJunctionBoxChange(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Eye Hook (Auto)
              </label>
              <input
                type="number"
                value={eyeHook}
                onChange={(e) => setEyeHook(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] font-semibold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 3: LT Pole Clamps */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            LT Pole Clamps
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Type 1 (Auto)
              </label>
              <input
                type="number"
                value={ltPoleClampType1}
                onChange={(e) => setLtPoleClampType1(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] font-semibold text-slate-800"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Type 2
              </label>
              <input
                type="number"
                value={ltPoleClampType2}
                onChange={(e) => setLtPoleClampType2(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>
        </div>

        {/* Section 4: IPC (Insulation Piercing Connector) */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#044343]" />
            IPC
          </h3>
          <div className="space-y-2.5">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                DB 50 To 70 (DB × 4)
              </label>
              <input
                type="number"
                value={ipcForDB50To70}
                onChange={(e) => setIpcForDB50To70(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] font-semibold text-slate-800"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  16 SQMM
                </label>
                <input
                  type="number"
                  value={ipcFor16SQMM}
                  onChange={(e) => setIpcFor16SQMM(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  ABC To ABC 50-70
                </label>
                <input
                  type="number"
                  value={ipcForAbcToAbc50To70SQMM}
                  onChange={(e) => setIpcForAbcToAbc50To70SQMM(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Straight Through Joint */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A896]" />
            Straight Through Joint
          </h3>
          <label className="flex items-center gap-2 text-slate-700 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={showStraightThroughJoint}
              onChange={(e) => {
                const isChecked = e.target.checked;
                setShowStraightThroughJoint(isChecked);
                if (!isChecked) {
                  setStj70('');
                  setStj16('');
                  setStj50('');
                }
              }}
              className="rounded border-slate-300 text-[#00A896] focus:ring-[#00A896] w-4 h-4 cursor-pointer"
            />
            <span>Add Straight Through Joint Details</span>
          </label>

          {showStraightThroughJoint && (
            <div className="grid grid-cols-3 gap-2.5 pt-2 animate-in fade-in">
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  70 SQMM
                </label>
                <input
                  type="number"
                  value={stj70}
                  onChange={(e) => setStj70(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  16 SQMM
                </label>
                <input
                  type="number"
                  value={stj16}
                  onChange={(e) => setStj16(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  50 SQMM
                </label>
                <input
                  type="number"
                  value={stj50}
                  onChange={(e) => setStj50(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 6: Service Connection */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0B2D52]" />
            Service Connection
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                1 Phase
              </label>
              <input
                type="number"
                value={serviceConnection1ph}
                onChange={(e) => {
                  setServiceConnection1ph(e.target.value);
                  handleServiceConnectionChange(e.target.value, serviceConnection3ph);
                }}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                3 Phase
              </label>
              <input
                type="number"
                value={serviceConnection3ph}
                onChange={(e) => {
                  setServiceConnection3ph(e.target.value);
                  handleServiceConnectionChange(serviceConnection1ph, e.target.value);
                }}
                onKeyDown={handleFieldKeyDown}
                placeholder=""
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          </div>
        </div>

        {/* Section 7: Ex-STAY Selection */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Ex-STAY
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {[
              { val: 0, label: 'No Ex Stay', sub: '0 value' },
              { val: 1, label: '1 Ex Stay', sub: 'Value: 1' },
              { val: 2, label: 'Enter Value', sub: 'Custom' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() => handleSelectExStayOption(item.val)}
                className={`py-2 px-1.5 rounded-xl border text-center transition cursor-pointer ${
                  exStayOption === item.val
                    ? 'bg-teal-50 border-[#00A896] text-[#044343] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs">{item.label}</div>
                <div className="text-[10px] text-slate-500">{item.sub}</div>
              </button>
            ))}
          </div>

          {exStayOption === 2 ? (
            <div>
              <label className="block text-slate-600 font-medium mb-1">
                Ex-STAY Custom Value
              </label>
              <input
                type="number"
                value={exStayValue}
                onChange={(e) => handleExStayCustomChange(e.target.value)}
                onKeyDown={handleFieldKeyDown}
                placeholder="Enter qty"
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
              />
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs flex items-center justify-between">
              <span className="text-slate-600 font-medium">Ex-STAY Value:</span>
              <span className="font-bold text-slate-900">
                {exStayOption === 0 ? '0 (No Ex Stay)' : '1 (1 Ex Stay)'}
              </span>
            </div>
          )}
        </div>

        {/* Section 8: Wire Specification (MANDATORY) */}
        <div
          id="wire-spec-section"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#00A896]" />
              <span>Wire Specification</span>
              <span className="text-rose-500 font-black">*</span>
            </h3>
            {selectedWireType && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-100 text-emerald-700">
                Selected ✓
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Select Wire Type (Only one can be selected):
          </p>

          <div className="space-y-1.5">
            {[
              { id: 'ACSR 50 sqmm', label: 'ACSR 50 sqmm' },
              { id: 'ACSR 30 sqmm', label: 'ACSR 30 sqmm' },
              { id: 'AAC 50 sqmm', label: 'AAC 50 sqmm' },
              { id: 'AAC 25 sqmm', label: 'AAC 25 sqmm' },
              { id: 'ACSR 20 sqmm', label: 'ACSR 20 sqmm' },
            ].map((wire) => {
              const isSelected = selectedWireType === wire.id;
              return (
                <button
                  key={wire.id}
                  type="button"
                  onClick={() => setSelectedWireType(wire.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-teal-50 border-[#00A896] text-[#044343] shadow-xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        isSelected
                          ? 'border-[#00A896] bg-[#00A896]'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </span>
                    <span className="font-semibold text-xs text-slate-800">{wire.label}</span>
                  </div>
                  {isSelected && (
                    <Check className="w-4 h-4 text-[#00A896]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 9: Wire Configuration (MANDATORY) */}
        <div
          id="wire-config-section"
          className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0B2D52]" />
              <span>Wire Configuration</span>
              <span className="text-rose-500 font-black">*</span>
            </h3>
            {selectedWireConfig && (
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider bg-emerald-100 text-emerald-700">
                Selected ✓
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-500">
            Select conductor wire line arrangement (Auto-calculates LT brackets &amp; shackle fittings):
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            {[
              {
                id: '2 wire',
                title: '2 Wire',
                sub: '1-Ph LT (Phase + Neutral)',
                detail: '1 Ph Bracket + 2 Clamps',
              },
              {
                id: '3 wire',
                title: '3 Wire',
                sub: '3-Phase LT (R-Y-B)',
                detail: '3 Ph Bracket + 3 Clamps',
              },
              {
                id: '4 wire',
                title: '4 Wire',
                sub: '3-Ph + Neutral (Standard)',
                detail: '3 Ph Bracket + 4 Clamps',
              },
              {
                id: '5 wire',
                title: '5 Wire',
                sub: '3-Ph + Neutral + Streetlight',
                detail: '3 Ph Bracket + 5 Clamps',
              },
            ].map((cfg) => {
              const isSelected = selectedWireConfig === cfg.id;
              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => handleSelectWireConfig(cfg.id)}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-br from-teal-50 to-emerald-50/40 border-[#00A896] text-[#044343] shadow-xs ring-1 ring-[#00A896]'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="font-extrabold text-xs text-slate-900">{cfg.title}</span>
                    {isSelected ? (
                      <div className="w-4 h-4 rounded-full bg-[#00A896] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-300" />
                    )}
                  </div>
                  <div className="text-[10px] font-semibold text-slate-600">{cfg.sub}</div>
                  <div className="text-[9px] text-teal-700 font-medium mt-1 bg-teal-100/50 px-1.5 py-0.5 rounded-md inline-block">
                    {cfg.detail}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedWireConfig && (
            <div className="bg-teal-50/80 border border-teal-200 rounded-xl p-2.5 flex items-center justify-between text-xs">
              <span className="font-semibold text-teal-900">
                Active Auto-Fill:
              </span>
              <span className="font-bold text-[#00A896]">
                {selectedWireConfig} Configuration Applied
              </span>
            </div>
          )}
        </div>

        {/* Section 10: Dismantle Inventory */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              Dismantle Inventory
            </h3>
            <label className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={isDismantle}
                onChange={(e) => handleToggleNoDismantle(e.target.checked)}
                className="rounded border-slate-300 text-[#00A896] w-3.5 h-3.5"
              />
              <span>NO DISMANTLE</span>
            </label>
          </div>

          {!isDismantle && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    LT BRACKET 1 PH
                  </label>
                  <input
                    type="number"
                    value={ltBracket1Ph}
                    onChange={(e) => setLtBracket1Ph(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    LT BRACKET 3 PH
                  </label>
                  <input
                    type="number"
                    value={ltBracket3Ph}
                    onChange={(e) => setLtBracket3Ph(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    Back Clamp
                  </label>
                  <input
                    type="number"
                    value={backClamp}
                    onChange={(e) => setBackClamp(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    D IRON CLAMP
                  </label>
                  <input
                    type="number"
                    value={dIronClamp}
                    onChange={(e) => setDIronClamp(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    SHACKLE INSULATOR
                  </label>
                  <input
                    type="number"
                    value={shackleInsulator}
                    onChange={(e) => setShackleInsulator(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    CI REEL
                  </label>
                  <input
                    type="number"
                    value={ciReel}
                    onChange={(e) => setCiReel(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    SHACKLE STRAP
                  </label>
                  <input
                    type="number"
                    value={shackleStrap}
                    onChange={(e) => setShackleStrap(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">
                    BOX BRACKET
                  </label>
                  <input
                    type="number"
                    value={boxBracket}
                    onChange={(e) => setBoxBracket(e.target.value)}
                    onKeyDown={handleFieldKeyDown}
                    placeholder=""
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">
                  L.C
                </label>
                <input
                  type="number"
                  value={lc}
                  onChange={(e) => setLc(e.target.value)}
                  onKeyDown={handleFieldKeyDown}
                  placeholder=""
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Section 11: Remarks */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-sm text-slate-900">Remarks</h3>
          <textarea
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            onKeyDown={handleFieldKeyDown}
            placeholder="Additional pole notes or remarks..."
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#00A896] resize-none"
          />
        </div>
      </div>

      {/* Floating Bottom Action Bar with Mandatory Fields Status */}
      <div className="absolute bottom-10 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 z-30 shadow-2xl">
        {/* Mandatory Fields Quick Status Indicator */}
        <div className="px-3 pt-2 pb-1 border-b border-slate-100 flex items-center justify-between overflow-x-auto gap-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Mandatory:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                typeOfPole
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {typeOfPole ? '✓ Pole Type' : '✗ Pole Type'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                routhLength.trim()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-700'
              }`}
            >
              {routhLength.trim() ? '✓ Length' : '✗ Length'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                selectedWireType.trim()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-700 animate-pulse'
              }`}
            >
              {selectedWireType.trim() ? '✓ Wire Spec' : '✗ Wire Spec'}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-bold flex items-center gap-1 ${
                selectedWireConfig.trim()
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-700 animate-pulse'
              }`}
            >
              {selectedWireConfig.trim() ? '✓ Wire Config' : '✗ Wire Config'}
            </span>
          </div>
        </div>

        <div className="p-3 flex gap-2.5">
          <button
            onClick={() => savePoleData(false)}
            disabled={!isFormValid}
            className={`flex-1 h-12 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-98 ${
              isFormValid
                ? 'bg-gradient-to-r from-[#0B2D52] via-[#0E3C66] to-[#00A896] hover:brightness-110 text-white shadow-teal-950/25 border border-white/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
            }`}
          >
            <Check className="w-4 h-4 text-emerald-300 stroke-[2.5]" />
            <span>{poleToEdit ? 'Update Pole' : 'Save Pole'}</span>
          </button>

          {!poleToEdit && (
            <button
              onClick={() => savePoleData(true)}
              disabled={!isFormValid}
              className={`flex-1 h-12 px-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg active:scale-98 ${
                isFormValid
                  ? 'bg-gradient-to-r from-[#00A896] to-[#028090] hover:brightness-110 text-white shadow-teal-950/25 border border-white/20'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
              }`}
            >
              <Plus className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Add New Pole</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
