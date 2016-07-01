var width = 1100,
    height = 600;

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .charge(-50000)
    .friction(.2)
    .gravity(0.2)
    .size([width, height])
    .linkDistance(function(d) { return d.value })
    .linkStrength(function(l, i) {
      if (l.target.group === 1) {
        return 2.5;
      } else {
        return 1;
      }
    });

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

  var root = node[0][[node[0].length-1]];
  root.radius = 0;
  root.fixed = true;

  svg.on("mousemove", function() {
    var p1 = d3.mouse(this);
    root.px = p1[0];
    root.py = p1[1];
    force.resume();
  });

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

    var q = d3.geom.quadtree(node[0]),
      i = 0,
      n = node[0].length;

    while (++i < n) q.visit(collide(node[0][i]));

    svg.selectAll("circle")
      .attr("cx", function(d) { return d.x; })
      .attr("cy", function(d) { return d.y; });
  });
});

function collide(node) {
  var r = node.radius + 5,
      nx1 = node.x - r,
      nx2 = node.x + r,
      ny1 = node.y - r,
      ny2 = node.y + r;
  return function(quad, x1, y1, x2, y2) {
    if (quad.point && (quad.point !== node)) {
      var x = node.x - quad.point.x,
          y = node.y - quad.point.y,
          l = Math.sqrt(x * x + y * y),
          r = node.radius + quad.point.radius;
      if (l < r) {
        l = (l - r) / l * .1;
        node.x -= x *= l;
        node.y -= y *= l;
        quad.point.x += x;
        quad.point.y += y;
      }
    }
    return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
  };
}

// Smooth scroll when clicking register

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


