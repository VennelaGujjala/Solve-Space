import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AppSettings,
  DemoScenarioId,
  FocusSession,
  MoodEntry,
  ModuleInstance,
  NumberLogEntry,
  PageId,
  RuleExplanation,
  SmartSuggestion,
  TaskItem,
  Workspace,
} from './types/solvespace';
import {
  applyDemoScenarioData,
  createInitialWorkspaces,
  offsetDate,
  uid,
} from './data/sampleData';
import { evaluateWorkspace } from './engine/adaptiveEngine';
import { ConsoleShell } from './components/ConsoleShell';
import { DemoSwitcher } from './components/DemoSwitcher';
import { RuleInspectorModal } from './components/RuleInspectorModal';
import { QuickNewTaskModal, SearchModal } from './components/SearchAndQuickModals';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { WorkspaceBuilderPage } from './pages/WorkspaceBuilderPage';
import { SimulatorPage } from './pages/SimulatorPage';
import { InsightsPage } from './pages/InsightsPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';

const LS_WORKSPACES_KEY = 'solvespace_workspaces_v1';
const LS_ACTIVE_WS_KEY = 'solvespace_active_ws_v1';
const LS_SETTINGS_KEY = 'solvespace_settings_v1';
const LS_BONUS_XP_KEY = 'solvespace_bonus_xp_v1';

const DEFAULT_SETTINGS: AppSettings = {
  darkMode: false,
  largeText: false,
  keyboardShortcuts: true,
};

