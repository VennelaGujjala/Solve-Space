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
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
          Behavioral patterns synthesized across all {workspaces.length} active problem workspaces,
          plus your SolveSpace progression milestones.
        </p>
      </div>

      {/* Key Cross-Workspace Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {insights.map((ins) => (
          <div
            key={ins.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
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
            <p className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
              {ins.supportingStat}
            </p>
          </div>
        ))}
      </div>

      {/* Multi-Workspace Comparison Chart + Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Progress Score vs. Goal Completion Across Workspaces
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-4">
            Side-by-side comparison of your active problem domains
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar
                  dataKey="progressScore"
                  name="Progress Score (0–100)"
                  fill="#2563eb"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="completionPct"
                  name="Goal Target %"
                  fill="#0d9488"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
            Workspace Mode Matrix
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-3">
            Click any row to open that workspace console
          </p>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 flex-1">
            {evaluations.map(({ workspace, eval: ev }) => (
              <button
                key={workspace.id}
                type="button"
                onClick={() => onSelectWorkspace(workspace.id)}
                className="w-full py-3 flex items-center justify-between gap-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-lg transition-colors cursor-pointer"
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
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
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
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
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
            <div className="flex justify-between text-xs font-mono-num text-slate-500 mb-1">
              <span>Level {ach.level}</span>
              <span>{ach.currentLevelProgressPct}%</span>
            </div>
            <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
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
                  ? 'border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/40'
                  : 'border-slate-100 dark:border-slate-800/60 opacity-65'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {badge.unlocked ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {badge.title}
                  </h3>
                </div>
                <span className="font-mono-num text-xs font-medium text-blue-600 dark:text-blue-400">
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
