import React, { useState } from 'react';
import { Check, Flame, Plus, Trash2 } from 'lucide-react';
import { HabitItem, RuleExplanation } from '../../types/solvespace';
import { offsetDate } from '../../data/sampleData';
import { ModuleShell } from './ModuleShell';

interface HabitTrackerModuleProps {
  habits: HabitItem[];
  title: string;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onToggleHabitToday: (habitId: string) => void;
  onAddHabit: (habitTitle: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitTrackerModule: React.FC<HabitTrackerModuleProps> = ({
  habits,
  title,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onToggleHabitToday,
  onAddHabit,
  onDeleteHabit,
}) => {
  const [draft, setDraft] = useState('');
  const today = offsetDate(0);
  const last7Days = [-6, -5, -4, -3, -2, -1, 0].map((d) => offsetDate(d));

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) return;
    onAddHabit(draft.trim());
    setDraft('');
  };

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(today)).length;
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0;

  return (
    <ModuleShell
      title={title}
      subtitle={`${completedTodayCount}/${habits.length} checked today · Peak streak ${bestStreak}d`}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`${completedTodayCount}/${habits.length} habits checked today · ${bestStreak}-day peak streak`}
    >
      <form onSubmit={handleAdd} className="flex items-center gap-2 pb-3 border-b border-slate-200/60 dark:border-white/[0.08]">
        <input
          type="text"
          placeholder="Add daily habit…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg astra-input text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>
      </form>

      {habits.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Add 1–3 repeatable daily habits above to build streak consistency.
        </div>
      ) : (
        <ul className="divide-y divide-slate-200/60 dark:divide-white/[0.06] mt-1">
          {habits.map((habit) => {
            const doneToday = habit.completedDates.includes(today);
            return (
              <li key={habit.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    type="button"
                    aria-label={`Toggle habit "${habit.title}" for today`}
                    onClick={() => onToggleHabitToday(habit.id)}
                    className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      doneToday
                        ? 'bg-emerald-500 border-emerald-500 text-slate-950'
                        : 'border-slate-300 dark:border-white/[0.22] hover:border-emerald-400'
                    }`}
                  >
                    {doneToday && <Check className="w-3.5 h-3.5" />}
                  </button>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                      {habit.title}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-300 font-medium">
                        <Flame className="w-3.5 h-3.5" />
                        {habit.streak}d streak
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1" title="Last 7 days">
                        {last7Days.map((day) => {
                          const hit = habit.completedDates.includes(day);
                          return (
                            <span
                              key={day}
                              className={`w-2.5 h-2.5 rounded-xs ${
                                hit
                                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]'
                                  : 'bg-slate-200 dark:bg-white/[0.10]'
                              }`}
                            />
                          );
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  aria-label={`Delete habit "${habit.title}"`}
                  onClick={() => onDeleteHabit(habit.id)}
                  className="p-1 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </ModuleShell>
  );
};
