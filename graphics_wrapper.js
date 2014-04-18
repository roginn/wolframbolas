// rewrite this wrapper if you want to use another framework
var Graphics = {
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

  drawDebugText: function(msg) {
    if(!Game.debugMode) return;
    Graphics.debugText.text = msg;
  },

  init: function() {
    stage = new createjs.Stage('canvas');
    Graphics.stage = stage;

    if(Game.debugMode) {
      var text = new createjs.Text("", "20px Courier New", "#0000ff");
      text.x = stage.canvas.width - 200;
      text.y = 100;
      Graphics.debugText = text;
      Graphics.stage.addChild(text);
    }
  },

  update: function() {
    Graphics.stage.update();
  }
};

function GraphicsElement(shape) {
  this.shape = shape;

  this.rotate = function(finalAngle) {
    this.shape.setTransform(this.shape.x,this.shape.y,1,1,360 - finalAngle);
  }

  this.translate = function(x, y) {
    this.shape.x += x;
    this.shape.y += y;
  }

  this.setPosition = function(x, y) {
    this.shape.x = x;
    this.shape.y = y;
  }

  this.getPosition = function() {
    return {
      x: this.shape.x,
      y: this.shape.y
    };
  }
}
