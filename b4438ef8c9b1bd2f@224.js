function _1(md){return(
  md`# Force-Directed Tree
  
  A [force-directed layout](/@d3/force-directed-graph) of a tree using [*hierarchy*.links](https://github.com/d3/d3-hierarchy/blob/master/README.md#node_links).`
  )}
  
  function _chart(d3,data,width,height,drag,invalidation)
  {
    const root = d3.hierarchy(data);
    let links = root.links();
    let nodes = root.descendants();
    
    // Define new node
    const newNode = {
      "name": "New Node"        
    }
    const newNodeHierarchy = d3.hierarchy(newNode);
    nodes.push(newNodeHierarchy);
  
    // Define new link
    const newLink = {            
      source: newNodeHierarchy,  // New node
      target: nodes[1],          // Existing node
    };
  
    links.push(newLink);
    
    const simulation = d3.forceSimulation(nodes)
        .force("link", d3.forceLink(links).id(d => d.id).distance(35).strength(1))
        .force("charge", d3.forceManyBody().strength(-50))
        .force("x", d3.forceX())
        .force("y", d3.forceY());
        
        
  
    const svg = d3.create("svg")
        .attr("viewBox", [-width / 2, -height / 2, width, height]);
  
    let link = svg.append("g")
        .attr("stroke", "#999")
        .attr("stroke-opacity", 2)
      .selectAll("line")
      .data(links)
      .join("line");
  
    let node = svg.append("g")
        .attr("fill", "#ff0")
        .attr("stroke", "#000")
        .attr("stroke-width", 2)
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("fill", d => d === newNodeHierarchy ? "#f00" : (d.children ? null : "#000"))
        .attr("stroke", d => d.children ? null : "#00f")
        .attr("r", 6)
        .call(drag(simulation));
  
      // Add text labels to nodes
    let labels = svg
      .append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("fill", "black")
      .selectAll("text")
      .data(nodes.filter(node => node.name !== "a"))
      .join("text")
      .text(d => d.data.name)
      .attr("dx", 0)
      .attr("dy", 2);
  
    node.append("title")
        .text(d => d.data.name);
  
    simulation.on("tick", () => {
      link
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y);
  
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y);
      // Update text label positions
      labels.attr("x", d => d.x + 8).attr("y", d => d.y + 4);
    });
  
    // Find the node to delete, 'a' node
    const nodeToDelete = nodes[5];
  
    // Filter out node and associated links
    nodes = nodes.filter((node) => node !== nodeToDelete);
    links = links.filter(
      (link) => link.source !== nodeToDelete && link.target !== nodeToDelete
    );
  
    // Update the visualization
    node.data(nodes);
    node.exit().remove();
    link.data(links);
    link.exit().remove();
  
    simulation.nodes(nodes).force("link").links(links);
  
    // Deleted old node 'a'
    console.log(nodeToDelete);       
  
    
    return svg.node();
  }
  
  
  function _data(FileAttachment){return(
  FileAttachment("data.json").json()
  )}
  
  function _height(){return(
  600
  )}
  
  function _drag(d3){return(
  simulation => {
    
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
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
  }
  )}
  
  function _d3(require){return(
  require("d3@6")
  )}
  
  export default function define(runtime, observer) {
    const main = runtime.module();
    function toString() { return this.url; }
    const fileAttachments = new Map([
      ["data.json", {url: new URL("./files/data.json", import.meta.url), mimeType: "application/json", toString}]
    ]);
    main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
    main.variable(observer()).define(["md"], _1);
    main.variable(observer("chart")).define("chart", ["d3","data","width","height","drag","invalidation"], _chart);
    main.variable(observer("data")).define("data", ["FileAttachment"], _data);
    main.variable(observer("height")).define("height", _height);
    main.variable(observer("drag")).define("drag", ["d3"], _drag);
    main.variable(observer("d3")).define("d3", ["require"], _d3);
    return main;
  }