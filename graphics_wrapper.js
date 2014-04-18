// rewrite this wrapper if you want to use another framework
var Graphics = {
  buildPlayerAvatar: function() {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 40);

    var triangle = new createjs.Shape();
    triangle.graphics.beginFill("green").drawPolyStar(0, 0, 40, 3, 0, 0);

    var container = new createjs.Container();
    container.addChild(circle);
    container.addChild(triangle);
    container.cache(-40, -40, 80, 80);
    container.x = container.y = 50;

    Graphics.stage.addChild(container);
    return container;
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
