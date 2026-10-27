import {
  DemoScenarioId,
  ModuleInstance,
  ModuleType,
  TemplateCategory,
  Workspace,
} from '../types/solvespace';

export function offsetDate(daysFromToday: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + daysFromToday);
  return d.toISOString().split('T')[0];
}

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export interface ModuleCatalogMeta {
  type: ModuleType;
  defaultTitle: string;
  description: string;
  defaultSpan: 'standard' | 'wide';
}

export const MODULE_CATALOG: ModuleCatalogMeta[] = [
  {
    type: ModuleType.GoalTracker,
    defaultTitle: 'Goal Tracker',
    description: 'Track target value, current progress, deadline countdown, and completion bar.',
    defaultSpan: 'standard',
  },
  {
    type: ModuleType.TaskPlanner,
    defaultTitle: 'Task Planner',
    description: 'Prioritize deliverables with due dates, effort tags, and overdue catch-up actions.',
    defaultSpan: 'wide',
  },
  {
    type: ModuleType.HabitTracker,
    defaultTitle: 'Habit & Streak Checklist',
    description: 'Maintain daily consistency habits with 7-day check history and active streaks.',
    defaultSpan: 'standard',
  },
  {
    type: ModuleType.NumberLogger,
    defaultTitle: 'Metric Logger',
    description: 'Record study hours, expenses, steps, or applications with interactive bar/line charts.',
    defaultSpan: 'wide',
  },
  {
    type: ModuleType.FocusTimer,
    defaultTitle: 'Focus Timer (Pomodoro)',
    description: 'Structured 25m focus / 5m break sprints with persistent session log.',
    defaultSpan: 'standard',
  },
  {
    type: ModuleType.MoodCheckin,
    defaultTitle: 'Mood & Energy Check-in',
    description: 'Daily 1–5 well-being sliders that inform the Adaptive Recovery Engine.',
    defaultSpan: 'standard',
  },
  {
    type: ModuleType.ProgressChart,
    defaultTitle: 'Progress Trajectory',
    description: 'Compare cumulative actual progress against the ideal linear deadline curve.',
    defaultSpan: 'wide',
  },
  {
    type: ModuleType.Notes,
    defaultTitle: 'Workspace Notes',
    description: 'Capture key formulas, interview notes, budget rules, or reflection memos.',
    defaultSpan: 'standard',
  },
];

export interface WorkspaceTemplate {
  category: TemplateCategory;
  tagline: string;
  problemPrompt: string;
  goalTitle: string;
  targetValue: number;
  unit: string;
  loggerLabel: string;
  daysToDeadline: number;
  modules: { type: ModuleType; title: string; span: 'standard' | 'wide' }[];
  starterTasks: {
    title: string;
    dueOffset: number;
    priority: 'low' | 'medium' | 'high';
    effort: 'light' | 'standard' | 'deep';
  }[];
  starterHabits: string[];
  starterNote: { title: string; content: string };
}

