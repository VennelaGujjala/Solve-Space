import React from 'react';
import {
  BrainCircuit,
  CalendarSync,
  Cloud,
  Layers,
  Smartphone,
  Share2,
  UserCheck,
  Users,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const futureScopeItems = [
    {
      icon: BrainCircuit,
      title: '01. AI-Based Problem Analysis from Natural Sentences',
      detail:
        'Type a single sentence such as "I have 3 weeks to prepare for my operating systems exam while working part-time" and automatically parse goals, milestones, effort weights, and custom module configurations.',
    },
    {
      icon: Smartphone,
      title: '02. Installable Mobile PWA with Smart Reminders',
      detail:
        'Offline-ready Progressive Web App with gentle local push notifications that respect Recovery Mode (suppressing late-night alerts when energy is low).',
    },
    {
      icon: Cloud,
      title: '03. Encrypted Cloud Sync & Cross-Device Accounts',
      detail:
        'Optional sign-in with end-to-end encrypted synchronization so laptop focus sessions and mobile habit check-ins stay seamlessly unified.',
    },
    {
      icon: Users,
      title: '04. Shared Team & Family Workspaces',
      detail:
        'Collaborative capstone sprint boards, household budget consoles, and group study workspaces with role-aware task delegation.',
    },
    {
      icon: Share2,
      title: '05. Community-Made Problem Templates',
      detail:
        'Public gallery where students, engineers, and coaches publish battle-tested module layouts for marathons, thesis writing, or debt payoff.',
    },
    {
      icon: CalendarSync,
      title: '06. Calendar & Wearable Biometric Integration',
      detail:
        'Two-way calendar time-blocking plus sleep/HRV import from wearables to calibrate Recovery Mode and Crunch Mode automatically.',
    },
    {
      icon: UserCheck,
      title: '07. Mentor, Academic Advisor & Counsellor View',
      detail:
        'Opt-in read-only summary links allowing mentors or student counsellors to spot Behind Schedule drift or burnout streaks early and offer timely support.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Problem Statement Section */}
      <div className="astra-card-priority rounded-xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-medium text-sky-600 dark:text-sky-300">
          <Layers className="w-4 h-4" />
          <span>Project Overview & Problem Statement</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white [text-wrap:balance]">
          SolveSpace: Design and Development of an Adaptive Multi-Model Interactive Console
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          People manage their personal and academic goals — exam preparation, monthly budgets,
          physical conditioning, internship searches, and team projects — across many disconnected
          apps. Traditional to-do lists, habit trackers, and spreadsheets remain completely static
          even when a person’s deadline tightens, tasks fall behind, or cognitive energy drops.
        </p>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong className="text-slate-900 dark:text-white">SolveSpace</strong> unifies problem
          solving into a single modular interactive console. Users select a domain template or build
          a custom workspace from eight reusable widgets, while an explainable rule-based{' '}
          <strong className="text-slate-900 dark:text-white">Adaptive Engine</strong> continuously
          evaluates progress, time remaining, streaks, and daily well-being — reorganizing module
          hierarchy, visual themes, and actionable suggestions with full{' '}
          <em>“Why am I seeing this?”</em> transparency.
        </p>
      </div>

      {/* Adaptive Engine Rule Matrix */}
      <div className="astra-card rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Explainable Adaptive Modes
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200/70 dark:border-white/[0.10] text-slate-500 dark:text-slate-400">
                <th className="py-2.5 pr-4 font-medium">Mode</th>
                <th className="py-2.5 px-4 font-medium">Trigger Condition</th>
                <th className="py-2.5 pl-4 font-medium">Automatic Console Adaptation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.07] text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-3 pr-4 font-semibold text-teal-700 dark:text-teal-300 whitespace-nowrap">
                  Recovery Mode
                </td>
                <td className="py-3 px-4 tabular-nums">
                  Mood or Energy ≤ 2/5 across 3 consecutive check-ins
                </td>
                <td className="py-3 pl-4">
                  Calm aurora-teal nebula aura, surfaces light-effort tasks & restorative break
                  guidance, compacts dense charts.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-rose-600 dark:text-rose-300 whitespace-nowrap">
                  Crunch Mode
                </td>
                <td className="py-3 px-4 tabular-nums">
                  Deadline within ≤ 7 days and goal completion &lt; 95%
                </td>
                <td className="py-3 pl-4">
                  Enlarges Focus Timer & Task Planner to full width at Row 1; compacts secondary
                  widgets.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-amber-700 dark:text-amber-300 whitespace-nowrap">
                  Behind Schedule
                </td>
                <td className="py-3 px-4 tabular-nums">
                  ≥ 2 overdue tasks OR actual progress lags elapsed schedule by &gt; 15%
                </td>
                <td className="py-3 pl-4">
                  Displays Catch-Up Warning Banner, promotes overdue tasks & 1-click tomorrow
                  rescheduler.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-emerald-700 dark:text-emerald-300 whitespace-nowrap">
                  Ahead of Plan
                </td>
                <td className="py-3 px-4 tabular-nums">
                  Outpaces timeline by ≥ 15% (or ≥ 85% complete with &gt; 7d left) & 0 overdue
                </td>
                <td className="py-3 pl-4">
                  Emerald pulsar banner and 1-click +15% stretch target calibration.
                </td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-semibold text-sky-600 dark:text-sky-300 whitespace-nowrap">
                  On Track
                </td>
                <td className="py-3 px-4">Balanced velocity and healthy check-in bandwidth</td>
                <td className="py-3 pl-4">
                  Honors custom drag-and-drop Workspace Builder layout order.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Future Scope Section */}
      <div className="astra-card rounded-xl p-6 sm:p-8 space-y-5">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-white">
            Future Scope & Research Roadmap
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Planned extensions evolving SolveSpace from a local multi-model console into a connected
            adaptive ecosystem:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {futureScopeItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-4 rounded-xl border border-slate-200/70 dark:border-white/[0.08] bg-white/40 dark:bg-white/[0.02] flex items-start gap-3.5"
              >
                <div className="p-2 rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-300 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.detail}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
