import React, { useState } from 'react';
import { ViewMode, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LayoutGrid, 
  Search, 
  Network, 
  Bot, 
  Settings, 
  Library,
  History,
  User as UserIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode, params?: any) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user }) => {
  const { t } = useLanguage();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navItems = [
    { id: ViewMode.DASHBOARD, icon: LayoutGrid, label: t('nav.dashboard') },
    { id: ViewMode.LIBRARY, icon: Library, label: t('nav.library') },
    { id: ViewMode.FINDER, icon: Search, label: t('nav.finder') },
    { id: ViewMode.GRAPH, icon: Network, label: t('nav.graph') },
    { id: ViewMode.TIMELINE, icon: History, label: t('nav.timeline') },
    { id: ViewMode.AGENT, icon: Bot, label: t('nav.agent') },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <aside 
      className={`h-screen bg-nexus-900 border-r border-nexus-border flex flex-col justify-between shrink-0 transition-all duration-300 relative z-20 ${
        isCollapsed ? 'w-14' : 'w-56'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-16 bg-nexus-800 border border-nexus-border rounded-full p-0.5 text-gray-400 hover:text-white hover:bg-nexus-700 transition-all z-50 shadow-sm"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>

      <div>
        <div className={`h-12 flex items-center border-b border-nexus-border transition-all duration-300 ${
          isCollapsed ? 'justify-center' : 'justify-start px-4'
        }`}>
          <div className="w-6 h-6 bg-nexus-accent rounded-md flex items-center justify-center shrink-0 shadow-sm shadow-nexus-accent/20">
            <span className="text-white font-bold font-mono text-xs">N</span>
          </div>
          {!isCollapsed && (
            <span className="ml-2.5 font-semibold text-sm text-nexus-text-primary tracking-tight animate-in fade-in duration-500">
              Nexus
            </span>
          )}
        </div>

        <nav className="p-1.5 space-y-0.5 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center rounded-md transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
                } ${
                  isActive 
                    ? 'bg-nexus-800 text-nexus-text-primary shadow-sm ring-1 ring-white/5' 
                    : 'text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary'
                }`}
              >
                <Icon size={16} className={`${isActive ? 'text-nexus-accent' : 'group-hover:text-nexus-text-primary'} shrink-0`} />
                {!isCollapsed && (
                  <span className="ml-2.5 text-sm font-medium truncate animate-in fade-in slide-in-from-left-1 duration-300">
                    {item.label}
                  </span>
                )}
                {/* Active Indicator Line */}
                {isActive && isCollapsed && (
                  <div className="absolute left-0 w-0.5 h-4 bg-nexus-accent rounded-r-full" />
                )}

                {/* Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-nexus-border">
         <div className="p-1.5 pb-0">
          <button 
            onClick={() => onViewChange(ViewMode.SETTINGS)}
            className={`w-full flex items-center rounded-md text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary transition-all group relative ${
              isCollapsed ? 'justify-center p-2' : 'px-3 py-2'
            } ${currentView === ViewMode.SETTINGS ? 'bg-nexus-800 text-nexus-text-primary' : ''}`}
          >
            <Settings size={16} className="shrink-0" />
            {!isCollapsed && (
              <span className="ml-2.5 text-sm font-medium animate-in fade-in duration-300">
                {t('nav.settings')}
              </span>
            )}
            
            {/* Tooltip */}
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                {t('nav.settings')}
                </div>
            )}
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-3 pt-1 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
           {user ? (
             <div className={`flex items-center rounded-md bg-nexus-950 border border-nexus-border/50 group relative ${
               isCollapsed ? 'p-1 cursor-default' : 'p-1.5'
             }`}>
                <div className="w-6 h-6 rounded-full bg-nexus-accent/20 text-nexus-accent flex items-center justify-center font-bold text-[10px] border border-nexus-accent/30 shrink-0">
                  {user.avatar || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="ml-2.5 overflow-hidden animate-in fade-in duration-300">
                    <div className="text-xs font-medium text-nexus-text-primary truncate">{user.name}</div>
                    <div className="text-[10px] text-nexus-text-secondary truncate">{user.email}</div>
                  </div>
                )}

                {/* Tooltip */}
                {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-[10px] text-gray-500">{user.email}</div>
                    </div>
                )}
             </div>
           ) : (
             <button 
                onClick={() => onViewChange(ViewMode.SETTINGS)}
                className={`w-full flex items-center justify-center rounded-md border border-dashed border-nexus-border/60 text-nexus-text-secondary hover:text-nexus-text-primary hover:border-nexus-accent hover:bg-nexus-800/30 transition-all group relative ${
                  isCollapsed ? 'h-8 w-8' : 'p-1.5'
                }`}
             >
                <UserIcon size={14} className={!isCollapsed ? "mr-2" : ""} />
                {!isCollapsed && <span className="text-xs">{t('nav.signIn')}</span>}

                {/* Tooltip */}
                {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                    {t('nav.signIn')}
                    </div>
                )}
             </button>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;