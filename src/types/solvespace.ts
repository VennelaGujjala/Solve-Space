export enum ModuleType {
  GoalTracker = 'goal_tracker',
  TaskPlanner = 'task_planner',
  HabitTracker = 'habit_tracker',
  NumberLogger = 'number_logger',
  FocusTimer = 'focus_timer',
  MoodCheckin = 'mood_checkin',
  Notes = 'notes',
  ProgressChart = 'progress_chart',
}

export enum AdaptiveMode {
  OnTrack = 'On Track',
  BehindSchedule = 'Behind Schedule',
  CrunchMode = 'Crunch Mode',
  RecoveryMode = 'Recovery Mode',
  AheadOfPlan = 'Ahead of Plan',
}

export enum TemplateCategory {
  ExamPrep = 'Exam Preparation',
  BudgetControl = 'Budget Control',
  FitnessGoal = 'Fitness Goal',
  JobSearch = 'Job/Internship Search',
  TeamProject = 'Team Project',
  DailyRoutine = 'Daily Routine',
  Custom = 'Custom Workspace',
}

export enum PageId {
  Onboarding = 'onboarding',
  Dashboard = 'dashboard',
  Builder = 'builder',
  Simulator = 'simulator',
  Insights = 'insights',
  Settings = 'settings',
  About = 'about',
}

export interface ModuleInstance {
  id: string;
  type: ModuleType;
  title: string;
  span: 'standard' | 'wide';
}

export interface TaskItem {
  id: string;
  title: string;
  dueDate: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high';
  effort: 'light' | 'standard' | 'deep';
  completed: boolean;
  completedAt?: string;
}

export interface HabitItem {
  id: string;
  title: string;
  streak: number;
  completedDates: string[]; // YYYY-MM-DD
}

export interface NumberLogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  value: number;
  note: string;
}

export interface FocusSession {
  id: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  label: string;
  mode: 'focus' | 'break';
}

export interface MoodEntry {
  id: string;
  date: string; // YYYY-MM-DD
  mood: number; // 1-5
  energy: number; // 1-5
  note: string;
}

export interface NoteEntry {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
}

export interface Workspace {
  id: string;
  name: string;
  problemStatement: string;
  category: TemplateCategory;
  goalTitle: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  loggerLabel: string;
  loggerChartType: 'bar' | 'line';
  startDate: string; // YYYY-MM-DD
  deadline: string; // YYYY-MM-DD
  modules: ModuleInstance[];
  tasks: TaskItem[];
  habits: HabitItem[];
  logs: NumberLogEntry[];
  focusSessions: FocusSession[];
  moods: MoodEntry[];
  notes: NoteEntry[];
}

export interface ScorePillar {
  label: string;
  score: number;
  maxScore: number;
  explanation: string;
}

export interface RuleExplanation {
  id: string;
  title: string;
  triggerRule: string;
  observedMetrics: { label: string; value: string; threshold: string }[];
  uiEffect: string;
  howToShift: string;
}

export interface SmartSuggestion {
  id: string;
  title: string;
  detail: string;
  actionLabel?: string;
  actionType?:
    | 'reschedule_overdue'
    | 'raise_target'
    | 'start_light_timer'
    | 'open_mood'
    | 'complete_light_task'
    | 'log_progress';
  whyExplanation: RuleExplanation;
}

export interface AdaptiveEvaluation {
  mode: AdaptiveMode;
  headline: string;
  subheadline: string;
  modeReason: RuleExplanation;
  orderedModules: {
    instance: ModuleInstance;
    effectiveSpan: 'standard' | 'wide';
    isEnlarged: boolean;
    isMinimized: boolean;
    promotedReason?: RuleExplanation;
  }[];
  progressScore: number;
  scorePillars: ScorePillar[];
  scoreExplanation: RuleExplanation;
  suggestions: SmartSuggestion[];
  daysRemaining: number;
  overdueCount: number;
  expectedProgressRatio: number;
  actualProgressRatio: number;
}

export interface AppSettings {
  darkMode: boolean;
  largeText: boolean;
  keyboardShortcuts: boolean;
  starfieldMotion: boolean;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  progressText: string;
}

export type DemoScenarioId =
  | 'exam_crunch'
  | 'low_budget'
  | 'bad_mood_streak'
  | 'ahead_of_schedule';
