import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { NavLink, href } from 'react-router';
import { TOOLS } from '@/constants/tool-constants';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

interface SidebarProps {
  activeToolId: string;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Sidebar({ 
  activeToolId, 
  isCollapsed, 
  onToggleCollapse,
  theme,
  onToggleTheme
}: SidebarProps) {
  const categories = Array.from(new Set(TOOLS.map(t => t.category)));

  return (
    <nav 
      role="navigation"
      aria-label="Main Sidebar"
      className={cn(
        "h-screen bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "p-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center",
        isCollapsed ? "flex-col gap-4 justify-center" : "justify-between"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0" aria-hidden="true">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight"
            >
              DevNexus
            </motion.h1>
          )}
        </div>

        <div className={cn("flex items-center gap-1", isCollapsed && "flex-col")}>
          <button
            onClick={onToggleCollapse}
            className="p-2 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200 transition-colors"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-label={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            aria-expanded={!isCollapsed}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" aria-hidden="true" /> : <ChevronLeft className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className={cn("py-4 px-3 space-y-6", isCollapsed && "px-2")}>
          <div className="space-y-1">
            <NavLink
              to={href('/')}
              className={({ isActive }) => cn(
                "flex items-center transition-all duration-200 group",
                isActive 
                  ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-medium" 
                  : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200",
                isCollapsed ? "w-12 h-12 mx-auto justify-center rounded-xl p-0" : "w-full gap-3 px-3 py-2 rounded-lg text-sm"
              )}
              title={isCollapsed ? "Dashboard" : undefined}
              aria-label={isCollapsed ? "Dashboard" : undefined}
            >
              <LayoutDashboard 
                className={cn(
                  "w-5 h-5 transition-colors shrink-0",
                  activeToolId === 'dashboard' ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                )} 
                aria-hidden="true"
              />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
          </div>

          {categories.map(category => (
            <div key={category} className="space-y-1">
              {!isCollapsed ? (
                <h2 className="px-3 text-xs font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  {category}
                </h2>
              ) : (
                <div className="h-px bg-zinc-200 dark:bg-zinc-800 mx-2 my-4" />
              )}
              <div className="space-y-1">
                {TOOLS.filter(t => t.category === category).map(tool => {
                  const Icon = tool.icon;
                  
                  return (
                    <NavLink
                      key={tool.id}
                      to={href('/tools/:toolId', { toolId: tool.id })}
                      className={({ isActive }) => cn(
                        "flex items-center transition-all duration-200 group relative",
                        isActive 
                          ? "bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-medium" 
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-200",
                        isCollapsed ? "w-12 h-12 mx-auto justify-center rounded-xl p-0" : "w-full gap-3 px-3 py-2 rounded-lg text-sm"
                      )}
                      title={isCollapsed ? tool.name : undefined}
                      aria-label={isCollapsed ? tool.name : undefined}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon 
                            className={cn(
                              "w-5 h-5 transition-colors shrink-0",
                              isActive ? "text-indigo-600 dark:text-indigo-400" : "text-zinc-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400"
                            )} 
                            aria-hidden="true"
                          />
                          {!isCollapsed && <span className="truncate">{tool.name}</span>}
                          {isActive && !isCollapsed && (
                            <motion.div 
                              layoutId="active-indicator"
                              className="ml-auto w-1 h-4 bg-indigo-500 rounded-full"
                              aria-hidden="true"
                            />
                          )}
                          {isActive && isCollapsed && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-indigo-500 rounded-l-full" aria-hidden="true" />
                          )}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className={cn(
          "flex items-center gap-3 px-3 py-4 text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-200 dark:border-zinc-800",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shrink-0" />
          {!isCollapsed && <span>v1.0.0 Stable</span>}
        </div>
    </nav>
  );
}
