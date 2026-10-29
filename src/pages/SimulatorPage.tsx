import React, { useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { simulateWhatIf } from '../engine/adaptiveEngine';
import { PageId, Workspace } from '../types/solvespace';

interface SimulatorPageProps {
  workspace: Workspace;
  onNavigate: (page: PageId) => void;
}

export const SimulatorPage: React.FC<SimulatorPageProps> = ({
  workspace,
  onNavigate,
}) => {
  const openTasksCount = workspace.tasks.filter((t) => !t.completed).length;

  const [skipDays, setSkipDays] = useState(0);
  const [extraUnitsPerDay, setExtraUnitsPerDay] = useState(1);
  const [tasksCompletedNow, setTasksCompletedNow] = useState(Math.min(1, openTasksCount));
  const [projectedMood, setProjectedMood] = useState(4);

  const result = simulateWhatIf(workspace, {
    skipDays,
    extraUnitsPerDay,
    tasksCompletedNow,
    projectedMood,
  });

  const handleReset = () => {
    setSkipDays(0);
    setExtraUnitsPerDay(0);
    setTasksCompletedNow(0);
    setProjectedMood(4);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(PageId.Dashboard)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to {workspace.name}</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            What-If Trajectory Simulator
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Test schedule trade-offs before they happen — see how skipping days or adding daily
            effort shifts your completion date, Progress Score, and Adaptive Mode.
          </p>
        </div>

        <button
          type="button"
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 astra-card rounded-lg hover:border-sky-400/50 transition-colors whitespace-nowrap shrink-0 self-start sm:self-auto cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Sliders</span>
        </button>
      </div>

      {/* Top Projected Outcome Strip */}
      <div className="astra-card rounded-xl divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-white/[0.08] grid grid-cols-1 sm:grid-cols-3">
        <div className="p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Projected Completion Date</p>
          <p className="mt-1 font-mono-num text-2xl font-bold text-slate-900 dark:text-white">
            {result.projectedCompletionDate}
          </p>
          <p className="mt-1 text-xs tabular-nums text-slate-600 dark:text-slate-300">
            Baseline: {result.baselineCompletionDate} ·{' '}
            <span
              className={
                result.daysAheadOrLate >= 0
                  ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                  : 'text-rose-600 dark:text-rose-400 font-medium'
              }
            >
              {result.daysAheadOrLate >= 0
                ? `${result.daysAheadOrLate}d before deadline`
                : `${Math.abs(result.daysAheadOrLate)}d past deadline`}
            </span>
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            7-Day Projected Progress Score
          </p>
          <div className="mt-1 flex items-baseline gap-2.5 font-mono-num">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">
              {result.projectedScore}/100
            </span>
            <span
              className={`text-xs font-semibold ${
                result.scoreDelta >= 0
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              {result.scoreDelta >= 0 ? `+${result.scoreDelta}` : result.scoreDelta} pts vs current (
              {result.baselineScore})
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Deadline fixed at {workspace.deadline}
          </p>
        </div>

        <div className="p-5">
          <p className="text-xs text-slate-500 dark:text-slate-400">Adaptive Mode Transition</p>
          <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">
            {result.baselineMode} →{' '}
            <span className="text-sky-600 dark:text-sky-300">{result.projectedMode}</span>
          </p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {result.projectedMode === 'Recovery Mode'
              ? 'Low mood setting triggers Recovery guardrails'
              : result.projectedMode === 'Ahead of Plan'
              ? 'Added pace unlocks stretch target prompt'
              : 'Live mode evaluation 7 days forward'}
          </p>
        </div>
      </div>

      {/* Main Split: Sliders + Before/After Comparison Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 astra-card rounded-xl p-5 space-y-5 flex flex-col justify-between">
          <div className="space-y-5">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Scenario Controls ({workspace.name})
            </h2>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-skip" className="font-medium text-slate-700 dark:text-slate-300">
                  If I skip N days of work
                </label>
                <span className="font-mono-num font-semibold text-slate-900 dark:text-sky-200">
                  {skipDays} day{skipDays === 1 ? '' : 's'}
                </span>
              </div>
              <input
                id="sim-skip"
                type="range"
                min={0}
                max={10}
                step={1}
                value={skipDays}
                onChange={(e) => setSkipDays(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-extra" className="font-medium text-slate-700 dark:text-slate-300">
                  Daily effort delta ({workspace.unit}/day)
                </label>
                <span className="font-mono-num font-semibold text-slate-900 dark:text-sky-200">
                  {extraUnitsPerDay >= 0 ? `+${extraUnitsPerDay}` : extraUnitsPerDay}{' '}
                  {workspace.unit}/day
                </span>
              </div>
              <input
                id="sim-extra"
                type="range"
                min={-2}
                max={6}
                step={0.5}
                value={extraUnitsPerDay}
                onChange={(e) => setExtraUnitsPerDay(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-tasks" className="font-medium text-slate-700 dark:text-slate-300">
                  If I clear open tasks today
                </label>
                <span className="font-mono-num font-semibold text-slate-900 dark:text-sky-200">
                  {tasksCompletedNow} / {openTasksCount} tasks
                </span>
              </div>
              <input
                id="sim-tasks"
                type="range"
                min={0}
                max={Math.max(1, openTasksCount)}
                step={1}
                disabled={openTasksCount === 0}
                value={tasksCompletedNow}
                onChange={(e) => setTasksCompletedNow(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="sim-mood" className="font-medium text-slate-700 dark:text-slate-300">
                  Sustained daily energy / mood (1–5)
                </label>
                <span className="font-mono-num font-semibold text-slate-900 dark:text-sky-200">
                  {projectedMood} / 5
                </span>
              </div>
              <input
                id="sim-mood"
                type="range"
                min={1}
                max={5}
                step={1}
                value={projectedMood}
                onChange={(e) => setProjectedMood(Number(e.target.value))}
                className="w-full accent-sky-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200/60 dark:border-white/[0.08] text-xs text-slate-500 dark:text-slate-400">
            Tip: Slide energy down to ≤ 2 to preview how SolveSpace triggers{' '}
            <strong className="text-slate-700 dark:text-sky-200">Recovery Mode</strong> even when
            raw output is high.
          </div>
        </div>

        {/* Before vs After Comparison Chart */}
        <div className="lg:col-span-7 astra-card rounded-xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Before vs. After Completion Trajectory ({workspace.unit})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Compares your current baseline velocity against the simulated What-If curve toward{' '}
              {workspace.targetValue} {workspace.unit}.
            </p>
          </div>

          <div className="h-72 w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.chartSeries} margin={{ top: 10, right: 16, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.14} />
                <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(8, 12, 26, 0.94)',
                    borderRadius: '10px',
                    border: '1px solid rgba(148, 163, 184, 0.25)',
                    color: '#f8fafc',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <ReferenceLine
                  y={workspace.targetValue}
                  stroke="#fb7185"
                  strokeDasharray="4 4"
                  label={{
                    value: `Goal (${workspace.targetValue} ${workspace.unit})`,
                    position: 'insideTopRight',
                    fill: '#fb7185',
                    fontSize: 11,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="currentTrajectory"
                  name="Before (Baseline Pace)"
                  stroke="#64748b"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="whatIfTrajectory"
                  name="After (What-If Scenario)"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  dot={{ r: 3.5, fill: '#38bdf8' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
