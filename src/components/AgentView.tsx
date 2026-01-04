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
    <div className="flex h-full bg-nexus-950">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full border-r border-nexus-border/0 md:border-r md:border-nexus-border">
            <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'model' ? 'bg-nexus-accent' : 'bg-gray-600'}`}>
                            {msg.role === 'model' ? <Bot size={18} className="text-white" /> : <div className="text-xs font-bold text-white">{t('agent.me')}</div>}
                        </div>
                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                            <div className={`p-4 rounded-2xl ${
                                msg.role === 'user' 
                                ? 'bg-nexus-800 text-white rounded-tr-sm' 
                                : 'bg-nexus-900 border border-nexus-border text-gray-300 rounded-tl-sm shadow-sm'
                            }`}>
                                <div className="prose prose-invert prose-sm whitespace-pre-wrap">
                                    {msg.text}
                                </div>
                            </div>
                            
                            {/* L1 Feature: Source transparency */}
                            {msg.role === 'model' && (
                                <div className="mt-2 flex items-center space-x-2">
                                    <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">{t('agent.sources')}:</span>
                                    <span className="text-xs text-blue-400 hover:underline cursor-pointer bg-blue-400/10 px-2 py-0.5 rounded">architecture_v2.md</span>
                                    <span className="text-xs text-blue-400 hover:underline cursor-pointer bg-blue-400/10 px-2 py-0.5 rounded">optimization.txt</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                
                {isTyping && (
                    <div className="flex gap-4">
                         <div className="w-8 h-8 rounded-full bg-nexus-accent flex items-center justify-center shrink-0 animate-pulse">
                            <Bot size={18} className="text-white" />
                        </div>
                        <div className="flex items-center text-gray-500 text-sm italic">
                            {t('agent.synthesizing')}
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-nexus-border bg-nexus-950">
                <div className="relative">
                    <input
                        className="w-full bg-nexus-900 border border-nexus-border rounded-xl pl-4 pr-12 py-3 text-white focus:ring-1 focus:ring-nexus-accent focus:border-nexus-accent transition-all"
                        placeholder={t('agent.placeholder')}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    />
                    <button 
                        onClick={handleSend}
                        className="absolute right-2 top-2 p-1.5 bg-nexus-accent hover:bg-violet-600 rounded-lg text-white transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>

        {/* L4 Feature: Workflow / Artifact Side Panel */}
        <div className="hidden lg:flex w-[400px] bg-nexus-900 flex-col border-l border-nexus-border">
            <div className="p-4 border-b border-nexus-border flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-200 font-semibold">
                    <Sparkles size={18} className="text-yellow-500" />
                    <span>{t('agent.workflowTitle')}</span>
                </div>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                 <div className="w-16 h-16 bg-nexus-800 rounded-2xl flex items-center justify-center mb-4 border border-nexus-border">
                    <FileText size={32} className="text-nexus-accent" />
                 </div>
                 <h3 className="text-lg font-medium text-white mb-2">{t('agent.synthesisTitle')}</h3>
                 <p className="text-sm text-gray-500 px-8">
                     {t('agent.synthesisDesc')}
                 </p>
                 
                 <div className="mt-8 w-full bg-nexus-950 rounded border border-nexus-border p-4 text-left">
                    <div className="text-xs font-mono text-gray-500 mb-2 border-b border-nexus-border pb-2">{t('agent.draft')}: optimization_plan.md</div>
                    <div className="space-y-2 animate-pulse">
                        <div className="h-2 bg-nexus-800 rounded w-3/4"></div>
                        <div className="h-2 bg-nexus-800 rounded w-full"></div>
                        <div className="h-2 bg-nexus-800 rounded w-5/6"></div>
                    </div>
                 </div>
            </div>
        </div>
    </div>
  );
};

export default AgentView;
