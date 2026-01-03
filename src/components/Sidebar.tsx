import React from 'react';
import { ViewMode, User } from '../types';
import { 
  LayoutGrid, 
  Search, 
  Network, 
  Bot, 
  Settings, 
  FolderOpen,
  History,
  Library,
  User as UserIcon,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  user: User | null;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onViewChange, user }) => {
  const navItems = [
    { id: ViewMode.DASHBOARD, icon: LayoutGrid, label: 'Dashboard' },
    { id: ViewMode.LIBRARY, icon: Library, label: 'Smart Library' },
    { id: ViewMode.FINDER, icon: Search, label: 'Finder' },
    { id: ViewMode.GRAPH, icon: Network, label: 'Knowledge Graph' },
    { id: ViewMode.TIMELINE, icon: History, label: 'Evolution' },
    { id: ViewMode.AGENT, icon: Bot, label: 'Agent Workflow' },
  ];

  return (
    <aside className="w-16 md:w-64 h-screen bg-nexus-900 border-r border-nexus-border flex flex-col justify-between shrink-0 transition-all duration-300">
      <div>
        <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-nexus-border">
          <div className="w-8 h-8 bg-nexus-accent rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-bold font-mono">N</span>
          </div>
          <span className="ml-3 font-semibold text-lg hidden md:block text-gray-100 tracking-tight">Nexus</span>
        </div>

        <nav className="p-2 md:p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center p-2 md:px-4 md:py-3 rounded-lg transition-colors duration-200 group ${
                  isActive 
                    ? 'bg-nexus-800 text-white shadow-sm ring-1 ring-white/10' 
                    : 'text-gray-400 hover:bg-nexus-800/50 hover:text-gray-200'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-nexus-accent' : 'group-hover:text-gray-200'} />
                <span className="ml-3 font-medium hidden md:block">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* L1 Feature Hint: File System Integration */}
        <div className="mt-8 px-4 hidden md:block">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Local Sources
          </div>
          <div className="space-y-1">
             <div className="flex items-center text-sm text-gray-400 p-2 rounded hover:bg-nexus-800 cursor-pointer">
                <FolderOpen size={14} className="mr-2" />
                <span>~/Documents/Work</span>
             </div>
             <div className="flex items-center text-sm text-gray-400 p-2 rounded hover:bg-nexus-800 cursor-pointer">
                <FolderOpen size={14} className="mr-2" />
                <span>~/Projects/Rust</span>
             </div>
          </div>
        </div>
      </div>

      <div className="border-t border-nexus-border">
         <div className="p-2 md:p-4 pb-0">
          <button 
            onClick={() => onViewChange(ViewMode.SETTINGS)}
            className={`w-full flex items-center p-2 md:px-4 md:py-3 rounded-lg text-gray-400 hover:bg-nexus-800/50 hover:text-gray-200 ${currentView === ViewMode.SETTINGS ? 'bg-nexus-800 text-white' : ''}`}
          >
            <Settings size={20} />
            <span className="ml-3 font-medium hidden md:block">Settings</span>
          </button>
        </div>

        {/* User Profile Section */}
        <div className="p-4 pt-2 hidden md:block">
           {user ? (
             <div className="flex items-center p-2 rounded-lg bg-nexus-950 border border-nexus-border/50">
                <div className="w-8 h-8 rounded-full bg-nexus-accent/20 text-nexus-accent flex items-center justify-center font-bold text-xs border border-nexus-accent/30">
                  {user.avatar || 'U'}
                </div>
                <div className="ml-3 overflow-hidden">
                  <div className="text-sm font-medium text-white truncate">{user.name}</div>
                  <div className="text-xs text-gray-500 truncate">{user.email}</div>
                </div>
             </div>
           ) : (
             <button 
                onClick={() => onViewChange(ViewMode.SETTINGS)}
                className="w-full flex items-center justify-center p-2 rounded-lg border border-dashed border-gray-600 text-gray-400 hover:text-white hover:border-nexus-accent hover:bg-nexus-800/30 transition-all"
             >
                <UserIcon size={16} className="mr-2" />
                <span className="text-xs">Sign In</span>
             </button>
           )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
