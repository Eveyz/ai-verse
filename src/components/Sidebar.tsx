import React, { useState } from 'react';
import { ViewMode, User } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  LayoutGrid, 
  Search, 
  Network, 
  Bot, 
  Settings, 
  FolderOpen,
  Library,
  History,
  User as UserIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
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
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Collapse Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-nexus-800 border border-nexus-border rounded-full p-1 text-gray-400 hover:text-white hover:bg-nexus-700 transition-all z-50 shadow-lg"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div>
        <div className={`h-16 flex items-center border-b border-nexus-border transition-all duration-300 ${
          isCollapsed ? 'justify-center' : 'justify-start px-6'
        }`}>
          <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-nexus-accent/20">
            <span className="text-white font-bold font-mono">N</span>
          </div>
          {!isCollapsed && (
            <span className="ml-3 font-semibold text-lg text-nexus-text-primary tracking-tight animate-in fade-in duration-500">
              Nexus
            </span>
          )}
        </div>

        <nav className="p-2 space-y-2 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center rounded-lg transition-all duration-200 group relative ${
                  isCollapsed ? 'justify-center p-2' : 'px-4 py-3'
                } ${
                  isActive 
                    ? 'bg-nexus-800 text-nexus-text-primary shadow-sm ring-1 ring-white/10' 
                    : 'text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary'
                }`}
              >
                <Icon size={20} className={`${isActive ? 'text-nexus-accent' : 'group-hover:text-nexus-text-primary'} shrink-0`} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium truncate animate-in fade-in slide-in-from-left-2 duration-300">
                    {item.label}
                  </span>
                )}
                {/* Active Indicator Line */}
                {isActive && isCollapsed && (
                  <div className="absolute left-0 w-1 h-6 bg-nexus-accent rounded-r-full" />
                )}

                {/* Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Local Sources Section */}
        {!isCollapsed && (
          <div className="mt-8 px-4 animate-in fade-in duration-500">
            <div className="text-xs font-semibold text-nexus-text-secondary uppercase tracking-wider mb-2">
              {t('nav.localSources')}
            </div>
            <div className="space-y-1">
               <div className="flex items-center text-sm text-nexus-text-secondary p-2 rounded hover:bg-nexus-800 cursor-pointer group">
                  <FolderOpen size={14} className="mr-2 group-hover:text-nexus-accent transition-colors" />
                  <span className="truncate">~/Documents/Work</span>
               </div>
               <div className="flex items-center text-sm text-nexus-text-secondary p-2 rounded hover:bg-nexus-800 cursor-pointer group">
                  <FolderOpen size={14} className="mr-2 group-hover:text-nexus-accent transition-colors" />
                  <span className="truncate">~/Projects/Rust</span>
               </div>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-nexus-border">
         <div className="p-2 pb-0">
          <button 
            onClick={() => onViewChange(ViewMode.SETTINGS)}
            className={`w-full flex items-center rounded-lg text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary transition-all group relative ${
              isCollapsed ? 'justify-center p-2' : 'px-4 py-3'
            } ${currentView === ViewMode.SETTINGS ? 'bg-nexus-800 text-nexus-text-primary' : ''}`}
          >
            <Settings size={20} className="shrink-0" />
            {!isCollapsed && (
              <span className="ml-3 font-medium animate-in fade-in duration-300">
                {t('nav.settings')}
              </span>
            )}
            
            {/* Tooltip */}
            {isCollapsed && (
                <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                {t('nav.settings')}
                </div>
            )}
          </button>
        </div>

        {/* User Profile Section */}
        <div className={`p-4 pt-2 transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
           {user ? (
             <div className={`flex items-center rounded-lg bg-nexus-950 border border-nexus-border/50 group relative ${
               isCollapsed ? 'p-1 cursor-default' : 'p-2'
             }`}>
                <div className="w-8 h-8 rounded-full bg-nexus-accent/20 text-nexus-accent flex items-center justify-center font-bold text-xs border border-nexus-accent/30 shrink-0">
                  {user.avatar || 'U'}
                </div>
                {!isCollapsed && (
                  <div className="ml-3 overflow-hidden animate-in fade-in duration-300">
                    <div className="text-sm font-medium text-nexus-text-primary truncate">{user.name}</div>
                    <div className="text-xs text-nexus-text-secondary truncate">{user.email}</div>
                  </div>
                )}

                {/* Tooltip */}
                {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
                    <div className="font-semibold">{user.name}</div>
                    <div className="text-[10px] text-gray-500">{user.email}</div>
                    </div>
                )}
             </div>
           ) : (
             <button 
                onClick={() => onViewChange(ViewMode.SETTINGS)}
                className={`w-full flex items-center justify-center rounded-lg border border-dashed border-gray-600 text-nexus-text-secondary hover:text-nexus-text-primary hover:border-nexus-accent hover:bg-nexus-800/30 transition-all group relative ${
                  isCollapsed ? 'h-10 w-10' : 'p-2'
                }`}
             >
                <UserIcon size={16} className={!isCollapsed ? "mr-2" : ""} />
                {!isCollapsed && <span className="text-xs">{t('nav.signIn')}</span>}

                {/* Tooltip */}
                {isCollapsed && (
                    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 px-2 py-1 bg-nexus-800 text-gray-100 text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 whitespace-nowrap border border-nexus-border shadow-xl">
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