import React, { useState } from 'react';
import { ArrowRight, Check, Sliders } from 'lucide-react';
import {
  MODULE_CATALOG,
  WORKSPACE_TEMPLATES,
  WorkspaceTemplate,
  buildWorkspaceFromTemplate,
  offsetDate,
  uid,
} from '../data/sampleData';
import { ModuleType, TemplateCategory, Workspace } from '../types/solvespace';

interface OnboardingPageProps {
  onCreateWorkspace: (ws: Workspace) => void;
  existingWorkspaces: Workspace[];
  onSelectExisting: (id: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  onCreateWorkspace,
  existingWorkspaces,
  onSelectExisting,
}) => {
  const [customMode, setCustomMode] = useState(false);
  const [name, setName] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [goalTitle, setGoalTitle] = useState('');
  const [targetValue, setTargetValue] = useState('30');
  const [unit, setUnit] = useState('hrs');
  const [loggerLabel, setLoggerLabel] = useState('Daily Units Logged');
  const [deadline, setDeadline] = useState(offsetDate(21));
  const [selectedModules, setSelectedModules] = useState<ModuleType[]>([
    ModuleType.GoalTracker,
    ModuleType.TaskPlanner,
    ModuleType.FocusTimer,
    ModuleType.HabitTracker,
    ModuleType.MoodCheckin,
    ModuleType.ProgressChart,
  ]);

  const handleQuickTemplate = (tpl: WorkspaceTemplate) => {
    const created = buildWorkspaceFromTemplate(tpl);
    onCreateWorkspace(created);
  };

  const toggleModule = (mType: ModuleType) => {
    setSelectedModules((prev) =>
      prev.includes(mType) ? prev.filter((x) => x !== mType) : [...prev, mType]
    );
  };

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || selectedModules.length === 0) return;
    const targetNum = Math.max(1, Number(targetValue) || 30);

    const ws: Workspace = {
      id: uid('ws'),
      name: name.trim(),
      problemStatement:
        problemStatement.trim() || `Structured modular workspace for ${name.trim()}.`,
      category: TemplateCategory.Custom,
      goalTitle: goalTitle.trim() || `Reach ${targetNum} ${unit.trim() || 'units'}`,
      targetValue: targetNum,
      currentValue: 0,
      unit: unit.trim() || 'units',
      loggerLabel: loggerLabel.trim() || 'Daily Progress Logged',
      loggerChartType: 'bar',
      startDate: offsetDate(0),
      deadline: deadline || offsetDate(21),
      modules: selectedModules.map((t) => {
        const meta = MODULE_CATALOG.find((c) => c.type === t)!;
        return {
          id: uid('mod'),
          type: t,
          title: meta.defaultTitle,
          span: meta.defaultSpan,
        };
      }),
      tasks: [
        {
          id: uid('task'),
          title: `Define first milestone toward ${name.trim()}`,
          dueDate: offsetDate(1),
          priority: 'high',
          effort: 'light',
          completed: false,
        },
      ],
      habits: [
        {
          id: uid('hab'),
          title: `Daily 25-minute block on ${name.trim()}`,
          streak: 0,
          completedDates: [],
        },
      ],
      logs: [],
      focusSessions: [],
      moods: [
        {
          id: uid('mood'),
          date: offsetDate(0),
          mood: 4,
          energy: 4,
          note: 'Starting fresh workspace',
        },
      ],
      notes: [
        {
          id: uid('note'),
          title: 'Problem Definition & Constraints',
          content: problemStatement.trim() || 'Capture key constraints and milestones here.',
          updatedAt: offsetDate(0),
        },
      ],
    };

    onCreateWorkspace(ws);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero Focal Anchor */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8">
        <div className="max-w-3xl">
          <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
            Adaptive Multi-Model Problem Console
          </p>
          <h1 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white [text-wrap:balance]">
            What problem do you want to solve?
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            Pick a domain template to assemble an immediate goal workspace, or compose a custom
            console from reusable modules. As your deadlines, streaks, and energy shift, SolveSpace
            automatically adapts layout priority, warnings, and suggestions.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setCustomMode(false)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                !customMode
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              Browse 6 Problem Templates
            </button>
            <button
              type="button"
              onClick={() => setCustomMode(true)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                customMode
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Custom Workspace</span>
            </button>
          </div>
        </div>
      </div>

      {!customMode ? (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Ready-to-Launch Problem Templates
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Pre-configured with target metrics, starter tasks, and adaptive rules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKSPACE_TEMPLATES.map((tpl) => (
              <div
                key={tpl.category}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
              >
                <div>
                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                    {tpl.category}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {tpl.tagline}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1 tabular-nums">
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      Goal: {tpl.goalTitle}
                    </p>
                    <p>
                      Target: {tpl.targetValue} {tpl.unit} · {tpl.daysToDeadline}-day horizon ·{' '}
                      {tpl.modules.length} modules
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleQuickTemplate(tpl)}
                  className="mt-5 w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap cursor-pointer"
                >
                  <span>Create {tpl.category}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleCreateCustom}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6"
        >
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              Assemble a Custom Problem Workspace
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Describe your problem, set a measurable target & deadline, and choose which modules to
              mount.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Workspace Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Thesis Literature Review"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Primary Goal Statement
              </label>
              <input
                type="text"
                placeholder="e.g., Read and synthesize 30 peer-reviewed papers"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Problem Description (what makes this tricky right now?)
              </label>
              <input
                type="text"
                placeholder="e.g., Balancing lab shifts with writing deadlines without losing energy."
                value={problemStatement}
                onChange={(e) => setProblemStatement(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Value
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-num rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Unit Label
                </label>
                <input
                  type="text"
                  placeholder="papers / hrs / USD / km"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Target Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 text-sm font-mono-num rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Number Logger Metric Name
                </label>
                <input
                  type="text"
                  value={loggerLabel}
                  onChange={(e) => setLoggerLabel(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-3">
              Select Modules to Mount ({selectedModules.length} selected)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {MODULE_CATALOG.map((mod) => {
                const active = selectedModules.includes(mod.type);
                return (
                  <button
                    key={mod.type}
                    type="button"
                    onClick={() => toggleModule(mod.type)}
                    className={`text-left p-3.5 rounded-lg border transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/30 dark:border-blue-500'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">
                        {mod.defaultTitle}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-xs border flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {active && <Check className="w-3 h-3" />}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                      {mod.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setCustomMode(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Back to templates
            </button>
            <button
              type="submit"
              disabled={!name.trim() || selectedModules.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>Launch Custom Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      )}

      {existingWorkspaces.length > 0 && (
        <div className="pt-2">
          <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Or Jump Back into an Existing Workspace
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {existingWorkspaces.map((ws) => (
              <button
                key={ws.id}
                type="button"
                onClick={() => onSelectExisting(ws.id)}
                className="text-left p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-blue-500 transition-colors cursor-pointer"
              >
                <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {ws.name}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                  {ws.currentValue} / {ws.targetValue} {ws.unit} · Due {ws.deadline}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
