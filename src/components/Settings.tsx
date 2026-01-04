import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Server, 
  Cpu, 
  Cloud, 
  Download, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  HardDrive,
  Activity,
  Key,
  CreditCard,
  Shield,
  Zap,
  Lock,
  User as UserIcon,
  LogOut,
  Mail,
  ArrowRight,
  Network,
  RefreshCw,
  Link as LinkIcon,
  Globe
} from 'lucide-react';
import { MOCK_MODELS } from '../constants';
import { AIModel, ComputeMode, User, UserSubscription, LocalProvider, Language } from '../types';

interface SettingsProps {
  user: User | null;
  onLogin: (email: string) => void;
  onLogout: () => void;
  onUpdateSubscription: (sub: UserSubscription) => void;
}

const Settings: React.FC<SettingsProps> = ({ user, onLogin, onLogout, onUpdateSubscription }) => {
  const { t, language, setLanguage } = useLanguage();
  const [computeMode, setComputeMode] = useState<ComputeMode>('local');
  const [localProvider, setLocalProvider] = useState<LocalProvider>('native');
  
  // Endpoint State
  const [endpointUrl, setEndpointUrl] = useState('http://localhost:11434');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  
  const [models, setModels] = useState<AIModel[]>(MOCK_MODELS);
  const [externalModels, setExternalModels] = useState<AIModel[]>([]);
  
  // Simulate active model selection
  const [selectedLocalLLM, setSelectedLocalLLM] = useState<string>('l1');
  const [selectedLocalEmbed, setSelectedLocalEmbed] = useState<string>('e1');
  const [selectedCloudLLM, setSelectedCloudLLM] = useState<string>('c1');
  const [selectedExternalLLM, setSelectedExternalLLM] = useState<string>('');

  // Login Form State
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleDownload = (id: string) => {
    // Start simulation
    setModels(prev => prev.map(m => m.id === id ? { ...m, status: 'downloading', downloadProgress: 0 } : m));
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setModels(prev => prev.map(m => {
        if (m.id === id) {
          if (progress >= 100) {
             clearInterval(interval);
             return { ...m, status: 'downloaded', downloadProgress: 100 };
          }
          return { ...m, downloadProgress: progress };
        }
        return m;
      }));
    }, 300);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this model file?')) {
      setModels(prev => prev.map(m => m.id === id ? { ...m, status: 'not_downloaded', downloadProgress: 0 } : m));
    }
  };

  const handleConnectEndpoint = () => {
      setIsConnecting(true);
      setConnectionStatus('disconnected');
      
      // Simulate API Call
      setTimeout(() => {
          setIsConnecting(false);
          setConnectionStatus('connected');
          setExternalModels([
              { id: 'ollama-1', name: 'llama3:latest', provider: 'Ollama', family: 'LLM', description: 'Meta Llama 3 via Ollama', status: 'active', requiresKey: false, size: 'External' },
              { id: 'ollama-2', name: 'mistral:instruct', provider: 'Ollama', family: 'LLM', description: 'Mistral Instruct via Ollama', status: 'active', requiresKey: false, size: 'External' },
              { id: 'ollama-3', name: 'nomic-embed-text', provider: 'Ollama', family: 'Embedding', description: 'Nomic Embeddings via Ollama', status: 'active', requiresKey: false, size: 'External' },
          ]);
          setSelectedExternalLLM('ollama-1');
      }, 1500);
  };

  const handleRenew = (plan: 'pro' | 'enterprise') => {
      const today = new Date();
      const nextMonth = new Date(today.setMonth(today.getMonth() + 1));
      onUpdateSubscription({
          status: 'active',
          plan: plan,
          expiryDate: nextMonth.toISOString().split('T')[0]
      });
      alert(`Successfully subscribed to ${plan.toUpperCase()} plan!`);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if(emailInput) {
          onLogin(emailInput);
      }
  };

  const getDiskUsage = () => {
    return models
        .filter(m => m.provider === 'Local' && (m.status === 'downloaded' || m.status === 'active'))
        .reduce((acc, m) => {
            const size = parseFloat(m.size?.split(' ')[0] || '0');
            const unit = m.size?.split(' ')[1] || 'MB';
            return acc + (unit === 'GB' ? size * 1024 : size);
        }, 0);
  };

  const formatSize = (mb: number) => {
      if (mb > 1024) return `${(mb/1024).toFixed(2)} GB`;
      return `${mb.toFixed(0)} MB`;
  };

  return (
    <div className="max-w-5xl mx-auto p-8 h-full overflow-y-auto">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('settings.title')}</h1>
          <p className="text-gray-400">{t('settings.subtitle')}</p>
        </div>
        
        {/* Language Switcher */}
        <div className="flex items-center gap-2 bg-nexus-900 border border-nexus-border rounded-lg p-1">
            <Globe size={16} className="ml-2 text-gray-500" />
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as Language)}
                className="bg-transparent text-sm text-white p-2 outline-none cursor-pointer"
            >
                <option value="en">English</option>
                <option value="zh">中文 (简体)</option>
            </select>
        </div>
      </div>

      {/* ACCOUNT SECTION */}
      <div className="mb-10 animate-in fade-in slide-in-from-top-2 duration-500">
         <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <UserIcon size={16} /> {t('settings.account')}
         </h2>
         
         {!user ? (
             <div className="bg-nexus-900 border border-nexus-border rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center">
                 <div className="flex-1">
                     <h3 className="text-2xl font-bold text-white mb-2">{t('settings.signInTitle')}</h3>
                     <p className="text-gray-400 mb-6">{t('settings.signInDesc')}</p>
                     <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-md">
                         <div>
                             <label className="block text-xs text-gray-500 mb-1">{t('settings.email')}</label>
                             <div className="relative">
                                 <Mail size={16} className="absolute left-3 top-3 text-gray-500" />
                                 <input 
                                    type="email" 
                                    required
                                    className="w-full bg-nexus-950 border border-nexus-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-nexus-accent outline-none transition-colors"
                                    placeholder="you@company.com"
                                    value={emailInput}
                                    onChange={(e) => setEmailInput(e.target.value)}
                                 />
                             </div>
                         </div>
                         <div>
                             <label className="block text-xs text-gray-500 mb-1">{t('settings.password')}</label>
                             <div className="relative">
                                 <Lock size={16} className="absolute left-3 top-3 text-gray-500" />
                                 <input 
                                    type="password" 
                                    required
                                    className="w-full bg-nexus-950 border border-nexus-border rounded-lg py-2.5 pl-10 pr-4 text-white focus:border-nexus-accent outline-none transition-colors"
                                    placeholder="••••••••"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                 />
                             </div>
                         </div>
                         <button type="submit" className="w-full bg-nexus-accent hover:bg-violet-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                             {t('nav.signIn')} <ArrowRight size={16} />
                         </button>
                     </form>
                 </div>
                 <div className="hidden md:block w-px h-48 bg-nexus-border"></div>
                 <div className="flex-1 text-center md:text-left">
                     <Shield size={48} className="text-nexus-accent mb-4 mx-auto md:mx-0" />
                     <h4 className="text-lg font-bold text-white mb-2">{t('settings.privacyTitle')}</h4>
                     <p className="text-sm text-gray-400">
                         {t('settings.privacyDesc')}
                     </p>
                 </div>
             </div>
         ) : (
             <div className="bg-nexus-900 border border-nexus-border rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div className="flex items-center gap-4">
                     <div className="w-16 h-16 rounded-full bg-nexus-accent/20 text-nexus-accent border border-nexus-accent/50 flex items-center justify-center text-xl font-bold">
                         {user.avatar || user.name.charAt(0)}
                     </div>
                     <div>
                         <h3 className="text-xl font-bold text-white">{user.name}</h3>
                         <div className="text-gray-400">{user.email}</div>
                         <div className="mt-2 flex items-center gap-2">
                             <span className="text-xs bg-nexus-950 border border-nexus-border px-2 py-0.5 rounded text-gray-300">
                                 ID: {user.id}
                             </span>
                             {user.subscription.status === 'active' ? (
                                 <span className="text-xs bg-green-900/30 text-green-400 border border-green-900/50 px-2 py-0.5 rounded flex items-center">
                                     <Zap size={10} className="mr-1" /> {t('settings.planActive')}
                                 </span>
                             ) : (
                                 <span className="text-xs bg-red-900/30 text-red-400 border border-red-900/50 px-2 py-0.5 rounded flex items-center">
                                     <AlertCircle size={10} className="mr-1" /> {t('settings.planExpired')}
                                 </span>
                             )}
                         </div>
                     </div>
                 </div>
                 <div className="flex gap-3">
                     <button className="px-4 py-2 bg-nexus-950 border border-nexus-border text-gray-300 rounded-lg hover:bg-nexus-800 transition-colors">
                         {t('settings.billing')}
                     </button>
                     <button 
                        onClick={onLogout}
                        className="px-4 py-2 bg-red-900/10 border border-red-900/30 text-red-400 rounded-lg hover:bg-red-900/30 transition-colors flex items-center gap-2"
                     >
                         <LogOut size={16} /> {t('settings.signOut')}
                     </button>
                 </div>
             </div>
         )}
      </div>

      <div className="w-full h-px bg-nexus-border mb-10"></div>

      {/* ENGINE CONFIGURATION */}
      <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
        <Cpu size={16} /> {t('settings.inferenceEngine')}
      </h2>

      {/* Mode Switcher */}
      <div className="bg-nexus-900 border border-nexus-border rounded-xl p-1 mb-8 flex">
        <button 
            onClick={() => setComputeMode('local')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg transition-all ${computeMode === 'local' ? 'bg-nexus-800 shadow text-white' : 'text-gray-500 hover:text-gray-300'}`}
        >
            <Cpu size={20} className={computeMode === 'local' ? 'text-nexus-accent' : ''} />
            <div className="text-left">
                <div className="font-bold">{t('settings.localMode')}</div>
                <div className="text-xs opacity-70">{t('settings.localModeDesc')}</div>
            </div>
        </button>
        <button 
            onClick={() => {
                if(!user) {
                    alert("Please sign in to access Cloud Mode.");
                    return;
                }
                setComputeMode('cloud');
            }}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-lg transition-all ${computeMode === 'cloud' ? 'bg-nexus-800 shadow text-white' : 'text-gray-500 hover:text-gray-300'} ${!user ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            <Cloud size={20} className={computeMode === 'cloud' ? 'text-blue-400' : ''} />
             <div className="text-left">
                <div className="font-bold flex items-center gap-2">
                    {t('settings.cloudMode')}
                    {!user && <Lock size={12} />}
                </div>
                <div className="text-xs opacity-70">{t('settings.cloudModeDesc')}</div>
            </div>
        </button>
      </div>

      {/* LOCAL SETTINGS */}
      {computeMode === 'local' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
             
             {/* Sub-tabs for Local Mode */}
             <div className="flex border-b border-nexus-border mb-6">
                <button 
                   onClick={() => setLocalProvider('native')}
                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${localProvider === 'native' ? 'border-nexus-accent text-nexus-accent' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                   <span className="flex items-center gap-2"><HardDrive size={14}/> {t('settings.builtinEngine')}</span>
                </button>
                <button 
                   onClick={() => setLocalProvider('ollama')}
                   className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${localProvider === 'ollama' ? 'border-nexus-accent text-nexus-accent' : 'border-transparent text-gray-500 hover:text-gray-300'}`}
                >
                   <span className="flex items-center gap-2"><Network size={14}/> {t('settings.externalEndpoint')}</span>
                </button>
             </div>

             {/* NATIVE (Built-in) */}
             {localProvider === 'native' && (
                <>
                    {/* Disk Stats */}
                    <div className="bg-nexus-900 border border-nexus-border rounded-xl p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-nexus-800 rounded-lg">
                                <HardDrive size={24} className="text-nexus-accent" />
                            </div>
                            <div>
                                <div className="text-white font-semibold">{t('settings.localStorage')}</div>
                                <div className="text-sm text-gray-500">{t('settings.using')} {formatSize(getDiskUsage())} {t('settings.available')}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{t('settings.recommended')}</div>
                            <div className="text-sm text-gray-300">16GB RAM + GPU (Metal/CUDA)</div>
                        </div>
                    </div>

                    {/* LLM Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Activity size={16} /> {t('settings.llm')}
                        </h3>
                        <div className="space-y-3">
                            {models.filter(m => m.provider === 'Local' && m.family === 'LLM').map(model => (
                                <ModelRow 
                                    key={model.id} 
                                    model={model} 
                                    isActive={selectedLocalLLM === model.id}
                                    onSelect={() => setSelectedLocalLLM(model.id)}
                                    onDownload={() => handleDownload(model.id)}
                                    onDelete={() => handleDelete(model.id)}
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Embeddings Section */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Server size={16} /> {t('settings.embedding')}
                        </h3>
                        <div className="space-y-3">
                            {models.filter(m => m.provider === 'Local' && m.family === 'Embedding').map(model => (
                                <ModelRow 
                                    key={model.id} 
                                    model={model} 
                                    isActive={selectedLocalEmbed === model.id}
                                    onSelect={() => setSelectedLocalEmbed(model.id)}
                                    onDownload={() => handleDownload(model.id)}
                                    onDelete={() => handleDelete(model.id)}
                                    t={t}
                                />
                            ))}
                        </div>
                    </div>
                </>
             )}

             {/* EXTERNAL (Ollama) */}
             {localProvider === 'ollama' && (
                 <div className="space-y-6">
                     <div className="bg-nexus-900 border border-nexus-border rounded-xl p-6">
                         <div className="flex items-start justify-between">
                             <div>
                                 <h3 className="text-lg font-bold text-white mb-1">{t('settings.customEndpoint')}</h3>
                                 <p className="text-sm text-gray-400">{t('settings.customEndpointDesc')}</p>
                             </div>
                             <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-2 ${connectionStatus === 'connected' ? 'bg-green-900/30 text-green-400 border-green-900/50' : 'bg-gray-800 text-gray-500 border-gray-700'}`}>
                                 <div className={`w-2 h-2 rounded-full ${connectionStatus === 'connected' ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                                 {connectionStatus === 'connected' ? 'Online' : 'Disconnected'}
                             </div>
                         </div>

                         <div className="mt-6 flex gap-4">
                             <div className="flex-1 relative">
                                 <LinkIcon size={16} className="absolute left-3 top-3 text-gray-500" />
                                 <input 
                                     type="text" 
                                     value={endpointUrl}
                                     onChange={(e) => setEndpointUrl(e.target.value)}
                                     className="w-full bg-nexus-950 border border-nexus-border rounded-lg pl-10 pr-4 py-2.5 text-white focus:border-nexus-accent outline-none font-mono text-sm"
                                 />
                             </div>
                             <button 
                                 onClick={handleConnectEndpoint}
                                 disabled={isConnecting}
                                 className="px-6 py-2 bg-nexus-800 hover:bg-nexus-700 text-white rounded-lg border border-nexus-border transition-colors flex items-center gap-2 disabled:opacity-50"
                             >
                                 {isConnecting ? <RefreshCw className="animate-spin" size={16}/> : <RefreshCw size={16}/>}
                                 {isConnecting ? 'Checking...' : t('settings.connectScan')}
                             </button>
                         </div>
                     </div>

                     {connectionStatus === 'connected' && (
                         <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                             <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Network size={16} /> {t('settings.discoveredModels')}
                             </h3>
                             <div className="space-y-3">
                                 {externalModels.length === 0 ? (
                                     <div className="text-gray-500 italic p-4 text-center">{t('settings.noModels')}</div>
                                 ) : (
                                     externalModels.map(model => (
                                        <div key={model.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${selectedExternalLLM === model.id ? 'bg-nexus-800 border-nexus-accent shadow-lg shadow-nexus-accent/10' : 'bg-nexus-900 border-nexus-border hover:border-gray-600'}`}>
                                            <div className="flex items-center gap-4">
                                                <div 
                                                    onClick={() => setSelectedExternalLLM(model.id)}
                                                    className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${selectedExternalLLM === model.id ? 'border-nexus-accent bg-nexus-accent' : 'border-gray-600 bg-transparent'}`}
                                                >
                                                    {selectedExternalLLM === model.id && <div className="w-2 h-2 rounded-full bg-white" />}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`font-semibold ${selectedExternalLLM === model.id ? 'text-white' : 'text-gray-300'}`}>{model.name}</span>
                                                        <span className="text-xs text-blue-400 bg-blue-900/20 px-1.5 py-0.5 rounded border border-blue-900/30">{model.provider}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">{model.description}</div>
                                                </div>
                                            </div>
                                            <div className="text-green-500 text-xs flex items-center">
                                                <CheckCircle size={14} className="mr-1"/> {t('settings.ready')}
                                            </div>
                                        </div>
                                     ))
                                 )}
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>
      )}

      {/* CLOUD SETTINGS */}
      {computeMode === 'cloud' && user && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Subscription Banner */}
            {user.subscription.status === 'active' ? (
                <div className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 p-6 rounded-xl flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <Shield className="text-green-400" size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{t('settings.planActive')}</h3>
                            <p className="text-green-200/70 text-sm">Valid until {user.subscription.expiryDate}</p>
                        </div>
                     </div>
                     <button className="px-4 py-2 bg-nexus-900 border border-nexus-border rounded-lg text-sm text-gray-300 hover:text-white transition-colors">
                        Manage Billing
                     </button>
                </div>
            ) : (
                <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-xl animate-pulse">
                     <div className="flex items-center gap-4 mb-2">
                        <AlertCircle className="text-red-500" size={24} />
                        <h3 className="text-xl font-bold text-red-100">{t('settings.planExpired')}</h3>
                     </div>
                     <p className="text-red-200/70 mb-4 ml-10">Your Cloud Mode access expired on {user.subscription.expiryDate}. Renew now to regain access to premium models.</p>
                     
                     {/* Pricing Table */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10 mt-6">
                        {/* Pro Plan */}
                        <div className="bg-nexus-950 border border-nexus-border p-4 rounded-xl relative overflow-hidden group hover:border-nexus-accent transition-all">
                            <div className="absolute top-0 right-0 bg-nexus-accent text-white text-[10px] font-bold px-2 py-1 rounded-bl">{t('settings.popular')}</div>
                            <h4 className="text-lg font-bold text-white mb-1">{t('settings.proPlan')}</h4>
                            <div className="text-2xl font-bold text-white mb-4">$20<span className="text-sm text-gray-500 font-normal">{t('settings.month')}</span></div>
                            <ul className="text-sm text-gray-400 space-y-2 mb-6">
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-nexus-accent"/> Access to Gemini Pro</li>
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-nexus-accent"/> Unlimited Cloud Embeddings</li>
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-nexus-accent"/> Priority Support</li>
                            </ul>
                            <button 
                                onClick={() => handleRenew('pro')}
                                className="w-full py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Zap size={16} /> {t('settings.renew')}
                            </button>
                        </div>

                        {/* Enterprise Plan */}
                         <div className="bg-nexus-950 border border-nexus-border p-4 rounded-xl group hover:border-blue-400 transition-all">
                            <h4 className="text-lg font-bold text-white mb-1">{t('settings.enterprisePlan')}</h4>
                            <div className="text-2xl font-bold text-white mb-4">$50<span className="text-sm text-gray-500 font-normal">{t('settings.month')}</span></div>
                             <ul className="text-sm text-gray-400 space-y-2 mb-6">
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-blue-400"/> All Pro Features</li>
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-blue-400"/> GPT-4o Access</li>
                                <li className="flex items-center"><CheckCircle size={12} className="mr-2 text-blue-400"/> Team Collaboration</li>
                            </ul>
                            <button 
                                onClick={() => handleRenew('enterprise')}
                                className="w-full py-2 bg-nexus-800 text-white font-bold rounded-lg hover:bg-nexus-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <CreditCard size={16} /> {t('settings.renew')}
                            </button>
                        </div>
                     </div>
                </div>
            )}

            <div className={`bg-nexus-900 border border-nexus-border rounded-xl p-6 transition-opacity ${user.subscription.status !== 'active' ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-white">{t('settings.modelConfig')}</h3>
                    {user.subscription.status !== 'active' && <Lock className="text-gray-500" />}
                </div>
                
                <div className="space-y-6">
                    {/* Google */}
                    <div className="p-4 bg-nexus-950 border border-nexus-border rounded-lg">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">Google Gemini</span>
                                <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded border border-green-900/50">Connected</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">{t('settings.chatModel')}</label>
                                <select 
                                    className="w-full bg-nexus-900 border border-nexus-border rounded p-2 text-sm text-white focus:border-nexus-accent outline-none"
                                    value={selectedCloudLLM}
                                    onChange={(e) => setSelectedCloudLLM(e.target.value)}
                                >
                                    {models.filter(m => m.provider === 'Google' && m.family === 'LLM').map(m => (
                                        <option key={m.id} value={m.id}>{m.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-gray-500 mb-1">{t('settings.apiKey')}</label>
                                <div className="relative">
                                    <input type="password" value="************************" disabled className="w-full bg-nexus-900 border border-nexus-border rounded p-2 text-sm text-gray-500" />
                                    <Key size={14} className="absolute right-3 top-3 text-gray-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* OpenAI */}
                     <div className="p-4 bg-nexus-950 border border-nexus-border rounded-lg opacity-60">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-gray-400">OpenAI</span>
                                <span className="text-xs bg-gray-800 text-gray-500 px-2 py-0.5 rounded">Not Configured</span>
                            </div>
                            <button className="text-xs text-nexus-accent hover:underline">Setup Key</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

// Helper Subcomponent for List Rows
const ModelRow: React.FC<{ 
    model: AIModel, 
    isActive: boolean, 
    onSelect: () => void,
    onDownload: () => void,
    onDelete: () => void,
    t: (key: string) => string
}> = ({ model, isActive, onSelect, onDownload, onDelete, t }) => {
    const isDownloaded = model.status === 'downloaded' || model.status === 'active';
    const isDownloading = model.status === 'downloading';

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isActive ? 'bg-nexus-800 border-nexus-accent shadow-lg shadow-nexus-accent/10' : 'bg-nexus-900 border-nexus-border hover:border-gray-600'}`}>
            <div className="flex items-center gap-4">
                <div 
                    onClick={isDownloaded ? onSelect : undefined}
                    className={`w-5 h-5 rounded-full border flex items-center justify-center cursor-pointer ${isActive ? 'border-nexus-accent bg-nexus-accent' : 'border-gray-600 bg-transparent'}`}
                >
                    {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
                
                <div>
                    <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>{model.name}</span>
                        <span className="text-xs text-gray-500 bg-nexus-950 px-1.5 py-0.5 rounded border border-nexus-border">{model.size}</span>
                        {model.paramCount && <span className="text-xs text-gray-500 bg-nexus-950 px-1.5 py-0.5 rounded border border-nexus-border">{model.paramCount}</span>}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{model.description}</div>
                    
                    {/* Progress Bar */}
                    {isDownloading && (
                         <div className="mt-2 w-48 h-1.5 bg-nexus-950 rounded-full overflow-hidden">
                             <div className="h-full bg-nexus-accent transition-all duration-300" style={{ width: `${model.downloadProgress}%` }}></div>
                         </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                {isDownloading ? (
                    <span className="text-xs font-mono text-nexus-accent animate-pulse">{model.downloadProgress}%</span>
                ) : isDownloaded ? (
                    <>
                        <div className="flex items-center text-xs text-green-500">
                             <CheckCircle size={14} className="mr-1" />
                             {t('settings.ready')}
                        </div>
                        <button onClick={onDelete} className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors" title="Delete Model">
                            <Trash2 size={16} />
                        </button>
                    </>
                ) : (
                    <button 
                        onClick={onDownload}
                        className="flex items-center gap-2 px-3 py-1.5 bg-nexus-800 hover:bg-nexus-700 text-gray-200 text-xs rounded border border-nexus-border transition-all"
                    >
                        <Download size={14} />
                        {t('settings.download')}
                    </button>
                )}
            </div>
        </div>
    );
}

export default Settings;
