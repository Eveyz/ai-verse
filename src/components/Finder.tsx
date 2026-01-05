import React, { useState } from 'react';
import { Search, FileText, Code, Hash, Clock } from 'lucide-react';
import { MOCK_SEARCH_RESULTS } from '../constants';
import { SearchResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const Finder: React.FC = () => {
  const { t } = useLanguage();
  const [query, setQuery] = useState('');
  
  // Simple filter simulation for the demo
  const results = query ? MOCK_SEARCH_RESULTS : [];

  return (
    <div className="flex flex-col items-center pt-24 h-full bg-nexus-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-nexus-text-primary mb-2">{t('finder.title')}</h1>
            <p className="text-nexus-text-secondary">{t('finder.subtitle')}</p>
        </div>

        <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-nexus-accent to-blue-600 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-200"></div>
            <div className="relative flex items-center bg-nexus-900 rounded-xl border border-nexus-border shadow-2xl">
                <Search className="ml-4 text-nexus-text-secondary" size={24} />
                <input
                    type="text"
                    className="w-full bg-transparent border-none focus:ring-0 text-xl p-4 text-nexus-text-primary placeholder-nexus-text-secondary focus:outline-none"
                    placeholder={t('finder.placeholder')}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    autoFocus
                />
                <div className="mr-4 flex gap-2">
                   <span className="text-xs border border-nexus-border px-1.5 py-0.5 rounded text-nexus-text-secondary font-mono">CMD+K</span>
                </div>
            </div>
        </div>

        {results.length > 0 ? (
          <div className="mt-8 space-y-4">
             <h3 className="text-sm font-medium text-nexus-text-secondary uppercase tracking-wider pl-2">{t('finder.topHits')}</h3>
             {results.map((res: SearchResult) => (
               <div key={res.id} className="bg-nexus-900 border border-nexus-border p-4 rounded-lg hover:border-nexus-accent/50 transition-colors cursor-pointer group">
                  <div className="flex items-start justify-between">
                     <div className="flex items-center gap-2 mb-1">
                        {res.type === 'doc' && <FileText size={16} className="text-blue-500" />}
                        {res.type === 'code' && <Code size={16} className="text-yellow-500" />}
                        <span className="text-nexus-accent font-semibold">{res.title}</span>
                     </div>
                     <span className="text-xs text-nexus-text-secondary bg-nexus-950 px-2 py-1 rounded-full border border-nexus-border">{Math.round(res.score * 100)}% {t('finder.match')}</span>
                  </div>
                  <p className="text-nexus-text-primary text-sm mt-1 font-mono pl-6 border-l-2 border-nexus-border group-hover:border-nexus-accent">
                    {res.snippet}
                  </p>
                  <div className="flex items-center justify-between mt-3 pl-6">
                    <span className="text-xs text-nexus-text-secondary font-mono">{res.path}</span>
                    <span className="text-xs text-nexus-text-secondary flex items-center">
                        <Clock size={12} className="mr-1"/> {res.lastModified}
                    </span>
                  </div>
               </div>
             ))}
          </div>
        ) : (
            query === '' && (
                <div className="mt-12 grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg border border-dashed border-nexus-border bg-nexus-900/30 text-center hover:bg-nexus-900/50 cursor-pointer transition">
                        <Clock className="mx-auto mb-2 text-nexus-text-secondary" size={24} />
                        <div className="text-nexus-text-primary font-medium">{t('finder.recentFiles')}</div>
                        <div className="text-xs text-nexus-text-secondary">{t('finder.recentFilesDesc')}</div>
                    </div>
                    <div className="p-4 rounded-lg border border-dashed border-nexus-border bg-nexus-900/30 text-center hover:bg-nexus-900/50 cursor-pointer transition">
                        <Hash className="mx-auto mb-2 text-nexus-text-secondary" size={24} />
                        <div className="text-nexus-text-primary font-medium">{t('finder.topics')}</div>
                        <div className="text-xs text-nexus-text-secondary">{t('finder.topicsDesc')}</div>
                    </div>
                </div>
            )
        )}
      </div>
    </div>
  );
};

export default Finder;