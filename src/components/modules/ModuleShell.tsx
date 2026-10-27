import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { RuleExplanation } from '../../types/solvespace';

interface ModuleShellProps {
  id?: string;
  title: string;
  subtitle?: string;
  isEnlarged?: boolean;
  isMinimized?: boolean;
  promotedReason?: RuleExplanation;
  onExplain?: (rule: RuleExplanation) => void;
  headerRight?: React.ReactNode;
  minimizedSummary?: string;
  children: React.ReactNode;
}

export const ModuleShell: React.FC<ModuleShellProps> = ({
  id,
  title,
  subtitle,
  isEnlarged,
  isMinimized,
  promotedReason,
  onExplain,
  headerRight,
  minimizedSummary,
  children,
}) => {
  const [manualExpand, setManualExpand] = useState(false);
  const collapsed = Boolean(isMinimized && !manualExpand);

  return (
    <section
      id={id}
      className={`bg-white dark:bg-slate-900 border rounded-xl transition-opacity duration-200 flex flex-col ${
        isEnlarged
          ? 'border-slate-300 dark:border-slate-700 shadow-sm'
          : 'border-slate-200 dark:border-slate-800'
      }`}
    >
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/80 flex items-start justify-between gap-4">
        <div className="min-w-0">
          {promotedReason && onExplain && (
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1">
              <span>
                {isEnlarged
                  ? 'Priority focus'
                  : isMinimized
                  ? 'Compacted view'
                  : 'Adaptive order'}
              </span>
              <span aria-hidden="true">·</span>
              <button
                type="button"
                onClick={() => onExplain(promotedReason)}
                className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium whitespace-nowrap shrink-0 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Why am I seeing this?</span>
              </button>
            </div>
          )}
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </h3>
          {subtitle && !collapsed && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
          )}
          {collapsed && minimizedSummary && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 tabular-nums">
              {minimizedSummary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {!collapsed && headerRight}
          {isMinimized && (
            <button
              type="button"
              onClick={() => setManualExpand((v) => !v)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {collapsed ? (
                <>
                  <span>Expand</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  <span>Compact</span>
                  <ChevronUp className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {!collapsed && <div className="p-5 flex-1 flex flex-col">{children}</div>}
    </section>
  );
};
