import React, { useState } from 'react';
import {
  BarChart3,
  Blocks,
  Info,
  LayoutDashboard,
  Menu,
  Moon,
  Plus,
  PlusCircle,
  Search,
  Settings,
  Sliders,
  Sun,
  X,
} from 'lucide-react';
import { AdaptiveMode, PageId, Workspace } from '../types/solvespace';
import { evaluateAchievements, evaluateWorkspace } from '../engine/adaptiveEngine';
import { AstraStarfield } from './AstraStarfield';

interface ConsoleShellProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  activeMode: AdaptiveMode;
  activePage: PageId;
  darkMode: boolean;
  starfieldMotion: boolean;
  bonusXp: number;
  onSelectWorkspace: (id: string) => void;
  onNavigate: (page: PageId) => void;
  onToggleDarkMode: () => void;
  onOpenSearch: () => void;
  onOpenQuickTask: () => void;
  children: React.ReactNode;
}

const PAGE_LABELS: Record<PageId, string> = {
  [PageId.Onboarding]: 'Problem Setup',
  [PageId.Dashboard]: 'Astra Console',
  [PageId.Builder]: 'Workspace Builder',
  [PageId.Simulator]: 'What-If Simulator',
  [PageId.Insights]: 'Cross-Workspace Insights',
  [PageId.Settings]: 'Settings',
  [PageId.About]: 'About & Future Scope',
};

export const ConsoleShell: React.FC<ConsoleShellProps> = ({
  workspaces,
  activeWorkspace,
  activeMode,
  activePage,
  darkMode,
  starfieldMotion,
  bonusXp,
  onSelectWorkspace,
  onNavigate,
  onToggleDarkMode,
  onOpenSearch,
  onOpenQuickTask,
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const ach = evaluateAchievements(workspaces, bonusXp);

  const navItems: { id: PageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: PageId.Dashboard, label: 'Console Dashboard', icon: LayoutDashboard },
    { id: PageId.Onboarding, label: 'New Problem Setup', icon: PlusCircle },
    { id: PageId.Builder, label: 'Workspace Builder', icon: Blocks },
    { id: PageId.Simulator, label: 'What-If Simulator', icon: Sliders },
    { id: PageId.Insights, label: 'Insights & Badges', icon: BarChart3 },
    { id: PageId.Settings, label: 'Settings', icon: Settings },
    { id: PageId.About, label: 'About SolveSpace', icon: Info },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6 overflow-y-auto">
        {/* Brand Wordmark */}
        <div className="flex items-center justify-between px-2 pt-1">
          <button
            type="button"
            onClick={() => {
              onNavigate(PageId.Dashboard);
              setMobileMenuOpen(false);
            }}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-white font-display whitespace-nowrap shrink-0 cursor-pointer"
          >
            SolveSpace
          </button>
          <button
            type="button"
            aria-label="Toggle dark or light Astra sky"
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-sky-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.07] transition-colors cursor-pointer"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspaces Switcher */}
        <div>
          <div className="px-2 mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Workspaces ({workspaces.length})
            </span>
            <button
              type="button"
              onClick={() => {
                onNavigate(PageId.Onboarding);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-medium text-sky-600 dark:text-sky-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
            >
              + New
            </button>
          </div>

          <div className="space-y-1">
            {workspaces.map((ws) => {
              const isSelected = ws.id === activeWorkspace.id;
              const wsEval = evaluateWorkspace(ws);
              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    onSelectWorkspace(ws.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900/90 text-white border-slate-700 dark:bg-sky-500/15 dark:text-white dark:border-sky-400/35 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.08)]'
                      : 'border-transparent text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{ws.name}</span>
                    <span
                      className={`font-mono-num text-[11px] shrink-0 ${
                        isSelected
                          ? 'text-sky-200 dark:text-sky-300'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {wsEval.progressScore}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected
                        ? 'text-slate-300 dark:text-sky-200/80'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {wsEval.mode}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation Links */}
        <div>
          <p className="px-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
            Console Views
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-sky-500/12 text-sky-700 dark:bg-white/[0.09] dark:text-sky-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Operator Level & XP Footer */}
      <div className="pt-4 mt-4 border-t border-slate-200/70 dark:border-white/[0.08] px-2">
        <div className="flex items-center justify-between text-xs font-mono-num">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Level {ach.level}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{ach.totalXp} XP</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-slate-200 dark:bg-white/[0.08] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full transition-all duration-300"
            style={{ width: `${ach.currentLevelProgressPct}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen relative flex text-slate-900 dark:text-slate-100">
      {/* Moving Astra Deep-Space Starfield */}
      <AstraStarfield
        mode={activeMode}
        darkMode={darkMode}
        motionEnabled={starfieldMotion}
      />

      {/* Desktop Sidebar (256px) */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white/75 dark:bg-[#060914]/78 backdrop-blur-2xl border-r border-slate-200/80 dark:border-white/[0.08] sticky top-0 h-screen z-20 no-print">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/65 backdrop-blur-sm no-print"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-white/95 dark:bg-[#070B18]/95 backdrop-blur-2xl border-r border-slate-200 dark:border-white/[0.1] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close sidebar"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-3 p-1.5 text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            {renderSidebarContent()}
          </div>
        </div>
      )}

      {/* Main Content Stage */}
      <div className="relative z-10 flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Contextual Breadcrumbs on Left, Primary Actions on Right */}
        <header className="sticky top-0 z-30 bg-white/75 dark:bg-[#060914]/72 backdrop-blur-2xl border-b border-slate-200/80 dark:border-white/[0.08] px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-white/[0.12] text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 dark:text-slate-400 truncate">
              <span className="font-semibold text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                SolveSpace
              </span>
              <span aria-hidden="true">/</span>
              <span className="truncate max-w-44 text-slate-700 dark:text-slate-300">
                {activeWorkspace.name}
              </span>
              <span aria-hidden="true" className="hidden sm:inline">/</span>
              <span className="hidden sm:inline font-medium text-slate-900 dark:text-sky-200 whitespace-nowrap shrink-0">
                {PAGE_LABELS[activePage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 bg-slate-200/70 dark:bg-white/[0.07] hover:bg-slate-200 dark:hover:bg-white/[0.12] border border-transparent dark:border-white/[0.08] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline font-mono-num text-[11px] text-slate-400">/</kbd>
            </button>

            <button
              type="button"
              onClick={onOpenQuickTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 rounded-lg shadow-[0_0_20px_-4px_rgba(56,189,248,0.6)] transition-all whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
              <kbd className="hidden sm:inline font-mono-num text-[11px] text-slate-800 ml-0.5">
                N
              </kbd>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-8 pb-24">{children}</main>
      </div>
    </div>
  );
};
