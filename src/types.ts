export interface KotlinFile {
  id: string;
  name: string;
  path: string;
  description: string;
  category: 'screen' | 'service' | 'constant' | 'config' | 'model';
  code: string;
}

export type ThemePresetId =
  | 'nordic_teal'
  | 'slate_cobalt'
  | 'sage_eucalyptus'
  | 'cashmere_bronze'
  | 'matte_carbon'
  | 'dusk_indigo'
  | 'bordeaux_wine'
  | 'aegean_marine'
  | 'sandstone_terracotta'
  | 'obsidian_gold'
  | 'glacier_frost'
  | 'matcha_mineral'
  | 'peacock_teal'
  | 'ocean_blue'
  | 'emerald_green'
  | 'electric_violet'
  | 'sunset_amber'
  | 'crimson_energy'
  | 'midnight_slate';

export type FontStyleId =
  | 'syne'
  | 'orbitron'
  | 'rajdhani'
  | 'cinzel'
  | 'outfit'
  | 'plus_jakarta'
  | 'jetbrains';

export interface SplashConfig {
  appName: string;
  appTitle: string;
  logoUrl?: string;
  splashDuration: number; // in seconds
  autoNavigate: boolean;
  isConnected: boolean;
  isLoggedIn: boolean;
  themePreset?: ThemePresetId;
  primaryColor?: string;
  darkMode?: boolean;
  themeGradient: {
    start: string;
    middle: string;
    end: string;
  };
  fontStyle?: FontStyleId;
  animationSpeed: number; // 1 = normal, 0.5 = slow motion, 2 = fast
  showNoInternetDialog: boolean;
}

export type ScreenState = 'splash' | 'login' | 'home' | 'dtr_form' | 'dtr_list' | 'add_pole' | 'pole_schedule' | 'settings';

export interface DTRModel {
  id: string;
  dtrCode: string;
  village: string;
  location: string;
  landMarks?: string;
  capacity: number | string;
  ccc: string;
  routeLength?: number;
  feeder?: string;
  substation?: string;
  drgNo?: string;
  docDate?: string;
  jmcNo?: string;
  gp?: string;
  censusCode?: string;
  block?: string;
  division?: string;
  user?: string;
  newPole?: number;
  staySet?: number;
  stayClampType1?: number;
  stayClampType2?: number;
  giEarthSpike?: number;
  suspension?: number;
  deadEnd?: number;
  distributionJunctionBox?: number;
  eyeHook?: number;
  ltPoleClampType1?: number;
  ltPoleClampType2?: number;
  ipcForDB50To70?: number;
  ipcFor16SQMM?: number;
  ipcForAbcToAbc50To70SQMM?: number;
  straightThroughJoint70SQMM?: number;
  straightThroughJoint16SQMM?: number;
  straightThroughJoint50SQMM?: number;
  serviceConnection1ph?: number;
  serviceConnection3ph?: number;
  ltBracket1Ph?: number;
  ltBracket3Ph?: number;
  backClamp?: number;
  dIronClamp?: number;
  shackleInsulator?: number;
  ciReel?: number;
  shackleStrap?: number;
  boxBracket?: number;
  lc?: number;
  exStay?: number;
  updatedAt?: string;
  [key: string]: any;
}

export interface PoleModel {
  id: string;
  slNo: number;
  typeOfPole: string;
  gpsNo: string;
  poleNo: string;
  routhLength: number;
  newPole: number;
  staySet: number;
  stayClampType1: number;
  stayClampType2: number;
  giEarthSpike: number;
  suspension: number;
  deadEnd: number;
  distributionJunctionBox: number;
  eyeHook: number;
  ltPoleClampType1: number;
  ltPoleClampType2: number;
  ipcForDB50To70: number;
  ipcFor16SQMM: number;
  ipcForAbcToAbc50To70SQMM: number;
  straightThroughJoint70SQMM: number;
  straightThroughJoint16SQMM: number;
  straightThroughJoint50SQMM: number;
  serviceConnection1ph: number;
  serviceConnection3ph: number;
  remarks: string;
  dtrId: string;
  ltBracket1Ph: number;
  ltBracket3Ph: number;
  backClamp: number;
  dIronClamp: number;
  shackleInsulator: number;
  ciReel: number;
  shackleStrap: number;
  boxBracket: number;
  lc: number;
  exStay: number;
  wireType: string;
  wireConfiguration: string;
}

export type DeviceType = 'android_pixel' | 'android_samsung' | 'fullscreen';