export default function App() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(() => {
    try {
      const raw = localStorage.getItem(LS_WORKSPACES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Workspace[];
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback to initial sample data
    }
    return createInitialWorkspaces();
  });

  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(LS_ACTIVE_WS_KEY);
      if (saved) return saved;
    } catch {
      // ignore
    }
    return 'ws_algorithms_finals';
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      if (raw) return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [bonusXp, setBonusXp] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(LS_BONUS_XP_KEY);
      return raw ? Number(raw) || 0 : 0;
    } catch {
      return 0;
    }
  });

  const [activePage, setActivePage] = useState<PageId>(PageId.Dashboard);
  const [inspectedRule, setInspectedRule] = useState<RuleExplanation | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickTaskOpen, setQuickTaskOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [activeDemoScenario, setActiveDemoScenario] = useState<DemoScenarioId | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const t = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(t);
  }, [toastMessage]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LS_WORKSPACES_KEY, JSON.stringify(workspaces));
    } catch {
      // ignore storage quota errors
    }
  }, [workspaces]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_ACTIVE_WS_KEY, activeWorkspaceId);
    } catch {
      // ignore
    }
  }, [activeWorkspaceId]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add('dark');
    else root.classList.remove('dark');

    if (settings.largeText) root.classList.add('large-text');
    else root.classList.remove('large-text');
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_BONUS_XP_KEY, String(bonusXp));
    } catch {
      // ignore
    }
  }, [bonusXp]);

  // Global Keyboard Shortcuts: N = New Task, / = Search, D = Demo Mode
  useEffect(() => {
    if (!settings.keyboardShortcuts) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        target?.isContentEditable
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '/') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setQuickTaskOpen(true);
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDemoOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setQuickTaskOpen(false);
        setInspectedRule(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [settings.keyboardShortcuts]);

  const activeWorkspace = useMemo(
    () => workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0],
    [workspaces, activeWorkspaceId]
  );

  const activeEvaluation = useMemo(
    () => evaluateWorkspace(activeWorkspace),
    [activeWorkspace]
  );

  const mutateActiveWorkspace = useCallback(
    (updater: (ws: Workspace) => Workspace) => {
      setWorkspaces((prev) =>
        prev.map((w) => (w.id === activeWorkspace.id ? updater(w) : w))
      );
    },
    [activeWorkspace.id]
  );

  // Module & Workspace Mutations
  const handleCreateWorkspace = (ws: Workspace) => {
    setWorkspaces((prev) => [ws, ...prev]);
    setActiveWorkspaceId(ws.id);
    setActivePage(PageId.Dashboard);
    setBonusXp((x) => x + 25);
    showToast(`Created workspace "${ws.name}" (+25 XP)`);
  };

  const handleUpdateGoalProgress = (nextCurrent: number, nextTarget?: number) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      currentValue: nextCurrent,
      targetValue: nextTarget ?? ws.targetValue,
    }));
    if (nextTarget !== undefined) {
      showToast(`Raised goal target to ${nextTarget} ${activeWorkspace.unit}`);
    }
  };

  const handleAddTask = (task: Omit<TaskItem, 'id' | 'completed'>) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      tasks: [
        {
          id: uid('task'),
          ...task,
          completed: false,
        },
        ...ws.tasks,
      ],
    }));
    showToast('Added task to workspace');
  };

  const handleToggleTask = (taskId: string) => {
    const today = offsetDate(0);
    mutateActiveWorkspace((ws) => ({
      ...ws,
      tasks: ws.tasks.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: !t.completed,
              completedAt: !t.completed ? today : undefined,
            }
          : t
      ),
    }));
  };

  const handleDeleteTask = (taskId: string) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      tasks: ws.tasks.filter((t) => t.id !== taskId),
    }));
  };

  const handleMoveTaskTomorrow = (taskId: string) => {
    const tomorrow = offsetDate(1);
    mutateActiveWorkspace((ws) => ({
      ...ws,
      tasks: ws.tasks.map((t) => (t.id === taskId ? { ...t, dueDate: tomorrow } : t)),
    }));
    showToast('Moved overdue task to tomorrow');
  };

  const handleToggleHabitToday = (habitId: string) => {
    const today = offsetDate(0);
    mutateActiveWorkspace((ws) => ({
      ...ws,
      habits: ws.habits.map((h) => {
        if (h.id !== habitId) return h;
        const already = h.completedDates.includes(today);
        const nextDates = already
          ? h.completedDates.filter((d) => d !== today)
          : [...h.completedDates, today];
        const nextStreak = already ? Math.max(0, h.streak - 1) : h.streak + 1;
        return { ...h, completedDates: nextDates, streak: nextStreak };
      }),
    }));
  };

  const handleAddHabit = (title: string) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      habits: [
        ...ws.habits,
        { id: uid('hab'), title, streak: 0, completedDates: [] },
      ],
    }));
  };

  const handleDeleteHabit = (habitId: string) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      habits: ws.habits.filter((h) => h.id !== habitId),
    }));
  };

  const handleToggleChartType = (nextType: 'bar' | 'line') => {
    mutateActiveWorkspace((ws) => ({ ...ws, loggerChartType: nextType }));
  };

  const handleAddLog = (entry: Omit<NumberLogEntry, 'id'>) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      logs: [...ws.logs, { id: uid('log'), ...entry }],
      currentValue:
        ws.unit !== 'USD'
          ? +(ws.currentValue + entry.value).toFixed(1)
          : ws.currentValue,
    }));
    showToast(`Logged ${entry.value} in ${activeWorkspace.loggerLabel}`);
  };

  const handleDeleteLog = (id: string) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      logs: ws.logs.filter((l) => l.id !== id),
    }));
  };

  const handleLogSession = (session: Omit<FocusSession, 'id'>) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      focusSessions: [...ws.focusSessions, { id: uid('foc'), ...session }],
    }));
    showToast(`Logged ${session.durationMinutes}m ${session.mode} block (+20 XP)`);
  };

  const handleSaveMood = (entry: Omit<MoodEntry, 'id'>) => {
    mutateActiveWorkspace((ws) => {
      const existingIdx = ws.moods.findIndex((m) => m.date === entry.date);
      if (existingIdx >= 0) {
        const copy = [...ws.moods];
        copy[existingIdx] = { ...copy[existingIdx], ...entry };
        return { ...ws, moods: copy };
      }
      return { ...ws, moods: [...ws.moods, { id: uid('mood'), ...entry }] };
    });
    showToast('Saved daily Mood & Energy check-in');
  };

  const handleSaveNote = (noteId: string | null, title: string, content: string) => {
    const today = offsetDate(0);
    mutateActiveWorkspace((ws) => {
      if (noteId) {
        return {
          ...ws,
          notes: ws.notes.map((n) =>
            n.id === noteId ? { ...n, title, content, updatedAt: today } : n
          ),
        };
      }
      return {
        ...ws,
        notes: [{ id: uid('note'), title, content, updatedAt: today }, ...ws.notes],
      };
    });
  };

  const handleDeleteNote = (noteId: string) => {
    mutateActiveWorkspace((ws) => ({
      ...ws,
      notes: ws.notes.filter((n) => n.id !== noteId),
    }));
  };

  const handleExecuteSuggestion = (suggestion: SmartSuggestion) => {
    const today = offsetDate(0);
    if (suggestion.actionType === 'reschedule_overdue') {
      const firstOverdue = activeWorkspace.tasks.find(
        (t) => !t.completed && t.dueDate < today
      );
      if (firstOverdue) {
        handleMoveTaskTomorrow(firstOverdue.id);
      }
    } else if (suggestion.actionType === 'raise_target') {
      handleUpdateGoalProgress(
        activeWorkspace.currentValue,
        Math.round(activeWorkspace.targetValue * 1.15)
      );
    } else if (suggestion.actionType === 'complete_light_task') {
      const light =
        activeWorkspace.tasks.find((t) => !t.completed && t.effort === 'light') ??
        activeWorkspace.tasks.find((t) => !t.completed);
      if (light) {
        handleToggleTask(light.id);
        showToast(`Completed "${light.title}" (+15 XP)`);
      }
    } else if (suggestion.actionType === 'log_progress') {
      const remaining = Math.max(0, activeWorkspace.targetValue - activeWorkspace.currentValue);
      const step = Math.max(
        1,
        Math.ceil(remaining / Math.max(1, activeEvaluation.daysRemaining))
      );
      handleUpdateGoalProgress(+(activeWorkspace.currentValue + step).toFixed(1));
      showToast(`Logged +${step} ${activeWorkspace.unit} toward goal`);
    } else if (suggestion.actionType === 'start_light_timer') {
      document.getElementById('module-focus-timer')?.scrollIntoView({ behavior: 'smooth' });
    } else if (suggestion.actionType === 'open_mood') {
      document.getElementById('module-mood-checkin')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Builder Mutations
  const handleUpdateWorkspaceMeta = (patch: Partial<Workspace>) => {
    mutateActiveWorkspace((ws) => ({ ...ws, ...patch }));
  };

  const handleUpdateModules = (modules: ModuleInstance[]) => {
    mutateActiveWorkspace((ws) => ({ ...ws, modules }));
  };

  const handleDeleteWorkspace = () => {
    if (workspaces.length <= 1) return;
    const remaining = workspaces.filter((w) => w.id !== activeWorkspace.id);
    setWorkspaces(remaining);
    setActiveWorkspaceId(remaining[0].id);
    setActivePage(PageId.Dashboard);
    showToast('Deleted workspace');
  };

  // Demo Scenario Switcher Handlers
  const handleSelectDemoScenario = (scenarioId: DemoScenarioId) => {
    const { workspaces: nextList, activeWorkspaceId: nextActive } = applyDemoScenarioData(
      scenarioId,
      workspaces
    );
    setWorkspaces(nextList);
    setActiveWorkspaceId(nextActive);
    setActiveDemoScenario(scenarioId);
    setActivePage(PageId.Dashboard);
    showToast('Demo scenario loaded — Adaptive Engine updated workspace live');
  };

  const handleResetDemo = () => {
    const fresh = createInitialWorkspaces();
    setWorkspaces(fresh);
    setActiveWorkspaceId(fresh[0].id);
    setActiveDemoScenario(null);
    setActivePage(PageId.Dashboard);
    showToast('Reset console to default sample workspaces');
  };

  return (
    <>
      <ConsoleShell
        workspaces={workspaces}
        activeWorkspace={activeWorkspace}
        activeMode={activeEvaluation.mode}
        activePage={activePage}
        darkMode={settings.darkMode}
        bonusXp={bonusXp}
        onSelectWorkspace={(id) => {
          setActiveWorkspaceId(id);
          setActivePage(PageId.Dashboard);
        }}
        onNavigate={setActivePage}
        onToggleDarkMode={() => setSettings((s) => ({ ...s, darkMode: !s.darkMode }))}
        onOpenSearch={() => setSearchOpen(true)}
        onOpenQuickTask={() => setQuickTaskOpen(true)}
      >
        {activePage === PageId.Onboarding && (
          <OnboardingPage
            onCreateWorkspace={handleCreateWorkspace}
            existingWorkspaces={workspaces}
            onSelectExisting={(id) => {
              setActiveWorkspaceId(id);
              setActivePage(PageId.Dashboard);
            }}
          />
        )}

        {activePage === PageId.Dashboard && (
          <DashboardPage
            workspace={activeWorkspace}
            evaluation={activeEvaluation}
            onExplain={setInspectedRule}
            onNavigate={setActivePage}
            onUpdateGoalProgress={handleUpdateGoalProgress}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onMoveTaskTomorrow={handleMoveTaskTomorrow}
            onToggleHabitToday={handleToggleHabitToday}
            onAddHabit={handleAddHabit}
            onDeleteHabit={handleDeleteHabit}
            onToggleChartType={handleToggleChartType}
            onAddLog={handleAddLog}
            onDeleteLog={handleDeleteLog}
            onLogSession={handleLogSession}
            onSaveMood={handleSaveMood}
            onSaveNote={handleSaveNote}
            onDeleteNote={handleDeleteNote}
            onExecuteSuggestion={handleExecuteSuggestion}
          />
        )}

        {activePage === PageId.Builder && (
          <WorkspaceBuilderPage
            workspace={activeWorkspace}
            canDeleteWorkspace={workspaces.length > 1}
            onUpdateWorkspaceMeta={handleUpdateWorkspaceMeta}
            onUpdateModules={handleUpdateModules}
            onDeleteWorkspace={handleDeleteWorkspace}
            onNavigate={setActivePage}
          />
        )}

        {activePage === PageId.Simulator && (
          <SimulatorPage workspace={activeWorkspace} onNavigate={setActivePage} />
        )}

        {activePage === PageId.Insights && (
          <InsightsPage
            workspaces={workspaces}
            bonusXp={bonusXp}
            onSelectWorkspace={(id) => {
              setActiveWorkspaceId(id);
              setActivePage(PageId.Dashboard);
            }}
          />
        )}

        {activePage === PageId.Settings && (
          <SettingsPage
            settings={settings}
            workspaces={workspaces}
            onUpdateSettings={(patch) => setSettings((s) => ({ ...s, ...patch }))}
            onResetAllData={() => {
              handleResetDemo();
              setBonusXp(0);
            }}
          />
        )}

        {activePage === PageId.About && <AboutPage />}
      </ConsoleShell>

      {/* Floating Presentation Demo Mode Switcher */}
      <DemoSwitcher
        isOpen={demoOpen}
        activeScenario={activeDemoScenario}
        onToggleOpen={() => setDemoOpen((v) => !v)}
        onSelectScenario={handleSelectDemoScenario}
        onResetDemo={handleResetDemo}
      />

      {/* Explainable Adaptive Rule Inspector ("Why am I seeing this?") */}
      <RuleInspectorModal
        rule={inspectedRule}
        onClose={() => setInspectedRule(null)}
      />

      {/* Global Search (/) & Quick Add Task (N) Modals */}
      <SearchModal
        isOpen={searchOpen}
        workspaces={workspaces}
        onClose={() => setSearchOpen(false)}
        onJumpToWorkspace={(wsId) => {
          setActiveWorkspaceId(wsId);
          setActivePage(PageId.Dashboard);
        }}
      />

      <QuickNewTaskModal
        isOpen={quickTaskOpen}
        workspaceName={activeWorkspace.name}
        onClose={() => setQuickTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* Subtle Feedback Toast */}
      {toastMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-5 z-40 px-4 py-2.5 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg shadow-lg no-print"
        >
          {toastMessage}
        </div>
      )}
    </>
  );
}
