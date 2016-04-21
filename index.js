var $canvas = $('#canvasA');
var canvasOffset = $canvas.offset();
var offsetX = canvasOffset.left;
var offsetY = canvasOffset.top;

function dynamiceTriangle(letter, base, hover,
  width1, height1, width2, height2, width3, height3) {

  var triangle;

  var canvas = document.getElementById('canvas'+letter),
    ctx = canvas.getContext('2d');

  window.addEventListener('resize', resizeCanvas, false);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    define(); 
  };

  resizeCanvas();

  function draw(polygon) {
    if (canvas.getContext){
      var ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.moveTo(polygon[0].x, polygon[0].y);
      for (var i = 1; i < polygon.length; i++) {
        ctx.lineTo(polygon[i].x, polygon[i].y);
      }
      ctx.closePath();
    }
    ctx.fillStyle = base;
    ctx.fill();
  };

  function define() {

    var triangle = [{
      x: innerWidth*(width1),
      y: innerHeight*(height1)
    }, {
      x: innerWidth*(width2),
      y: innerHeight*(height2)
    }, {
      x: innerWidth*(width3),
      y: innerHeight*(height3)
    }];

    draw(triangle);
  };

  $('#canvas'+letter).mousemove(function (e) {
    handleMouseMove(e);
  });

  function hitTest(polygon) {
    define(polygon);

    return (ctx.isPointInPath(mouseX, mouseY));
  }

  function handleMouseMove(e) {
    e.preventDefault();
    mouseX = parseInt(e.clientX - offsetX);
    mouseY = parseInt(e.clientY - offsetY);

    define(triangle);

    if(ctx.isPointInPath(mouseX,mouseY)){
      ctx.fillStyle = hover;
      ctx.fill();
    } else {
      ctx.fillStyle = base;
      ctx.fill();
    }
  }
};

dynamiceTriangle('A', '#707070', 'rgb(83, 224, 158)', 0, 0, 1/5, 0, 0, 1);
dynamiceTriangle('A', '#999999', 'rgb(242, 190, 92)', 1/10, 1/2, 1, 1, 1/2, 1);
dynamiceTriangle('A', '#b8b8b8', 'rgb(139, 91, 252)', 0, 1, 1/10, 1/2, 1/2, 1);
dynamiceTriangle('A', '#858585', 'rgb(51, 195, 196)', 1/5, 0, 1/2, 13/18, 1/10, 1/2);
dynamiceTriangle('A', '#a3a3a3', 'rgb(242, 151, 201)', 1/2, 13/18, 1, 13/18, 1, 1);
dynamiceTriangle('A', '#8f8f8f', 'rgb(99, 165, 242)', 4/5, 0, 1, 13/18, 1, 0);
dynamiceTriangle('A', '#cccccc', 'rgb(248, 130, 126)', 1/2, 13/18, 4/5, 0, 1, 13/18);

dynamiceTriangle('A', '#666666', 'rgb(51, 195, 196)', 1/5, 0, 1/2, 13/18, 4/5, 0);

