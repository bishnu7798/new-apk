import { SplashConfig, ThemePresetId, FontStyleId } from '../types';

export interface ThemeDefinition {
  id: ThemePresetId;
  name: string;
  badge: string;
  primary: string;
  primaryHover: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  gradient: {
    start: string;
    middle: string;
    end: string;
    css: string;
  };
  headerBg: string;
  chipBg: string;
  chipText: string;
}

export const THEME_PRESETS: ThemeDefinition[] = [
  {
    id: 'peacock_teal',
    name: 'Nordic Teal',
    badge: 'Executive',
    primary: '#0D9488',
    primaryHover: '#0F766E',
    primaryLight: '#F0FDFA',
    primaryDark: '#134E4A',
    accent: '#2DD4BF',
    gradient: {
      start: '#042F2E',
      middle: '#0F766E',
      end: '#134E4A',
      css: 'from-[#042F2E] via-[#0F766E] to-[#134E4A]',
    },
    headerBg: 'from-[#042F2E] via-[#0F766E] to-[#134E4A]',
    chipBg: 'bg-teal-50 dark:bg-teal-950/60',
    chipText: 'text-teal-700 dark:text-teal-300',
  },
  {
    id: 'slate_cobalt',
    name: 'Executive Slate',
    badge: 'Enterprise',
    primary: '#2563EB',
    primaryHover: '#1D4ED8',
    primaryLight: '#EFF6FF',
    primaryDark: '#1E3A8A',
    accent: '#60A5FA',
    gradient: {
      start: '#0F172A',
      middle: '#1E293B',
      end: '#1E3A8A',
      css: 'from-[#0F172A] via-[#1E293B] to-[#1E3A8A]',
    },
    headerBg: 'from-[#0F172A] via-[#1E293B] to-[#1E3A8A]',
    chipBg: 'bg-blue-50 dark:bg-blue-950/60',
    chipText: 'text-blue-700 dark:text-blue-300',
  },
  {
    id: 'ocean_blue',
    name: 'Aegean Horizon',
    badge: 'Marine Pro',
    primary: '#0284C7',
    primaryHover: '#0369A1',
    primaryLight: '#F0F9FF',
    primaryDark: '#075985',
    accent: '#38BDF8',
    gradient: {
      start: '#082F49',
      middle: '#0C4A6E',
      end: '#075985',
      css: 'from-[#082F49] via-[#0C4A6E] to-[#075985]',
    },
    headerBg: 'from-[#082F49] via-[#0C4A6E] to-[#075985]',
    chipBg: 'bg-sky-50 dark:bg-sky-950/60',
    chipText: 'text-sky-700 dark:text-sky-300',
  },
  {
    id: 'sage_eucalyptus',
    name: 'Sage & Spruce',
    badge: 'Botanical',
    primary: '#059669',
    primaryHover: '#047857',
    primaryLight: '#ECFDF5',
    primaryDark: '#065F46',
    accent: '#34D399',
    gradient: {
      start: '#022C22',
      middle: '#065F46',
      end: '#047857',
      css: 'from-[#022C22] via-[#065F46] to-[#047857]',
    },
    headerBg: 'from-[#022C22] via-[#065F46] to-[#047857]',
    chipBg: 'bg-emerald-50 dark:bg-emerald-950/60',
    chipText: 'text-emerald-700 dark:text-emerald-300',
  },
  {
    id: 'cashmere_bronze',
    name: 'Warm Cashmere',
    badge: 'Prestige',
    primary: '#B45309',
    primaryHover: '#92400E',
    primaryLight: '#FFFBEB',
    primaryDark: '#78350F',
    accent: '#FBBF24',
    gradient: {
      start: '#1C1917',
      middle: '#44403C',
      end: '#78350F',
      css: 'from-[#1C1917] via-[#44403C] to-[#78350F]',
    },
    headerBg: 'from-[#1C1917] via-[#44403C] to-[#78350F]',
    chipBg: 'bg-amber-50 dark:bg-amber-950/60',
    chipText: 'text-amber-800 dark:text-amber-300',
  },
  {
    id: 'dusk_indigo',
    name: 'Dusk Lavender',
    badge: 'Twilight',
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryLight: '#EEF2FF',
    primaryDark: '#3730A3',
    accent: '#A5B4FC',
    gradient: {
      start: '#1E1B4B',
      middle: '#312E81',
      end: '#3730A3',
      css: 'from-[#1E1B4B] via-[#312E81] to-[#3730A3]',
    },
    headerBg: 'from-[#1E1B4B] via-[#312E81] to-[#3730A3]',
    chipBg: 'bg-indigo-50 dark:bg-indigo-950/60',
    chipText: 'text-indigo-700 dark:text-indigo-300',
  },
  {
    id: 'bordeaux_wine',
    name: 'Bordeaux Velvet',
    badge: 'Luxury Wine',
    primary: '#BE123C',
    primaryHover: '#9F1239',
    primaryLight: '#FFF1F2',
    primaryDark: '#881337',
    accent: '#FDA4AF',
    gradient: {
      start: '#4C0519',
      middle: '#881337',
      end: '#4A044E',
      css: 'from-[#4C0519] via-[#881337] to-[#4A044E]',
    },
    headerBg: 'from-[#4C0519] via-[#881337] to-[#4A044E]',
    chipBg: 'bg-rose-50 dark:bg-rose-950/60',
    chipText: 'text-rose-700 dark:text-rose-300',
  },
  {
    id: 'midnight_slate',
    name: 'Matte Titanium',
    badge: 'Monochrome',
    primary: '#475569',
    primaryHover: '#334155',
    primaryLight: '#F8FAFC',
    primaryDark: '#1E293B',
    accent: '#94A3B8',
    gradient: {
      start: '#09090B',
      middle: '#18181B',
      end: '#27272A',
      css: 'from-[#09090B] via-[#18181B] to-[#27272A]',
    },
    headerBg: 'from-[#09090B] via-[#18181B] to-[#27272A]',
    chipBg: 'bg-slate-100 dark:bg-slate-800',
    chipText: 'text-slate-700 dark:text-slate-300',
  },
  {
    id: 'obsidian_gold',
    name: 'Obsidian & Gold',
    badge: 'VIP Dark',
    primary: '#CA8A04',
    primaryHover: '#A16207',
    primaryLight: '#FEFCE8',
    primaryDark: '#713F12',
    accent: '#FDE047',
    gradient: {
      start: '#050505',
      middle: '#171717',
      end: '#262626',
      css: 'from-[#050505] via-[#171717] to-[#262626]',
    },
    headerBg: 'from-[#050505] via-[#171717] to-[#262626]',
    chipBg: 'bg-yellow-50 dark:bg-yellow-950/60',
    chipText: 'text-yellow-800 dark:text-yellow-300',
  },
  {
    id: 'sandstone_terracotta',
    name: 'Terracotta Clay',
    badge: 'Warm Earth',
    primary: '#C2410C',
    primaryHover: '#9A3412',
    primaryLight: '#FFF7ED',
    primaryDark: '#7C2D12',
    accent: '#FB923C',
    gradient: {
      start: '#27140B',
      middle: '#431407',
      end: '#7C2D12',
      css: 'from-[#27140B] via-[#431407] to-[#7C2D12]',
    },
    headerBg: 'from-[#27140B] via-[#431407] to-[#7C2D12]',
    chipBg: 'bg-orange-50 dark:bg-orange-950/60',
    chipText: 'text-orange-800 dark:text-orange-300',
  },
  {
    id: 'glacier_frost',
    name: 'Glacier Steel',
    badge: 'Cool Frost',
    primary: '#0891B2',
    primaryHover: '#0E7490',
    primaryLight: '#ECFEFF',
    primaryDark: '#155E75',
    accent: '#67E8F9',
    gradient: {
      start: '#083344',
      middle: '#155E75',
      end: '#164E63',
      css: 'from-[#083344] via-[#155E75] to-[#164E63]',
    },
    headerBg: 'from-[#083344] via-[#155E75] to-[#164E63]',
    chipBg: 'bg-cyan-50 dark:bg-cyan-950/60',
    chipText: 'text-cyan-700 dark:text-cyan-300',
  },
  {
    id: 'matcha_mineral',
    name: 'Olive Matcha',
    badge: 'Soft Moss',
    primary: '#4D7C0F',
    primaryHover: '#3F6212',
    primaryLight: '#F7FEE7',
    primaryDark: '#365314',
    accent: '#A3E635',
    gradient: {
      start: '#142508',
      middle: '#1E3A0F',
      end: '#365314',
      css: 'from-[#142508] via-[#1E3A0F] to-[#365314]',
    },
    headerBg: 'from-[#142508] via-[#1E3A0F] to-[#365314]',
    chipBg: 'bg-lime-50 dark:bg-lime-950/60',
    chipText: 'text-lime-800 dark:text-lime-300',
  },
];

