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
        bannerBg: 'bg-rose-50/90 dark:bg-rose-950/35',
        bannerBorder: 'border-rose-200 dark:border-rose-800/70',
        accentText: 'text-rose-700 dark:text-rose-300',
        buttonPrimary: 'bg-rose-600 hover:bg-rose-700 text-white',
        barFill: 'bg-rose-600 dark:bg-rose-500',
        chartHex: '#e11d48',
        canvasTint: 'bg-slate-50 dark:bg-slate-950',
      };
    case AdaptiveMode.BehindSchedule:
      return {
        bannerBg: 'bg-amber-50/90 dark:bg-amber-950/35',
        bannerBorder: 'border-amber-200 dark:border-amber-800/70',
        accentText: 'text-amber-800 dark:text-amber-300',
        buttonPrimary: 'bg-amber-600 hover:bg-amber-700 text-white',
        barFill: 'bg-amber-600 dark:bg-amber-500',
        chartHex: '#d97706',
        canvasTint: 'bg-slate-50 dark:bg-slate-950',
      };
    case AdaptiveMode.RecoveryMode:
      return {
        bannerBg: 'bg-teal-50/90 dark:bg-teal-950/35',
        bannerBorder: 'border-teal-200 dark:border-teal-800/70',
        accentText: 'text-teal-800 dark:text-teal-300',
        buttonPrimary: 'bg-teal-600 hover:bg-teal-700 text-white',
        barFill: 'bg-teal-600 dark:bg-teal-500',
        chartHex: '#0d9488',
        canvasTint: 'bg-teal-50/35 dark:bg-slate-950',
      };
    case AdaptiveMode.AheadOfPlan:
      return {
        bannerBg: 'bg-emerald-50/90 dark:bg-emerald-950/35',
        bannerBorder: 'border-emerald-200 dark:border-emerald-800/70',
        accentText: 'text-emerald-800 dark:text-emerald-300',
        buttonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        barFill: 'bg-emerald-600 dark:bg-emerald-500',
        chartHex: '#16a34a',
        canvasTint: 'bg-slate-50 dark:bg-slate-950',
      };
    case AdaptiveMode.OnTrack:
    default:
      return {
        bannerBg: 'bg-blue-50/80 dark:bg-blue-950/30',
        bannerBorder: 'border-blue-200 dark:border-blue-800/60',
        accentText: 'text-blue-700 dark:text-blue-300',
        buttonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        barFill: 'bg-blue-600 dark:bg-blue-500',
        chartHex: '#2563eb',
        canvasTint: 'bg-slate-50 dark:bg-slate-950',
      };
  }
}
