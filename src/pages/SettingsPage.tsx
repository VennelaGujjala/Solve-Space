import React, { useState } from 'react';
import { Download, Keyboard, Moon, RotateCcw, Sparkles, Sun, Type } from 'lucide-react';
import { AppSettings, Workspace } from '../types/solvespace';

interface SettingsPageProps {
  settings: AppSettings;
  workspaces: Workspace[];
  onUpdateSettings: (patch: Partial<AppSettings>) => void;
  onResetAllData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  workspaces,
  onUpdateSettings,
  onResetAllData,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportJson = () => {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), workspaces }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solvespace-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Astra Theme & Accessibility Settings
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
          Personalize cosmic starfield motion, visual contrast, reading scale, keyboard shortcuts,
          and local storage backups.
        </p>
      </div>

      {/* Appearance & Accessibility */}
      <div className="astra-card rounded-xl divide-y divide-slate-200/60 dark:divide-white/[0.08]">
        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            {settings.darkMode ? (
              <Moon className="w-5 h-5 text-sky-400 mt-0.5 shrink-0" />
            ) : (
              <Sun className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
            )}
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Astra Atmosphere (Deep Space Dark / Celestial Dawn)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Default Deep Space Obsidian pairs translucent glass modules with luminous starlight.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ darkMode: !settings.darkMode })}
            className="px-4 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-white/[0.15] text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            {settings.darkMode ? 'Switch to Celestial Light' : 'Switch to Astra Dark'}
          </button>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-sky-500 dark:text-sky-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Moving Starfield Background
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Animates multi-depth parallax stars, subtle starlight twinkle, and shooting comets
                behind your console.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ starfieldMotion: !settings.starfieldMotion })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.starfieldMotion
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-200 dark:border-white/[0.15] text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
            }`}
          >
            {settings.starfieldMotion ? 'Stars Moving: On' : 'Stars Paused'}
          </button>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Type className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Large Text Mode (Accessibility)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Scales root typography to 112.5% across cards, tables, and form inputs for comfortable
                reading.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ largeText: !settings.largeText })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.largeText
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-200 dark:border-white/[0.15] text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
            }`}
          >
            {settings.largeText ? 'Large Text: On' : 'Enable Large Text'}
          </button>
        </div>

        <div className="p-5 flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Keyboard className="w-5 h-5 text-sky-600 dark:text-sky-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Single-Key Console Shortcuts
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Press <kbd className="font-mono-num font-semibold text-sky-400">N</kbd> for New Task,{' '}
                <kbd className="font-mono-num font-semibold text-sky-400">/</kbd> for Global Search, and{' '}
                <kbd className="font-mono-num font-semibold text-sky-400">D</kbd> to toggle the Demo Scenario
                Switcher (auto-paused when typing in inputs).
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onUpdateSettings({ keyboardShortcuts: !settings.keyboardShortcuts })}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
              settings.keyboardShortcuts
                ? 'bg-sky-500 text-slate-950'
                : 'border border-slate-200 dark:border-white/[0.15] text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-white/[0.07]'
            }`}
          >
            {settings.keyboardShortcuts ? 'Shortcuts: Active' : 'Shortcuts: Off'}
          </button>
        </div>
      </div>

      {/* Data Persistence & Export */}
      <div className="astra-card rounded-xl p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
          Local Storage Data & Portability
        </h2>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          All workspaces, tasks, Pomodoro logs, mood check-ins, and custom module layouts are stored
          privately in your browser’s <code className="font-mono-num text-sky-300">localStorage</code> with zero
          external servers required.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="button"
            onClick={handleExportJson}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Snapshot</span>
          </button>

          {!confirmReset ? (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-300 border border-rose-300/60 dark:border-rose-500/40 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Console to Default Sample Data</span>
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onResetAllData();
                  setConfirmReset(false);
                }}
                className="px-3.5 py-2 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-500 cursor-pointer"
              >
                Confirm Full Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="px-3 py-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
