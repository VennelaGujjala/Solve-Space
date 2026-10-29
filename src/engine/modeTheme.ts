import { AdaptiveMode } from '../types/solvespace';

export interface ModeThemeTokens {
  bannerBg: string;
  bannerBorder: string;
  accentText: string;
  buttonPrimary: string;
  barFill: string;
  chartHex: string;
  canvasTint: string;
}

export function getModeTheme(mode: AdaptiveMode): ModeThemeTokens {
  switch (mode) {
    case AdaptiveMode.CrunchMode:
      return {
        bannerBg: 'bg-rose-50/85 dark:bg-rose-950/35 backdrop-blur-xl',
        bannerBorder: 'border-rose-300/70 dark:border-rose-500/35',
        accentText: 'text-rose-700 dark:text-rose-300',
        buttonPrimary:
          'bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_20px_-4px_rgba(244,63,94,0.55)]',
        barFill: 'bg-gradient-to-r from-rose-500 to-orange-400',
        chartHex: '#fb7185',
        canvasTint: 'bg-transparent',
      };
    case AdaptiveMode.BehindSchedule:
      return {
        bannerBg: 'bg-amber-50/85 dark:bg-amber-950/35 backdrop-blur-xl',
        bannerBorder: 'border-amber-300/70 dark:border-amber-500/35',
        accentText: 'text-amber-800 dark:text-amber-300',
        buttonPrimary:
          'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-[0_0_20px_-4px_rgba(245,158,11,0.5)]',
        barFill: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        chartHex: '#fbbf24',
        canvasTint: 'bg-transparent',
      };
    case AdaptiveMode.RecoveryMode:
      return {
        bannerBg: 'bg-teal-50/85 dark:bg-teal-950/35 backdrop-blur-xl',
        bannerBorder: 'border-teal-300/70 dark:border-teal-400/35',
        accentText: 'text-teal-800 dark:text-teal-300',
        buttonPrimary:
          'bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold shadow-[0_0_20px_-4px_rgba(45,212,191,0.5)]',
        barFill: 'bg-gradient-to-r from-teal-400 to-cyan-400',
        chartHex: '#2dd4bf',
        canvasTint: 'bg-transparent',
      };
    case AdaptiveMode.AheadOfPlan:
      return {
        bannerBg: 'bg-emerald-50/85 dark:bg-emerald-950/35 backdrop-blur-xl',
        bannerBorder: 'border-emerald-300/70 dark:border-emerald-400/35',
        accentText: 'text-emerald-800 dark:text-emerald-300',
        buttonPrimary:
          'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-[0_0_20px_-4px_rgba(52,211,153,0.5)]',
        barFill: 'bg-gradient-to-r from-emerald-400 to-teal-300',
        chartHex: '#34d399',
        canvasTint: 'bg-transparent',
      };
    case AdaptiveMode.OnTrack:
    default:
      return {
        bannerBg: 'bg-sky-50/85 dark:bg-[#0D152B]/75 backdrop-blur-xl',
        bannerBorder: 'border-sky-300/70 dark:border-sky-400/30',
        accentText: 'text-sky-700 dark:text-sky-300',
        buttonPrimary:
          'bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold shadow-[0_0_22px_-4px_rgba(56,189,248,0.55)]',
        barFill: 'bg-gradient-to-r from-sky-400 to-indigo-400',
        chartHex: '#38bdf8',
        canvasTint: 'bg-transparent',
      };
  }
}