export interface FontDefinition {
  id: FontStyleId;
  name: string;
  badge: string;
  fontClass: string;
  fontFamily: string;
  sample: string;
}

export const FONT_DEFINITIONS: FontDefinition[] = [
  {
    id: 'syne',
    name: 'Syne Display',
    badge: 'Modern Bold',
    fontClass: 'font-syne font-extrabold',
    fontFamily: "'Syne', sans-serif",
    sample: 'NS POWER GRID',
  },
  {
    id: 'outfit',
    name: 'Outfit Clean',
    badge: 'Geometric',
    fontClass: 'font-outfit font-bold',
    fontFamily: "'Outfit', sans-serif",
    sample: 'Field Survey Suite',
  },
  {
    id: 'plus_jakarta',
    name: 'Jakarta Sans',
    badge: 'Corporate',
    fontClass: 'font-sans font-bold',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    sample: 'DTR & 24-Col Poles',
  },
  {
    id: 'orbitron',
    name: 'Orbitron Cyber',
    badge: 'Futuristic',
    fontClass: 'font-orbitron font-bold',
    fontFamily: "'Orbitron', sans-serif",
    sample: '11KV SUBSTATION',
  },
  {
    id: 'rajdhani',
    name: 'Rajdhani Tech',
    badge: 'Power & Grid',
    fontClass: 'font-rajdhani font-bold',
    fontFamily: "'Rajdhani', sans-serif",
    sample: '100 kVA Transformer',
  },
  {
    id: 'cinzel',
    name: 'Cinzel Royal',
    badge: 'Luxury Serif',
    fontClass: 'font-cinzel font-bold',
    fontFamily: "'Cinzel', serif",
    sample: 'Electrical Corporation',
  },
  {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    badge: 'Monospace',
    fontClass: 'font-mono-jb font-bold',
    fontFamily: "'JetBrains Mono', monospace",
    sample: 'POLE-GPS #314201',
  },
];

export function getActiveTheme(config: SplashConfig): ThemeDefinition {
  if (config.themePreset) {
    const found = THEME_PRESETS.find((t) => t.id === config.themePreset);
    if (found) return found;
  }
  // Match by gradient if preset not set explicitly
  if (config.themeGradient) {
    const matched = THEME_PRESETS.find(
      (t) =>
        t.gradient.start.toLowerCase() === config.themeGradient.start.toLowerCase() &&
        t.gradient.middle.toLowerCase() === config.themeGradient.middle.toLowerCase()
    );
    if (matched) return matched;
  }
  return THEME_PRESETS[0];
}

export function getActiveFont(config: SplashConfig): FontDefinition {
  const fontId = config.fontStyle || 'syne';
  return FONT_DEFINITIONS.find((f) => f.id === fontId) || FONT_DEFINITIONS[0];
}
