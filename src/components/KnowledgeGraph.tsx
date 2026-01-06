import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { GraphData, Node, Link, DataSource } from '../types';
import { MOCK_DATA_SOURCES } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Database, 
  Folder, 
  UploadCloud, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  PauseCircle,
  Filter,
  Maximize2
} from 'lucide-react';

interface KnowledgeGraphProps {
  data: GraphData;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const { t } = useLanguage();
  const { currentTheme } = useTheme();
  
  // Layout & Data State
  const [activeSourceFilter, setActiveSourceFilter] = useState<string | 'all'>('all');
  const [dataSources] = useState<DataSource[]>(MOCK_DATA_SOURCES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  // D3 Refs
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Filter Data Logic
  const filteredData = useMemo(() => {
    // 1. Filter Nodes
    const filteredNodes = data.nodes.filter(node => {
        if (activeSourceFilter === 'all') return true;
        return node.sourceId === activeSourceFilter;
    });

    // 2. Filter Links (Only keep links where both source and target exist in filteredNodes)
    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = data.links.filter(link => {
        // Handle both string IDs (initial) and object references (after D3 simulation runs once)
        const sourceId = typeof link.source === 'object' ? (link.source as any).id : link.source;
        const targetId = typeof link.target === 'object' ? (link.target as any).id : link.target;
        return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    // 3. Deep copy to prevent D3 mutation issues when switching views
    return {
        nodes: filteredNodes.map(n => ({ ...n })),
        links: filteredLinks.map(l => ({ ...l }))
    };
  }, [data, activeSourceFilter]);

  const activeSourceName = activeSourceFilter === 'all' 
    ? t('library.allSources') 
    : dataSources.find(s => s.id === activeSourceFilter)?.name || 'Unknown';


  // D3 Rendering Effect
  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    // Resolve CSS variables
    const style = getComputedStyle(document.documentElement);
    const borderColor = style.getPropertyValue('--color-nexus-border').trim() || '#3f3f46';
    const textColor = style.getPropertyValue('--color-nexus-text-secondary').trim() || '#a1a1aa';
    const accentColor = style.getPropertyValue('--color-nexus-accent').trim() || '#8b5cf6';

    // Clear previous
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("width", width)
      .attr("height", height);

    // Add zoom capabilities
    const g = svg.append("g");
    const zoom = d3.zoom()
        .scaleExtent([0.1, 4])
        .on("zoom", (event) => {
            g.attr("transform", event.transform);
        });
    svg.call(zoom as any);

    if (filteredData.nodes.length === 0) {
        g.append("text")
         .attr("x", width / 2)
         .attr("y", height / 2)
         .attr("text-anchor", "middle")
         .attr("fill", textColor)
         .text("No nodes found in this source.");
        return;
    }

    // Simulation
    const simulation = d3.forceSimulation(filteredData.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(filteredData.links).id((d: any) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 2.5));

    // Links
    const link = g.append("g")
      .attr("stroke", borderColor)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(filteredData.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    // Node Groups
    const node = g.append("g")
      .attr("stroke", currentTheme === 'dark' ? '#000' : '#fff')
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(filteredData.nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Circles
    node.append("circle")
      .attr("r", (d) => d.val)
      .attr("fill", (d) => {
        switch(d.type) {
          case 'concept': return accentColor;
          case 'file': return '#3b82f6'; // blue
          case 'person': return '#10b981'; // emerald
          default: return '#71717a';
        }
      })
      .attr("cursor", "pointer")
      .on("click", (event, d) => {
        setSelectedNode(d as Node);
        event.stopPropagation();
      });

    // Labels
    node.append("text")
      .text((d) => d.label)
      .attr("x", (d) => d.val + 5)
      .attr("y", 4)
      .attr("fill", textColor)
      .attr("font-size", "10px")
      .attr("stroke", "none")
      .attr("font-family", "Inter, sans-serif")
      .style("pointer-events", "none"); // Let clicks pass through to circle/background

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [filteredData, currentTheme]);

  const getLabelForType = (type: string) => {
      switch(type) {
          case 'concept': return t('graph.legend.concept');
          case 'file': return t('graph.legend.file');
          case 'person': return t('graph.legend.entity');
          default: return type;
      }
  };

  return (
    <div className="flex h-full bg-nexus-950 transition-colors duration-300 overflow-hidden">
      
      {/* LEFT PANE: SOURCE SELECTOR */}
      <div className="w-56 md:w-64 bg-nexus-900 border-r border-nexus-border flex flex-col shrink-0">
          <div className="p-3 border-b border-nexus-border">
              <h2 className="font-bold text-sm text-nexus-text-primary flex items-center gap-2">
                  <Filter size={16} /> {t('library.sources')}
              </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
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
                Sources
              </div>

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
                </div>
              ))}
          </div>
      </div>

      {/* RIGHT PANE: GRAPH VISUALIZATION */}
      <div className="flex-1 flex flex-col h-full bg-nexus-950 relative">
          
          {/* Header Overlay */}
          <div className="absolute top-3 left-3 z-10 bg-nexus-900/90 backdrop-blur border border-nexus-border p-2.5 rounded-lg shadow-lg">
            <h2 className="text-xs font-semibold text-nexus-text-primary">{activeSourceName} Topology</h2>
            <p className="text-[10px] text-nexus-text-secondary">
                {filteredData.nodes.length} nodes • {filteredData.links.length} relations
            </p>
            <div className="mt-1.5 flex gap-2 text-[9px] uppercase font-bold tracking-wider">
                <span className="text-nexus-accent">{t('graph.legend.concept')}</span>
                <span className="text-blue-500">{t('graph.legend.file')}</span>
                <span className="text-emerald-500">{t('graph.legend.entity')}</span>
            </div>
          </div>

          <div ref={wrapperRef} className="flex-1 h-full w-full relative overflow-hidden cursor-move">
               <svg ref={svgRef} className="w-full h-full block"></svg>
          </div>
      </div>

      {/* NODE DETAILS SIDEBAR (Overlay on Right) */}
      {selectedNode && (
        <div className="absolute top-0 right-0 h-full w-72 border-l border-nexus-border bg-nexus-900/95 backdrop-blur p-5 shadow-2xl overflow-y-auto z-20 animate-in slide-in-from-right duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${selectedNode.type === 'concept' ? 'bg-nexus-accent/20 text-nexus-accent' : 'bg-nexus-950 text-nexus-text-secondary'}`}>
              {getLabelForType(selectedNode.type)}
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-nexus-text-secondary hover:text-nexus-text-primary">&times;</button>
          </div>
          <h2 className="text-xl font-bold text-nexus-text-primary mb-1 break-words">{selectedNode.label}</h2>
          <p className="text-xs text-nexus-text-secondary mb-5">
            {t('graph.foundIn')}
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-[10px] font-semibold text-nexus-text-secondary uppercase tracking-wider mb-2">{t('graph.connectedEntities')}</h4>
              <div className="space-y-1">
                {filteredData.links
                  .filter(l => (l.source as any).id === selectedNode.id || (l.target as any).id === selectedNode.id)
                  .map((l, i) => {
                     const target = (l.target as any).id === selectedNode.id ? (l.source as any) : (l.target as any);
                     return (
                       <div key={i} className="text-xs text-nexus-text-primary bg-nexus-950 p-1.5 rounded border border-nexus-border/50 flex items-center gap-2">
                         <div className={`w-1.5 h-1.5 rounded-full ${target.type === 'concept' ? 'bg-nexus-accent' : 'bg-blue-500'}`} />
                         {target.label}
                       </div>
                     )
                  })
                }
                {filteredData.links.filter(l => (l.source as any).id === selectedNode.id || (l.target as any).id === selectedNode.id).length === 0 && (
                    <div className="text-[10px] text-nexus-text-secondary italic">No direct connections in this view</div>
                )}
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-semibold text-nexus-text-secondary uppercase tracking-wider mb-2">{t('graph.actions')}</h4>
              <button className="w-full py-1.5 bg-nexus-800 hover:bg-nexus-700 text-nexus-text-primary rounded text-xs mb-2 transition-colors border border-nexus-border">
                {t('graph.showTimeline')}
              </button>
              <button className="w-full py-1.5 bg-nexus-accent hover:bg-violet-600 text-white rounded text-xs transition-colors">
                {t('graph.startChat')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowledgeGraph;