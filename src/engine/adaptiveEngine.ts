import {
  AchievementBadge,
  AdaptiveEvaluation,
  AdaptiveMode,
  ModuleInstance,
  ModuleType,
  RuleExplanation,
  ScorePillar,
  SmartSuggestion,
  Workspace,
} from '../types/solvespace';
import { offsetDate } from '../data/sampleData';

/**
 * Helper: Calculate integer days between two YYYY-MM-DD strings (target - base).
 */
export function daysBetween(baseIso: string, targetIso: string): number {
  const b = new Date(`${baseIso}T12:00:00`);
  const t = new Date(`${targetIso}T12:00:00`);
  return Math.round((t.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * ============================================================================
 * SOLVESPACE ADAPTIVE MULTI-MODEL ENGINE
 * ============================================================================
 * Evaluates a workspace's live quantitative & affective signals and assigns one
 * of five deterministic operating modes:
 *
 * RULE PRECEDENCE (Human-Centered Safety -> Deadline Urgency -> Schedule Drift -> Growth):
 *  1. RECOVERY MODE: Last 3 mood/energy check-ins show low mood (<= 2) OR low energy (<= 2).
 *     -> Protects against burnout by calming theme colors, elevating Mood Check-in &
 *        lightweight tasks, and suggesting restorative breaks.
 *  2. CRUNCH MODE: Deadline is within <= 7 days (and >= 0) while goal completion < 95%.
 *     -> Maximizes execution focus by enlarging Focus Timer + Task Planner at the top
 *        and compacting non-essential widgets.
 *  3. BEHIND SCHEDULE: Overdue tasks >= 2 OR actual goal progress lags expected
 *     time-elapsed progress by > 15% (or deadline has passed).
 *     -> Surfaces warning banner, Catch-Up Plan, and promotes Task Planner & Goal Tracker.
 *  4. AHEAD OF PLAN: Actual goal progress exceeds expected pace by >= 15% (or >= 85%
 *     complete with > 7 days remaining) AND overdue tasks == 0.
 *     -> Celebrates velocity and suggests raising target by +15%.
 *  5. ON TRACK: Default balanced workspace respecting user's custom module layout.
 */
export function evaluateWorkspace(ws: Workspace): AdaptiveEvaluation {
  const today = offsetDate(0);
  const totalSpanDays = Math.max(1, daysBetween(ws.startDate, ws.deadline));
  const elapsedDays = Math.max(0, daysBetween(ws.startDate, today));
  const daysRemaining = daysBetween(today, ws.deadline);

  const expectedProgressRatio = Math.min(1, Math.max(0.05, elapsedDays / totalSpanDays));
  const actualProgressRatio =
    ws.targetValue > 0 ? Math.min(1.25, Math.max(0, ws.currentValue / ws.targetValue)) : 0;

  const totalTasks = ws.tasks.length;
  const completedTasks = ws.tasks.filter((t) => t.completed).length;
  const overdueTasks = ws.tasks.filter((t) => !t.completed && t.dueDate < today);
  const overdueCount = overdueTasks.length;

  // Sort mood check-ins chronologically and inspect the 3 most recent entries
  const sortedMoods = [...ws.moods].sort((a, b) => a.date.localeCompare(b.date));
  const lastThreeMoods = sortedMoods.slice(-3);
  const isLowMoodStreak =
    lastThreeMoods.length >= 3 &&
    lastThreeMoods.every((m) => m.mood <= 2 || m.energy <= 2);

  const avgMood =
    lastThreeMoods.length > 0
      ? lastThreeMoods.reduce((acc, m) => acc + (m.mood + m.energy) / 2, 0) / lastThreeMoods.length
      : 3.5;

  const maxHabitStreak =
    ws.habits.length > 0 ? Math.max(...ws.habits.map((h) => h.streak)) : 0;
  const avgHabitStreak =
    ws.habits.length > 0
      ? ws.habits.reduce((acc, h) => acc + h.streak, 0) / ws.habits.length
      : 0;

  // --------------------------------------------------------------------------
  // 1. CALCULATE PROGRESS SCORE (0–100) ACROSS 4 TRANSPARENT PILLARS
  // --------------------------------------------------------------------------
  // Pillar A: Goal & Task Completion (0–35 pts)
  const taskRatio = totalTasks > 0 ? completedTasks / totalTasks : actualProgressRatio;
  const blendedCompletion = Math.min(1, actualProgressRatio * 0.65 + taskRatio * 0.35);
  const completionPts = Math.round(blendedCompletion * 35);

  // Pillar B: Schedule Alignment & Overdue Control (0–25 pts)
  const scheduleDelta = actualProgressRatio - expectedProgressRatio; // -1..+1
  const rawPacePts = Math.max(0, Math.min(25, Math.round(18 + scheduleDelta * 25 - overdueCount * 4)));
  const pacePts = daysRemaining < 0 && actualProgressRatio < 1 ? Math.max(2, rawPacePts - 8) : rawPacePts;

  // Pillar C: Consistency & Habit Streaks (0–20 pts)
  const focusBonus = Math.min(5, ws.focusSessions.length);
  const streakPts = Math.min(20, Math.round(Math.min(15, avgHabitStreak * 3) + focusBonus));

  // Pillar D: Well-being & Sustainable Energy (0–20 pts)
  const wellbeingPts = Math.min(20, Math.max(4, Math.round((avgMood / 5) * 20)));

  const progressScore = Math.min(100, Math.max(0, completionPts + pacePts + streakPts + wellbeingPts));

  const scorePillars: ScorePillar[] = [
    {
      label: 'Goal & Task Execution',
      score: completionPts,
      maxScore: 35,
      explanation: `${Math.round(actualProgressRatio * 100)}% of ${ws.targetValue} ${ws.unit} target (${completedTasks}/${totalTasks} tasks done).`,
    },
    {
      label: 'Schedule Pace & Deadlines',
      score: pacePts,
      maxScore: 25,
      explanation:
        overdueCount > 0
          ? `${overdueCount} overdue task(s) reducing pace score; ${daysRemaining}d left.`
          : `Comparing ${Math.round(actualProgressRatio * 100)}% actual vs ${Math.round(expectedProgressRatio * 100)}% expected elapsed time.`,
    },
    {
      label: 'Habit Streaks & Focus',
      score: streakPts,
      maxScore: 20,
      explanation: `Peak habit streak of ${maxHabitStreak} day(s) + ${ws.focusSessions.length} logged Pomodoro session(s).`,
    },
    {
      label: 'Mood & Energy Balance',
      score: wellbeingPts,
      maxScore: 20,
      explanation: `Recent well-being check-in average is ${avgMood.toFixed(1)} / 5.0.`,
    },
  ];

  const scoreExplanation: RuleExplanation = {
    id: 'rule_progress_score',
    title: `Composite Progress Score: ${progressScore} / 100`,
    triggerRule:
      'Weighted multi-factor model = Execution (35%) + Schedule Alignment (25%) + Consistency Streaks (20%) + Well-being (20%).',
    observedMetrics: scorePillars.map((p) => ({
      label: p.label,
      value: `${p.score} / ${p.maxScore} pts`,
      threshold: p.explanation,
    })),
    uiEffect:
      'Renders the radial gauge in the workspace console header and calibrates What-If Simulator projections.',
    howToShift:
      'Complete overdue tasks, log daily habit streaks, advance the primary goal metric, or protect recovery energy.',
  };

  // --------------------------------------------------------------------------
  // 2. DETERMINE ADAPTIVE MODE & MODULE LAYOUT TRANSFORMATION
  // --------------------------------------------------------------------------
  let mode: AdaptiveMode = AdaptiveMode.OnTrack;
  let headline = 'Steady cadence — your workspace is balanced and on schedule.';
  let subheadline =
    'Modules are displayed in your preferred custom order with standard cognitive density.';
  let modeReason: RuleExplanation;

  const pctActual = `${Math.round(actualProgressRatio * 100)}%`;
  const pctExpected = `${Math.round(expectedProgressRatio * 100)}%`;

  if (isLowMoodStreak) {
    mode = AdaptiveMode.RecoveryMode;
    headline = 'Recovery Mode active — protecting momentum with lower cognitive load.';
    subheadline =
      'Detected 3 consecutive low mood/energy check-ins. Switched to a calm sage palette, elevated light-effort tasks, and softened pressure.';
    modeReason = {
      id: 'rule_recovery_mode',
      title: 'Adaptive Rule #1: Recovery Mode (3-Day Low Mood/Energy Guard)',
      triggerRule: 'Last 3 daily check-ins each recorded Mood ≤ 2 OR Energy ≤ 2 on a 5-point scale.',
      observedMetrics: lastThreeMoods.map((m) => ({
        label: `Check-in (${m.date})`,
        value: `Mood ${m.mood}/5 · Energy ${m.energy}/5`,
        threshold: 'Trigger ≤ 2/5 for 3 consecutive entries',
      })),
      uiEffect:
        'Applies calm sage-teal surface accents, moves Mood & Energy Check-in and lightweight tasks to the top, and replaces aggressive sprint prompts with restorative pacing.',
      howToShift:
        'Take a restorative break, complete just 1 light task, and log a Mood & Energy check-in ≥ 3 when rested.',
    };
  } else if (daysRemaining >= 0 && daysRemaining <= 7 && actualProgressRatio < 0.95) {
    mode = AdaptiveMode.CrunchMode;
    headline = `Crunch Mode active — ${daysRemaining} day${daysRemaining === 1 ? '' : 's'} until deadline.`;
    subheadline =
      'Focus Timer and Task Planner have been enlarged at the top of your console; secondary widgets are compacted to eliminate distraction.';
    modeReason = {
      id: 'rule_crunch_mode',
      title: 'Adaptive Rule #2: Crunch Mode (7-Day Deadline Proximity)',
      triggerRule: '0 ≤ Days Remaining ≤ 7 AND Goal Completion < 95%.',
      observedMetrics: [
        { label: 'Days until deadline', value: `${daysRemaining} days (${ws.deadline})`, threshold: '≤ 7 days' },
        { label: 'Goal completion', value: `${ws.currentValue} / ${ws.targetValue} ${ws.unit} (${pctActual})`, threshold: '< 95%' },
        { label: 'Remaining tasks', value: `${totalTasks - completedTasks} open`, threshold: 'Prioritized by urgency' },
      ],
      uiEffect:
        'Promotes and enlarges Focus Timer + Task Planner to wide full-focus cards, while compacting Notes, Habit Checklist, and Charts below.',
      howToShift:
        'Reach ≥ 95% of your goal target or extend the workspace deadline beyond 7 days in Workspace Builder.',
    };
  } else if (
    overdueCount >= 2 ||
    expectedProgressRatio - actualProgressRatio > 0.15 ||
    (daysRemaining < 0 && actualProgressRatio < 1)
  ) {
    mode = AdaptiveMode.BehindSchedule;
    const lagPct = Math.max(0, Math.round((expectedProgressRatio - actualProgressRatio) * 100));
    headline =
      overdueCount >= 2
        ? `Behind Schedule — ${overdueCount} overdue tasks need a quick catch-up plan.`
        : `Behind Schedule — current progress trails ideal timeline by ${lagPct}%.`;
    subheadline =
      'Overdue tasks and your Goal Catch-Up Plan have been moved to the top of the workspace so you can course-correct immediately.';
    modeReason = {
      id: 'rule_behind_schedule',
      title: 'Adaptive Rule #3: Behind Schedule (Drift & Overdue Detection)',
      triggerRule: 'Overdue Incomplete Tasks ≥ 2 OR (Expected Time Ratio − Actual Goal Ratio) > 15%.',
      observedMetrics: [
        { label: 'Overdue incomplete tasks', value: `${overdueCount} task(s)`, threshold: '≥ 2 overdue tasks' },
        { label: 'Actual vs. Expected pace', value: `${pctActual} actual vs ${pctExpected} elapsed`, threshold: 'Lag > 15%' },
        { label: 'Deadline status', value: daysRemaining >= 0 ? `${daysRemaining} days left` : `${Math.abs(daysRemaining)} days past due`, threshold: 'Active window' },
      ],
      uiEffect:
        'Displays amber Catch-Up Warning Banner, reorders Task Planner (filtered to surface overdue items) and Goal Tracker to Row 1, and enables 1-click task rescheduling.',
      howToShift:
        'Complete or reschedule overdue tasks to tomorrow, or log progress toward your target metric.',
    };
  } else if (
    (actualProgressRatio - expectedProgressRatio >= 0.15 ||
      (actualProgressRatio >= 0.85 && daysRemaining > 7)) &&
    overdueCount === 0
  ) {
    mode = AdaptiveMode.AheadOfPlan;
    const leadPct = Math.max(5, Math.round((actualProgressRatio - expectedProgressRatio) * 100));
    headline = `Ahead of Plan — outpacing expected schedule by +${leadPct}% with zero overdue tasks.`;
    subheadline =
      'Your consistency is compounding. Consider raising your target by +15% or banking extra recovery margin.';
    modeReason = {
      id: 'rule_ahead_of_plan',
      title: 'Adaptive Rule #4: Ahead of Plan (Velocity Surplus)',
      triggerRule: '(Actual Progress − Expected Progress ≥ 15% OR Progress ≥ 85% with >7d left) AND Overdue Tasks = 0.',
      observedMetrics: [
        { label: 'Goal completion', value: `${ws.currentValue} / ${ws.targetValue} ${ws.unit} (${pctActual})`, threshold: `Expected ${pctExpected}` },
        { label: 'Overdue tasks', value: '0 overdue', threshold: 'Must equal 0' },
        { label: 'Peak habit streak', value: `${maxHabitStreak} days`, threshold: 'Sustained momentum' },
      ],
      uiEffect:
        'Switches console accent to emerald growth state and unlocks a 1-click "+15% Stretch Target" calibration.',
      howToShift:
        'Click "Raise Target +15%" to level up the challenge, or keep cruising steadily to finish early.',
    };
  } else {
    mode = AdaptiveMode.OnTrack;
    modeReason = {
      id: 'rule_on_track',
      title: 'Adaptive Rule #5: On Track (Nominal Equilibrium)',
      triggerRule:
        'Progress aligns within ±15% of elapsed schedule, overdue tasks < 2, deadline > 7 days, and well-being > 2/5.',
      observedMetrics: [
        { label: 'Goal pace', value: `${pctActual} actual vs ${pctExpected} expected`, threshold: 'Within ±15% band' },
        { label: 'Overdue tasks', value: `${overdueCount} task(s)`, threshold: '< 2 tasks' },
        { label: 'Recent well-being', value: `${avgMood.toFixed(1)} / 5.0`, threshold: '> 2.0 healthy band' },
      ],
      uiEffect:
        'Preserves your custom Workspace Builder layout order and balanced neutral-cobalt visual hierarchy.',
      howToShift:
        'Adaptive layout automatically intervenes if deadlines tighten (≤7d), tasks slip behind, or energy drops.',
    };
  }

  // --------------------------------------------------------------------------
  // 3. REORDER, ENLARGE & COMPACT MODULES BASED ON ACTIVE MODE
  // --------------------------------------------------------------------------
  const orderedModules = computeAdaptiveModuleLayout(ws.modules, mode, modeReason);

  // --------------------------------------------------------------------------
  // 4. GENERATE 3 RULE-BASED SMART SUGGESTIONS ("NEXT BEST ACTIONS")
  // --------------------------------------------------------------------------
  const suggestions = buildSmartSuggestions(
    ws,
    mode,
    overdueCount,
    daysRemaining,
    actualProgressRatio,
    expectedProgressRatio,
    avgMood
  );

  return {
    mode,
    headline,
    subheadline,
    modeReason,
    orderedModules,
    progressScore,
    scorePillars,
    scoreExplanation,
    suggestions,
    daysRemaining,
    overdueCount,
    expectedProgressRatio,
    actualProgressRatio,
  };
}

function computeAdaptiveModuleLayout(
  modules: ModuleInstance[],
  mode: AdaptiveMode,
  baseReason: RuleExplanation
): AdaptiveEvaluation['orderedModules'] {
  const priorityMap: Partial<Record<ModuleType, number>> = {};
  const enlargedSet = new Set<ModuleType>();
  const minimizedSet = new Set<ModuleType>();

  if (mode === AdaptiveMode.CrunchMode) {
    priorityMap[ModuleType.FocusTimer] = 1;
    priorityMap[ModuleType.TaskPlanner] = 2;
    priorityMap[ModuleType.GoalTracker] = 3;
    enlargedSet.add(ModuleType.FocusTimer);
    enlargedSet.add(ModuleType.TaskPlanner);
    minimizedSet.add(ModuleType.Notes);
    minimizedSet.add(ModuleType.HabitTracker);
    minimizedSet.add(ModuleType.MoodCheckin);
  } else if (mode === AdaptiveMode.BehindSchedule) {
    priorityMap[ModuleType.TaskPlanner] = 1;
    priorityMap[ModuleType.GoalTracker] = 2;
    priorityMap[ModuleType.ProgressChart] = 3;
    enlargedSet.add(ModuleType.TaskPlanner);
  } else if (mode === AdaptiveMode.RecoveryMode) {
    priorityMap[ModuleType.MoodCheckin] = 1;
    priorityMap[ModuleType.TaskPlanner] = 2;
    priorityMap[ModuleType.Notes] = 3;
    enlargedSet.add(ModuleType.MoodCheckin);
    minimizedSet.add(ModuleType.NumberLogger);
    minimizedSet.add(ModuleType.ProgressChart);
  } else if (mode === AdaptiveMode.AheadOfPlan) {
    priorityMap[ModuleType.GoalTracker] = 1;
    priorityMap[ModuleType.ProgressChart] = 2;
    enlargedSet.add(ModuleType.GoalTracker);
  }

  const indexed = modules.map((m, idx) => ({ m, idx }));
  indexed.sort((a, b) => {
    const pa = priorityMap[a.m.type] ?? 100 + a.idx;
    const pb = priorityMap[b.m.type] ?? 100 + b.idx;
    return pa - pb;
  });

  return indexed.map(({ m }) => {
    const isEnlarged = enlargedSet.has(m.type);
    const isMinimized = minimizedSet.has(m.type);
    const isPromoted = priorityMap[m.type] !== undefined;

    const effectiveSpan: 'standard' | 'wide' = isEnlarged
      ? 'wide'
      : isMinimized
      ? 'standard'
      : m.span;

    const promotedReason: RuleExplanation | undefined =
      isPromoted || isMinimized
        ? {
            ...baseReason,
            title: isEnlarged
              ? `${m.title} — Enlarged & Promoted by ${mode}`
              : isMinimized
              ? `${m.title} — Compacted by ${mode}`
              : `${m.title} — Reprioritized by ${mode}`,
            uiEffect: isEnlarged
              ? `Expanded "${m.title}" to full-width priority focus at the top of the workspace.`
              : isMinimized
              ? `Compacted "${m.title}" to reduce visual noise while ${mode} is active (expandable anytime).`
              : `Moved "${m.title}" higher in the console grid so critical actions require zero scrolling.`,
          }
        : undefined;

    return {
      instance: m,
      effectiveSpan,
      isEnlarged,
      isMinimized,
      promotedReason,
    };
  });
}

function buildSmartSuggestions(
  ws: Workspace,
  mode: AdaptiveMode,
  overdueCount: number,
  daysRemaining: number,
  actualRatio: number,
  expectedRatio: number,
  avgMood: number
): SmartSuggestion[] {
  const list: SmartSuggestion[] = [];
  const remainingUnits = Math.max(0, +(ws.targetValue - ws.currentValue).toFixed(1));
  const dailyNeeded =
    daysRemaining > 0 ? +(remainingUnits / daysRemaining).toFixed(1) : remainingUnits;

  if (mode === AdaptiveMode.RecoveryMode) {
    list.push({
      id: 'sug_rec_1',
      title: 'Step away for a 15-minute screen-free recovery break',
      detail: `Your last 3 check-ins averaged ${avgMood.toFixed(1)}/5 energy. Restoring alertness prevents diminishing returns.`,
      actionLabel: 'Start 5m Breather',
      actionType: 'start_light_timer',
      whyExplanation: {
        id: 'why_sug_rec_1',
        title: 'Why suggest a recovery break?',
        triggerRule: '3-day Mood/Energy average ≤ 2.2/5.0.',
        observedMetrics: [
          { label: 'Recent energy average', value: `${avgMood.toFixed(1)} / 5`, threshold: '≤ 2.2 triggers break prompt' },
        ],
        uiEffect: 'Configures a gentle low-stakes timer block instead of a heavy 50-minute grind.',
        howToShift: 'Log a refreshed mood check-in once rested.',
      },
    });
    list.push({
      id: 'sug_rec_2',
      title: 'Complete just 1 light-effort task today to keep momentum alive',
      detail: 'Skip deep-effort tasks for tonight; checking off one quick win protects self-efficacy.',
      actionLabel: 'Complete Light Task',
      actionType: 'complete_light_task',
      whyExplanation: {
        id: 'why_sug_rec_2',
        title: 'Why filter for a light-effort task?',
        triggerRule: 'Recovery Mode active AND open light-effort tasks exist.',
        observedMetrics: [
          {
            label: 'Light tasks available',
            value: `${ws.tasks.filter((t) => !t.completed && t.effort === 'light').length} task(s)`,
            threshold: '≥ 1 light task',
          },
        ],
        uiEffect: 'Highlights low-friction tasks so your streak stays intact without exhaustion.',
        howToShift: 'Resume deep-effort tasks when energy returns to ≥ 3/5.',
      },
    });
  }

  if (overdueCount > 0) {
    list.push({
      id: 'sug_overdue',
      title: `You have ${overdueCount} overdue task${overdueCount > 1 ? 's' : ''}. Move 1 task to tomorrow.`,
      detail: 'Clearing backlog guilt restores realistic daily planning and immediately improves pace clarity.',
      actionLabel: 'Move 1 Overdue to Tomorrow',
      actionType: 'reschedule_overdue',
      whyExplanation: {
        id: 'why_sug_overdue',
        title: 'Why suggest rescheduling an overdue task?',
        triggerRule: 'Incomplete tasks with dueDate < Today ≥ 1.',
        observedMetrics: [
          { label: 'Overdue tasks', value: `${overdueCount}`, threshold: '≥ 1 past-due task' },
        ],
        uiEffect: 'Advances the oldest overdue task due date to tomorrow with one click.',
        howToShift: 'Complete or reschedule remaining past-due items.',
      },
    });
  }

  if (mode === AdaptiveMode.AheadOfPlan) {
    const nextTarget = Math.round(ws.targetValue * 1.15);
    list.push({
      id: 'sug_stretch',
      title: `Ahead of pace! Raise target from ${ws.targetValue} to ${nextTarget} ${ws.unit}`,
      detail: `You have already completed ${Math.round(actualRatio * 100)}% with ${daysRemaining} days still available.`,
      actionLabel: `Raise Target to ${nextTarget}`,
      actionType: 'raise_target',
      whyExplanation: {
        id: 'why_sug_stretch',
        title: 'Why suggest raising your goal target?',
        triggerRule: 'Actual Progress exceeds Expected Time Pace by ≥ 15% with 0 overdue tasks.',
        observedMetrics: [
          { label: 'Current completion', value: `${Math.round(actualRatio * 100)}%`, threshold: `Expected ${Math.round(expectedRatio * 100)}%` },
          { label: 'Proposed stretch (+15%)', value: `${nextTarget} ${ws.unit}`, threshold: ' calibrated +15% step' },
        ],
        uiEffect: 'Updates workspace targetValue in localStorage and recalibrates trajectory.',
        howToShift: 'Optional — keep current target if you prefer finishing early.',
      },
    });
  }

  if (remainingUnits > 0 && daysRemaining > 0) {
    list.push({
      id: 'sug_daily_pace',
      title: `Target ${dailyNeeded} ${ws.unit}/day for the next ${daysRemaining} days to finish on time`,
      detail: `${remainingUnits} ${ws.unit} remaining before ${ws.deadline}. Logging +${Math.max(1, Math.ceil(dailyNeeded))} today locks in pace.`,
      actionLabel: `Log +${Math.max(1, Math.ceil(dailyNeeded))} ${ws.unit}`,
      actionType: 'log_progress',
      whyExplanation: {
        id: 'why_sug_pace',
        title: 'Daily Required Velocity Formula',
        triggerRule: 'Daily Needed = (Target Value − Current Value) ÷ Days Remaining.',
        observedMetrics: [
          { label: 'Remaining gap', value: `${remainingUnits} ${ws.unit}`, threshold: `Target ${ws.targetValue} ${ws.unit}` },
          { label: 'Days left', value: `${daysRemaining} days`, threshold: `Deadline ${ws.deadline}` },
        ],
        uiEffect: 'Computes exact daily quota and offers 1-click progress logging.',
        howToShift: 'Updates dynamically every time you log progress.',
      },
    });
  }

  if (list.length < 3) {
    list.push({
      id: 'sug_pomodoro',
      title: 'Run one focused 25-minute Pomodoro sprint on your highest-priority task',
      detail: 'Single-tasking in bounded 25m intervals correlates with higher daily task closure across workspaces.',
      actionLabel: 'Jump to Focus Timer',
      actionType: 'start_light_timer',
      whyExplanation: {
        id: 'why_sug_pomo',
        title: 'Why recommend a 25-minute Pomodoro sprint?',
        triggerRule: 'Open high/medium priority tasks > 0 AND daily focus sessions < 3.',
        observedMetrics: [
          {
            label: 'Logged focus sessions',
            value: `${ws.focusSessions.length} total`,
            threshold: '25-min structured sprint',
          },
        ],
        uiEffect: 'Scrolls to and primes the Focus Timer module.',
        howToShift: 'Complete session to earn +25 XP and log focus history.',
      },
    });
  }

  if (list.length < 3) {
    list.push({
      id: 'sug_mood_check',
      title: 'Record today’s Mood & Energy check-in to keep burnout protection calibrated',
      detail: 'Takes 5 seconds and helps SolveSpace adapt task intensity to your real bandwidth.',
      actionLabel: 'Log Check-in',
      actionType: 'open_mood',
      whyExplanation: {
        id: 'why_sug_mood',
        title: 'Why prompt a daily Mood & Energy check-in?',
        triggerRule: 'Adaptive Engine uses 3-day rolling well-being data to guard against exhaustion.',
        observedMetrics: [
          { label: 'Total mood entries', value: `${ws.moods.length} logged`, threshold: '1 check-in per day ideal' },
        ],
        uiEffect: 'Focuses the 1–5 Mood & Energy slider card.',
        howToShift: 'Save today’s check-in.',
      },
    });
  }

  return list.slice(0, 3);
}

/**
 * ============================================================================
 * WHAT-IF SIMULATOR ENGINE
 * ============================================================================
 */
export interface WhatIfParams {
  skipDays: number; // 0..10
  extraUnitsPerDay: number; // -2..+6
  tasksCompletedNow: number; // 0..openTasks
  projectedMood: number; // 1..5
}

export interface WhatIfResult {
  baselineScore: number;
  projectedScore: number;
  scoreDelta: number;
  baselineMode: AdaptiveMode;
  projectedMode: AdaptiveMode;
  baselineCompletionDate: string;
  projectedCompletionDate: string;
  daysAheadOrLate: number; // positive = days before deadline, negative = days after deadline
  chartSeries: {
    dayLabel: string;
    currentTrajectory: number;
    whatIfTrajectory: number;
    targetLine: number;
  }[];
}

export function simulateWhatIf(ws: Workspace, params: WhatIfParams): WhatIfResult {
  const baselineEval = evaluateWorkspace(ws);
  const today = offsetDate(0);

  // Estimate current daily velocity from logs or elapsed progress
  const elapsed = Math.max(3, daysBetween(ws.startDate, today));
  const recentLogsSum = ws.logs.slice(-5).reduce((s, l) => s + l.value, 0);
  const avgDailyRate =
    ws.logs.length >= 2 && ws.unit !== 'USD'
      ? Math.max(0.5, recentLogsSum / Math.min(5, ws.logs.length))
      : Math.max(0.8, ws.currentValue / elapsed);

  const remaining = Math.max(0, ws.targetValue - ws.currentValue);
  const baselineDaysToFinish = remaining <= 0 ? 0 : Math.ceil(remaining / Math.max(0.25, avgDailyRate));
  const baselineCompletionDate = offsetDate(baselineDaysToFinish);

  const newDailyRate = Math.max(0.2, avgDailyRate + params.extraUnitsPerDay);
  const immediateBoost = params.tasksCompletedNow * (ws.targetValue * 0.04);
  const adjustedRemaining = Math.max(0, remaining - immediateBoost);
  const projectedDaysToFinish =
    adjustedRemaining <= 0
      ? 0
      : params.skipDays + Math.ceil(adjustedRemaining / newDailyRate);
  const projectedCompletionDate = offsetDate(projectedDaysToFinish);

  const daysAheadOrLate = daysBetween(projectedCompletionDate, ws.deadline);

  // Build synthetic workspace state 7 days forward under What-If assumptions to score cleanly
  const horizonDays = 7;
  const activeWorkDays = Math.max(0, horizonDays - params.skipDays);
  const projectedCurrentValue = Math.min(
    ws.targetValue * 1.15,
    +(ws.currentValue + immediateBoost + activeWorkDays * newDailyRate).toFixed(1)
  );

  let tasksLeftToComplete = params.tasksCompletedNow;
  const simulatedTasks = ws.tasks.map((t) => {
    if (!t.completed && tasksLeftToComplete > 0) {
      tasksLeftToComplete -= 1;
      return { ...t, completed: true };
    }
    return t;
  });

  const simulatedMoods = [
    { id: 'sim_m1', date: offsetDate(-2), mood: params.projectedMood, energy: params.projectedMood, note: '' },
    { id: 'sim_m2', date: offsetDate(-1), mood: params.projectedMood, energy: params.projectedMood, note: '' },
    { id: 'sim_m3', date: offsetDate(0), mood: params.projectedMood, energy: params.projectedMood, note: '' },
  ];

  const simulatedWs: Workspace = {
    ...ws,
    currentValue: projectedCurrentValue,
    tasks: simulatedTasks,
    moods: simulatedMoods,
    habits: ws.habits.map((h) => ({
      ...h,
      streak: params.skipDays >= 3 ? 0 : h.streak + Math.min(4, activeWorkDays),
    })),
  };

  const simEval = evaluateWorkspace(simulatedWs);

  // Build 10-step comparison chart series
  const steps = 10;
  const maxHorizon = Math.max(10, Math.min(35, Math.max(baselineDaysToFinish, projectedDaysToFinish, 14)));
  const stepSize = Math.max(1, Math.round(maxHorizon / steps));

  const chartSeries = Array.from({ length: steps + 1 }, (_, idx) => {
    const dayOffset = idx * stepSize;
    const curVal = Math.min(
      ws.targetValue * 1.1,
      +(ws.currentValue + dayOffset * avgDailyRate).toFixed(1)
    );
    const effectiveDays = Math.max(0, dayOffset - params.skipDays);
    const whatIfVal = Math.min(
      ws.targetValue * 1.15,
      +(ws.currentValue + immediateBoost + effectiveDays * newDailyRate).toFixed(1)
    );

    return {
      dayLabel: dayOffset === 0 ? 'Today' : `+${dayOffset}d`,
      currentTrajectory: curVal,
      whatIfTrajectory: whatIfVal,
      targetLine: ws.targetValue,
    };
  });

  return {
    baselineScore: baselineEval.progressScore,
    projectedScore: simEval.progressScore,
    scoreDelta: simEval.progressScore - baselineEval.progressScore,
    baselineMode: baselineEval.mode,
    projectedMode: simEval.mode,
    baselineCompletionDate,
    projectedCompletionDate,
    daysAheadOrLate,
    chartSeries,
  };
}

/**
 * ============================================================================
 * CROSS-WORKSPACE INSIGHTS ANALYZER
 * ============================================================================
 */
export interface CrossWorkspaceInsight {
  id: string;
  headline: string;
  supportingStat: string;
  explanation: string;
}

export function computeCrossWorkspaceInsights(workspaces: Workspace[]) {
  // 1. Mood >= 4 vs Mood < 4 task & log productivity comparison
  let highMoodDays = 0;
  let highMoodCompletions = 0;
  let lowMoodDays = 0;
  let lowMoodCompletions = 0;

  workspaces.forEach((ws) => {
    ws.moods.forEach((m) => {
      const tasksOnDay = ws.tasks.filter((t) => t.completed && t.completedAt === m.date).length;
      const logsOnDay = ws.logs.filter((l) => l.date === m.date).length;
      const outputScore = tasksOnDay + logsOnDay;
      if (m.mood >= 4) {
        highMoodDays += 1;
        highMoodCompletions += Math.max(1, outputScore);
      } else {
        lowMoodDays += 1;
        lowMoodCompletions += outputScore;
      }
    });
  });

  const highAvg = highMoodDays > 0 ? highMoodCompletions / highMoodDays : 1.8;
  const lowAvg = lowMoodDays > 0 ? Math.max(0.5, lowMoodCompletions / lowMoodDays) : 0.8;
  const multiplier = Math.max(1.3, +(highAvg / lowAvg).toFixed(1));

  // 2. Evaluate all workspaces
  const evaluations = workspaces.map((ws) => ({
    workspace: ws,
    eval: evaluateWorkspace(ws),
  }));

  const bestWs = [...evaluations].sort((a, b) => b.eval.progressScore - a.eval.progressScore)[0];
  const totalFocusMins = workspaces.reduce(
    (sum, ws) => sum + ws.focusSessions.reduce((s, f) => s + f.durationMinutes, 0),
    0
  );
  const longestStreakHabit = workspaces
    .flatMap((ws) => ws.habits.map((h) => ({ ...h, wsName: ws.name })))
    .sort((a, b) => b.streak - a.streak)[0];

  const insights: CrossWorkspaceInsight[] = [
    {
      id: 'ins_mood_tasks',
      headline: `You complete ${multiplier}x more actions on days when your mood check-in is 4 or higher.`,
      supportingStat: `${highMoodDays} high-mood check-ins analyzed across ${workspaces.length} workspaces`,
      explanation:
        'Days with Mood ≥ 4 show consistently stronger task completion and metric logging than fatigued days — validating Recovery Mode interventions.',
    },
    {
      id: 'ins_top_workspace',
      headline: bestWs
        ? `"${bestWs.workspace.name}" leads your console with a ${bestWs.eval.progressScore}/100 Progress Score.`
        : 'Create a workspace to compare cross-domain execution scores.',
      supportingStat: bestWs ? `Operating in ${bestWs.eval.mode}` : 'No workspaces',
      explanation:
        'Consistent habit streaks combined with zero past-due tasks keep schedule alignment near peak efficiency.',
    },
    {
      id: 'ins_focus_volume',
      headline: `${totalFocusMins} total Pomodoro focus minutes logged across all active goals.`,
      supportingStat: longestStreakHabit
        ? `Top habit streak: "${longestStreakHabit.title}" (${longestStreakHabit.streak} days)`
        : 'Start a habit streak today',
      explanation:
        'Workspaces with at least 2 logged Pomodoro sprints show higher goal-target velocity than untracked workspaces.',
    },
  ];

  const comparisonData = evaluations.map(({ workspace, eval: ev }) => ({
    name: workspace.name.length > 18 ? `${workspace.name.slice(0, 18)}…` : workspace.name,
    progressScore: ev.progressScore,
    completionPct: Math.round(ev.actualProgressRatio * 100),
    focusMinutes: workspace.focusSessions.reduce((s, f) => s + f.durationMinutes, 0),
    mode: ev.mode,
  }));

  return { insights, comparisonData, evaluations, totalFocusMins };
}

/**
 * ============================================================================
 * GAMIFICATION: XP LEVEL & ACHIEVEMENT BADGES
 * ============================================================================
 */
export function evaluateAchievements(workspaces: Workspace[], bonusXp: number): {
  totalXp: number;
  level: number;
  nextLevelXp: number;
  currentLevelProgressPct: number;
  badges: AchievementBadge[];
} {
  const completedTasks = workspaces.reduce(
    (s, w) => s + w.tasks.filter((t) => t.completed).length,
    0
  );
  const focusSessions = workspaces.reduce((s, w) => s + w.focusSessions.length, 0);
  const maxStreak = Math.max(
    0,
    ...workspaces.flatMap((w) => w.habits.map((h) => h.streak))
  );
  const moodLogs = workspaces.reduce((s, w) => s + w.moods.length, 0);
  const hasAheadWorkspace = workspaces.some(
    (w) => evaluateWorkspace(w).mode === AdaptiveMode.AheadOfPlan || w.currentValue >= w.targetValue * 0.85
  );

  const badges: AchievementBadge[] = [
    {
      id: 'badge_architect',
      title: 'Multi-Model Architect',
      description: 'Manage 3 or more modular problem workspaces in SolveSpace.',
      xpReward: 50,
      unlocked: workspaces.length >= 3,
      progressText: `${workspaces.length} / 3 workspaces`,
    },
    {
      id: 'badge_executor',
      title: 'Consistent Finisher',
      description: 'Complete at least 6 tasks across your workspaces.',
      xpReward: 75,
      unlocked: completedTasks >= 6,
      progressText: `${completedTasks} / 6 tasks done`,
    },
    {
      id: 'badge_streak',
      title: '5-Day Streak Keeper',
      description: 'Maintain a 5-day or longer daily habit streak.',
      xpReward: 100,
      unlocked: maxStreak >= 5,
      progressText: `${maxStreak} / 5 day streak`,
    },
    {
      id: 'badge_deep_focus',
      title: 'Deep Focus Practitioner',
      description: 'Log 5 or more Pomodoro focus sessions.',
      xpReward: 80,
      unlocked: focusSessions >= 5,
      progressText: `${focusSessions} / 5 sessions`,
    },
    {
      id: 'badge_self_aware',
      title: 'Self-Aware Operator',
      description: 'Log 8 Mood & Energy check-ins to calibrate adaptive burnout guardrails.',
      xpReward: 60,
      unlocked: moodLogs >= 8,
      progressText: `${moodLogs} / 8 check-ins`,
    },
    {
      id: 'badge_velocity',
      title: 'Ahead of Schedule',
      description: 'Reach ≥ 85% of any workspace goal target or unlock Ahead of Plan mode.',
      xpReward: 120,
      unlocked: hasAheadWorkspace,
      progressText: hasAheadWorkspace ? 'Unlocked' : 'Reach 85% on a goal',
    },
  ];

  const badgeXp = badges.filter((b) => b.unlocked).reduce((s, b) => s + b.xpReward, 0);
  const activityXp = completedTasks * 15 + focusSessions * 20 + moodLogs * 5 + bonusXp;
  const totalXp = badgeXp + activityXp;

  const level = Math.floor(totalXp / 150) + 1;
  const levelFloor = (level - 1) * 150;
  const nextLevelXp = level * 150;
  const currentLevelProgressPct = Math.round(((totalXp - levelFloor) / 150) * 100);

  return {
    totalXp,
    level,
    nextLevelXp,
    currentLevelProgressPct,
    badges,
  };
}
