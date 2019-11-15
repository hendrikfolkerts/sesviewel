exports.createPicture = function presentation(treeData, withouticons=false, style=[10, "normal"]) {
  d3.select("svg").remove();

  var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate("+ margin.left + "," + margin.top + ")");

  var i = 0, duration = 0, root; var border=1;  //duration = duration of a transition -> animation when the tree is updated
  
  // Assigns parent, children, height, depth
  root = d3.hierarchy(treeData, function(d) { return d.children; });
  root.x0 = (height) / 2;
  root.y0 = 0;

  // Collapse after the second level
  //root.children.forEach(collapse);

  update(root);

  //--------Functions----------------------------------------------------------------------------

  // Collapse the node and all it's children
  function collapse(d) {
    if(d.children) {
      d._children = d.children
      d._children.forEach(collapse)
      d.children = null
    }
  }

  function update(source) {

    // Assigns the x and y position for the nodes
    var treeData = treemap(root);

    // Compute the new tree layout.
    var nodes = treeData.descendants(),
        links = treeData.descendants().slice(1);

    // Normalize for fixed-depth.
    var max_depth=Math.max.apply(Math, nodes.map(function(o) {return o.depth}))
    if (max_depth > 10){
      var depth = 40;
    } else{
      var depth = 60;
    }
    nodes.forEach(function(d){ d.y = d.depth * depth});

    // ****************** Nodes section ***************************

    // Update the nodes...
    var node = svg.selectAll('g.node')
        .data(nodes, function(d) {return d.id || (d.id = ++i); });

    // Enter any new modes at the parent's previous position.
    var nodeEnter = node.enter().append('g')
        .attr('class', 'node')
        .on('click', click)
        .attr("transform", function(d) {return "translate(" + source.x0 + "," + source.y0 + ")";});

    // Add labels for the nodes
    if (withouticons) {
      nodeEnter.append('text')
          .attr("dy", ".35em")
          .attr("text-anchor", "middle")
          .style("font-size", style[0].toString()+"px")
          .style("font-weight", style[1])
          //no icons, so the mouseover event needs to be added on the labels
          .on("mouseover", mouseover)			
          .on("mousemove", mousemove)
          .on("mouseout", mouseout)
          .text(function(d) { return d.data.name; });
    } else {
      nodeEnter.append('text')
          .attr("dy", ".35em")
          //label of inner nodes left of the node, label of leaf node right of the node 
          .attr("x", function(d) {
              return d.children || d._children ? -13 : 13;
          })
          .attr("text-anchor", function(d) {
              return d.children || d._children ? "end" : "start";
          })
          //label of all nodes left of the node
          /*
          .attr("x", -13)
          .attr("text-anchor", "end")
          */ 
          .style("font-size", style[0].toString()+"px")
          .style("font-weight", style[1])
          .text(function(d) { return d.data.name; });
    }

    // Replace d3's circles by pictures
    if (!withouticons) {
      nodeEnter.append("image")
          .attr("xlink:href", function(d) { return d._children ? "test.png" : d.data.type + ".png"; })
          .attr("x", "-12px")
          .attr("y", "-12px")
          .attr("width", "24px")
          .attr("height","24px")
          .on("mouseover", mouseover)			
          .on("mousemove", mousemove)
          .on("mouseout", mouseout);
    }

    function mouseover() {
      if (this.__data__.data.info.length > 1) {
        div.style("display", "inline");
      }
    }

    function mousemove() {
      var infoToDisplay = this.__data__.data.info;
      if (infoToDisplay.length > 1) {
        
        var linesplit = infoToDisplay.split("<br />");
        var maxLinecount = 0;
        var numLinebreaks = linesplit.length;
        for (var n=0; n<numLinebreaks; n++) {
          if (maxLinecount < linesplit[n].length) {
            maxLinecount = linesplit[n].length;
          }
        }
        
        //now style and display tooltip
        div
          //.text(this.__data__.data.info)
          .html(infoToDisplay)  //recognize <br /> as linebreak
          //.style("width",(this.__data__.data.info.length*8-20) + "px")
          .style("width",(maxLinecount*5) + "px")
          .style("height", (numLinebreaks*10) + "px")
          .style("left", (d3.event.pageX - 34) + "px")
          .style("top", (d3.event.pageY - 12) + "px")
          .style("background-color", "white")
          .style("border-style","solid")
          .style("border-width","0.5px")
          .style("border", "solid")
          .style("border-radius", "5px")
          .style("text-align", "left")
          //.style("font", "12px sans-serif")
          .attr("class", "tooltip")
          //.style("opacity", 0)
          //.style("opacity", 1)
          .style("padding", "5px");
      }
    }

    function mouseout() {
      if (this.__data__.data.info.length > 1) {
        div.style("display", "none");
      }
    }

    // UPDATE
    var nodeUpdate = nodeEnter.merge(node);

    // Transition to the proper position for the node
  
    nodeUpdate.transition()
        .duration(duration)
        .attr("transform", function(d) {
          return "translate(" + d.x + "," + d.y + ")";
        });


    // Remove any exiting nodes
    var nodeExit = node.exit().transition()
        .duration(duration)
        .attr("transform", function(d) {
            var k = {x:source.x + 12, y:source.y + 12}; 
            return "translate(" + k.x + "," + k.y + ")";
        })
        .remove();

    // On exit reduce the node circles size to 0
    nodeExit.select('image')
      .attr("width", "0px")
      .attr("height", "0px");

    // On exit reduce the opacity of text labels
    nodeExit.select('text')
      .style('fill-opacity', 1e-6);

    // ****************** links section ***************************

    // Update the links...
    var link = svg.selectAll('path.link')
        .data(links, function(d) { return d.id; });

    // Enter any new links at the parent's previous position.
    var linkEnter = link.enter().insert('path', "g")
        .attr("class", "link")
        .attr('d', function(d){
          var o = {x: source.x0, y: source.y0+24}
          return diagonal(o, o, d.parent.data["type"], d.data["type"], d.parent.data["children"].length)
        });

    // UPDATE
    var linkUpdate = linkEnter.merge(link);

    // Transition back to the parent element position
    linkUpdate.transition()
        .duration(duration)
        .attr('d', function(d){ return diagonal(d, d.parent, d.parent.data["type"], d.data["type"], d.parent.data["children"].length) });

    // Remove any exiting links
    var linkExit = link.exit().transition()
        .duration(duration)
        .attr('d', function(d) {
          var o = {x: source.x, y: source.y}
          return diagonal(o, o, d.parent.data["type"], d.data["type"], d.parent.data["children"].length)
        })
        .remove();

    // Store the old positions for transition.
    nodes.forEach(function(d){
      d.x0 = d.x;
      d.y0 = d.y;
    });

    // Creates a path from parent to the child nodes
    function diagonal(s, d, ptype, ctype, nchild) {
      //entity, aspect = 1; specialization = 2; masp = 3
      ptype=type2nmb(ptype);
      ctype=type2nmb(ctype);
      var drain   = {x : d.x, y : d.y+12};
      var source  = {x : s.x, y : s.y-12};

      
      if(nchild==1){
        //one straight line
        type=String(parseInt(ctype)+parseInt(ptype)-1);
        if (type =='1'){
          //presentation of the entities and the aspect node
          path = `M ${drain.x} ${drain.y}
                  L ${source.x} ${source.y}`
        }
        else if (type=='2'){
          //presentation of the specialization node
          path = `M ${drain.x+2} ${drain.y}
                  L ${source.x+2} ${source.y}
                  M ${drain.x-2} ${drain.y}
                  L ${source.x-2} ${source.y}`
          }
        else{
          //presentation of the multi-aspect node
          path = `M ${drain.x} ${drain.y}
                  L ${source.x} ${source.y}
                  M ${drain.x-3.5} ${drain.y}
                  L ${source.x-3.5} ${source.y}
                  M ${drain.x+3.5} ${drain.y}
                  L ${source.x+3.5} ${source.y}`
          }      
      } else {
          //presentation for nchild>1!
          //presentation of the upper part of a path
          if (ptype =='1'){
            //presentation of the entities and the aspect node
            path_oben = `M ${drain.x} ${drain.y}
                        L ${drain.x} ${(drain.y-source.y)/2.5+source.y}`
          }
          else if (ptype=='2'){
            //presentation of the specialization node
            path_oben = `M ${drain.x+2} ${drain.y}
                        L ${drain.x+2} ${(drain.y-source.y)/2.5+source.y}
                        M ${drain.x-2} ${drain.y}
                        L ${drain.x-2} ${(drain.y-source.y)/2.5+source.y}`
          }
          else{
            path_oben = `M ${drain.x} ${drain.y}
                        L ${drain.x} ${(drain.y-source.y)/2.5+source.y}
                        M ${drain.x-3.5} ${drain.y}
                        L ${drain.x-3.5} ${(drain.y-source.y)/2.5+source.y}
                        M ${drain.x+3.5} ${drain.y}
                        L ${drain.x+3.5} ${(drain.y-source.y)/2.5+source.y}`
          }

          //presentation of the lower part of a path
          if (ctype =='1'){
            //presentation of the entities and the aspect node
            path_unten = `M ${source.x} ${source.y}
                          L ${source.x} ${(drain.y-source.y)/2.5+source.y},
                            ${drain.x} ${(drain.y-source.y)/2.5+source.y}`
          }
          else if (ctype=='2'){
            //presentation of the specialization node
            if (source.x<drain.x) {
              path_unten = `M ${source.x-2} ${source.y}
                      L ${source.x-2} ${(drain.y-source.y)/2.5+source.y},
                        ${drain.x+2} ${(drain.y-source.y)/2.5+source.y}
                      M ${source.x+2} ${source.y}
                      L ${source.x+2} ${(drain.y-source.y)/2.5+source.y}`
            } else {
              path_unten = `M ${source.x+2} ${source.y}
                      L ${source.x+2} ${(drain.y-source.y)/2.5+source.y},
                        ${drain.x-2} ${(drain.y-source.y)/2.5+source.y}
                      M ${source.x-2} ${source.y}
                      L ${source.x-2} ${(drain.y-source.y)/2.5+source.y}`
            }
          }
          else{ //ctype == '3'
            if (source.x<drain.x) {
              path_unten = `M ${source.x-3.5} ${source.y}
                      L ${source.x-3.5} ${(drain.y-source.y)/2.5+source.y},
                        ${drain.x+3.5} ${(drain.y-source.y)/2.5+source.y}
                      M ${source.x+3.5} ${source.y}
                      L ${source.x+3.5} ${(drain.y-source.y)/2.5+source.y}
                      M ${source.x} ${source.y}
                      L ${source.x} ${(drain.y-source.y)/2.5+source.y}`
            } else {
              path_unten = `M ${source.x+3.5} ${source.y}
                      L ${source.x+3.5} ${(drain.y-source.y)/2.5+source.y},
                        ${drain.x-3.5} ${(drain.y-source.y)/2.5+source.y}
                      M ${source.x-3.5} ${source.y}
                      L ${source.x-3.5} ${(drain.y-source.y)/2.5+source.y}                  
                      M ${source.x} ${source.y}
                      L ${source.x} ${(drain.y-source.y)/2.5+source.y}`
            }
          }
          path=path_unten+path_oben;
      }

      return path
    }

    function type2nmb(type){
      if (type == "aspect" || type == "entity" || type == "descriptive"){
        var nmb = "1";
      }else{
        if(type == "specialization"){
          var nmb = "2";
        }else{
          var nmb = "3";
        }
      }
      return nmb;
    }

    // Toggle children on click.
    function click(d) {
      if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
      update(d);
    }
  }
}