export const WORKSPACE_TEMPLATES: WorkspaceTemplate[] = [
  {
    category: TemplateCategory.ExamPrep,
    tagline: 'Structured syllabus coverage, timed revision blocks, and exam readiness.',
    problemPrompt: 'Prepare systematically for upcoming finals without last-minute cramming.',
    goalTitle: 'Complete 45 hours of focused exam revision',
    targetValue: 45,
    unit: 'hrs',
    loggerLabel: 'Study Hours Logged',
    daysToDeadline: 18,
    modules: [
      { type: ModuleType.GoalTracker, title: 'Revision Target', span: 'standard' },
      { type: ModuleType.FocusTimer, title: 'Revision Pomodoro', span: 'standard' },
      { type: ModuleType.TaskPlanner, title: 'Syllabus Study Queue', span: 'wide' },
      { type: ModuleType.NumberLogger, title: 'Daily Study Hours', span: 'wide' },
      { type: ModuleType.HabitTracker, title: 'Daily Study Habits', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: ' Cognitive Energy Check-in', span: 'standard' },
      { type: ModuleType.ProgressChart, title: 'Revision Pace vs. Exam Date', span: 'wide' },
      { type: ModuleType.Notes, title: 'Key Formulas & Weak Topics', span: 'standard' },
    ],
    starterTasks: [
      { title: 'Summarize Unit 1–2 core theorems & edge cases', dueOffset: 1, priority: 'high', effort: 'deep' },
      { title: 'Solve 2024 past examination paper under timed conditions', dueOffset: 3, priority: 'high', effort: 'deep' },
      { title: 'Review flashcard deck for weak definitions', dueOffset: 2, priority: 'medium', effort: 'light' },
      { title: 'Compile 1-page formula cheat sheet', dueOffset: 5, priority: 'medium', effort: 'standard' },
    ],
    starterHabits: ['Complete 2 Pomodoro blocks before noon', 'Active recall review (20 mins)', 'Sleep 7.5+ hours'],
    starterNote: {
      title: 'Exam Strategy & High-Weight Topics',
      content: 'Focus 60% of revision time on past problem sets rather than passive re-reading. Flag any problem taking >15 minutes for office hours.',
    },
  },
  {
    category: TemplateCategory.BudgetControl,
    tagline: 'Track discretionary spending, hit monthly savings targets, and audit leaks.',
    problemPrompt: 'Keep monthly discretionary spending disciplined and build an emergency savings buffer.',
    goalTitle: 'Save $1,200 toward Emergency & Travel Buffer',
    targetValue: 1200,
    unit: 'USD',
    loggerLabel: 'Daily Savings / Expense Check ($)',
    daysToDeadline: 24,
    modules: [
      { type: ModuleType.GoalTracker, title: 'Savings Buffer Goal', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: 'Financial Stress & Impulse Check', span: 'standard' },
      { type: ModuleType.NumberLogger, title: 'Daily Discretionary Spend ($)', span: 'wide' },
      { type: ModuleType.TaskPlanner, title: 'Bills & Budget Actions', span: 'wide' },
      { type: ModuleType.HabitTracker, title: 'Frugal Daily Habits', span: 'standard' },
      { type: ModuleType.Notes, title: 'Subscription Audit & Rules', span: 'standard' },
      { type: ModuleType.ProgressChart, title: 'Savings Accumulation Curve', span: 'wide' },
    ],
    starterTasks: [
      { title: 'Cancel unused streaming & cloud trial subscriptions', dueOffset: 1, priority: 'high', effort: 'light' },
      { title: 'Transfer $300 automated paycheck allocation', dueOffset: 3, priority: 'high', effort: 'light' },
      { title: 'Meal-prep weekday lunches for next 5 days', dueOffset: 2, priority: 'medium', effort: 'standard' },
    ],
    starterHabits: ['Zero impulse food delivery', 'Log every purchase before 9 PM', 'Brew coffee at home'],
    starterNote: {
      title: '48-Hour Rule for Non-Essentials',
      content: 'Any non-essential item above $35 waits 48 hours on this list before purchase. Most impulse urges fade by day two.',
    },
  },
  {
    category: TemplateCategory.FitnessGoal,
    tagline: 'Balance training volume, step volume, recovery check-ins, and habit streaks.',
    problemPrompt: 'Build cardiovascular endurance consistently without overtraining or burnout.',
    goalTitle: 'Log 100 km of running & brisk conditioning',
    targetValue: 100,
    unit: 'km',
    loggerLabel: 'Distance Logged (km)',
    daysToDeadline: 28,
    modules: [
      { type: ModuleType.GoalTracker, title: '100 km Endurance Target', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: 'Soreness & Energy Check-in', span: 'standard' },
      { type: ModuleType.HabitTracker, title: 'Training & Hydration Habits', span: 'standard' },
      { type: ModuleType.FocusTimer, title: 'Mobility / Core Interval Timer', span: 'standard' },
      { type: ModuleType.NumberLogger, title: 'Daily Kilometers Logged', span: 'wide' },
      { type: ModuleType.TaskPlanner, title: 'Weekly Workout Milestones', span: 'wide' },
      { type: ModuleType.ProgressChart, title: 'Cumulative Mileage Curve', span: 'wide' },
    ],
    starterTasks: [
      { title: 'Easy Zone-2 5 km aerobic base run', dueOffset: 1, priority: 'high', effort: 'standard' },
      { title: '15-minute hip & ankle mobility routine', dueOffset: 0, priority: 'low', effort: 'light' },
      { title: 'Weekend 8 km progressive tempo run', dueOffset: 4, priority: 'medium', effort: 'deep' },
    ],
    starterHabits: ['Drink 2.5L water', '10 mins post-run stretching', '8,000+ baseline steps'],
    starterNote: {
      title: 'Training Pace Zones',
      content: 'Keep 80% of weekly volume at conversational pace. If Energy Check-in drops to 2 or below for 3 days, swap intervals for walking.',
    },
  },
  {
    category: TemplateCategory.JobSearch,
    tagline: 'Organize tailored applications, portfolio polish, outreach, and interview prep.',
    problemPrompt: 'Run a structured, high-conversion internship & graduate role search without application fatigue.',
    goalTitle: 'Submit 40 tailored role applications',
    targetValue: 40,
    unit: 'apps',
    loggerLabel: 'Tailored Applications Sent',
    daysToDeadline: 25,
    modules: [
      { type: ModuleType.GoalTracker, title: 'Application Pipeline Target', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: 'Confidence & Energy Check', span: 'standard' },
      { type: ModuleType.TaskPlanner, title: 'Outreach & Interview Prep Tasks', span: 'wide' },
      { type: ModuleType.NumberLogger, title: 'Applications Sent Per Day', span: 'wide' },
      { type: ModuleType.HabitTracker, title: 'Daily Career Habits', span: 'standard' },
      { type: ModuleType.Notes, title: 'STAR Stories & Recruiter Notes', span: 'standard' },
      { type: ModuleType.ProgressChart, title: 'Application Velocity', span: 'wide' },
    ],
    starterTasks: [
      { title: 'Tailor resume bullet metrics for 3 frontend product roles', dueOffset: 1, priority: 'high', effort: 'standard' },
      { title: 'Practice 2 array/graph problems aloud in 35 mins', dueOffset: 2, priority: 'high', effort: 'deep' },
      { title: 'Send polite alumni informational chat note', dueOffset: 3, priority: 'medium', effort: 'light' },
    ],
    starterHabits: ['Send 2 tailored applications', 'Solve 1 coding interview problem', 'Follow up on 5-day-old leads'],
    starterNote: {
      title: 'Core Behavioral STAR Highlights',
      content: '1. Adaptive Console Project: Built rule-based workspace engine.\n2. Team Conflict Story: Aligned API contract early across 4 teammates.',
    },
  },
  {
    category: TemplateCategory.TeamProject,
    tagline: 'Coordinate milestone deliverables, sprint velocity, focus blocks, and blockers.',
    problemPrompt: 'Deliver a polished multi-module capstone software project on schedule.',
    goalTitle: 'Complete 24 sprint story points for MVP launch',
    targetValue: 24,
    unit: 'pts',
    loggerLabel: 'Story Points Verified',
    daysToDeadline: 14,
    modules: [
      { type: ModuleType.GoalTracker, title: 'MVP Milestone Points', span: 'standard' },
      { type: ModuleType.FocusTimer, title: 'Deep Engineering Sprint', span: 'standard' },
      { type: ModuleType.TaskPlanner, title: 'Sprint Deliverables & Blockers', span: 'wide' },
      { type: ModuleType.ProgressChart, title: 'Sprint Burn-up Trajectory', span: 'wide' },
      { type: ModuleType.HabitTracker, title: 'Engineering Hygiene', span: 'standard' },
      { type: ModuleType.Notes, title: 'Architecture & Demo Checklist', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: 'Team Bandwidth Check', span: 'standard' },
    ],
    starterTasks: [
      { title: 'Finalize rule-based adaptive engine edge-case tests', dueOffset: 1, priority: 'high', effort: 'deep' },
      { title: 'Record backup 3-minute live demo walkthrough', dueOffset: 3, priority: 'medium', effort: 'standard' },
      { title: 'Proofread presentation slides & architecture diagram', dueOffset: 4, priority: 'low', effort: 'light' },
    ],
    starterHabits: ['Push clean atomic commits daily', 'Zero unresolved TypeScript warnings', '10-min async standup update'],
    starterNote: {
      title: 'Presentation Demo Flow',
      content: 'Show Onboarding -> Custom Builder -> Live Demo Switcher (Crunch, Recovery, Behind, Ahead) -> "Why am I seeing this?" rule drawer -> What-If Simulator.',
    },
  },
  {
    category: TemplateCategory.DailyRoutine,
    tagline: 'Anchor sleep, deep work, movement, and evening shutdown in one calm console.',
    problemPrompt: 'Replace scattered to-do sticky notes with a sustainable daily rhythm.',
    goalTitle: 'Complete 30 consistent daily routine cycles',
    targetValue: 30,
    unit: 'days',
    loggerLabel: 'Deep Focus Hours',
    daysToDeadline: 30,
    modules: [
      { type: ModuleType.HabitTracker, title: 'Core Daily Anchors', span: 'wide' },
      { type: ModuleType.FocusTimer, title: 'Morning Deep Work Timer', span: 'standard' },
      { type: ModuleType.MoodCheckin, title: 'Daily Mood & Energy Log', span: 'standard' },
      { type: ModuleType.TaskPlanner, title: 'Top 3 Daily Priorities', span: 'wide' },
      { type: ModuleType.GoalTracker, title: '30-Day Consistency Goal', span: 'standard' },
      { type: ModuleType.Notes, title: 'Evening Shutdown Reflection', span: 'standard' },
    ],
    starterTasks: [
      { title: 'Clear desk & plan tomorrow’s top 3 priorities before 9 PM', dueOffset: 0, priority: 'medium', effort: 'light' },
      { title: 'Complete 50-minute distraction-free morning block', dueOffset: 1, priority: 'high', effort: 'deep' },
    ],
    starterHabits: ['No phone for first 30m after waking', '90m morning focus block', '20m outdoor walk', 'Evening desk reset'],
    starterNote: {
      title: 'Anchor Habit Principle',
      content: 'On busy days, never skip twice. Even a 10-minute light version preserves identity and streak continuity.',
    },
  },
];

