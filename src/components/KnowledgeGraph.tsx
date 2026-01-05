import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphData, Node, Link } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';

interface KnowledgeGraphProps {
  data: GraphData;
}

const KnowledgeGraph: React.FC<KnowledgeGraphProps> = ({ data }) => {
  const { t } = useLanguage();
  const { currentTheme } = useTheme(); // Listen to theme changes
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || !data.nodes.length) return;

    const width = wrapperRef.current.clientWidth;
    const height = wrapperRef.current.clientHeight;

    // Resolve CSS variables to actual colors for D3
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

    // Simulation
    const simulation = d3.forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force("link", d3.forceLink(data.links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.val * 2));

    // Links
    const link = svg.append("g")
      .attr("stroke", borderColor)
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    // Node Groups
    const node = svg.append("g")
      .attr("stroke", currentTheme === 'dark' ? '#000' : '#fff')
      .attr("stroke-width", 1.5)
      .selectAll("g")
      .data(data.nodes)
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
      .attr("font-family", "Inter, sans-serif");

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
  }, [data, currentTheme]); // Re-run when theme changes

  const getLabelForType = (type: string) => {
      switch(type) {
          case 'concept': return t('graph.legend.concept');
          case 'file': return t('graph.legend.file');
          case 'person': return t('graph.legend.entity');
          default: return type;
      }
  };

  return (
    <div className="w-full h-full flex overflow-hidden">
      <div ref={wrapperRef} className="flex-1 h-full relative bg-nexus-950 transition-colors duration-300">
        <div className="absolute top-4 left-4 z-10 bg-nexus-900/80 backdrop-blur border border-nexus-border p-3 rounded-lg">
          <h2 className="text-sm font-semibold text-nexus-text-primary">{t('graph.topology')}</h2>
          <p className="text-xs text-nexus-text-secondary">{t('graph.stats')}</p>
          <div className="mt-2 flex gap-2 text-[10px] uppercase font-bold tracking-wider">
            <span className="text-nexus-accent">{t('graph.legend.concept')}</span>
            <span className="text-blue-500">{t('graph.legend.file')}</span>
            <span className="text-emerald-500">{t('graph.legend.entity')}</span>
          </div>
        </div>
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>

      {selectedNode && (
        <div className="w-80 border-l border-nexus-border bg-nexus-900 p-6 shadow-2xl overflow-y-auto z-20 transition-colors duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${selectedNode.type === 'concept' ? 'bg-nexus-accent/20 text-nexus-accent' : 'bg-nexus-950 text-nexus-text-secondary'}`}>
              {getLabelForType(selectedNode.type)}
            </span>
            <button onClick={() => setSelectedNode(null)} className="text-nexus-text-secondary hover:text-nexus-text-primary">&times;</button>
          </div>
          <h2 className="text-2xl font-bold text-nexus-text-primary mb-2">{selectedNode.label}</h2>
          <p className="text-sm text-nexus-text-secondary mb-6">
            {t('graph.foundIn')}
          </p>
          
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-nexus-text-secondary uppercase tracking-wider mb-2">{t('graph.connectedEntities')}</h4>
              <div className="space-y-1">
                {data.links
                  .filter(l => (l.source as any).id === selectedNode.id || (l.target as any).id === selectedNode.id)
                  .map((l, i) => {
                     const target = (l.target as any).id === selectedNode.id ? (l.source as any) : (l.target as any);
                     return (
                       <div key={i} className="text-sm text-nexus-text-primary bg-nexus-950 p-2 rounded border border-nexus-border/50">
                         {target.label}
                       </div>
                     )
                  })
                }
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-semibold text-nexus-text-secondary uppercase tracking-wider mb-2">{t('graph.actions')}</h4>
              <button className="w-full py-2 bg-nexus-800 hover:bg-nexus-700 text-nexus-text-primary rounded text-sm mb-2 transition-colors">
                {t('graph.showTimeline')}
              </button>
              <button className="w-full py-2 border border-nexus-border text-nexus-text-secondary hover:text-nexus-text-primary hover:bg-nexus-800 rounded text-sm transition-colors">
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