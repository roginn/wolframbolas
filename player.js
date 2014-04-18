function Player (x, y, radius) {
  this.ACCEL_FACTOR = 3;
  this.STATIC_FRIC  = 1;
  this.DYNAMIC_FRIC = 0.92;

  this.ANG_ACCEL_FACTOR = 2;    // degrees / sec^2
  this.ANG_DYNAMIC_FRIC = 0.92;
  this.ANG_STATIC_FRIC  = 1.5;

  this.x     = x;   // x position
  this.y     = y;   // y position
  this.vx    = 0;   // x component of velocity, pixels/sec
  this.vy    = 0;   // y component of velocity, pixels/sec
  this.angle = 0;   // angle in degrees
  this.vang  = 0;   // angular velocity, degrees/sec

  this.radius = radius;
  this.mass   = radius;

  this.graphics = Graphics.buildPlayerAvatar(this);

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
    this._applyAngFriction();
    this._applyAngVelocity();
    this._applyFriction();
    this._applyVelocity();
    this.graphics.setPosition(this.x, this.y);
    this.graphics.rotate(this.angle);
  }

  this.turnClockwise = function() {
    this._angAccelerate(-1 * this.ANG_ACCEL_FACTOR);
  }

  this.turnCounterClockwise = function() {
    this._angAccelerate(this.ANG_ACCEL_FACTOR);
  }

  //
  //private
  //

  this._accelerate = function(factor) {
    this.vx += Math.cos(this.angle * Math.PI / 180) * factor;
    this.vy -= Math.sin(this.angle * Math.PI / 180) * factor;
  }

  this._angAccelerate = function(factor) {
    this.vang += factor;
  }

  // reduces angular velocity
  this._applyAngFriction = function() {
    if(Math.abs(this.vang) > this.ANG_STATIC_FRIC) {
      this.vang *= this.ANG_DYNAMIC_FRIC;
    } else {
      this.vang = 0;
    }
  }

  // updates angle based on angular velocity
  this._applyAngVelocity = function() {
    var sign = (this.vang >= 0 ? 1 : -1);
    this.angle = (360 + this.angle + (Math.abs(this.vang) % 360) * sign) % 360
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
