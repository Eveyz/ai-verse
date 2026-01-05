import React, { useState, useMemo } from 'react';
import { MOCK_TIMELINE_DATA } from '../constants';
import { TimelineEvent, TimelineScope } from '../types';
import { 
  GitCommit, 
  GitMerge, 
  Zap, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Sparkles,
  Calendar,
  History,
  Filter,
  Globe,
  BrainCircuit,
  FileCode
} from 'lucide-react';
import { generateSynthesizedResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const Timeline: React.FC = () => {
  const { t } = useLanguage();
  const [activeScope, setActiveScope] = useState<TimelineScope>('global');
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  // Filter Data based on Active Scope
  const filteredEvents = useMemo(() => {
    if (activeScope === 'global') {
        // Show milestones and major concept changes
        return MOCK_TIMELINE_DATA.filter(e => e.scope === 'global' || e.type === 'milestone');
    }
    if (activeScope === 'concept') {
        // Show concept refinements
        return MOCK_TIMELINE_DATA.filter(e => e.scope === 'concept');
    }
    if (activeScope === 'file') {
        // Show file specific changes
        return MOCK_TIMELINE_DATA.filter(e => e.scope === 'file');
    }
    return MOCK_TIMELINE_DATA;
  }, [activeScope]);

  // Set default selection when scope changes
  React.useEffect(() => {
      if (filteredEvents.length > 0) {
          setSelectedEvent(filteredEvents[0]);
      } else {
          setSelectedEvent(null);
      }
  }, [filteredEvents]);

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return <GitMerge size={18} className="text-nexus-accent" />;
      case 'refinement': return <GitCommit size={18} className="text-blue-500" />;
      case 'emergence': return <Zap size={18} className="text-yellow-500" />;
      case 'contradiction': return <AlertTriangle size={18} className="text-red-500" />;
      default: return <GitCommit size={18} />;
    }
  };

  const generateReport = async () => {
    setIsGeneratingReport(true);
    setReport(null);
    // Simulate generation
    const result = await generateSynthesizedResponse(
        "Generate a monthly evolution report for October", 
        "CONTEXT: Various changes in architecture and optimization."
    );
    setTimeout(() => {
        setReport(`## 🗓️ October Knowledge Synthesis

**Summary**: This month marked a significant shift from pure vector search to a Hybrid Retrieval architecture.

### 📈 Key Evolutions
1. **Architecture Shift**: Moved from HNSW-only to Hybrid (BM25 + HNSW). This was driven by the "System Architecture v2.0" document.
2. **Performance Focus**: A new cluster of notes around "Latency" and "WebWorkers" emerged, indicating a shift from prototyping to productionizing.

### ⚠️ Open Questions
- There is a contradiction between \`prompts.rs\` and \`style_guide.md\` regarding the persona tone.
- The "Graph RAG" concept is new and sparsely populated (only 2 papers).

### 🧠 Suggested Focus for November
- Resolve the persona contradiction.
- Implement the WebWorker offloading for embeddings.
`);
        setIsGeneratingReport(false);
    }, 2000);
  };

  return (
    <div className="flex h-full bg-nexus-950 transition-colors duration-300">
      {/* Left: Filter & Timeline List */}
      <div className="w-1/3 min-w-[340px] border-r border-nexus-border flex flex-col bg-nexus-900/50">
        
        {/* Header Controls */}
        <div className="p-4 bg-nexus-950/95 backdrop-blur z-10 border-b border-nexus-border space-y-4">
          <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-nexus-text-primary">{t('timeline.title')}</h2>
                <p className="text-xs text-nexus-text-secondary">{t('timeline.scopeDesc')}</p>
              </div>
          </div>

          {/* Scope Selector (The Solution to "Messy") */}
          <div className="flex bg-nexus-900 p-1 rounded-lg border border-nexus-border">
             <button 
                onClick={() => setActiveScope('global')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded transition-all ${activeScope === 'global' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
             >
                <Globe size={14} className="mr-2" />
                {t('timeline.views.global')}
             </button>
             <button 
                onClick={() => setActiveScope('concept')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded transition-all ${activeScope === 'concept' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
             >
                <BrainCircuit size={14} className="mr-2" />
                {t('timeline.views.concept')}
             </button>
             <button 
                onClick={() => setActiveScope('file')}
                className={`flex-1 flex items-center justify-center py-2 text-xs font-medium rounded transition-all ${activeScope === 'file' ? 'bg-nexus-800 text-nexus-text-primary shadow' : 'text-nexus-text-secondary hover:text-nexus-text-primary'}`}
             >
                <FileCode size={14} className="mr-2" />
                {t('timeline.views.file')}
             </button>
          </div>

          <button 
            onClick={generateReport}
            disabled={isGeneratingReport}
            className="w-full flex items-center justify-center gap-2 bg-nexus-800 hover:bg-nexus-700 text-white py-2 px-4 rounded-lg border border-nexus-border transition-all"
          >
            {isGeneratingReport ? (
                <Sparkles size={16} className="animate-spin text-nexus-accent" />
            ) : (
                <Calendar size={16} className="text-nexus-accent" />
            )}
            <span className="text-sm font-medium">
                {isGeneratingReport ? t('timeline.generating') : t('timeline.generateReport')}
            </span>
          </button>
        </div>

        {/* Timeline List */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          {/* Vertical Line */}
          <div className="absolute left-9 top-6 bottom-0 w-px bg-nexus-border" />

          {filteredEvents.length === 0 ? (
              <div className="pl-12 text-nexus-text-secondary text-sm italic py-4">
                  No events found for this scope.
              </div>
          ) : (
            filteredEvents.map((event) => (
                <div 
                    key={event.id} 
                    className={`relative pl-10 cursor-pointer group mb-8 ${selectedEvent?.id === event.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    onClick={() => setSelectedEvent(event)}
                >
                {/* Dot / Icon */}
                <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border border-nexus-border flex items-center justify-center z-10 bg-nexus-950 transition-all ${selectedEvent?.id === event.id ? 'ring-2 ring-nexus-accent border-transparent' : ''}`}>
                    {getIcon(event.type)}
                </div>

                <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs font-mono text-nexus-text-secondary bg-nexus-800/50 px-2 py-0.5 rounded">{event.date}</span>
                    {activeScope !== 'global' && event.targetId && (
                        <span className="text-[10px] text-nexus-accent border border-nexus-accent/30 px-1 rounded uppercase">
                            {event.targetId}
                        </span>
                    )}
                </div>
                <h3 className={`text-sm font-semibold mb-1 ${selectedEvent?.id === event.id ? 'text-nexus-text-primary' : 'text-nexus-text-secondary'}`}>
                    {event.title}
                </h3>
                <p className="text-xs text-nexus-text-secondary line-clamp-2">{event.description}</p>
                </div>
            ))
          )}
        </div>
      </div>

      {/* Right: Detail View or Report */}
      <div className="flex-1 overflow-y-auto p-8">
        {report ? (
             <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-nexus-text-primary flex items-center gap-3">
                        <Sparkles className="text-nexus-accent" />
                        {t('timeline.reportTitle')}
                    </h2>
                    <button onClick={() => setReport(null)} className="text-sm text-nexus-text-secondary hover:text-nexus-text-primary">{t('timeline.closeReport')}</button>
                </div>
                <div className="bg-nexus-900 border border-nexus-border rounded-xl p-8 prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans leading-relaxed text-nexus-text-primary">
                        {report}
                    </div>
                </div>
             </div>
        ) : selectedEvent ? (
          <div className="max-w-3xl mx-auto">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-nexus-800 rounded-xl border border-nexus-border">
                    {getIcon(selectedEvent.type)}
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-nexus-text-primary">{selectedEvent.title}</h1>
                    <div className="text-sm text-nexus-text-secondary font-mono mt-1">{t('timeline.eventId')}: {selectedEvent.id} • {selectedEvent.date}</div>
                </div>
             </div>

             <div className="bg-nexus-900 border border-nexus-border rounded-xl p-6 mb-6">
                 <h3 className="text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider mb-4">{t('timeline.description')}</h3>
                 <p className="text-nexus-text-primary leading-relaxed">{selectedEvent.description}</p>
             </div>

            {selectedEvent.diffSummary && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                        <div className="text-xs font-bold text-red-500 mb-2 uppercase">{t('timeline.previously')}</div>
                        <div className="font-mono text-sm dark:text-red-200/80 text-red-600">{selectedEvent.diffSummary.before}</div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <ArrowRight className="text-nexus-text-secondary" />
                    </div>
                    <div className="bg-green-900/10 border border-green-900/30 p-4 rounded-lg -ml-[100%] z-10">
                         <div className="text-xs font-bold text-green-500 mb-2 uppercase">{t('timeline.evolvedTo')}</div>
                        <div className="font-mono text-sm dark:text-green-200/80 text-green-600">{selectedEvent.diffSummary.after}</div>
                    </div>
                </div>
            )}

             <div>
                 <h3 className="text-sm font-semibold text-nexus-text-secondary uppercase tracking-wider mb-3">{t('timeline.impactedFiles')}</h3>
                 <div className="space-y-2">
                     {selectedEvent.relatedFiles.map((file, i) => (
                         <div key={i} className="flex items-center p-3 bg-nexus-900 border border-nexus-border rounded hover:border-nexus-accent/50 transition-colors cursor-pointer">
                             <FileText size={16} className="text-nexus-text-secondary mr-3" />
                             <span className="text-sm text-nexus-text-primary font-mono">{file}</span>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-nexus-text-secondary">
                <History size={48} className="mb-4 opacity-20" />
                <p>{t('timeline.selectEvent')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;