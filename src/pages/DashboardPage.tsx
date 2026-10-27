import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ArrowUpRight,
  Compass,
  Flame,
  HeartHandshake,
  HelpCircle,
  Printer,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from 'lucide-react';
import {
  AdaptiveEvaluation,
  AdaptiveMode,
  FocusSession,
  MoodEntry,
  ModuleType,
  NumberLogEntry,
  PageId,
  RuleExplanation,
  SmartSuggestion,
  TaskItem,
  Workspace,
} from '../types/solvespace';
import { getModeTheme } from '../engine/modeTheme';
import { GoalTrackerModule } from '../components/modules/GoalTrackerModule';
import { TaskPlannerModule } from '../components/modules/TaskPlannerModule';
import { HabitTrackerModule } from '../components/modules/HabitTrackerModule';
import { NumberLoggerModule } from '../components/modules/NumberLoggerModule';
import { FocusTimerModule } from '../components/modules/FocusTimerModule';
import { MoodCheckinModule } from '../components/modules/MoodCheckinModule';
import { NotesModule } from '../components/modules/NotesModule';
import { ProgressChartModule } from '../components/modules/ProgressChartModule';

interface DashboardPageProps {
  workspace: Workspace;
  evaluation: AdaptiveEvaluation;
  onExplain: (rule: RuleExplanation) => void;
  onNavigate: (page: PageId) => void;
  onUpdateGoalProgress: (nextCurrent: number, nextTarget?: number) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskTomorrow: (taskId: string) => void;
  onToggleHabitToday: (habitId: string) => void;
  onAddHabit: (title: string) => void;
  onDeleteHabit: (habitId: string) => void;
  onToggleChartType: (nextType: 'bar' | 'line') => void;
  onAddLog: (entry: Omit<NumberLogEntry, 'id'>) => void;
  onDeleteLog: (id: string) => void;
  onLogSession: (session: Omit<FocusSession, 'id'>) => void;
  onSaveMood: (entry: Omit<MoodEntry, 'id'>) => void;
  onSaveNote: (noteId: string | null, title: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
  onExecuteSuggestion: (suggestion: SmartSuggestion) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  workspace,
  evaluation,
  onExplain,
  onNavigate,
  onUpdateGoalProgress,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onMoveTaskTomorrow,
  onToggleHabitToday,
  onAddHabit,
  onDeleteHabit,
  onToggleChartType,
  onAddLog,
  onDeleteLog,
  onLogSession,
  onSaveMood,
  onSaveNote,
  onDeleteNote,
  onExecuteSuggestion,
}) => {
  const [showScoreBreakdown, setShowScoreBreakdown] = useState(false);
  const theme = getModeTheme(evaluation.mode);

  const ModeIcon =
    evaluation.mode === AdaptiveMode.CrunchMode
      ? Flame
      : evaluation.mode === AdaptiveMode.BehindSchedule
      ? AlertTriangle
      : evaluation.mode === AdaptiveMode.RecoveryMode
      ? HeartHandshake
      : evaluation.mode === AdaptiveMode.AheadOfPlan
      ? Zap
      : Compass;

  // Radial SVG Gauge math for 0-100 Progress Score
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - (evaluation.progressScore / 100) * circumference;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Workspace Header Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
            <span>{workspace.category}</span>
            <span aria-hidden="true">·</span>
            <span>Deadline {workspace.deadline}</span>
            <span aria-hidden="true">·</span>
            <span>{workspace.modules.length} active modules</span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
            {workspace.name}
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
            {workspace.problemStatement}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 no-print">
          <button
            type="button"
            onClick={() => onNavigate(PageId.Builder)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Customize Modules</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate(PageId.Simulator)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>What-If Simulator</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Weekly Report</span>
          </button>
        </div>
      </div>

      {/* ADAPTIVE ENGINE MODE BANNER */}
      <motion.div
        key={evaluation.mode}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`rounded-xl border p-5 ${theme.bannerBg} ${theme.bannerBorder}`}
      >
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className={`p-2 rounded-lg bg-white/80 dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-700/70 shrink-0 ${theme.accentText}`}>
              <ModeIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
                <span className={theme.accentText}>Adaptive Engine · {evaluation.mode}</span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <button
                  type="button"
                  onClick={() => onExplain(evaluation.modeReason)}
                  className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-200 hover:underline font-medium whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Why am I seeing this?</span>
                </button>
              </div>
              <h2 className="mt-1 text-base sm:text-lg font-semibold text-slate-900 dark:text-white">
                {evaluation.headline}
              </h2>
              <p className="mt-0.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {evaluation.subheadline}
              </p>
            </div>
          </div>

          {evaluation.mode === AdaptiveMode.BehindSchedule && evaluation.overdueCount > 0 && (
            <button
              type="button"
              onClick={() =>
                onExecuteSuggestion({
                  id: 'banner_catchup',
                  title: 'Catch-up',
                  detail: '',
                  actionType: 'reschedule_overdue',
                  whyExplanation: evaluation.modeReason,
                })
              }
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer ${theme.buttonPrimary}`}
            >
              Reschedule 1 Overdue Task
            </button>
          )}

          {evaluation.mode === AdaptiveMode.AheadOfPlan && (
            <button
              type="button"
              onClick={() =>
                onUpdateGoalProgress(
                  workspace.currentValue,
                  Math.round(workspace.targetValue * 1.15)
                )
              }
              className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 self-start cursor-pointer ${theme.buttonPrimary}`}
            >
              Raise Target +15%
            </button>
          )}
        </div>
      </motion.div>

      {/* TOP INTELLIGENCE ROW: PROGRESS SCORE GAUGE + NEXT BEST ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 no-print">
        {/* Progress Score Radial Gauge (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Progress Score
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Multi-factor execution & pace index
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowScoreBreakdown((v) => !v)}
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Why this score?</span>
            </button>
          </div>

          <div className="my-4 flex items-center gap-5">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-slate-100 dark:text-slate-800"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius}
                  fill="none"
                  stroke={theme.chartHex}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
                  {evaluation.progressScore}
                </span>
                <span className="text-[11px] text-slate-400 font-mono-num">/100</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs flex-1 min-w-0 tabular-nums">
              {evaluation.scorePillars.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-2">
                  <span className="text-slate-600 dark:text-slate-400 truncate">{p.label}</span>
                  <span className="font-mono-num font-semibold text-slate-900 dark:text-slate-100 shrink-0">
                    {p.score}/{p.maxScore}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {showScoreBreakdown ? (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
              {evaluation.scorePillars.map((p) => (
                <div key={p.label}>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {p.label}: {p.score}/{p.maxScore} pts
                  </p>
                  <p className="text-slate-500 dark:text-slate-400">{p.explanation}</p>
                </div>
              ))}
              <button
                type="button"
                onClick={() => onExplain(evaluation.scoreExplanation)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
              >
                Open full formula in Rule Inspector →
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              <span>Actual: {Math.round(evaluation.actualProgressRatio * 100)}%</span>
              <span>Expected: {Math.round(evaluation.expectedProgressRatio * 100)}%</span>
            </div>
          )}
        </div>

        {/* Smart Suggestions: Next Best Actions (8 cols) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Next Best Actions (Rule-Based)</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Concrete adjustments generated from your deadline pace, overdue queue, and energy check-ins
              </p>
            </div>
          </div>

          <ul className="divide-y divide-slate-100 dark:divide-slate-800/80 flex-1">
            {evaluation.suggestions.map((sug, idx) => (
              <li
                key={sug.id}
                className="py-3 first:pt-1 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    <span className="font-mono-num text-slate-400 mr-1.5">0{idx + 1}.</span>
                    {sug.title}
                  </p>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span>{sug.detail}</span>
                    <span aria-hidden="true">·</span>
                    <button
                      type="button"
                      onClick={() => onExplain(sug.whyExplanation)}
                      className="text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      Why am I seeing this?
                    </button>
                  </div>
                </div>

                {sug.actionLabel && (
                  <button
                    type="button"
                    onClick={() => onExecuteSuggestion(sug)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-800 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 self-start sm:self-center cursor-pointer"
                  >
                    {sug.actionLabel}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ADAPTIVE REUSABLE MODULE GRID */}
      {evaluation.orderedModules.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-10 text-center space-y-3">
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            No modules mounted in this workspace yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Open the Workspace Builder to add Goal Tracker, Task Planner, Focus Timer, or Habit modules.
          </p>
          <button
            type="button"
            onClick={() => onNavigate(PageId.Builder)}
            className="px-4 py-2 text-xs font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Open Workspace Builder
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 no-print">
          {evaluation.orderedModules.map(
            ({ instance, effectiveSpan, isEnlarged, isMinimized, promotedReason }) => {
              const colClass =
                effectiveSpan === 'wide' ? 'lg:col-span-2' : 'lg:col-span-1';

              return (
                <motion.div
                  key={instance.id}
                  layout="position"
                  transition={{ duration: 0.22 }}
                  className={`${colClass} flex flex-col`}
                >
                  {instance.type === ModuleType.GoalTracker && (
                    <GoalTrackerModule
                      workspace={workspace}
                      title={instance.title}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onUpdateGoalProgress={onUpdateGoalProgress}
                    />
                  )}
                  {instance.type === ModuleType.TaskPlanner && (
                    <TaskPlannerModule
                      tasks={workspace.tasks}
                      title={instance.title}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onAddTask={onAddTask}
                      onToggleTask={onToggleTask}
                      onDeleteTask={onDeleteTask}
                      onMoveTaskTomorrow={onMoveTaskTomorrow}
                    />
                  )}
                  {instance.type === ModuleType.HabitTracker && (
                    <HabitTrackerModule
                      habits={workspace.habits}
                      title={instance.title}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onToggleHabitToday={onToggleHabitToday}
                      onAddHabit={onAddHabit}
                      onDeleteHabit={onDeleteHabit}
                    />
                  )}
                  {instance.type === ModuleType.NumberLogger && (
                    <NumberLoggerModule
                      logs={workspace.logs}
                      title={instance.title}
                      loggerLabel={workspace.loggerLabel}
                      chartType={workspace.loggerChartType}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onToggleChartType={onToggleChartType}
                      onAddLog={onAddLog}
                      onDeleteLog={onDeleteLog}
                    />
                  )}
                  {instance.type === ModuleType.FocusTimer && (
                    <FocusTimerModule
                      sessions={workspace.focusSessions}
                      title={instance.title}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onLogSession={onLogSession}
                    />
                  )}
                  {instance.type === ModuleType.MoodCheckin && (
                    <MoodCheckinModule
                      moods={workspace.moods}
                      title={instance.title}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onSaveMood={onSaveMood}
                    />
                  )}
                  {instance.type === ModuleType.Notes && (
                    <NotesModule
                      notes={workspace.notes}
                      title={instance.title}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                      onSaveNote={onSaveNote}
                      onDeleteNote={onDeleteNote}
                    />
                  )}
                  {instance.type === ModuleType.ProgressChart && (
                    <ProgressChartModule
                      workspace={workspace}
                      title={instance.title}
                      mode={evaluation.mode}
                      isEnlarged={isEnlarged}
                      isMinimized={isMinimized}
                      promotedReason={promotedReason}
                      onExplain={onExplain}
                    />
                  )}
                </motion.div>
              );
            }
          )}
        </div>
      )}

      {/* PRINTABLE WEEKLY PROGRESS REPORT (Visible when printing via window.print()) */}
      <div className="hidden print-only space-y-6 pt-4 border-t border-slate-300">
        <div>
          <h2 className="text-xl font-bold">SolveSpace — Weekly Workspace Progress Report</h2>
          <p className="text-sm text-slate-600 tabular-nums">
            Workspace: {workspace.name} · Adaptive Mode: {evaluation.mode} · Composite Score:{' '}
            {evaluation.progressScore}/100
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm border-y border-slate-200 py-4 tabular-nums">
          <div>
            <p className="font-semibold">Goal Progress</p>
            <p>
              {workspace.currentValue} / {workspace.targetValue} {workspace.unit} (
              {Math.round(evaluation.actualProgressRatio * 100)}%)
            </p>
            <p>Target Deadline: {workspace.deadline}</p>
          </div>
          <div>
            <p className="font-semibold">Score Pillars</p>
            {evaluation.scorePillars.map((p) => (
              <p key={p.label}>
                {p.label}: {p.score}/{p.maxScore}
              </p>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Tasks Summary</h3>
          <ul className="space-y-1 text-sm tabular-nums">
            {workspace.tasks.map((t) => (
              <li key={t.id}>
                [{t.completed ? 'DONE' : 'OPEN'}] {t.title} — Due {t.dueDate} ({t.priority} priority)
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-base font-semibold mb-2">Next Best Actions</h3>
          <ul className="space-y-1 text-sm">
            {evaluation.suggestions.map((s) => (
              <li key={s.id}>• {s.title}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
