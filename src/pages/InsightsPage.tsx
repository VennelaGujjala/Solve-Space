import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Award, CheckCircle2, Lock, TrendingUp } from 'lucide-react';
import {
  computeCrossWorkspaceInsights,
  evaluateAchievements,
} from '../engine/adaptiveEngine';
import { Workspace } from '../types/solvespace';

interface InsightsPageProps {
  workspaces: Workspace[];
  bonusXp: number;
  onSelectWorkspace: (id: string) => void;
}

export const InsightsPage: React.FC<InsightsPageProps> = ({
  workspaces,
  bonusXp,
  onSelectWorkspace,
}) => {
  const { insights, comparisonData, evaluations } = computeCrossWorkspaceInsights(workspaces);
  const ach = evaluateAchievements(workspaces, bonusXp);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Cross-Workspace Insights & Achievements
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
          Behavioral patterns synthesized across all {workspaces.length} active problem workspaces,
          plus your SolveSpace progression milestones.
        </p>
      </div>

      {/* Key Cross-Workspace Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="astra-card rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Cross-Domain Signal</span>
              </div>
              <h2 className="mt-2 text-base font-semibold text-slate-900 dark:text-white leading-snug">
                {ins.headline}
              </h2>
              <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {ins.explanation}
              </p>
            </div>
            <p className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/[0.08] text-xs text-slate-500 dark:text-sky-200/80 tabular-nums">
              {ins.supportingStat}
            </p>
          </div>
        ))}
      </div>

      {/* Multi-Workspace Comparison Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 astra-card rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Progress Score vs. Goal Completion Across Workspaces
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Side-by-side comparison of your active problem domains
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.14} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
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
                <Bar
                  dataKey="progressScore"
                  name="Progress Score (0–100)"
                  fill="#38bdf8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completionPct"
                  name="Goal Target %"
                  fill="#2dd4bf"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 astra-card rounded-xl p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Workspace Mode Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
            Click any row to open that workspace console
          </p>

          <div className="divide-y divide-slate-200/60 dark:divide-white/[0.07] flex-1">
            {evaluations.map(({ workspace, eval: ev }) => (
              <button
                key={workspace.id}
                type="button"
                onClick={() => onSelectWorkspace(workspace.id)}
                className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-200/50 dark:hover:bg-white/[0.05] px-2 rounded-lg transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {workspace.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums mt-0.5">
                    {ev.mode} · Due {workspace.deadline}
                  </p>
                </div>
                <div className="text-right shrink-0 font-mono-num">
                  <p className="text-sm font-semibold text-slate-900 dark:text-sky-200">
                    {ev.progressScore}/100
                  </p>
                  <p className="text-xs text-slate-400">
                    {Math.round(ev.actualProgressRatio * 100)}% goal
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gamification: XP Level & Achievement Badges */}
      <div className="astra-card rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/15 text-sky-600 dark:text-sky-300 border border-sky-400/25">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                Operator Level {ach.level} · {ach.totalXp} Total XP
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                Next level at {ach.nextLevelXp} XP · Earn XP by completing tasks (+15), Pomodoro
                sessions (+20), and daily check-ins (+5)
              </p>
            </div>
          </div>

          <div className="w-full sm:w-52">
            <div className="flex justify-between text-xs font-mono-num text-slate-500 dark:text-slate-400 mb-1">
              <span>Level {ach.level}</span>
              <span>{ach.currentLevelProgressPct}%</span>
            </div>
            <div className="h-2 bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full transition-all duration-300"
                style={{ width: `${ach.currentLevelProgressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ach.badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-colors ${
                badge.unlocked
                  ? 'border-sky-400/30 bg-sky-50/40 dark:bg-white/[0.04]'
                  : 'border-slate-200/60 dark:border-white/[0.06] opacity-65'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                </div>
                <span className="font-mono-num text-xs font-medium text-sky-600 dark:text-sky-300">
                  +{badge.xpReward} XP
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {badge.description}
              </p>
              <p className="mt-2 text-xs font-mono-num text-slate-500 dark:text-slate-400">
                {badge.unlocked ? 'Unlocked' : badge.progressText}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
