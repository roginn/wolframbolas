function Ball (x, y, radius, angle) {
  this.STATIC_FRIC  = 1;
  this.DYNAMIC_FRIC = 0.93;

  this.x     = x;     // x position
  this.y     = y;     // y position
  this.vx    = 0;     // x component of velocity, pixels/sec
  this.vy    = 0;     // y component of velocity, pixels/sec

  this.radius = radius;
  this.mass   = radius;

  this.graphics = Graphics.buildBallAvatar(this);

  this.getSpeed = function() {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
  };

  this.tickPosition = function() {
    this._applyFriction();
    this._applyVelocity();
    this.graphics.setPosition(this.x, this.y);
    this.graphics.rotate(this.angle);
  };

  //
  //private
  //

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
  };

  // updates (x,y) based on velocity
  this._applyVelocity = function() {
    this.x += this.vx;
    this.y += this.vy;
  };
}
