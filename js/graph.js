/*
** Animation
*/ 

var w = window.innerWidth,
    h = window.innerHeight - 145,
    width, height;

if (w < 800) {
  width = 800;
} else {
  width = w;
}

if (h < 450) {
  height = 450;
} else {
  height = h;
}

var svg = d3.select("#vis").append("svg")
    .attr("width", width)
    .attr("height", height);

var force = d3.layout.force()
    .charge(-30000)
    .friction(0.17)
    .size([width, height])
    .linkDistance(function(d, i) { return d.value })
    .linkStrength(1.6);

d3.json("data.json", function(error, json) {
  if (error) throw error;

  var screenSize = width * height;

  if (screenSize > 750000) {
    json['nodes'] = json['nodes'];
    json['links'] = json['links'];
  } else if (screenSize > 650000) {
    json['nodes'] = json['nodes'].slice(0, 25);
    json['links'] = json['links'].slice(0, 49);
  } else if (screenSize > 550000) {
    json['nodes'] = json['nodes'].slice(0, 21);
    json['links'] = json['links'].slice(0, 40);
  } else if (screenSize > 450000) {
    json['nodes'] = json['nodes'].slice(0, 17);
    json['links'] = json['links'].slice(0, 30);
  } else {
    json['nodes'] = json['nodes'].slice(0, 11);
    json['links'] = json['links'].slice(0, 16);
  }

  json['nodes'].push({
      "name": "center-image",
      "img": "images/center-logo.png",
      "group": 1,
      "fixed": true,
      "x": width / 2,
      "y": height / 2
    })

  // Center foci
  json['nodes'][0]['x'] = width / 2;
  json['nodes'][0]['y'] = height / 2;

  // Top-left foci
  json['nodes'][1]['x'] = width / 4;
  json['nodes'][1]['y'] = height / 3;

  // Top-right foci
  json['nodes'][2]['x'] = 3 * width / 4;
  json['nodes'][2]['y'] = height / 3;

  // Bottom-left foci
  json['nodes'][3]['x'] = width / 4;
  json['nodes'][3]['y'] = 2 * height / 3;

  // Bottom-right foci
  json['nodes'][4]['x'] = 3 * width / 4;
  json['nodes'][4]['y'] = 2 * height / 3;

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
    .attr("r", function(d, i) { 
      return (d['group'] === 4) ? 33 : 0;
    })
    .style("fill", '#506fce');

  node.append("image")
    .attr("xlink:href",  function(d) { return d.img;})
    .attr("x", function(d, i) { return (i === json.nodes.length - 1) ? -62.5 : -35})
    .attr("y", function(d, i) { return (i === json.nodes.length - 1) ? -62.5 : -35})
    .attr("width", function(d, i) { return (i === json.nodes.length - 1) ? 125 : 70})
    .attr("height", function(d, i) { return (i === json.nodes.length - 1) ? 125 : 70});

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
        return 3.5;
      } 
      else {
        return 1.6;
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

// Check brand checkbox if category is selected
$(".brands").on("input", function() {
  if ($(".brands").val().length > 0) {
    $('.brand-checkbox').prop('checked', true);
  } else {
    $('.brand-checkbox').prop('checked', false);
  }
});

// Keep width consistent with svg
var minWidthElements = ['#vis', '.header', '.register', '.bottom-banner',
                        '.email-form', '.bottom-brands', '.thin-banner', '.footer']

if (w > 1000) {
  for (var i = 0; i < minWidthElements.length; i++) {
    $(minWidthElements[i]).css("min-width", w);
  }
} else {
  for (var i = 0; i < minWidthElements.length; i++) {
    $(minWidthElements[i]).css("min-width", 1000);
  }
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
