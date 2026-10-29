import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Plus, Trash2 } from 'lucide-react';
import { AdaptiveMode, NumberLogEntry, RuleExplanation } from '../../types/solvespace';
import { offsetDate } from '../../data/sampleData';
import { getModeTheme } from '../../engine/modeTheme';
import { ModuleShell } from './ModuleShell';

interface NumberLoggerModuleProps {
  logs: NumberLogEntry[];
  title: string;
  loggerLabel: string;
  chartType: 'bar' | 'line';
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
  onToggleChartType: (nextType: 'bar' | 'line') => void;
  onAddLog: (entry: Omit<NumberLogEntry, 'id'>) => void;
  onDeleteLog: (id: string) => void;
}

export const NumberLoggerModule: React.FC<NumberLoggerModuleProps> = ({
  logs,
  title,
  loggerLabel,
  chartType,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  onToggleChartType,
  onAddLog,
  onDeleteLog,
}) => {
  const [val, setVal] = useState('');
  const [date, setDate] = useState(offsetDate(0));
  const [note, setNote] = useState('');

  const theme = getModeTheme(mode);

  const sorted = [...logs].sort((a, b) => a.date.localeCompare(b.date));
  const chartData = sorted.map((l) => ({
    date: l.date.slice(5),
    value: l.value,
    note: l.note,
  }));

  const totalLogged = logs.reduce((s, l) => s + l.value, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(val);
    if (Number.isNaN(num) || val.trim() === '') return;
    onAddLog({
      date: date || offsetDate(0),
      value: num,
      note: note.trim() || 'Logged entry',
    });
    setVal('');
    setNote('');
  };

  const tooltipStyles = {
    backgroundColor: 'rgba(8, 12, 26, 0.94)',
    borderRadius: '10px',
    border: '1px solid rgba(148, 163, 184, 0.25)',
    color: '#f8fafc',
    fontSize: '12px',
  };

  return (
    <ModuleShell
      title={title}
      subtitle={`${loggerLabel} · Total logged: ${+totalLogged.toFixed(1)}`}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`${logs.length} entries logged · Sum: ${+totalLogged.toFixed(1)}`}
      headerRight={
        <div className="flex items-center gap-1 p-0.5 bg-slate-200/70 dark:bg-white/[0.06] rounded-lg border border-transparent dark:border-white/[0.08]">
          {(['bar', 'line'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => onToggleChartType(t)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md capitalize transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                chartType === t
                  ? 'bg-white dark:bg-sky-500/20 text-slate-900 dark:text-sky-200 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t} chart
            </button>
          ))}
        </div>
      }
    >
      <div className="h-48 w-full">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Log your first numeric entry below to visualize daily trends.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' ? (
              <BarChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.14} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={tooltipStyles} />
                <Bar dataKey="value" fill={theme.chartHex} radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.14} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
                <Tooltip contentStyle={tooltipStyles} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={theme.chartHex}
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: theme.chartHex }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 pt-3 border-t border-slate-200/60 dark:border-white/[0.08] flex flex-wrap sm:flex-nowrap items-center gap-2">
        <input
          type="number"
          step="any"
          placeholder="Value"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          className="w-24 px-2.5 py-1.5 text-sm font-mono-num rounded-lg astra-input text-slate-900 dark:text-white"
        />
        <input
          type="date"
          aria-label="Log date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-2.5 py-1.5 text-xs font-mono-num rounded-lg astra-input text-slate-700 dark:text-slate-200"
        />
        <input
          type="text"
          placeholder="Short note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="flex-1 min-w-0 px-3 py-1.5 text-sm rounded-lg astra-input text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${theme.buttonPrimary}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Log</span>
        </button>
      </form>

      {logs.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-200/60 dark:divide-white/[0.06] max-h-36 overflow-y-auto">
          {[...sorted]
            .reverse()
            .slice(0, 4)
            .map((entry) => (
              <li key={entry.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                <div className="min-w-0 truncate text-slate-600 dark:text-slate-300">
                  <span className="font-mono-num text-slate-500 dark:text-slate-400">{entry.date}</span>
                  <span aria-hidden="true"> · </span>
                  <span>{entry.note}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-mono-num font-semibold text-slate-900 dark:text-sky-200">
                    {entry.value}
                  </span>
                  <button
                    type="button"
                    aria-label="Delete log entry"
                    onClick={() => onDeleteLog(entry.id)}
                    className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </li>
            ))}
        </ul>
      )}
    </ModuleShell>
  );
};
