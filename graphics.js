// rewrite this wrapper if you want to use another framework
var Graphics = {
  buildBallAvatar: function(ball) {
    var circle = new createjs.Shape(),
    container = new createjs.Container(),

    r = ball.radius,
    x = ball.x,
    y = ball.y,
    color = ball.color || "#46ac39";

    circle.graphics.beginFill(color).drawCircle(0, 0, r);

    container.addChild(circle);
    container.cache(-1 * r, -1 * r, 2 * r, 2 * r);
    container.x = x;
    container.y = y;

    Graphics.stage.addChild(container);
    return new GraphicsElement(container);
  },

  buildPlayerAvatar: function(player) {
    var circle = new createjs.Shape(),
    triangle = new createjs.Shape(),
    container = new createjs.Container(),
    r = player.radius,
    x = player.x,
    y = player.y;

    circle.graphics.beginFill("#e52949").drawCircle(0, 0, r);

    triangle.graphics.beginFill("#0d717b");
    triangle.graphics.moveTo(0, -1/2 * r);
    triangle.graphics.lineTo(r, 0);
    triangle.graphics.lineTo(0, 1/2 * r);
    triangle.graphics.lineTo(0, -1/2 * r);
    triangle.width = r;
    triangle.height = r;

    container.addChild(circle);
    container.addChild(triangle);

    container.cache(-1 * r, -1 * r, 2 * r, 2 * r);
    container.x = x;
    container.y = y;

    Graphics.stage.addChild(container);
    return new GraphicsElement(container);
  },

  buildWall: function(wall) {
    var line = new createjs.Shape();

    line.graphics.setStrokeStyle(1);
    line.graphics.beginStroke("white");
    line.graphics.moveTo(wall.x1, wall.y1);
    line.graphics.lineTo(wall.x2, wall.y2);

    Graphics.stage.addChild(line);
  },

  cleanUp: function() {
    if(typeof Graphics.stage !== "undefined") {
      Graphics.stage.removeAllChildren();
      Graphics.stage.clear();
    }
  },

  drawDebugText: function(msg) {
    // if(!Game.debugMode) return;
    Graphics.debugText.text = msg;
  },

  drawScore: function(p1, p2) {
    Graphics.scoreText.text = p1 + ' x ' + p2;
  },

  init: function() {
    Graphics.stage = new createjs.Stage('canvas');;

    var debugText = new createjs.Text("", "20px Courier New", "#0000ff");
    debugText.x = Graphics.stage.canvas.width - 300;
    debugText.y = 100;
    Graphics.debugText = debugText;
    Graphics.stage.addChild(debugText);

    var scoreText = new createjs.Text("0 x 0", "20px Courier New", "white");
    scoreText.x = 0;
    scoreText.y = 10;
    Graphics.scoreText = scoreText;
    Graphics.stage.addChild(scoreText);
  },

  update: function() {
    Graphics.stage.update();
  }
};

function GraphicsElement(shape) {
  this.shape = shape;

  this.rotate = function(finalAngle) {
    this.shape.setTransform(this.shape.x,this.shape.y,1,1,360 - finalAngle);
  };

  this.translate = function(x, y) {
    this.shape.x += x;
    this.shape.y += y;
  };

  this.setPosition = function(x, y) {
    this.shape.x = x;
    this.shape.y = y;
  };

  this.getPosition = function() {
    return {
      x: this.shape.x,
      y: this.shape.y
    };
  };
}