export function buildWorkspaceFromTemplate(
  template: WorkspaceTemplate,
  overrides?: {
    name?: string;
    problemStatement?: string;
    goalTitle?: string;
    targetValue?: number;
    unit?: string;
    deadline?: string;
    selectedTypes?: ModuleType[];
  }
): Workspace {
  const chosenModules: ModuleInstance[] = (
    overrides?.selectedTypes
      ? overrides.selectedTypes.map((t) => {
          const preset = template.modules.find((m) => m.type === t);
          const cat = MODULE_CATALOG.find((c) => c.type === t)!;
          return {
            id: uid('mod'),
            type: t,
            title: preset?.title ?? cat.defaultTitle,
            span: preset?.span ?? cat.defaultSpan,
          };
        })
      : template.modules.map((m) => ({
          id: uid('mod'),
          type: m.type,
          title: m.title,
          span: m.span,
        }))
  );

  return {
    id: uid('ws'),
    name: overrides?.name?.trim() || template.category,
    problemStatement: overrides?.problemStatement?.trim() || template.problemPrompt,
    category: template.category,
    goalTitle: overrides?.goalTitle?.trim() || template.goalTitle,
    targetValue: overrides?.targetValue ?? template.targetValue,
    currentValue: Math.round((overrides?.targetValue ?? template.targetValue) * 0.15),
    unit: overrides?.unit?.trim() || template.unit,
    loggerLabel: template.loggerLabel,
    loggerChartType: 'bar',
    startDate: offsetDate(-5),
    deadline: overrides?.deadline || offsetDate(template.daysToDeadline),
    modules: chosenModules,
    tasks: template.starterTasks.map((t) => ({
      id: uid('task'),
      title: t.title,
      dueDate: offsetDate(t.dueOffset),
      priority: t.priority,
      effort: t.effort,
      completed: false,
    })),
    habits: template.starterHabits.map((title, idx) => ({
      id: uid('hab'),
      title,
      streak: idx === 0 ? 3 : 2,
      completedDates: [offsetDate(-2), offsetDate(-1)],
    })),
    logs: [
      { id: uid('log'), date: offsetDate(-4), value: 2, note: 'Initial baseline session' },
      { id: uid('log'), date: offsetDate(-2), value: 3, note: 'Steady mid-week block' },
      { id: uid('log'), date: offsetDate(-1), value: 2, note: 'Focused evening progress' },
    ],
    focusSessions: [
      { id: uid('foc'), date: offsetDate(-2), durationMinutes: 25, label: 'Deep work sprint #1', mode: 'focus' },
      { id: uid('foc'), date: offsetDate(-1), durationMinutes: 25, label: 'Focused execution block', mode: 'focus' },
    ],
    moods: [
      { id: uid('mood'), date: offsetDate(-3), mood: 4, energy: 4, note: 'Clear mind, solid momentum' },
      { id: uid('mood'), date: offsetDate(-2), mood: 3, energy: 4, note: 'Steady afternoon pace' },
      { id: uid('mood'), date: offsetDate(-1), mood: 4, energy: 4, note: 'Productive evening review' },
    ],
    notes: [
      {
        id: uid('note'),
        title: template.starterNote.title,
        content: template.starterNote.content,
        updatedAt: offsetDate(-1),
      },
    ],
  };
}

