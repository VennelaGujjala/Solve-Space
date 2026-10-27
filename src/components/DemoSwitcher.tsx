import React from 'react';
import { PlayCircle, RotateCcw, X } from 'lucide-react';
import { DEMO_SCENARIOS } from '../data/sampleData';
import { DemoScenarioId } from '../types/solvespace';

interface DemoSwitcherProps {
  isOpen: boolean;
  activeScenario: DemoScenarioId | null;
  onToggleOpen: () => void;
  onSelectScenario: (id: DemoScenarioId) => void;
  onResetDemo: () => void;
}

export const DemoSwitcher: React.FC<DemoSwitcherProps> = ({
  isOpen,
  activeScenario,
  onToggleOpen,
  onSelectScenario,
  onResetDemo,
}) => {
  return (
    <div className="fixed bottom-5 right-5 z-40 no-print flex flex-col items-end">
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Presentation Demo Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any scenario to load live telemetry and watch the console transform.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close demo panel"
              onClick={onToggleOpen}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-md cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            {DEMO_SCENARIOS.map((sc) => {
              const selected = activeScenario === sc.id;
              return (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => onSelectScenario(sc.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-colors cursor-pointer ${
                    selected
                      ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/40 dark:border-blue-500'
                      : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {sc.title}
                    </span>
                    <span className="text-[11px] font-medium text-blue-600 dark:text-blue-400 whitespace-nowrap">
                      → {sc.targetMode}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    {sc.summary}
                  </p>
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-mono-num">Shortcut: [D]</span>
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo</span>
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onToggleOpen}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-slate-900 dark:bg-blue-600 text-white rounded-xl shadow-lg hover:opacity-95 transition-opacity whitespace-nowrap shrink-0 cursor-pointer"
      >
        <PlayCircle className="w-4 h-4" />
        <span>
          {activeScenario
            ? `Demo Mode: ${DEMO_SCENARIOS.find((s) => s.id === activeScenario)?.title}`
            : 'Demo Mode'}
        </span>
      </button>
    </div>
  );
};
