import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Database, FileText, Share2, Layers } from 'lucide-react';

const data = [
  { name: 'Mon', files: 400, chunks: 2400 },
  { name: 'Tue', files: 300, chunks: 1398 },
  { name: 'Wed', files: 200, chunks: 9800 },
  { name: 'Thu', files: 278, chunks: 3908 },
  { name: 'Fri', files: 189, chunks: 4800 },
];

const StatCard = ({ label, value, icon: Icon, color }: any) => (
  <div className="bg-nexus-900 border border-nexus-border p-6 rounded-xl hover:border-nexus-border/80 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
        <Icon className={color} size={24} />
      </div>
      <span className="text-xs text-green-500 font-mono">+12%</span>
    </div>
    <div className="text-2xl font-bold text-white mb-1">{value}</div>
    <div className="text-sm text-gray-500">{label}</div>
  </div>
);

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white">Knowledge Base Overview</h1>
        <p className="text-gray-400 mt-2">Local index status and evolution metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Indexed Files" value="12,403" icon={FileText} color="text-blue-500" />
        <StatCard label="Vector Chunks" value="1.2M" icon={Database} color="text-purple-500" />
        <StatCard label="Semantic Links" value="84,392" icon={Share2} color="text-nexus-accent" />
        <StatCard label="Knowledge Depth" value="L3" icon={Layers} color="text-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-nexus-900 border border-nexus-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Ingestion Velocity</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                 <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="name" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                />
                <Bar dataKey="chunks" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-nexus-900 border border-nexus-border p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
          <div className="space-y-4">
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-400">Vector Store (Local)</span>
                   <span className="text-white">1.2 GB / 50 GB</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-2">
                   <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '4%' }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-400">Memory Usage (Rust Worker)</span>
                   <span className="text-white">450 MB</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-2">
                   <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                </div>
             </div>
             <div>
                <div className="flex justify-between text-sm mb-1">
                   <span className="text-gray-400">Embedding Queue</span>
                   <span className="text-white">Idle</span>
                </div>
                <div className="w-full bg-nexus-950 rounded-full h-2">
                   <div className="bg-gray-700 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
             </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-nexus-border">
             <div className="text-sm font-semibold text-gray-300 mb-2">Active Plugins</div>
             <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-nexus-800 text-xs text-gray-400 rounded border border-nexus-border">Parsers: PDF, MD</span>
                <span className="px-2 py-1 bg-nexus-800 text-xs text-gray-400 rounded border border-nexus-border">Model: Gemini Flash</span>
                <span className="px-2 py-1 bg-nexus-800 text-xs text-gray-400 rounded border border-nexus-border">Graph: Enabled</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
