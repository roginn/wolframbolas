function Vector(x, y) {
  this.x = x;
  this.y = y;

  this.normalize = function() {
    var magnitude = this.getMagnitude();
    if(magnitude < 0) return;

    this.x /= magnitude;
    this.y /= magnitude;

    return this;
  };

  this.scale = function(factor) {
    this.x *= factor;
    this.y *= factor;

    return this;
  };

  this.add = function(vector) {
    this.x += vector.x;
    this.y += vector.y;

    return this;
  };

  this.dotProduct = function(vector) {
    return this.x * vector.x + this.y * vector.y;
  };

  this.getMagnitude = function() {
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  };

  this.getPerpendicular = function() {
    return new Vector(-1 * this.y, this.x);
  };

  this.getPosition = function() {
    return {
      x: this.shape.x,
      y: this.shape.y
    };
  };

  this.getScaled = function(factor) {
    return new Vector(this.x * factor, this.y * factor);
  };

}
