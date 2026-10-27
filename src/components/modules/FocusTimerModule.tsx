import React, { useEffect, useState } from 'react';
import { CheckCircle2, Pause, Play, RotateCcw } from 'lucide-react';
import { AdaptiveMode, FocusSession, RuleExplanation } from '../../types/solvespace';
import { offsetDate } from '../../data/sampleData';
import { getModeTheme } from '../../engine/modeTheme';
import { ModuleShell } from './ModuleShell';

interface FocusTimerModuleProps {
  sessions: FocusSession[];
  title: string;
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onLogSession: (session: Omit<FocusSession, 'id'>) => void;
}

const PRESETS = {
  focus: { label: '25m Focus', seconds: 25 * 60, minutes: 25, kind: 'focus' as const },
  shortBreak: { label: '5m Break', seconds: 5 * 60, minutes: 5, kind: 'break' as const },
  longBreak: { label: '15m Recovery', seconds: 15 * 60, minutes: 15, kind: 'break' as const },
};

export const FocusTimerModule: React.FC<FocusTimerModuleProps> = ({
  sessions,
  title,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onLogSession,
}) => {
  const [presetKey, setPresetKey] = useState<'focus' | 'shortBreak' | 'longBreak'>(
    mode === AdaptiveMode.RecoveryMode ? 'longBreak' : 'focus'
  );
  const [secondsLeft, setSecondsLeft] = useState(PRESETS[presetKey].seconds);
  const [running, setRunning] = useState(false);
  const [sessionLabel, setSessionLabel] = useState('');

  const theme = getModeTheme(mode);

  useEffect(() => {
    if (!running) return;
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false);
          const p = PRESETS[presetKey];
          onLogSession({
            date: offsetDate(0),
            durationMinutes: p.minutes,
            label: sessionLabel.trim() || `${p.label} block`,
            mode: p.kind,
          });
          return p.seconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [running, presetKey, sessionLabel, onLogSession]);

  const selectPreset = (key: 'focus' | 'shortBreak' | 'longBreak') => {
    setRunning(false);
    setPresetKey(key);
    setSecondsLeft(PRESETS[key].seconds);
  };

  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const secs = String(secondsLeft % 60).padStart(2, '0');
  const totalFocusMins = sessions
    .filter((s) => s.mode === 'focus')
    .reduce((sum, s) => sum + s.durationMinutes, 0);

  return (
    <ModuleShell
      id="module-focus-timer"
      title={title}
      subtitle={`${sessions.length} sessions · ${totalFocusMins} focus mins logged`}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`${sessions.length} Pomodoro sessions (${totalFocusMins}m total)`}
    >
      <div className="flex flex-col justify-between gap-4 flex-1">
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg self-start">
          {(Object.keys(PRESETS) as ('focus' | 'shortBreak' | 'longBreak')[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => selectPreset(k)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                presetKey === k
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {PRESETS[k].label}
            </button>
          ))}
        </div>

        <div className="py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="font-mono-num text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900 dark:text-white">
            {mins}:{secs}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${theme.buttonPrimary}`}
            >
              {running ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Start</span>
                </>
              )}
            </button>
            <button
              type="button"
              aria-label="Reset timer"
              onClick={() => {
                setRunning(false);
                setSecondsLeft(PRESETS[presetKey].seconds);
              }}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Session focus intent (e.g., Mock Paper Q1–Q4)…"
            value={sessionLabel}
            onChange={(e) => setSessionLabel(e.target.value)}
            className="flex-1 min-w-0 px-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white placeholder:text-slate-400"
          />
          <button
            type="button"
            onClick={() => {
              const p = PRESETS[presetKey];
              onLogSession({
                date: offsetDate(0),
                durationMinutes: p.minutes,
                label: sessionLabel.trim() || `Completed ${p.label}`,
                mode: p.kind,
              });
              setSessionLabel('');
            }}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Complete Now</span>
          </button>
        </div>

        {sessions.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1.5">
              Recent sessions
            </p>
            <ul className="divide-y divide-slate-100 dark:divide-slate-800/70 max-h-28 overflow-y-auto">
              {[...sessions]
                .reverse()
                .slice(0, 4)
                .map((s) => (
                  <li key={s.id} className="py-1.5 flex items-center justify-between gap-2 text-xs">
                    <span className="truncate text-slate-700 dark:text-slate-300">{s.label}</span>
                    <span className="font-mono-num text-slate-500 dark:text-slate-400 shrink-0">
                      {s.durationMinutes}m · {s.date.slice(5)}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </ModuleShell>
  );
};
