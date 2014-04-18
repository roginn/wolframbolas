function Player (shape) {
  this.TURN_FACTOR  = 10;   // degrees
  this.ACCEL_FACTOR = 5;
  this.STATIC_FRIC  = 1;
  this.DYNAMIC_FRIC = 0.95;

  this.x     = 0;   // x position
  this.y     = 0;   // y position
  this.vx    = 0;   // x component of velocity, pixels/sec
  this.vy    = 0;   // y component of velocity, pixels/sec
  this.angle = 0;   // angle in degrees
  this.angv  = 0;   // angular velocity, degrees/sec

  this.graphics = new GraphicsElement(shape);

  this.turnCounterClockwise = function() {
    this.angle = (this.angle + this.TURN_FACTOR) % 360;
    this.graphics.rotate(this.angle);
    Game.debug('ANGLE: ' + this.angle);
  }

  this.turnClockwise = function() {
    this.angle = (360 + this.angle - this.TURN_FACTOR) % 360;
    this.graphics.rotate(this.angle);
    Game.debug('ANGLE: ' + this.angle);
  }

  this.accelerate = function() {
    this._accelerate(this.ACCEL_FACTOR);
  }

  this.decelerate = function() {
    this._accelerate(-1 * this.ACCEL_FACTOR);
  }

  this.getSpeed = function() {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
  }

  this.tickPosition = function() {
    this._applyFriction();
    this._applyVelocity();
    this.graphics.setPosition(this.x, this.y);
  }

  //private

  this._accelerate = function(factor) {
    this.vx += Math.cos(this.angle * Math.PI / 180) * factor;
    this.vy -= Math.sin(this.angle * Math.PI / 180) * factor;
  }

  // reduces velocity
  this._applyFriction = function() {
    if(Math.abs(this.vx) > this.STATIC_FRIC) {
      // this.vx += (this.vx < 0 ? 1 : -1) * this.DYNAMIC_FRIC;
      this.vx *= this.DYNAMIC_FRIC;
    } else {
      this.vx = 0;
    }

    if(Math.abs(this.vy) > this.STATIC_FRIC) {
      // this.vy += (this.vy < 0 ? 1 : -1) * this.DYNAMIC_FRIC;
      this.vy *= this.DYNAMIC_FRIC;
    } else {
      this.vy = 0;
    }
  }

  // updates (x,y) based on velocity
  this._applyVelocity = function() {
    this.x += this.vx;
    this.y += this.vy;
  }
}
