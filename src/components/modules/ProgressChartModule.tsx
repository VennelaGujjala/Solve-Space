import React from 'react';
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AdaptiveMode, RuleExplanation, Workspace } from '../../types/solvespace';
import { daysBetween } from '../../engine/adaptiveEngine';
import { offsetDate } from '../../data/sampleData';
import { getModeTheme } from '../../engine/modeTheme';
import { ModuleShell } from './ModuleShell';

interface ProgressChartModuleProps {
  workspace: Workspace;
  title: string;
  mode: AdaptiveMode;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain: (rule: RuleExplanation) => void;
}

export const ProgressChartModule: React.FC<ProgressChartModuleProps> = ({
  workspace,
  title,
  mode,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
}) => {
  const theme = getModeTheme(mode);
  const today = offsetDate(0);
  const totalDays = Math.max(4, daysBetween(workspace.startDate, workspace.deadline));
  const elapsedDays = Math.max(1, daysBetween(workspace.startDate, today));

  // Build 7 milestone checkpoints from startDate through deadline
  const checkpoints = 6;
  const series = Array.from({ length: checkpoints + 1 }, (_, i) => {
    const ratio = i / checkpoints;
    const dayIndex = Math.round(ratio * totalDays);
    const pointDate = offsetDate(dayIndex - elapsedDays);
    const idealValue = +(workspace.targetValue * ratio).toFixed(1);

    // Plot actual curve up to today; leave future actuals null so user clearly sees Today vs Deadline
    const isPastOrToday = pointDate <= today;
    const actualProgressAtPoint = isPastOrToday
      ? +(
          workspace.currentValue *
          Math.min(1, Math.max(0.1, dayIndex / Math.max(1, elapsedDays)))
        ).toFixed(1)
      : null;

    return {
      date: pointDate === today ? 'Today' : pointDate.slice(5),
      ideal: idealValue,
      actual: pointDate === today ? workspace.currentValue : actualProgressAtPoint,
    };
  });

  const pct =
    workspace.targetValue > 0
      ? Math.round((workspace.currentValue / workspace.targetValue) * 100)
      : 0;

  return (
    <ModuleShell
      title={title}
      subtitle={`Actual cumulative (${workspace.unit}) vs. linear deadline pace`}
      isEnlarged={isEnlarged}
      isMinimized={isMinimized}
      promotedReason={promotedReason}
      onExplain={onExplain}
      minimizedSummary={`Trajectory at ${pct}% of ${workspace.targetValue} ${workspace.unit} target`}
    >
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={series} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
            <Tooltip
              contentStyle={{
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '12px',
              }}
            />
            <Line
              type="monotone"
              dataKey="ideal"
              name={`Ideal Pace (${workspace.unit})`}
              stroke="#94a3b8"
              strokeDasharray="5 5"
              strokeWidth={2}
              dot={false}
            />
            <Area
              type="monotone"
              dataKey="actual"
              name={`Actual (${workspace.unit})`}
              stroke={theme.chartHex}
              fill={theme.chartHex}
              fillOpacity={0.14}
              strokeWidth={2.5}
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 tabular-nums">
        <span>Start: {workspace.startDate}</span>
        <span>Solid curve: Actual progress · Dashed line: Linear target pace</span>
        <span>Deadline: {workspace.deadline}</span>
      </div>
    </ModuleShell>
  );
};
