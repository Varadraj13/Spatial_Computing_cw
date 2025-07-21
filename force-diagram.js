// D3.js force-directed tree/flowchart
window.addEventListener('DOMContentLoaded', function() {
  const d3Container = document.getElementById('force-container');
  if (!d3Container || !window.d3) return;
  
  function getDims() {
    const header = document.querySelector('header');
    const headerH = header ? header.offsetHeight : 0;
    const w = window.innerWidth;
    const h = window.innerHeight - headerH;
    return { width: w, height: h };
  }

  function renderForceGraph() {
    // Clear existing SVG
    d3.select(d3Container).selectAll('svg').remove();
    const { width, height } = getDims();

    // Create SVG container with zoom capability
    const svg = d3.select(d3Container)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('background', '#000')
      .style('display', 'block')
      .style('margin', '0 auto');

    const g = svg.append('g');

    // Convert hierarchy to flat nodes/links
    const root = d3.hierarchy(window.safetyData);
    const nodes = [];
    const links = [];
    
    function traverse(node, parent = null) {
      nodes.push(node);
      if (parent) links.push({ source: parent, target: node });
      if (node.children) node.children.forEach(child => traverse(child, node));
    }
    traverse(root);

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance(120).strength(1))
      .force('charge', d3.forceManyBody().strength(-1000))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(60));

    // Draw links
    const link = g.append('g')
      .attr('stroke', '#666')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(links)
      .join('line');

    // Draw nodes
    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', d => d.depth === 0 ? 30 : d.depth === 1 ? 20 : 10)
      .attr('fill', d => {
        if (!d.data.priority) return '#888';
        if (d.data.priority === 'High') return '#facc15';
        if (d.data.priority === 'Medium') return '#38bdf8';
        if (d.data.priority === 'Low') return '#a3e635';
        return '#888';
      })
      .attr('stroke', '#fff')
      .attr('stroke-width', d => d.depth === 0 ? 2 : 1)
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add labels
    const label = g.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('font-size', d => d.depth === 0 ? 16 : 12)
      .attr('fill', '#fff')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .text(d => d.data.name);

    // Remove zoom capability so the chart stays in place
    // svg.call(zoom); // <-- Comment out or remove this line

    // Simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);

      label
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }
  }

  // Initial render and resize handling
  renderForceGraph();
  window.addEventListener('resize', renderForceGraph);
});