/**
 * Rich initial sample data across 3 distinct problem workspaces so SolveSpace
 * never looks empty on first load and Cross-Workspace Insights are immediately meaningful.
 */
export function createInitialWorkspaces(): Workspace[] {
  const wsExam: Workspace = {
    id: 'ws_algorithms_finals',
    name: 'Algorithms & OS Finals',
    problemStatement: 'Master graph algorithms, dynamic programming, and OS virtual memory before semester finals.',
    category: TemplateCategory.ExamPrep,
    goalTitle: 'Complete 45 hours of structured exam revision',
    targetValue: 45,
    currentValue: 24,
    unit: 'hrs',
    loggerLabel: 'Study Hours Logged',
    loggerChartType: 'bar',
    startDate: offsetDate(-10),
    deadline: offsetDate(11),
    modules: [
      { id: 'm_exam_goal', type: ModuleType.GoalTracker, title: 'Revision Hours Target', span: 'standard' },
      { id: 'm_exam_timer', type: ModuleType.FocusTimer, title: 'Pomodoro Study Timer', span: 'standard' },
      { id: 'm_exam_tasks', type: ModuleType.TaskPlanner, title: 'Syllabus Revision Planner', span: 'wide' },
      { id: 'm_exam_logger', type: ModuleType.NumberLogger, title: 'Daily Study Hours', span: 'wide' },
      { id: 'm_exam_habits', type: ModuleType.HabitTracker, title: 'Active Recall Habits', span: 'standard' },
      { id: 'm_exam_mood', type: ModuleType.MoodCheckin, title: 'Mood & Cognitive Energy', span: 'standard' },
      { id: 'm_exam_chart', type: ModuleType.ProgressChart, title: 'Cumulative Revision Trajectory', span: 'wide' },
      { id: 'm_exam_notes', type: ModuleType.Notes, title: 'Theorem & Complexity Notes', span: 'standard' },
    ],
    tasks: [
      {
        id: 't_ex_1',
        title: 'Derive Dijkstra & Bellman-Ford complexity proofs',
        dueDate: offsetDate(-4),
        priority: 'high',
        effort: 'deep',
        completed: true,
        completedAt: offsetDate(-4),
      },
      {
        id: 't_ex_2',
        title: 'Solve 8 Dynamic Programming recurrence problems',
        dueDate: offsetDate(-2),
        priority: 'high',
        effort: 'deep',
        completed: true,
        completedAt: offsetDate(-2),
      },
      {
        id: 't_ex_3',
        title: 'Review OS Page Replacement (LRU, Clock, Optimal)',
        dueDate: offsetDate(-1),
        priority: 'medium',
        effort: 'standard',
        completed: true,
        completedAt: offsetDate(-1),
      },
      {
        id: 't_ex_4',
        title: 'Complete 2025 Mock Exam Paper A (90 mins)',
        dueDate: offsetDate(1),
        priority: 'high',
        effort: 'deep',
        completed: false,
      },
      {
        id: 't_ex_5',
        title: 'Flashcard drill: Deadlock prevention & Banker’s algorithm',
        dueDate: offsetDate(2),
        priority: 'medium',
        effort: 'light',
        completed: false,
      },
      {
        id: 't_ex_6',
        title: 'Office hours check on Red-Black Tree deletion cases',
        dueDate: offsetDate(4),
        priority: 'low',
        effort: 'light',
        completed: false,
      },
    ],
    habits: [
      {
        id: 'h_ex_1',
        title: '2 Pomodoro blocks before 11 AM',
        streak: 5,
        completedDates: [offsetDate(-4), offsetDate(-3), offsetDate(-2), offsetDate(-1), offsetDate(0)],
      },
      {
        id: 'h_ex_2',
        title: '20-min spaced repetition flashcards',
        streak: 4,
        completedDates: [offsetDate(-4), offsetDate(-3), offsetDate(-2), offsetDate(-1)],
      },
      {
        id: 'h_ex_3',
        title: 'Phone in another room while studying',
        streak: 3,
        completedDates: [offsetDate(-3), offsetDate(-2), offsetDate(-1)],
      },
    ],
    logs: [
      { id: 'l_ex_1', date: offsetDate(-6), value: 3.5, note: 'Graph traversal & BFS/DFS' },
      { id: 'l_ex_2', date: offsetDate(-5), value: 2.0, note: 'Light evening review' },
      { id: 'l_ex_3', date: offsetDate(-4), value: 4.0, note: 'Shortest path proofs' },
      { id: 'l_ex_4', date: offsetDate(-3), value: 2.5, note: 'OS process scheduling' },
      { id: 'l_ex_5', date: offsetDate(-2), value: 4.5, note: 'Dynamic programming marathon' },
      { id: 'l_ex_6', date: offsetDate(-1), value: 3.5, note: 'Virtual memory & paging' },
      { id: 'l_ex_7', date: offsetDate(0), value: 4.0, note: 'Morning mock problem set' },
    ],
    focusSessions: [
      { id: 'f_ex_1', date: offsetDate(-2), durationMinutes: 25, label: 'DP knapsack variations', mode: 'focus' },
      { id: 'f_ex_2', date: offsetDate(-2), durationMinutes: 25, label: 'DP memoization tables', mode: 'focus' },
      { id: 'f_ex_3', date: offsetDate(-1), durationMinutes: 25, label: 'TLB & multilevel paging', mode: 'focus' },
      { id: 'f_ex_4', date: offsetDate(0), durationMinutes: 25, label: 'Minimum spanning trees', mode: 'focus' },
    ],
    moods: [
      { id: 'md_ex_1', date: offsetDate(-5), mood: 2, energy: 2, note: 'Tired after late lab submission' },
      { id: 'md_ex_2', date: offsetDate(-4), mood: 4, energy: 4, note: 'Slept well, proofs clicked quickly' },
      { id: 'md_ex_3', date: offsetDate(-3), mood: 3, energy: 3, note: 'Moderate focus after lectures' },
      { id: 'md_ex_4', date: offsetDate(-2), mood: 5, energy: 4, note: 'High momentum solving DP sets' },
      { id: 'md_ex_5', date: offsetDate(-1), mood: 4, energy: 4, note: 'Calm and steady evening session' },
      { id: 'md_ex_6', date: offsetDate(0), mood: 4, energy: 5, note: 'Sharp morning energy' },
    ],
    notes: [
      {
        id: 'n_ex_1',
        title: 'Master Theorem & Paging Quick Reference',
        content:
          '• T(n) = aT(n/b) + f(n): compare f(n) against n^(log_b a).\n• Effective Access Time (EAT) = hit_ratio × (TLB + mem) + miss_ratio × (TLB + 2×mem).\n• Re-verify negative cycle detection in Bellman-Ford before Paper A.',
        updatedAt: offsetDate(-1),
      },
    ],
  };

  const wsBudget: Workspace = {
    id: 'ws_student_budget',
    name: 'Monthly Savings & Budget',
    problemStatement: 'Curb impulse dining/tech spend and save $1,200 for summer relocation.',
    category: TemplateCategory.BudgetControl,
    goalTitle: 'Build $1,200 Relocation Savings Buffer',
    targetValue: 1200,
    currentValue: 640,
    unit: 'USD',
    loggerLabel: 'Daily Discretionary Spend ($)',
    loggerChartType: 'line',
    startDate: offsetDate(-12),
    deadline: offsetDate(16),
    modules: [
      { id: 'm_bu_goal', type: ModuleType.GoalTracker, title: 'Relocation Savings Buffer', span: 'standard' },
      { id: 'm_bu_mood', type: ModuleType.MoodCheckin, title: 'Impulse & Stress Check-in', span: 'standard' },
      { id: 'm_bu_logger', type: ModuleType.NumberLogger, title: 'Daily Discretionary Spend ($)', span: 'wide' },
      { id: 'm_bu_tasks', type: ModuleType.TaskPlanner, title: 'Budget & Bill Actions', span: 'wide' },
      { id: 'm_bu_habits', type: ModuleType.HabitTracker, title: 'No-Spend Habits', span: 'standard' },
      { id: 'm_bu_notes', type: ModuleType.Notes, title: 'Budget Guardrails', span: 'standard' },
    ],
    tasks: [
      {
        id: 't_bu_1',
        title: 'Automate $400 bi-weekly savings transfer',
        dueDate: offsetDate(-4),
        priority: 'high',
        effort: 'light',
        completed: true,
        completedAt: offsetDate(-4),
      },
      {
        id: 't_bu_2',
        title: 'Audit recurring app & cloud subscriptions ($38/mo saved)',
        dueDate: offsetDate(-2),
        priority: 'medium',
        effort: 'light',
        completed: true,
        completedAt: offsetDate(-2),
      },
      {
        id: 't_bu_3',
        title: 'Sell unused monitor stand on campus marketplace',
        dueDate: offsetDate(2),
        priority: 'medium',
        effort: 'standard',
        completed: false,
      },
      {
        id: 't_bu_4',
        title: 'Plan Sunday grocery list under $55 cap',
        dueDate: offsetDate(3),
        priority: 'low',
        effort: 'light',
        completed: false,
      },
    ],
    habits: [
      {
        id: 'h_bu_1',
        title: 'Pack lunch from home',
        streak: 6,
        completedDates: [offsetDate(-5), offsetDate(-4), offsetDate(-3), offsetDate(-2), offsetDate(-1), offsetDate(0)],
      },
      {
        id: 'h_bu_2',
        title: 'Log daily expenses under $20 cap',
        streak: 3,
        completedDates: [offsetDate(-2), offsetDate(-1), offsetDate(0)],
      },
    ],
    logs: [
      { id: 'l_bu_1', date: offsetDate(-5), value: 14, note: 'Groceries top-up' },
      { id: 'l_bu_2', date: offsetDate(-4), value: 8, note: 'Campus transit pass' },
      { id: 'l_bu_3', date: offsetDate(-3), value: 26, note: 'Group dinner split' },
      { id: 'l_bu_4', date: offsetDate(-2), value: 11, note: 'Coffee beans & oats' },
      { id: 'l_bu_5', date: offsetDate(-1), value: 0, note: 'Zero-spend day!' },
      { id: 'l_bu_6', date: offsetDate(0), value: 12, note: 'Stationery supplies' },
    ],
    focusSessions: [
      { id: 'f_bu_1', date: offsetDate(-2), durationMinutes: 25, label: 'Monthly bank statement review', mode: 'focus' },
    ],
    moods: [
      { id: 'md_bu_1', date: offsetDate(-4), mood: 4, energy: 4, note: 'Relieved after automating transfer' },
      { id: 'md_bu_2', date: offsetDate(-2), mood: 4, energy: 3, note: 'Canceled 3 unused subscriptions' },
      { id: 'md_bu_3', date: offsetDate(-1), mood: 5, energy: 4, note: 'Zero-spend day felt effortless' },
    ],
    notes: [
      {
        id: 'n_bu_1',
        title: 'Monthly Spend Ceilings',
        content: 'Dining out cap: $90/mo · Transit: $45/mo · Everything saved above $1,200 goes toward conference travel.',
        updatedAt: offsetDate(-2),
      },
    ],
  };

  const wsCareer: Workspace = {
    id: 'ws_internship_hunt',
    name: 'SWE Internship Search',
    problemStatement: 'Submit 40 tailored software engineering internship applications and prepare for technical interviews.',
    category: TemplateCategory.JobSearch,
    goalTitle: 'Send 40 tailored SWE applications',
    targetValue: 40,
    currentValue: 18,
    unit: 'apps',
    loggerLabel: 'Applications Sent',
    loggerChartType: 'bar',
    startDate: offsetDate(-9),
    deadline: offsetDate(15),
    modules: [
      { id: 'm_ca_goal', type: ModuleType.GoalTracker, title: 'Tailored Applications Goal', span: 'standard' },
      { id: 'm_ca_timer', type: ModuleType.FocusTimer, title: 'Mock Interview Sprint', span: 'standard' },
      { id: 'm_ca_tasks', type: ModuleType.TaskPlanner, title: 'Application & Prep Pipeline', span: 'wide' },
      { id: 'm_ca_logger', type: ModuleType.NumberLogger, title: 'Daily Applications Sent', span: 'wide' },
      { id: 'm_ca_habits', type: ModuleType.HabitTracker, title: 'Daily Career Consistency', span: 'standard' },
      { id: 'm_ca_mood', type: ModuleType.MoodCheckin, title: 'Search Morale Check-in', span: 'standard' },
      { id: 'm_ca_notes', type: ModuleType.Notes, title: 'Interview Feedback & Links', span: 'standard' },
    ],
    tasks: [
      {
        id: 't_ca_1',
        title: 'Deploy live portfolio link for SolveSpace console',
        dueDate: offsetDate(-2),
        priority: 'high',
        effort: 'deep',
        completed: true,
        completedAt: offsetDate(-2),
      },
      {
        id: 't_ca_2',
        title: 'Submit tailored applications to 3 developer-tools startups',
        dueDate: offsetDate(1),
        priority: 'high',
        effort: 'standard',
        completed: false,
      },
      {
        id: 't_ca_3',
        title: 'Complete 45-min mock frontend system design practice',
        dueDate: offsetDate(3),
        priority: 'medium',
        effort: 'deep',
        completed: false,
      },
    ],
    habits: [
      {
        id: 'h_ca_1',
        title: 'Send 2 tailored applications',
        streak: 4,
        completedDates: [offsetDate(-3), offsetDate(-2), offsetDate(-1), offsetDate(0)],
      },
      {
        id: 'h_ca_2',
        title: '1 medium data-structures problem',
        streak: 3,
        completedDates: [offsetDate(-2), offsetDate(-1), offsetDate(0)],
      },
    ],
    logs: [
      { id: 'l_ca_1', date: offsetDate(-4), value: 3, note: 'Cloud & observability roles' },
      { id: 'l_ca_2', date: offsetDate(-3), value: 2, note: 'Product engineering roles' },
      { id: 'l_ca_3', date: offsetDate(-2), value: 4, note: 'Strong referrals batch' },
      { id: 'l_ca_4', date: offsetDate(-1), value: 2, note: 'Frontend platform teams' },
      { id: 'l_ca_5', date: offsetDate(0), value: 3, note: 'Morning application block' },
    ],
    focusSessions: [
      { id: 'f_ca_1', date: offsetDate(-2), durationMinutes: 25, label: 'Portfolio polish sprint', mode: 'focus' },
      { id: 'f_ca_2', date: offsetDate(-1), durationMinutes: 25, label: 'Graph traversal mock interview', mode: 'focus' },
    ],
    moods: [
      { id: 'md_ca_1', date: offsetDate(-3), mood: 3, energy: 3, note: 'Waiting on recruiter replies' },
      { id: 'md_ca_2', date: offsetDate(-2), mood: 5, energy: 5, note: 'Got 2 phone screen invites!' },
      { id: 'md_ca_3', date: offsetDate(-1), mood: 4, energy: 4, note: 'Confident after mock practice' },
    ],
    notes: [
      {
        id: 'n_ca_1',
        title: 'Phone Screen Talking Points',
        content: 'Highlight rule-based explainability ("Why am I seeing this?") and responsive modular architecture.',
        updatedAt: offsetDate(-1),
      },
    ],
  };

  return [wsExam, wsBudget, wsCareer];
}

