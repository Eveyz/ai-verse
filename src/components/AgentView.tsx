import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, FileText, Sparkles, XCircle } from 'lucide-react';
import { generateSynthesizedResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const AgentView: React.FC = () => {
  const { t } = useLanguage();
  // Using lazy initialization for state so that t() is available
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (!hasInitialized) {
        setMessages([{ id: '1', role: 'model', text: t('agent.initialMessage') }]);
        setHasInitialized(true);
    }
  }, [t, hasInitialized]);

  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate Agent Work
    const responseText = await generateSynthesizedResponse(userMsg.text, "MOCK_CONTEXT");
    
    setIsTyping(false);
    const aiMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: responseText,
        // Mocking an artifact for L4 demo
        artifacts: userMsg.text.toLowerCase().includes('fix') || userMsg.text.toLowerCase().includes('write') ? [
            { title: 'Proposed Changes', type: 'code', content: 'fn optimized_embedding() {\n  // ...\n}' }
        ] : undefined
    };
    setMessages(prev => [...prev, aiMsg]);
  };

  return (
    <div className="flex h-full bg-nexus-950 transition-colors duration-300">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full border-r border-nexus-border/0 md:border-r md:border-nexus-border">
            <div className="flex-1 overflow-y-auto p-4 space-y-5" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${msg.role === 'model' ? 'bg-nexus-accent' : 'bg-gray-600'}`}>
                            {msg.role === 'model' ? <Bot size={14} className="text-white" /> : <div className="text-[10px] font-bold text-white">{t('agent.me')}</div>}
                        </div>
                        <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                msg.role === 'user' 
                                ? 'bg-nexus-800 text-nexus-text-primary rounded-tr-sm' 
                                : 'bg-nexus-900 border border-nexus-border text-nexus-text-primary rounded-tl-sm shadow-sm'
                            }`}>
                                <div className="prose prose-sm prose-invert max-w-none">
                                    <span className="text-nexus-text-primary whitespace-pre-wrap">{msg.text}</span>
                                </div>
                            </div>
                            
                            {/* L1 Feature: Source transparency */}
                            {msg.role === 'model' && (
                                <div className="mt-1.5 flex items-center space-x-1.5 opacity-80 hover:opacity-100 transition-opacity">
                                    <span className="text-[9px] uppercase text-nexus-text-secondary font-bold tracking-wider">{t('agent.sources')}:</span>
                                    <span className="text-[10px] text-blue-400 hover:underline cursor-pointer bg-blue-400/5 px-1.5 py-0.5 rounded border border-blue-400/10">architecture_v2.md</span>
                                    <span className="text-[10px] text-blue-400 hover:underline cursor-pointer bg-blue-400/5 px-1.5 py-0.5 rounded border border-blue-400/10">optimization.txt</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-3">
                         <div className="w-7 h-7 rounded-md bg-nexus-accent flex items-center justify-center shrink-0 animate-pulse mt-0.5">
                            <Bot size={14} className="text-white" />
                        </div>
                        <div className="flex items-center text-nexus-text-secondary text-xs italic mt-1.5">
                            {t('agent.synthesizing')}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-nexus-border bg-nexus-950">
                <div className="relative">
                    <input
                        className="w-full bg-nexus-900 border border-nexus-border rounded-xl pl-4 pr-10 py-2.5 text-sm text-nexus-text-primary focus:ring-1 focus:ring-nexus-accent focus:border-nexus-accent transition-all outline-none"
                        placeholder={t('agent.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 top-2 p-1 bg-nexus-accent hover:bg-violet-600 rounded-lg text-white transition-colors"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>

        {/* L4 Feature: Workflow / Artifact Side Panel */}
        <div className="hidden lg:flex w-[340px] bg-nexus-900 flex-col border-l border-nexus-border transition-colors duration-300">
            <div className="p-3 border-b border-nexus-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-nexus-text-primary font-semibold text-sm">
                    <Sparkles size={14} className="text-yellow-500" />
                    <span>{t('agent.workflowTitle')}</span>
                </div>
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
                 <div className="w-12 h-12 bg-nexus-800 rounded-xl flex items-center justify-center mb-3 border border-nexus-border">
                    <FileText size={24} className="text-nexus-accent" />
                 </div>
                 <h3 className="text-base font-medium text-nexus-text-primary mb-1">{t('agent.synthesisTitle')}</h3>
                 <p className="text-xs text-nexus-text-secondary px-4 leading-relaxed">
                     {t('agent.synthesisDesc')}
                 </p>
                 
                 <div className="mt-6 w-full bg-nexus-950 rounded border border-nexus-border p-3 text-left">
                    <div className="text-[10px] font-mono text-nexus-text-secondary mb-2 border-b border-nexus-border pb-1">{t('agent.draft')}: optimization_plan.md</div>
                    <div className="space-y-1.5 animate-pulse">
                        <div className="h-1.5 bg-nexus-800 rounded w-3/4"></div>
                        <div className="h-1.5 bg-nexus-800 rounded w-full"></div>
                        <div className="h-1.5 bg-nexus-800 rounded w-5/6"></div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default AgentView;