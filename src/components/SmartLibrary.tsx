import React, { useState, useMemo } from 'react';
import { MOCK_LIBRARY_FILES } from '../constants';
import { LibraryFile } from '../types';
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
  FolderOpen
} from 'lucide-react';

type GroupMode = 'none' | 'type' | 'time' | 'semantic';

const SmartLibrary: React.FC = () => {
  const [groupMode, setGroupMode] = useState<GroupMode>('semantic');
  const [isDragging, setIsDragging] = useState(false);

  const getFileIcon = (type: LibraryFile['type']) => {
    switch (type) {
      case 'code': return <Code size={20} className="text-yellow-400" />;
      case 'md': return <FileText size={20} className="text-blue-400" />;
      case 'pdf': return <FileText size={20} className="text-red-400" />;
      case 'img': return <Image size={20} className="text-purple-400" />;
      case 'sheet': return <Table size={20} className="text-green-400" />;
      default: return <File size={20} className="text-gray-400" />;
    }
  };

  const groupedFiles = useMemo(() => {
    const groups: Record<string, LibraryFile[]> = {};

    MOCK_LIBRARY_FILES.forEach(file => {
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
  }, [groupMode]);

  return (
    <div className="flex flex-col h-full bg-nexus-950">
      {/* Header & Controls */}
      <div className="p-8 border-b border-nexus-border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Smart Library</h1>
          <p className="text-gray-400 text-sm">Dump your files here. We organize them for you.</p>
        </div>

        <div className="flex bg-nexus-900 p-1 rounded-lg border border-nexus-border">
          <button 
            onClick={() => setGroupMode('none')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all ${groupMode === 'none' ? 'bg-nexus-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Grid size={14} className="mr-2" />
            Grid
          </button>
          <button 
            onClick={() => setGroupMode('type')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all ${groupMode === 'type' ? 'bg-nexus-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Box size={14} className="mr-2" />
            Type
          </button>
          <button 
            onClick={() => setGroupMode('time')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all ${groupMode === 'time' ? 'bg-nexus-800 text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Calendar size={14} className="mr-2" />
            Time
          </button>
          <button 
            onClick={() => setGroupMode('semantic')}
            className={`flex items-center px-3 py-1.5 rounded-md text-sm transition-all ${groupMode === 'semantic' ? 'bg-nexus-accent/20 text-nexus-accent shadow ring-1 ring-nexus-accent/50' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <BrainCircuit size={14} className="mr-2" />
            Smart
          </button>
        </div>
      </div>

      {/* Drop Zone Area */}
      <div 
        className={`m-8 mb-0 p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-all duration-300 cursor-pointer ${isDragging ? 'border-nexus-accent bg-nexus-accent/10' : 'border-nexus-border bg-nexus-900/30 hover:bg-nexus-900/50'}`}
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => { e.preventDefault(); setIsDragging(false); alert("Demo: Files 'uploaded' successfully!"); }}
      >
        <div className="bg-nexus-800 p-3 rounded-full mb-3">
            <UploadCloud size={24} className="text-gray-300" />
        </div>
        <div className="text-gray-300 font-medium">Drop files to auto-index</div>
        <div className="text-xs text-gray-500 mt-1">Supports PDF, MD, Code, Images</div>
      </div>

      {/* Content Grid */}
      <div className="flex-1 overflow-y-auto p-8">
        {Object.entries(groupedFiles).map(([groupName, files]) => (
          <div key={groupName} className="mb-8">
            <h2 className="flex items-center text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-nexus-border pb-2">
              {groupMode === 'semantic' && <BrainCircuit size={14} className="mr-2 text-nexus-accent" />}
              {groupMode === 'time' && <Calendar size={14} className="mr-2 text-blue-400" />}
              {groupMode === 'type' && <Box size={14} className="mr-2 text-yellow-400" />}
              {groupName} 
              <span className="ml-2 text-xs bg-nexus-800 text-gray-500 px-1.5 py-0.5 rounded-full normal-case">{files.length}</span>
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {files.map(file => (
                <div key={file.id} className="group bg-nexus-900 border border-nexus-border rounded-lg p-4 hover:border-nexus-accent/50 hover:bg-nexus-800/50 transition-all cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden">
                  
                  {/* Semantic Glow Effect */}
                  {groupMode === 'semantic' && (
                     <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-nexus-accent/10 to-transparent rounded-bl-3xl -mr-8 -mt-8 group-hover:from-nexus-accent/20 transition-all"></div>
                  )}

                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-nexus-950 rounded border border-nexus-border/50">
                        {getFileIcon(file.type)}
                    </div>
                    {/* Badge for Semantic Mode */}
                    {groupMode !== 'semantic' && (
                         <span className="text-[10px] text-gray-600 border border-nexus-border px-1 rounded">{file.type}</span>
                    )}
                  </div>
                  
                  <div>
                    <div className="text-gray-200 font-medium text-sm truncate mb-1" title={file.name}>{file.name}</div>
                    <div className="flex items-center justify-between text-[10px] text-gray-500 font-mono">
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
  );
};

export default SmartLibrary;
