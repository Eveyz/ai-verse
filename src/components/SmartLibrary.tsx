import React, { useState, useMemo } from 'react';
import { MOCK_LIBRARY_FILES, MOCK_DATA_SOURCES } from '../constants';
import { LibraryFile, DataSource } from '../types';
import { 
  Grid, 
  Calendar, 
  BrainCircuit, 
  Box, 
  FileText, 
  Code, 
  Image, 
  Table, 
  File, 
  UploadCloud,
  FolderPlus,
  Folder,
  Database,
  Loader2,
  CheckCircle2,
  Search,
  MoreVertical,
  PauseCircle,
  AlertCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type GroupMode = 'none' | 'type' | 'time' | 'semantic';

interface SmartLibraryProps {
    initialSourceId?: string; // Optional prop if we want to deep link
}

const SmartLibrary: React.FC<SmartLibraryProps> = ({ initialSourceId }) => {
  const { t } = useLanguage();
  const [groupMode, setGroupMode] = useState<GroupMode>('semantic');
  const [isDragging, setIsDragging] = useState(false);
  
  // Data Source State
  const [dataSources, setDataSources] = useState<DataSource[]>(MOCK_DATA_SOURCES);
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | 'all'>(initialSourceId || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Update state if props change (simple sync)
  React.useEffect(() => {
      if(initialSourceId) setActiveSourceFilter(initialSourceId);
  }, [initialSourceId]);

  const handleAddSource = () => {
      const name = prompt(t('library.enterFolderName'));
      if (!name) return;
      const newSource: DataSource = {
          id: `src-${Date.now()}`,
          name: name,
          path: `~/New/Project/${name}`,
          type: 'folder',
          itemCount: 0,
          status: 'indexing',
          lastSynced: 'Starting...'
      };
      setDataSources(prev => [...prev, newSource]);
  };

  const getFileIcon = (type: LibraryFile['type']) => {
    switch (type) {
      case 'code': return <Code size={16} className="text-yellow-500" />;
      case 'md': return <FileText size={16} className="text-blue-500" />;
      case 'pdf': return <FileText size={16} className="text-red-500" />;
      case 'img': return <Image size={16} className="text-purple-500" />;
      case 'sheet': return <Table size={16} className="text-green-500" />;
      default: return <File size={16} className="text-gray-400" />;
    }
  };

  const filteredFiles = useMemo(() => {
      let files = MOCK_LIBRARY_FILES;
      
      // 1. Filter by Source
      if (activeSourceFilter !== 'all') {
          files = files.filter(f => f.sourceId === activeSourceFilter);
      }

      // 2. Filter by Search
      if (searchQuery) {
          const q = searchQuery.toLowerCase();
          files = files.filter(f => f.name.toLowerCase().includes(q) || f.semanticTag.toLowerCase().includes(q));
      }

      return files;
  }, [activeSourceFilter, searchQuery]);

  const groupedFiles = useMemo(() => {
    const groups: Record<string, LibraryFile[]> = {};

    filteredFiles.forEach(file => {
      let key = 'All Files';
      if (groupMode === 'type') {
        key = file.type.toUpperCase();
      } else if (groupMode === 'time') {
        // Simple month grouping
        const date = new Date(file.lastModified);
        key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      } else if (groupMode === 'semantic') {
        key = file.semanticTag;
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(file);
    });

    return groups;
  }, [groupMode, filteredFiles]);

  const activeSourceName = activeSourceFilter === 'all' 
    ? t('library.allSources') 
    : dataSources.find(s => s.id === activeSourceFilter)?.name || 'Unknown';

  const getActiveSourceStatus = () => {
    if (activeSourceFilter === 'all') return 'synced'; // Assuming aggregate is synced for now
    return dataSources.find(s => s.id === activeSourceFilter)?.status || 'synced';
  };

  const status = getActiveSourceStatus();

  return (
    <div className="flex h-full bg-nexus-950 transition-colors duration-300 overflow-hidden">
      
      {/* LEFT PANE: SOURCES (Master) */}
      <div className="w-56 md:w-64 bg-nexus-900 border-r border-nexus-border flex flex-col shrink-0">
        <div className="p-3 border-b border-nexus-border flex items-center justify-between">
            <h2 className="font-bold text-sm text-nexus-text-primary">{t('library.sources')}</h2>
            <button 
                onClick={handleAddSource}
                className="p-1 text-nexus-text-secondary hover:text-white hover:bg-nexus-800 rounded transition-colors"
                title={t('library.addSource')}
            >
                <FolderPlus size={14} />
            </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {/* All Sources Item */}
            <div 
                onClick={() => setActiveSourceFilter('all')}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-md cursor-pointer transition-all ${
                    activeSourceFilter === 'all' 
                    ? 'bg-nexus-800 text-nexus-text-primary font-medium' 
                    : 'text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary'
                }`}
            >
                <Database size={14} className={activeSourceFilter === 'all' ? 'text-nexus-accent' : ''} />
                <span className="text-xs">{t('library.allSources')}</span>
            </div>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-nexus-text-secondary uppercase tracking-wider opacity-70">
                {t('library.sources')}
            </div>

            {/* Source List */}
            {dataSources.map(source => (
                <div 
                    key={source.id}
                    onClick={() => setActiveSourceFilter(source.id)}
                    className={`flex items-center justify-between px-3 py-2 rounded-md cursor-pointer group transition-all ${
                        activeSourceFilter === source.id
                        ? 'bg-nexus-800 text-nexus-text-primary font-medium' 
                        : 'text-nexus-text-secondary hover:bg-nexus-800/50 hover:text-nexus-text-primary'
                    }`}
                >
                    <div className="flex items-center gap-2.5 truncate">
                        {source.type === 'upload' ? (
                            <UploadCloud size={14} className={activeSourceFilter === source.id ? 'text-purple-400' : ''} />
                        ) : (
                            <Folder size={14} className={activeSourceFilter === source.id ? 'text-blue-400' : ''} />
                        )}
                        <span className="text-xs truncate">{source.name}</span>
                    </div>
                    
                    {source.status === 'indexing' ? (
                        <Loader2 size={10} className="animate-spin text-nexus-accent shrink-0" />
                    ) : (
                        <span className="text-[10px] opacity-0 group-hover:opacity-100 transition-opacity bg-nexus-950 px-1.5 rounded text-nexus-text-secondary">
                            {source.itemCount}
                        </span>
                    )}
                </div>
            ))}
        </div>

        {/* Sync Status Footer - DYNAMIC */}
        <div className="p-2 border-t border-nexus-border bg-nexus-900/50 text-[10px] text-nexus-text-secondary flex items-center justify-center gap-1.5">
            {status === 'indexing' && (
                <>
                    <Loader2 size={10} className="animate-spin text-nexus-accent" />
                    <span className="text-nexus-accent font-medium">{t('library.indexing')}</span>
                </>
            )}
            {status === 'synced' && (
                <>
                    <CheckCircle2 size={10} className="text-green-500" />
                    <span>{t('library.synced')}</span>
                </>
            )}
            {status === 'paused' && (
                <>
                    <PauseCircle size={10} className="text-yellow-500" />
                    <span>{t('library.paused')}</span>
                </>
            )}
             {status === 'error' && (
                <>
                    <AlertCircle size={10} className="text-red-500" />
                    <span>{t('library.error')}</span>
                </>
            )}
        </div>
      </div>

      {/* RIGHT PANE: CONTENT (Detail) */}
      <div className="flex-1 flex flex-col h-full bg-nexus-950 relative">
        
        {/* Detail Header */}
        <div className="h-14 border-b border-nexus-border flex items-center justify-between px-6 shrink-0 bg-nexus-950/80 backdrop-blur z-10">
            <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-nexus-text-primary truncate">{activeSourceName}</h1>
                <span className="text-xs text-nexus-text-secondary bg-nexus-900 px-2 py-0.5 rounded-full border border-nexus-border">
                    {filteredFiles.length} {t('library.items')}
                </span>
            </div>

            <div className="flex items-center gap-3">
                 {/* Search Bar */}
                <div className="relative hidden md:block">
                    <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-nexus-text-secondary" />
                    <input 
                        type="text" 
                        placeholder={t('finder.placeholder')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-nexus-900 border border-nexus-border rounded-full py-1 pl-8 pr-3 text-xs text-nexus-text-primary focus:border-nexus-accent outline-none w-40 transition-all focus:w-56"
                    />
                </div>

                {/* View Toggles */}
                <div className="flex bg-nexus-900 p-0.5 rounded-md border border-nexus-border">
                    <button 
                        onClick={() => setGroupMode('none')}
                        className={`p-1.5 rounded text-xs transition-all ${groupMode === 'none' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
                        title={t('library.grid')}
                    >
                        <Grid size={12} />
                    </button>
                    <button 
                        onClick={() => setGroupMode('type')}
                        className={`p-1.5 rounded text-xs transition-all ${groupMode === 'type' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
                        title={t('library.type')}
                    >
                        <Box size={12} />
                    </button>
                    <button 
                        onClick={() => setGroupMode('time')}
                        className={`p-1.5 rounded text-xs transition-all ${groupMode === 'time' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
                        title={t('library.time')}
                    >
                        <Calendar size={12} />
                    </button>
                    <button 
                        onClick={() => setGroupMode('semantic')}
                        className={`p-1.5 rounded text-xs transition-all ${groupMode === 'semantic' ? 'bg-nexus-accent/20 text-nexus-accent shadow ring-1 ring-nexus-accent/50' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
                        title={t('library.smart')}
                    >
                        <BrainCircuit size={12} />
                    </button>
                </div>
            </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
             {/* Drop Zone (Only visible when viewing All or Uploads) */}
            {(activeSourceFilter === 'all' || activeSourceFilter === 'default-uploads') && (
                <div 
                    className={`mb-6 p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-nexus-accent bg-nexus-accent/10' : 'border-nexus-border bg-nexus-900/30 hover:bg-nexus-900/50'}`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => { e.preventDefault(); setIsDragging(false); alert(t('library.uploaded')); }}
                >
                    <div className="bg-nexus-800 p-2 rounded-full mb-2">
                        <UploadCloud size={18} className="text-nexus-text-secondary" />
                    </div>
                    <div className="text-nexus-text-primary font-medium text-sm">{t('library.dropMain')}</div>
                    <div className="text-[10px] text-nexus-text-secondary mt-0.5">{t('library.dropSub')}</div>
                </div>
            )}

            {/* Empty State */}
            {Object.keys(groupedFiles).length === 0 && (
                <div className="text-center py-20 opacity-50 flex flex-col items-center">
                    <Folder size={40} className="mb-4 text-nexus-text-secondary"/>
                    <p className="text-nexus-text-secondary text-sm">{t('library.noFiles')}</p>
                </div>
            )}

            {/* File Grid */}
             {Object.entries(groupedFiles).map(([groupName, files]) => (
                <div key={groupName} className="mb-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <h2 className="flex items-center text-[10px] font-bold text-nexus-text-secondary uppercase tracking-wider mb-3 border-b border-nexus-border pb-1.5">
                        {groupMode === 'semantic' && <BrainCircuit size={12} className="mr-2 text-nexus-accent" />}
                        {groupMode === 'time' && <Calendar size={12} className="mr-2 text-blue-500" />}
                        {groupMode === 'type' && <Box size={12} className="mr-2 text-yellow-500" />}
                        {groupName} 
                        <span className="ml-2 text-[10px] bg-nexus-800 text-nexus-text-secondary px-1.5 py-0.5 rounded-full normal-case">{files.length}</span>
                    </h2>

                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3">
                        {files.map(file => (
                            <div key={file.id} className="group bg-nexus-900 border border-nexus-border rounded-lg p-3 hover:border-nexus-accent/50 hover:bg-nexus-800/50 transition-all cursor-pointer flex flex-col justify-between h-28 relative overflow-hidden">
                            
                            {/* Semantic Glow Effect */}
                            {groupMode === 'semantic' && (
                                <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-nexus-accent/10 to-transparent rounded-bl-3xl -mr-6 -mt-6 group-hover:from-nexus-accent/20 transition-all"></div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="p-1.5 bg-nexus-950 rounded border border-nexus-border/50">
                                    {getFileIcon(file.type)}
                                </div>
                                <button className="text-nexus-text-secondary hover:text-nexus-text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreVertical size={12} />
                                </button>
                            </div>
                            
                            <div>
                                <div className="text-nexus-text-primary font-medium text-xs truncate mb-1" title={file.name}>{file.name}</div>
                                <div className="flex items-center justify-between text-[10px] text-nexus-text-secondary font-mono">
                                    <span>{file.size}</span>
                                    <span>{file.lastModified}</span>
                                </div>
                            </div>
                            </div>
                        ))}
                    </div>
                </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default SmartLibrary;