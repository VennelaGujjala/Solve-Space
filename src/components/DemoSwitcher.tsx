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
        <div className="mb-3 w-80 sm:w-96 bg-white/95 dark:bg-[#070B19]/92 backdrop-blur-2xl border border-slate-200 dark:border-sky-400/25 rounded-xl shadow-2xl p-4 space-y-3">
          <div className="flex items-start justify-between gap-2 pb-2 border-b border-slate-200/70 dark:border-white/[0.08]">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Presentation Demo Scenarios
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any scenario to load live telemetry and watch the console & nebula shift.
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
                      ? 'border-sky-400 bg-sky-50/70 dark:bg-sky-500/15 dark:border-sky-400/50'
                      : 'border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {sc.title}
                    </span>
                    <span className="text-[11px] font-medium text-sky-600 dark:text-sky-300 whitespace-nowrap">
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

          <div className="pt-2 border-t border-slate-200/70 dark:border-white/[0.08] flex items-center justify-between gap-2">
            <span className="text-[11px] text-slate-400 font-mono-num">Shortcut: [D]</span>
            <button
              type="button"
              onClick={onResetDemo}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/[0.14] rounded-lg hover:bg-slate-100 dark:hover:bg-white/[0.07] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
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
        className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-xl shadow-[0_0_24px_-4px_rgba(56,189,248,0.65)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
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
