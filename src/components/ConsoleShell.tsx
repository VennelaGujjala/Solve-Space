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
import { getModeTheme } from '../engine/modeTheme';

interface ConsoleShellProps {
  workspaces: Workspace[];
  activeWorkspace: Workspace;
  activeMode: AdaptiveMode;
  activePage: PageId;
  darkMode: boolean;
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
  [PageId.Dashboard]: 'Workspace Console',
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
  const theme = getModeTheme(activeMode);

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
            aria-label="Toggle dark mode"
            onClick={onToggleDarkMode}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
              className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline whitespace-nowrap shrink-0 cursor-pointer"
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
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold truncate">{ws.name}</span>
                    <span
                      className={`font-mono-num text-[11px] shrink-0 ${
                        isSelected
                          ? 'text-slate-300 dark:text-slate-600'
                          : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {wsEval.progressScore}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] truncate mt-0.5 ${
                      isSelected
                        ? 'text-slate-300 dark:text-slate-600'
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
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
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
      <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 px-2">
        <div className="flex items-center justify-between text-xs font-mono-num">
          <span className="font-semibold text-slate-800 dark:text-slate-200">
            Level {ach.level}
          </span>
          <span className="text-slate-500 dark:text-slate-400">{ach.totalXp} XP</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${ach.currentLevelProgressPct}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className={`min-h-screen flex ${theme.canvasTint} text-slate-900 dark:text-slate-100 transition-colors duration-300`}>
      {/* Desktop Sidebar (260px) */}
      <aside className="hidden lg:block w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen no-print">
        {renderSidebarContent()}
      </aside>

      {/* Mobile Slide-Over Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-slate-950/50 backdrop-blur-xs no-print"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 relative"
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

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar Contract: Contextual Breadcrumbs on Left, Primary Actions on Right */}
        <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Open navigation menu"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shrink-0 cursor-pointer"
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
              <span className="hidden sm:inline font-medium text-slate-900 dark:text-white whitespace-nowrap shrink-0">
                {PAGE_LABELS[activePage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenSearch}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline font-mono-num text-[11px] text-slate-400">/</kbd>
            </button>

            <button
              type="button"
              onClick={onOpenQuickTask}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Task</span>
              <kbd className="hidden sm:inline font-mono-num text-[11px] text-blue-200 ml-0.5">
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