export interface DemoScenarioMeta {
  id: DemoScenarioId;
  title: string;
  targetMode: string;
  summary: string;
}

export const DEMO_SCENARIOS: DemoScenarioMeta[] = [
  {
    id: 'exam_crunch',
    title: 'Exam Week Crunch',
    targetMode: 'Crunch Mode',
    summary: 'Deadline in 3 days (≤ 7 days). Enlarges Focus Timer & Task Planner and compacts secondary widgets.',
  },
  {
    id: 'low_budget',
    title: 'Low Budget Alert',
    targetMode: 'Behind Schedule',
    summary: 'Savings lagging 24% behind schedule + 3 overdue budget tasks. Surfaces Catch-Up Plan & warning banner.',
  },
  {
    id: 'bad_mood_streak',
    title: 'Bad Mood Streak',
    targetMode: 'Recovery Mode',
    summary: '3 consecutive days of low mood & energy (≤ 2/5). Activates calm teal palette, break guidance & light tasks.',
  },
  {
    id: 'ahead_of_schedule',
    title: 'Ahead of Schedule',
    targetMode: 'Ahead of Plan',
    summary: '89% goal reached with 16 days remaining & 7-day streak. Suggests raising target by +15%.',
  },
];

/**
 * Generates transformed workspaces & active workspace ID for live presentation Demo Scenarios.
 */
