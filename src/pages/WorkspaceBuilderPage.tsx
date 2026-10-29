import React, { useState } from 'react';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  GripVertical,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
} from 'lucide-react';
import { MODULE_CATALOG, uid } from '../data/sampleData';
import { ModuleInstance, ModuleType, PageId, Workspace } from '../types/solvespace';

interface WorkspaceBuilderPageProps {
  workspace: Workspace;
  canDeleteWorkspace: boolean;
  onUpdateWorkspaceMeta: (patch: Partial<Workspace>) => void;
  onUpdateModules: (modules: ModuleInstance[]) => void;
  onDeleteWorkspace: () => void;
  onNavigate: (page: PageId) => void;
}

export const WorkspaceBuilderPage: React.FC<WorkspaceBuilderPageProps> = ({
  workspace,
  canDeleteWorkspace,
  onUpdateWorkspaceMeta,
  onUpdateModules,
  onDeleteWorkspace,
  onNavigate,
}) => {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const moveItem = (from: number, to: number) => {
    if (to < 0 || to >= workspace.modules.length || from === to) return;
    const copy = [...workspace.modules];
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    onUpdateModules(copy);
  };

  const handleRenameModule = (id: string, title: string) => {
    onUpdateModules(
      workspace.modules.map((m) => (m.id === id ? { ...m, title } : m))
    );
  };

  const handleToggleSpan = (id: string) => {
    onUpdateModules(
      workspace.modules.map((m) =>
        m.id === id
          ? { ...m, span: m.span === 'wide' ? 'standard' : 'wide' }
          : m
      )
    );
  };

  const handleRemoveModule = (id: string) => {
    onUpdateModules(workspace.modules.filter((m) => m.id !== id));
  };

  const handleAddModule = (type: ModuleType) => {
    const meta = MODULE_CATALOG.find((c) => c.type === type)!;
    onUpdateModules([
      ...workspace.modules,
      {
        id: uid('mod'),
        type,
        title: meta.defaultTitle,
        span: meta.defaultSpan,
      },
    ]);
  };

  const mountedTypes = new Set(workspace.modules.map((m) => m.type));
  const availableToAdd = MODULE_CATALOG.filter((c) => !mountedTypes.has(c.type));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={() => onNavigate(PageId.Dashboard)}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspace Console</span>
          </button>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Workspace Builder — {workspace.name}
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5">
            Drag and drop to reorder modules, rename widget headers, toggle card width, or mount new
            tools.
          </p>
        </div>

        {canDeleteWorkspace && (
          <div>
            {!confirmDelete ? (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-rose-600 dark:text-rose-300 border border-rose-300/60 dark:border-rose-500/40 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-500/15 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Workspace</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onDeleteWorkspace}
                  className="px-3 py-1.5 text-xs font-medium bg-rose-600 text-white rounded-lg hover:bg-rose-500 cursor-pointer"
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-2.5 py-1.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workspace Goal & Deadline Settings */}
      <div className="astra-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">
          01. Workspace Goal Parameters
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Workspace Name
            </label>
            <input
              type="text"
              value={workspace.name}
              onChange={(e) => onUpdateWorkspaceMeta({ name: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg astra-input text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Goal Target ({workspace.unit})
            </label>
            <input
              type="number"
              min="1"
              step="any"
              value={workspace.targetValue}
              onChange={(e) =>
                onUpdateWorkspaceMeta({ targetValue: Math.max(1, Number(e.target.value) || 1) })
              }
              className="w-full px-3 py-2 text-sm font-mono-num rounded-lg astra-input text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Metric Unit
            </label>
            <input
              type="text"
              value={workspace.unit}
              onChange={(e) => onUpdateWorkspaceMeta({ unit: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg astra-input text-slate-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
              Deadline (drives Crunch Mode)
            </label>
            <input
              type="date"
              value={workspace.deadline}
              onChange={(e) => onUpdateWorkspaceMeta({ deadline: e.target.value })}
              className="w-full px-3 py-2 text-sm font-mono-num rounded-lg astra-input text-slate-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Active Modules Drag-and-Drop List */}
      <div className="astra-card rounded-xl p-5">
        <div className="flex items-baseline justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              02. Mounted Modules ({workspace.modules.length})
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Drag rows by the handle or use Up/Down arrows to set baseline order (used when On Track).
            </p>
          </div>
        </div>

        {workspace.modules.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-500 dark:text-slate-400">
            No active modules. Add modules from the catalog below.
          </p>
        ) : (
          <ul className="divide-y divide-slate-200/60 dark:divide-white/[0.07]">
            {workspace.modules.map((mod, idx) => {
              const catMeta = MODULE_CATALOG.find((c) => c.type === mod.type);
              return (
                <li
                  key={mod.id}
                  draggable
                  onDragStart={() => setDragIdx(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragIdx !== null) {
                      moveItem(dragIdx, idx);
                      setDragIdx(null);
                    }
                  }}
                  className={`py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                    dragIdx === idx ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span
                      className="text-slate-400 cursor-grab active:cursor-grabbing shrink-0"
                      title="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </span>
                    <span className="font-mono-num text-xs text-sky-400 w-5 shrink-0">
                      0{idx + 1}
                    </span>
                    <input
                      type="text"
                      aria-label="Module custom title"
                      value={mod.title}
                      onChange={(e) => handleRenameModule(mod.id, e.target.value)}
                      className="flex-1 min-w-0 max-w-xs px-2.5 py-1.5 text-sm font-medium rounded-lg astra-input text-slate-900 dark:text-white"
                    />
                    <span className="text-xs text-slate-400 hidden md:inline truncate">
                      {catMeta?.defaultTitle}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleSpan(mod.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.14] rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                    >
                      {mod.span === 'wide' ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5" />
                          <span>Wide (2 col)</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Standard (1 col)</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      aria-label="Move module up"
                      disabled={idx === 0}
                      onClick={() => moveItem(idx, idx - 1)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.14] text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Move module down"
                      disabled={idx === workspace.modules.length - 1}
                      onClick={() => moveItem(idx, idx + 1)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.14] text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-white/[0.06] cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove module from workspace"
                      onClick={() => handleRemoveModule(mod.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Available Modules Catalog */}
      <div className="astra-card rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
          03. Reusable Module Library
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Add additional widgets to this workspace at any time (you can also mount multiple Notes or
          Tracker widgets).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(availableToAdd.length > 0 ? availableToAdd : MODULE_CATALOG).map((meta) => {
            const alreadyMounted = mountedTypes.has(meta.type);
            return (
              <div
                key={meta.type}
                className="p-3.5 rounded-lg border border-slate-200/70 dark:border-white/[0.10] flex flex-col justify-between gap-3"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white">
                    {meta.defaultTitle}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 leading-snug">
                    {meta.description}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleAddModule(meta.type)}
                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg transition-colors whitespace-nowrap cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{alreadyMounted ? 'Add Another' : 'Add Module'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
