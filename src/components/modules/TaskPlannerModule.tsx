import React, { useState } from 'react';
import { CalendarClock, Check, Plus, Trash2 } from 'lucide-react';
import { AdaptiveMode, RuleExplanation, TaskItem } from '../../types/solvespace';
import { offsetDate } from '../../data/sampleData';
import { ModuleShell } from './ModuleShell';

interface TaskPlannerModuleProps {
  tasks: TaskItem[];
  title: string;
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onMoveTaskTomorrow: (taskId: string) => void;
}

export const TaskPlannerModule: React.FC<TaskPlannerModuleProps> = ({
  tasks,
  title,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onMoveTaskTomorrow,
}) => {
  const today = offsetDate(0);
  const [filter, setFilter] = useState<'all' | 'active' | 'overdue' | 'done'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [newDue, setNewDue] = useState(offsetDate(1));
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newEffort, setNewEffort] = useState<'light' | 'standard' | 'deep'>('standard');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      dueDate: newDue || today,
      priority: newPriority,
      effort: newEffort,
    });
    setNewTitle('');
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    if (mode === AdaptiveMode.RecoveryMode) {
      const effortRank = { light: 0, standard: 1, deep: 2 };
      if (effortRank[a.effort] !== effortRank[b.effort]) {
        return effortRank[a.effort] - effortRank[b.effort];
      }
    }
    const aOverdue = !a.completed && a.dueDate < today ? 0 : 1;
    const bOverdue = !b.completed && b.dueDate < today ? 0 : 1;
    if (aOverdue !== bOverdue) return aOverdue - bOverdue;
    const prioRank = { high: 0, medium: 1, low: 2 };
    if (prioRank[a.priority] !== prioRank[b.priority]) {
      return prioRank[a.priority] - prioRank[b.priority];
    }
    return a.dueDate.localeCompare(b.dueDate);
  });

  const filtered = sortedTasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'overdue') return !t.completed && t.dueDate < today;
    if (filter === 'done') return t.completed;
    return true;
  });

  const openCount = tasks.filter((t) => !t.completed).length;
  const overdueCount = tasks.filter((t) => !t.completed && t.dueDate < today).length;

  return (
    <ModuleShell
      id="module-task-planner"
      title={title}
      subtitle={
        mode === AdaptiveMode.RecoveryMode
          ? 'Recovery sorting active: light-effort tasks surfaced first'
          : overdueCount > 0
          ? `${overdueCount} overdue · ${openCount} open tasks`
          : `${openCount} open · ${tasks.length - openCount} completed`
      }
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`${openCount} open tasks · ${overdueCount} overdue`}
      headerRight={
        <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-white/[0.06] rounded-lg border border-transparent dark:border-white/[0.08]">
          {(['all', 'active', 'overdue', 'done'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors capitalize whitespace-nowrap shrink-0 cursor-pointer ${
                filter === tab
                  ? 'bg-white dark:bg-sky-500/20 text-slate-900 dark:text-sky-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 pb-4 border-b border-slate-200/60 dark:border-white/[0.08]">
        <input
          type="text"
          placeholder="Add a concrete next task…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 text-sm rounded-lg astra-input text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
          <input
            type="date"
            aria-label="Task due date"
            value={newDue}
            onChange={(e) => setNewDue(e.target.value)}
            className="px-2.5 py-2 text-xs font-mono-num rounded-lg astra-input text-slate-700 dark:text-slate-200"
          />
          <select
            aria-label="Task priority"
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as 'low' | 'medium' | 'high')}
            className="px-2.5 py-2 text-xs rounded-lg astra-input text-slate-700 dark:text-slate-200"
          >
            <option value="high">High priority</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            aria-label="Task effort level"
            value={newEffort}
            onChange={(e) => setNewEffort(e.target.value as 'light' | 'standard' | 'deep')}
            className="px-2.5 py-2 text-xs rounded-lg astra-input text-slate-700 dark:text-slate-200"
          >
            <option value="light">Light effort</option>
            <option value="standard">Standard</option>
            <option value="deep">Deep work</option>
          </select>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </form>

      {filtered.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {filter === 'overdue'
              ? 'Zero overdue tasks — your schedule is clean.'
              : filter === 'done'
              ? 'No completed tasks yet. Check off your first task above to earn +15 XP.'
              : 'All tasks cleared! Add your next milestone step above.'}
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-slate-200/60 dark:divide-white/[0.06] mt-1">
          {filtered.map((task) => {
            const isOverdue = !task.completed && task.dueDate < today;
            return (
              <li
                key={task.id}
                className="py-3 flex items-start justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    type="button"
                    aria-label={task.completed ? `Mark "${task.title}" incomplete` : `Complete "${task.title}"`}
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      task.completed
                        ? 'bg-sky-500 border-sky-500 text-slate-950'
                        : 'border-slate-300 dark:border-white/[0.22] hover:border-sky-400'
                    }`}
                  >
                    {task.completed && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <div className="min-w-0">
                    <p
                      className={`text-sm font-medium leading-snug ${
                        task.completed
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100'
                      }`}
                    >
                      {task.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 tabular-nums">
                      <span
                        className={
                          isOverdue
                            ? 'text-amber-700 dark:text-amber-300 font-medium'
                            : ''
                        }
                      >
                        {isOverdue ? `Overdue (${task.dueDate})` : `Due ${task.dueDate}`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span
                        className={
                          task.priority === 'high' && !task.completed
                            ? 'text-rose-600 dark:text-rose-300 font-medium capitalize'
                            : 'capitalize'
                        }
                      >
                        {task.priority} priority
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="capitalize">{task.effort} effort</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  {isOverdue && (
                    <button
                      type="button"
                      onClick={() => onMoveTaskTomorrow(task.id)}
                      title="Reschedule to tomorrow"
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-amber-800 dark:text-amber-300 border border-amber-400/50 dark:border-amber-400/35 rounded-md hover:bg-amber-50 dark:hover:bg-amber-500/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      <CalendarClock className="w-3.5 h-3.5" />
                      <span>Tomorrow</span>
                    </button>
                  )}
                  <button
                    type="button"
                    aria-label={`Delete task "${task.title}"`}
                    onClick={() => onDeleteTask(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 rounded-md transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </ModuleShell>
  );
};
