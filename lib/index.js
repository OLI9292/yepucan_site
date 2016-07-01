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

dynamiceTriangle('A', '#ededed', '#FFC107', 0, 1/7, 1/2, 1/2, 1/7, 0);
dynamiceTriangle('A', '#ededed', '#64B5F6', 3/7, 0, 1/2, 1/2, 5/7, 0);
dynamiceTriangle('A', '#ededed', '#FFC107', 1, 0, 1/2, 1/2, 1, 2/7);
dynamiceTriangle('A', '#ededed', '#FFA000', 1, 4/7, 1/2, 1/2, 1, 6/7);
dynamiceTriangle('A', '#ededed', '#64B5F6', 6/7, 1, 1/2, 1/2, 4/7, 1);
dynamiceTriangle('A', '#ededed', 'rgb(99, 165, 242)', 2/7, 1, 1/2, 1/2, 0, 1);
dynamiceTriangle('A', '#ededed', '#42A5F5', 0, 5/7, 1/2, 1/2, 0, 3/7);

