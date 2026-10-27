import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { AdaptiveMode, MoodEntry, RuleExplanation } from '../../types/solvespace';
import { offsetDate } from '../../data/sampleData';
import { getModeTheme } from '../../engine/modeTheme';
import { ModuleShell } from './ModuleShell';

interface MoodCheckinModuleProps {
  moods: MoodEntry[];
  title: string;
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onSaveMood: (entry: Omit<MoodEntry, 'id'>) => void;
}

const SCALE_LABELS: Record<number, string> = {
  1: '1 · Drained',
  2: '2 · Low',
  3: '3 · Steady',
  4: '4 · Good',
  5: '5 · Peak',
};

export const MoodCheckinModule: React.FC<MoodCheckinModuleProps> = ({
  moods,
  title,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onSaveMood,
}) => {
  const today = offsetDate(0);
  const existingToday = moods.find((m) => m.date === today);

  const [moodVal, setMoodVal] = useState<number>(existingToday?.mood ?? 4);
  const [energyVal, setEnergyVal] = useState<number>(existingToday?.energy ?? 4);
  const [note, setNote] = useState<string>(existingToday?.note ?? '');
  const [justSaved, setJustSaved] = useState(false);

  const theme = getModeTheme(mode);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMood({
      date: today,
      mood: moodVal,
      energy: energyVal,
      note: note.trim() || 'Daily check-in',
    });
    setJustSaved(true);
    window.setTimeout(() => setJustSaved(false), 1800);
  };

  const recent = [...moods].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);

  return (
    <ModuleShell
      id="module-mood-checkin"
      title={title}
      subtitle="Calibrates Recovery Mode & burnout guardrails"
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={
        recent[0]
          ? `Latest (${recent[0].date.slice(5)}): Mood ${recent[0].mood}/5 · Energy ${recent[0].energy}/5`
          : 'No check-ins yet'
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="mood-slider" className="font-medium text-slate-700 dark:text-slate-300">
              Mood today
            </label>
            <span className="font-mono-num font-semibold text-slate-900 dark:text-white">
              {SCALE_LABELS[moodVal]}
            </span>
          </div>
          <input
            id="mood-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={moodVal}
            onChange={(e) => setMoodVal(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <label htmlFor="energy-slider" className="font-medium text-slate-700 dark:text-slate-300">
              Cognitive / Physical Energy
            </label>
            <span className="font-mono-num font-semibold text-slate-900 dark:text-white">
              {SCALE_LABELS[energyVal]}
            </span>
          </div>
          <input
            id="energy-slider"
            type="range"
            min={1}
            max={5}
            step={1}
            value={energyVal}
            onChange={(e) => setEnergyVal(Number(e.target.value))}
            className="w-full accent-blue-600 cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Quick context (e.g., Slept 8h, feeling clear)…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="flex-1 min-w-0 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="submit"
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${theme.buttonPrimary}`}
          >
            {justSaved ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Check-in</span>
            )}
          </button>
        </div>
      </form>

      {recent.length > 0 && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
            Recent check-in log
          </p>
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/70">
            {recent.map((m) => (
              <li key={m.id} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                <span className="truncate text-slate-600 dark:text-slate-300">
                  <span className="font-mono-num text-slate-500 dark:text-slate-400">{m.date.slice(5)}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{m.note}</span>
                </span>
                <span className="font-mono-num text-slate-800 dark:text-slate-200 shrink-0">
                  M:{m.mood} · E:{m.energy}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ModuleShell>
  );
};
