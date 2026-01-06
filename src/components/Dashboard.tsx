import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Database, FileText, Share2, Layers, Folder, UploadCloud, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { MOCK_DATA_SOURCES } from '../constants';
import { ViewMode } from '../types';

const data = [
  { name: 'Mon', files: 400, chunks: 2400 },
  { name: 'Tue', files: 300, chunks: 1398 },
  { name: 'Wed', files: 200, chunks: 9800 },
  { name: 'Thu', files: 278, chunks: 3908 },
  { name: 'Fri', files: 189, chunks: 4800 },
];

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-nexus-900 border border-nexus-border p-4 rounded-xl hover:border-nexus-border/80 transition-all">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-1.5 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color} size={20} />
      </div>
      <span className="text-[10px] text-green-500 font-mono">+12%</span>
    </div>
    <div className="text-xl font-bold text-nexus-text-primary mb-0.5">{value}</div>
    <div className="text-xs text-nexus-text-secondary">{label}</div>
  </div>
);

interface DashboardProps {
    onViewChange?: (view: ViewMode, params?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { t } = useLanguage();

  const handleSourceClick = (sourceId: string) => {
      if (onViewChange) {
          onViewChange(ViewMode.LIBRARY, { sourceId });
      }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full overflow-y-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-nexus-text-primary">{t('dashboard.title')}</h1>
        <p className="text-sm text-nexus-text-secondary mt-1">{t('dashboard.subtitle')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label={t('dashboard.indexedFiles')} value="12,403" icon={FileText} color="text-blue-500" />
        <StatCard label={t('dashboard.vectorChunks')} value="1.2M" icon={Database} color="text-purple-500" />
        <StatCard label={t('dashboard.semanticLinks')} value="84,392" icon={Share2} color="text-nexus-accent" />
        <StatCard label={t('dashboard.knowledgeDepth')} value="L3" icon={Layers} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
            {/* Ingestion Velocity */}
            <div className="bg-nexus-900 border border-nexus-border p-5 rounded-xl">
            <h3 className="text-base font-semibold text-nexus-text-primary mb-4">{t('dashboard.ingestionVelocity')}</h3>
            <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-nexus-border)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-nexus-text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--color-nexus-text-secondary)" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--color-nexus-900)', border: '1px solid var(--color-nexus-border)', borderRadius: '8px', fontSize: '12px' }}
                        itemStyle={{ color: 'var(--color-nexus-text-primary)' }}
                    />
                    <Bar dataKey="chunks" fill="var(--color-nexus-accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
                </ResponsiveContainer>
            </div>
            </div>
            
            {/* Connected Data Sources List */}
            <div className="bg-nexus-900 border border-nexus-border p-5 rounded-xl">
                 <div className="flex items-center justify-between mb-3">
                     <h3 className="text-base font-semibold text-nexus-text-primary">{t('dashboard.connectedSources')}</h3>
                     <button 
                        onClick={() => onViewChange && onViewChange(ViewMode.LIBRARY)}
                        className="text-[10px] text-nexus-accent hover:text-white transition-colors"
                     >
                        {t('dashboard.manageSources')}
                     </button>
                 </div>
                 <div className="space-y-2">
                     {MOCK_DATA_SOURCES.map(source => (
                         <div 
                            key={source.id} 
                            onClick={() => handleSourceClick(source.id)}
                            className="flex items-center justify-between p-2.5 bg-nexus-950 border border-nexus-border rounded-lg hover:border-nexus-accent/50 cursor-pointer group transition-all"
                         >
                            <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-lg ${source.type === 'upload' ? 'bg-purple-500/10' : 'bg-blue-500/10'}`}>
                                    {source.type === 'upload' ? (
                                        <UploadCloud size={16} className={source.type === 'upload' ? 'text-purple-500' : ''} />
                                    ) : (
                                        <Folder size={16} className={source.type === 'folder' ? 'text-blue-500' : ''} />
                                    )}
                                </div>
                                <div>
                                    <div className="font-medium text-nexus-text-primary text-sm group-hover:text-nexus-accent transition-colors">{source.name}</div>
                                    <div className="text-[10px] text-nexus-text-secondary font-mono truncate max-w-[200px]">{source.path}</div>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                <div className="text-right">
                                    <div className="flex items-center justify-end gap-1 mb-0.5">
                                        {source.status === 'indexing' ? (
                                            <>
                                                <Loader2 size={10} className="animate-spin text-nexus-accent" />
                                                <span className="text-[10px] text-nexus-accent font-medium">Indexing</span>
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 size={10} className="text-green-500" />
                                                <span className="text-[10px] text-green-500 font-medium">Synced</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="text-[9px] text-nexus-text-secondary">{source.itemCount} items</div>
                                </div>
                                <ArrowRight size={12} className="text-nexus-text-secondary opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                            </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>

        {/* Right Column: System Health */}
        <div className="bg-nexus-900 border border-nexus-border p-5 rounded-xl h-fit">
          <h3 className="text-base font-semibold text-nexus-text-primary mb-3">{t('dashboard.systemHealth')}</h3>
          <div className="space-y-5">
             <div>
                <div className="flex justify-between text-xs mb-1.5">
                   <span className="text-nexus-text-secondary flex items-center gap-2">
                       <Database size={12} />
                       {t('dashboard.vectorStore')}
                   </span>
                   <span className="text-nexus-text-primary font-mono text-[10px]">1.2 GB / 50 GB</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: '4%' }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs mb-1.5">
                   <span className="text-nexus-text-secondary flex items-center gap-2">
                       <Share2 size={12} />
                       {t('dashboard.memoryUsage')}
                   </span>
                   <span className="text-nexus-text-primary font-mono text-[10px]">450 MB / 16 GB</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '30%' }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-xs mb-1.5">
                   <span className="text-nexus-text-secondary flex items-center gap-2">
                       <Loader2 size={12} />
                       {t('dashboard.queue')}
                   </span>
                   <span className="text-nexus-text-primary font-mono text-[10px]">Idle</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-1.5 overflow-hidden">
                   <div className="bg-gray-700 h-1.5 rounded-full" style={{ width: '0%' }}></div>
                </div>
             </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-nexus-border">
             <div className="text-xs font-semibold text-nexus-text-secondary mb-2">{t('dashboard.activePlugins')}</div>
             <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-nexus-950 text-[10px] text-nexus-text-secondary rounded border border-nexus-border">PDF Parser</span>
                <span className="px-2 py-0.5 bg-nexus-950 text-[10px] text-nexus-text-secondary rounded border border-nexus-border">Markdown</span>
                <span className="px-2 py-0.5 bg-nexus-950 text-[10px] text-nexus-text-secondary rounded border border-nexus-border">Code Splitter</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;