import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import { RuleExplanation } from '../types/solvespace';

interface RuleInspectorModalProps {
  rule: RuleExplanation | null;
  onClose: () => void;
}

export const RuleInspectorModal: React.FC<RuleInspectorModalProps> = ({
  rule,
  onClose,
}) => {
  if (!rule) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 no-print"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
            <HelpCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs font-semibold">Explainable Adaptive Engine</span>
          </div>
          <button
            type="button"
            aria-label="Close rule explanation"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">{rule.title}</h2>
          <p className="mt-1.5 text-xs font-mono-num text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            Rule: {rule.triggerRule}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Observed Workspace Data That Triggered This State
          </h3>
          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg">
            {rule.observedMetrics.map((m) => (
              <div
                key={m.label}
                className="px-3.5 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs"
              >
                <span className="font-medium text-slate-700 dark:text-slate-200">{m.label}</span>
                <div className="font-mono-num text-right">
                  <span className="font-semibold text-slate-900 dark:text-white">{m.value}</span>
                  <span className="text-slate-400"> · {m.threshold}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 text-xs">
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Console Adaptation Applied:{' '}
            </span>
            <span className="text-slate-600 dark:text-slate-400">{rule.uiEffect}</span>
          </div>
          <div>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              How to Change This State:{' '}
            </span>
            <span className="text-slate-600 dark:text-slate-400">{rule.howToShift}</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
