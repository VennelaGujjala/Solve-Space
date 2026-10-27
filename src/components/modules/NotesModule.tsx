import React, { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import { NoteEntry, RuleExplanation } from '../../types/solvespace';
import { ModuleShell } from './ModuleShell';

interface NotesModuleProps {
  notes: NoteEntry[];
  title: string;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onSaveNote: (noteId: string | null, title: string, content: string) => void;
  onDeleteNote: (noteId: string) => void;
}

export const NotesModule: React.FC<NotesModuleProps> = ({
  notes,
  title,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onSaveNote,
  onDeleteNote,
}) => {
  const activeNote = notes[0] ?? null;
  const [selectedId, setSelectedId] = useState<string | null>(activeNote?.id ?? null);
  const current = notes.find((n) => n.id === selectedId) ?? notes[0] ?? null;

  const [draftTitle, setDraftTitle] = useState(current?.title ?? 'Workspace Scratchpad');
  const [draftBody, setDraftBody] = useState(current?.content ?? '');
  const [savedNotice, setSavedNotice] = useState(false);

  const selectNote = (note: NoteEntry) => {
    setSelectedId(note.id);
    setDraftTitle(note.title);
    setDraftBody(note.content);
  };

  const handleCreateNew = () => {
    setSelectedId(null);
    setDraftTitle('New Note');
    setDraftBody('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(selectedId, draftTitle.trim() || 'Untitled Note', draftBody);
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 1500);
  };

  return (
    <ModuleShell
      title={title}
      subtitle={`${notes.length} note${notes.length === 1 ? '' : 's'} saved in workspace`}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={
        current ? `${current.title} (updated ${current.updatedAt})` : 'Empty scratchpad'
      }
      headerRight={
        <button
          type="button"
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Note</span>
        </button>
      }
    >
      {notes.length > 1 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 border-b border-slate-100 dark:border-slate-800">
          {notes.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => selectNote(n)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md truncate max-w-40 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                current?.id === n.id && selectedId !== null
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {n.title}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-2.5 flex-1">
        <input
          type="text"
          value={draftTitle}
          onChange={(e) => setDraftTitle(e.target.value)}
          placeholder="Note title…"
          className="px-3 py-1.5 text-sm font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
        />
        <textarea
          rows={4}
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          placeholder="Jot down formulas, reflections, constraints, or links…"
          className="flex-1 w-full px-3 py-2 text-xs leading-relaxed rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 resize-y"
        />
        <div className="flex items-center justify-between gap-2 pt-1">
          {current && selectedId !== null ? (
            <button
              type="button"
              onClick={() => {
                onDeleteNote(current.id);
                setSelectedId(null);
                setDraftTitle('Workspace Scratchpad');
                setDraftBody('');
              }}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400">Drafting new note</span>
          )}

          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
          >
            {savedNotice ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </>
            ) : (
              <span>Save Note</span>
            )}
          </button>
        </div>
      </form>
    </ModuleShell>
  );
};
