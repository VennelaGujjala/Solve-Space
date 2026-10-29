import React, { useState } from 'react';
import { Minus, Plus, TrendingUp } from 'lucide-react';
import { AdaptiveMode, RuleExplanation, Workspace } from '../../types/solvespace';
import { daysBetween } from '../../engine/adaptiveEngine';
import { offsetDate } from '../../data/sampleData';
import { getModeTheme } from '../../engine/modeTheme';
import { ModuleShell } from './ModuleShell';

interface GoalTrackerModuleProps {
  workspace: Workspace;
  title: string;
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onUpdateGoalProgress: (nextCurrent: number, nextTarget?: number) => void;
}

export const GoalTrackerModule: React.FC<GoalTrackerModuleProps> = ({
  workspace,
  title,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onUpdateGoalProgress,
}) => {
  const [customStep, setCustomStep] = useState('1');
  const [editingTarget, setEditingTarget] = useState(false);
  const [draftTarget, setDraftTarget] = useState(String(workspace.targetValue));

  const pct =
    workspace.targetValue > 0
      ? Math.min(100, Math.round((workspace.currentValue / workspace.targetValue) * 100))
      : 0;
  const daysLeft = daysBetween(offsetDate(0), workspace.deadline);
  const theme = getModeTheme(mode);

  const stepAmount = Math.max(0.5, Number(customStep) || 1);

  const handleSaveTarget = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Number(draftTarget);
    if (parsed > 0) {
      onUpdateGoalProgress(workspace.currentValue, parsed);
    }
    setEditingTarget(false);
  };

  return (
    <ModuleShell
      title={title}
      subtitle={workspace.goalTitle}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`${workspace.currentValue} / ${workspace.targetValue} ${workspace.unit} (${pct}%) · ${daysLeft >= 0 ? `${daysLeft}d left` : 'Past due'}`}
    >
      <div className="flex flex-col justify-between gap-5 flex-1">
        <div>
          <div className="flex items-baseline justify-between gap-4">
            <div className="font-mono-num text-3xl font-semibold text-slate-900 dark:text-white">
              {workspace.currentValue}
              <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                {' '}
                / {workspace.targetValue} {workspace.unit}
              </span>
            </div>
            <div className="text-right font-mono-num text-sm font-medium text-slate-700 dark:text-sky-200">
              {pct}% complete
            </div>
          </div>

          <div className="mt-3 h-2.5 w-full bg-slate-200/70 dark:bg-white/[0.08] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${theme.barFill}`}
              style={{ width: `${pct}%` }}
            />
          </div>

          <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>
              Deadline: {workspace.deadline}
              {' · '}
              {daysLeft > 0
                ? `${daysLeft} day${daysLeft === 1 ? '' : 's'} remaining`
                : daysLeft === 0
                ? 'Due today'
                : `${Math.abs(daysLeft)} days overdue`}
            </span>
            <button
              type="button"
              onClick={() => {
                setDraftTarget(String(workspace.targetValue));
                setEditingTarget((v) => !v);
              }}
              className="text-sky-600 dark:text-sky-400 hover:underline font-medium whitespace-nowrap cursor-pointer"
            >
              {editingTarget ? 'Cancel target edit' : 'Adjust target'}
            </button>
          </div>
        </div>

        {editingTarget && (
          <form onSubmit={handleSaveTarget} className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-white/[0.08]">
            <label className="text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
              New Target ({workspace.unit}):
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={draftTarget}
              onChange={(e) => setDraftTarget(e.target.value)}
              className="w-24 px-2.5 py-1.5 text-sm font-mono-num rounded-lg astra-input text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Save
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-200/60 dark:border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease progress"
              onClick={() =>
                onUpdateGoalProgress(Math.max(0, +(workspace.currentValue - stepAmount).toFixed(1)))
              }
              className="p-2 rounded-lg border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="0.5"
              step="0.5"
              aria-label="Increment step value"
              value={customStep}
              onChange={(e) => setCustomStep(e.target.value)}
              className="w-16 text-center px-2 py-1.5 text-sm font-mono-num rounded-lg astra-input text-slate-900 dark:text-white"
            />
            <button
              type="button"
              onClick={() =>
                onUpdateGoalProgress(+(workspace.currentValue + stepAmount).toFixed(1))
              }
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${theme.buttonPrimary}`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log {stepAmount} {workspace.unit}</span>
            </button>
          </div>

          {mode === AdaptiveMode.AheadOfPlan && (
            <button
              type="button"
              onClick={() =>
                onUpdateGoalProgress(
                  workspace.currentValue,
                  Math.round(workspace.targetValue * 1.15)
                )
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 border border-emerald-400/50 dark:border-emerald-400/40 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Raise Target +15%</span>
            </button>
          )}
        </div>
      </div>
    </ModuleShell>
  );
};
