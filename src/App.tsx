import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Finder from './components/Finder';
import KnowledgeGraph from './components/KnowledgeGraph';
import AgentView from './components/AgentView';
import Timeline from './components/Timeline';
import SmartLibrary from './components/SmartLibrary';
import Settings from './components/Settings';
import { ViewMode, User, UserSubscription } from './types';
import { MOCK_GRAPH_DATA, MOCK_USER } from './constants';
import { LanguageProvider } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);
  // Start with no user to demonstrate login flow
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (email: string) => {
    // Simulate login
    setUser({ ...MOCK_USER, email });
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateSubscription = (sub: UserSubscription) => {
    if (user) {
      setUser({ ...user, subscription: sub });
    }
  };

  const renderView = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return <Dashboard />;
      case ViewMode.LIBRARY:
        return <SmartLibrary />;
      case ViewMode.FINDER:
        return <Finder />;
      case ViewMode.GRAPH:
        return <KnowledgeGraph data={MOCK_GRAPH_DATA} />;
      case ViewMode.TIMELINE:
        return <Timeline />;
      case ViewMode.AGENT:
        return <AgentView />;
      case ViewMode.SETTINGS:
        return <Settings 
          user={user} 
          onLogin={handleLogin} 
          onLogout={handleLogout}
          onUpdateSubscription={handleUpdateSubscription}
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-nexus-950 text-gray-100 font-sans overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        user={user}
      />
      <main className="flex-1 h-full relative overflow-hidden">
        {renderView()}
      </main>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
