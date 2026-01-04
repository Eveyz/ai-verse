import React, { useState } from 'react';
import { MOCK_TIMELINE_DATA } from '../constants';
import { TimelineEvent } from '../types';
import { 
  GitCommit, 
  GitMerge, 
  Zap, 
  AlertTriangle, 
  FileText, 
  ArrowRight,
  Sparkles,
  Calendar,
  History
} from 'lucide-react';
import { generateSynthesizedResponse } from '../services/geminiService';
import { useLanguage } from '../contexts/LanguageContext';

const Timeline: React.FC = () => {
  const { t } = useLanguage();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(MOCK_TIMELINE_DATA[0]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [report, setReport] = useState<string | null>(null);

  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'milestone': return <GitMerge size={18} className="text-nexus-accent" />;
      case 'refinement': return <GitCommit size={18} className="text-blue-400" />;
      case 'emergence': return <Zap size={18} className="text-yellow-400" />;
      case 'contradiction': return <AlertTriangle size={18} className="text-red-400" />;
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
    // Hardcoding a specific structured output for the demo effect to match the "Monthly Summary" request
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
    <div className="flex h-full bg-nexus-950">
      {/* Left: Timeline List */}
      <div className="w-1/3 min-w-[320px] border-r border-nexus-border overflow-y-auto bg-nexus-900/50">
        <div className="p-6 sticky top-0 bg-nexus-950/95 backdrop-blur z-10 border-b border-nexus-border">
          <h2 className="text-xl font-bold text-white mb-1">{t('timeline.title')}</h2>
          <p className="text-sm text-gray-500 mb-4">{t('timeline.subtitle')}</p>
          
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

        <div className="p-6 space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-9 top-6 bottom-0 w-px bg-nexus-border" />

          {MOCK_TIMELINE_DATA.map((event) => (
            <div 
                key={event.id} 
                className={`relative pl-10 cursor-pointer group ${selectedEvent?.id === event.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                onClick={() => setSelectedEvent(event)}
            >
              {/* Dot / Icon */}
              <div className={`absolute left-0 top-1 w-8 h-8 rounded-full border border-nexus-border flex items-center justify-center z-10 bg-nexus-950 transition-all ${selectedEvent?.id === event.id ? 'ring-2 ring-nexus-accent border-transparent' : ''}`}>
                {getIcon(event.type)}
              </div>

              <div className="mb-1">
                <span className="text-xs font-mono text-gray-500 bg-nexus-800/50 px-2 py-0.5 rounded">{event.date}</span>
              </div>
              <h3 className={`text-sm font-semibold mb-1 ${selectedEvent?.id === event.id ? 'text-white' : 'text-gray-300'}`}>
                {event.title}
              </h3>
              <p className="text-xs text-gray-500 line-clamp-2">{event.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Detail View or Report */}
      <div className="flex-1 overflow-y-auto p-8">
        {report ? (
             <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <Sparkles className="text-nexus-accent" />
                        {t('timeline.reportTitle')}
                    </h2>
                    <button onClick={() => setReport(null)} className="text-sm text-gray-500 hover:text-white">{t('timeline.closeReport')}</button>
                </div>
                <div className="bg-nexus-900 border border-nexus-border rounded-xl p-8 prose prose-invert max-w-none">
                    <div className="whitespace-pre-wrap font-sans leading-relaxed">
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
                    <h1 className="text-2xl font-bold text-white">{selectedEvent.title}</h1>
                    <div className="text-sm text-gray-500 font-mono mt-1">{t('timeline.eventId')}: {selectedEvent.id} • {selectedEvent.date}</div>
                </div>
             </div>

             <div className="bg-nexus-900 border border-nexus-border rounded-xl p-6 mb-6">
                 <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">{t('timeline.description')}</h3>
                 <p className="text-gray-200 leading-relaxed">{selectedEvent.description}</p>
             </div>

            {selectedEvent.diffSummary && (
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-red-900/10 border border-red-900/30 p-4 rounded-lg">
                        <div className="text-xs font-bold text-red-400 mb-2 uppercase">{t('timeline.previously')}</div>
                        <div className="font-mono text-sm text-red-200/80">{selectedEvent.diffSummary.before}</div>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <ArrowRight className="text-gray-600" />
                    </div>
                    <div className="bg-green-900/10 border border-green-900/30 p-4 rounded-lg -ml-[100%] z-10">
                         <div className="text-xs font-bold text-green-400 mb-2 uppercase">{t('timeline.evolvedTo')}</div>
                        <div className="font-mono text-sm text-green-200/80">{selectedEvent.diffSummary.after}</div>
                    </div>
                </div>
            )}

             <div>
                 <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">{t('timeline.impactedFiles')}</h3>
                 <div className="space-y-2">
                     {selectedEvent.relatedFiles.map((file, i) => (
                         <div key={i} className="flex items-center p-3 bg-nexus-900 border border-nexus-border rounded hover:border-nexus-accent/50 transition-colors cursor-pointer">
                             <FileText size={16} className="text-gray-500 mr-3" />
                             <span className="text-sm text-gray-300 font-mono">{file}</span>
                         </div>
                     ))}
                 </div>
             </div>
          </div>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
                <History size={48} className="mb-4 opacity-20" />
                <p>{t('timeline.selectEvent')}</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Timeline;
