/*
** Animation
*/ 

var width = 1100,
    height = 600;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .charge(-30000)
    .friction(.15)
    .size([width, height])
    .linkDistance(function(d) { return d.value })
    .linkStrength(1.5);

d3.json("data.json", function(error, json) {
  if (error) throw error;

  force
      .nodes(json.nodes)
      .links(json.links)
      .start();

  var link = svg.selectAll(".link")
      .data(json.links)
    .enter().append("line")
      .attr("class", "link");

  var node = svg.selectAll(".node")
      .data(json.nodes)
    .enter().append("g")
      .attr("class", "node");

  node.append("circle")
    .attr("r", 34)
    .style("fill", '#506fce');

  node.append("image")
    .attr("xlink:href",  function(d) { return d.img;})
    .attr("x", function(d, i) { return (i === 0) ? -62.5 : -35})
    .attr("y", function(d, i) { return (i === 0) ? -62.5 : -35})
    .attr("width", function(d, i) { return (i === 0) ? 125 : 70})
    .attr("height", function(d, i) { return (i === 0) ? 125 : 70});

  force.on("tick", function(e) {

    link.attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; })
    
    node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
  });

  /*
  ** Mouseover gravity effect
  */ 

  svg.on("mousemove", function() {

    var p1 = d3.mouse(this);
    var distances = node[0].map(function(n) {
      return Math.sqrt(Math.pow(Math.abs(p1[0] - n['__data__']['x']), 2) + 
             Math.pow(Math.abs(p1[1] - n['__data__']['y']), 2))
    });

    var closestNodeIndex = indexOfSmallest(distances);
    var closestLinksIndices = [];

    for (var i = 0; i < json['links'].length; i++) {
      if ((json['links'][i]['source']['index'] === closestNodeIndex) || 
          (json['links'][i]['target']['index'] === closestNodeIndex)) {
        closestLinksIndices.push(i);
      }
    }

    force.linkStrength(function(l, i) {
      if (closestLinksIndices.indexOf(i) >= 0) {
        return 3;
      } 
      else {
        return 1.5;
      }
    });

    force.start();
  });
});

/*
** Smooth scroll when clicking register
*/ 

window.smoothScroll = function(target) {
    var scrollContainer = target;
    do { 
        scrollContainer = scrollContainer.parentNode;
        if (!scrollContainer) return;
        scrollContainer.scrollTop += 1;
    } while (scrollContainer.scrollTop == 0);

    var targetY = 0;
    do { 
        if (target == scrollContainer) break;
        targetY += target.offsetTop;
    } while (target = target.offsetParent);

    scroll = function(c, a, b, i) {
        i++; if (i > 30) return;
        c.scrollTop = a + (b - a) / 30 * i;
        setTimeout(function(){ scroll(c, a, b, i); }, 20);
    }
    scroll(scrollContainer, scrollContainer.scrollTop, targetY, 0);
}

/*
** Helper functions
*/ 

function indexOfSmallest(a) {
  var lowest = 0;
  for (var i = 1; i < a.length; i++) {
    if (a[i] < a[lowest]) lowest = i;
  }
  return lowest;
}

function includes(k) {
  for(var i=0; i < this.length; i++){
    if( this[i] === k || ( this[i] !== this[i] && k !== k ) ){
      return true;
    }
  }
  return false;
}