export function applyDemoScenarioData(
  scenarioId: DemoScenarioId,
  existingWorkspaces: Workspace[]
): { workspaces: Workspace[]; activeWorkspaceId: string } {
  const base = createInitialWorkspaces();
  const merged = existingWorkspaces.length >= 2 ? existingWorkspaces.map((w) => structuredClone(w)) : base;

  if (scenarioId === 'exam_crunch') {
    const crunchWs: Workspace = {
      ...base[0],
      id: 'ws_demo_crunch',
      name: 'Algorithms & OS Finals (Exam Week)',
      startDate: offsetDate(-18),
      deadline: offsetDate(3), // 3 days left -> triggers Crunch Mode!
      targetValue: 45,
      currentValue: 31,
      moods: [
        { id: uid('m'), date: offsetDate(-2), mood: 3, energy: 4, note: 'Intense exam week focus' },
        { id: uid('m'), date: offsetDate(-1), mood: 4, energy: 3, note: 'Pushing through mock papers' },
        { id: uid('m'), date: offsetDate(0), mood: 3, energy: 4, note: 'Final 72-hour sprint' },
      ],
      tasks: [
        {
          id: uid('t'),
          title: 'Solve 2025 Full Timed Finals Paper (Priority #1)',
          dueDate: offsetDate(0),
          priority: 'high',
          effort: 'deep',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Drill Virtual Memory & Page Fault numerical problems',
          dueDate: offsetDate(1),
          priority: 'high',
          effort: 'deep',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Quick 20-min review of Graph Shortest-Path edge cases',
          dueDate: offsetDate(2),
          priority: 'medium',
          effort: 'light',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Complete Unit 1–3 summary sheets',
          dueDate: offsetDate(-3),
          priority: 'high',
          effort: 'standard',
          completed: true,
          completedAt: offsetDate(-3),
        },
      ],
    };
    const others = merged.filter((w) => w.id !== 'ws_demo_crunch' && w.id !== 'ws_algorithms_finals');
    return { workspaces: [crunchWs, ...others], activeWorkspaceId: crunchWs.id };
  }

  if (scenarioId === 'low_budget') {
    const budgetWs: Workspace = {
      ...base[1],
      id: 'ws_demo_budget_behind',
      name: 'Monthly Savings & Budget (Alert)',
      startDate: offsetDate(-20),
      deadline: offsetDate(10), // 67% time elapsed, but only $340 / $1200 (28%) saved!
      targetValue: 1200,
      currentValue: 340,
      logs: [
        { id: uid('l'), date: offsetDate(-5), value: 68, note: 'Unplanned takeout & rideshare' },
        { id: uid('l'), date: offsetDate(-4), value: 115, note: 'Impulse keyboard accessory' },
        { id: uid('l'), date: offsetDate(-3), value: 49, note: 'Weekend dining out' },
        { id: uid('l'), date: offsetDate(-2), value: 38, note: 'Forgotten annual app renewal' },
        { id: uid('l'), date: offsetDate(-1), value: 42, note: 'Delivery dinner' },
      ],
      moods: [
        { id: uid('m'), date: offsetDate(-2), mood: 3, energy: 3, note: 'Need to tighten spending' },
        { id: uid('m'), date: offsetDate(-1), mood: 3, energy: 4, note: 'Reviewing statement today' },
      ],
      tasks: [
        {
          id: uid('t'),
          title: 'OVERDUE: Request refund on accidental annual renewal ($38)',
          dueDate: offsetDate(-3),
          priority: 'high',
          effort: 'light',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'OVERDUE: Move $250 from checking to locked savings bucket',
          dueDate: offsetDate(-2),
          priority: 'high',
          effort: 'light',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'OVERDUE: Reconcile week-3 credit card statement',
          dueDate: offsetDate(-1),
          priority: 'medium',
          effort: 'standard',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Prep 4-day zero-delivery meal batch',
          dueDate: offsetDate(1),
          priority: 'high',
          effort: 'standard',
          completed: false,
        },
      ],
    };
    const others = merged.filter((w) => w.id !== 'ws_demo_budget_behind' && w.id !== 'ws_student_budget');
    return { workspaces: [budgetWs, ...others], activeWorkspaceId: budgetWs.id };
  }

  if (scenarioId === 'bad_mood_streak') {
    const recoveryWs: Workspace = {
      ...base[0],
      id: 'ws_demo_recovery',
      name: 'Algorithms & OS Finals (Burnout Guard)',
      startDate: offsetDate(-12),
      deadline: offsetDate(14),
      targetValue: 45,
      currentValue: 23,
      moods: [
        { id: uid('m'), date: offsetDate(-4), mood: 4, energy: 4, note: 'Normal start of week' },
        { id: uid('m'), date: offsetDate(-2), mood: 2, energy: 2, note: 'Exhausted after consecutive 5h sleep nights' },
        { id: uid('m'), date: offsetDate(-1), mood: 2, energy: 1, note: 'Brain fog, rereading same paragraph' },
        { id: uid('m'), date: offsetDate(0), mood: 1, energy: 2, note: 'Feeling overwhelmed and drained' },
      ],
      tasks: [
        {
          id: uid('t'),
          title: 'Organize desk & skim 10 easy summary flashcards (10 mins)',
          dueDate: offsetDate(0),
          priority: 'low',
          effort: 'light',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Watch 12-min visual walkthrough of LRU caching',
          dueDate: offsetDate(1),
          priority: 'medium',
          effort: 'light',
          completed: false,
        },
        {
          id: uid('t'),
          title: 'Full 2-hour NP-Completeness proof derivation set',
          dueDate: offsetDate(3),
          priority: 'high',
          effort: 'deep',
          completed: false,
        },
      ],
    };
    const others = merged.filter((w) => w.id !== 'ws_demo_recovery' && w.id !== 'ws_algorithms_finals');
    return { workspaces: [recoveryWs, ...others], activeWorkspaceId: recoveryWs.id };
  }

  // ahead_of_schedule
  const aheadWs: Workspace = {
    ...base[2],
    id: 'ws_demo_ahead',
    name: 'SWE Internship Search (High Velocity)',
    startDate: offsetDate(-12),
    deadline: offsetDate(16), // 42% time elapsed, 36/40 (90%) complete!
    targetValue: 40,
    currentValue: 36,
    habits: [
      {
        id: uid('h'),
        title: 'Send 3 tailored applications daily',
        streak: 7,
        completedDates: [
          offsetDate(-6),
          offsetDate(-5),
          offsetDate(-4),
          offsetDate(-3),
          offsetDate(-2),
          offsetDate(-1),
          offsetDate(0),
        ],
      },
      {
        id: uid('h'),
        title: '1 timed algorithm problem + verbal explanation',
        streak: 6,
        completedDates: [
          offsetDate(-5),
          offsetDate(-4),
          offsetDate(-3),
          offsetDate(-2),
          offsetDate(-1),
          offsetDate(0),
        ],
      },
    ],
    moods: [
      { id: uid('m'), date: offsetDate(-2), mood: 4, energy: 5, note: 'Strong momentum' },
      { id: uid('m'), date: offsetDate(-1), mood: 5, energy: 4, note: 'Received 3 interview invites!' },
      { id: uid('m'), date: offsetDate(0), mood: 5, energy: 5, note: 'Energized and ahead of target' },
    ],
    tasks: [
      {
        id: uid('t'),
        title: 'Submit batch 1–8 tailored applications (36 sent)',
        dueDate: offsetDate(-1),
        priority: 'high',
        effort: 'standard',
        completed: true,
        completedAt: offsetDate(-1),
      },
      {
        id: uid('t'),
        title: 'Prepare custom architecture slide for Friday final-round interview',
        dueDate: offsetDate(3),
        priority: 'high',
        effort: 'standard',
        completed: false,
      },
    ],
  };
  const others = merged.filter((w) => w.id !== 'ws_demo_ahead' && w.id !== 'ws_internship_hunt');
  return { workspaces: [aheadWs, ...others], activeWorkspaceId: aheadWs.id };
}
