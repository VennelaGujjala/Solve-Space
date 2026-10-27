import React, { useState } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { offsetDate } from '../data/sampleData';
import { TaskItem, Workspace } from '../types/solvespace';

interface SearchModalProps {
  isOpen: boolean;
  workspaces: Workspace[];
  onClose: () => void;
  onJumpToWorkspace: (workspaceId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  workspaces,
  onClose,
  onJumpToWorkspace,
}) => {
  const [query, setQuery] = useState('');
  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const hits: { id: string; wsId: string; wsName: string; kind: string; text: string }[] = [];

  workspaces.forEach((ws) => {
    if (!q || ws.name.toLowerCase().includes(q) || ws.goalTitle.toLowerCase().includes(q)) {
      hits.push({
        id: `ws_${ws.id}`,
        wsId: ws.id,
        wsName: ws.name,
        kind: 'Workspace',
        text: `${ws.name} — ${ws.goalTitle}`,
      });
    }
    if (q) {
      ws.tasks.forEach((t) => {
        if (t.title.toLowerCase().includes(q)) {
          hits.push({
            id: `t_${t.id}`,
            wsId: ws.id,
            wsName: ws.name,
            kind: 'Task',
            text: t.title,
          });
        }
      });
      ws.notes.forEach((n) => {
        if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)) {
          hits.push({
            id: `n_${n.id}`,
            wsId: ws.id,
            wsName: ws.name,
            kind: 'Note',
            text: n.title,
          });
        }
      });
    }
  });

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-start justify-center pt-20 p-4 no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search workspaces, tasks, goals, or notes…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
          {hits.length === 0 ? (
            <li className="p-6 text-center text-xs text-slate-500">
              No matching workspaces, tasks, or notes for “{query}”.
            </li>
          ) : (
            hits.slice(0, 10).map((hit) => (
              <li key={hit.id}>
                <button
                  type="button"
                  onClick={() => {
                    onJumpToWorkspace(hit.wsId);
                    onClose();
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800/70 flex items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {hit.text}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {hit.kind} · {hit.wsName}
                    </p>
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 shrink-0">Open →</span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

interface QuickNewTaskModalProps {
  isOpen: boolean;
  workspaceName: string;
  onClose: () => void;
  onAddTask: (task: Omit<TaskItem, 'id' | 'completed'>) => void;
}

export const QuickNewTaskModal: React.FC<QuickNewTaskModalProps> = ({
  isOpen,
  workspaceName,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState(offsetDate(1));
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('high');
  const [effort, setEffort] = useState<'light' | 'standard' | 'deep'>('standard');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      dueDate: dueDate || offsetDate(0),
      priority,
      effort,
    });
    setTitle('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-5 space-y-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white">
              Quick Add Task
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Adding to {workspaceName}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
            Task Description
          </label>
          <input
            type="text"
            autoFocus
            required
            placeholder="What needs to get done?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-2 py-1.5 text-xs font-mono-num rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Effort</label>
            <select
              value={effort}
              onChange={(e) => setEffort(e.target.value as 'light' | 'standard' | 'deep')}
              className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
            >
              <option value="light">Light</option>
              <option value="standard">Standard</option>
              <option value="deep">Deep</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Task</span>
          </button>
        </div>
      </form>
    </div>
  );
};
