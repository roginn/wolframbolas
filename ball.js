// function Ball(x, y, radius, attractionColor) {
function Ball(config) {

  this.id = Game.numObjects++;
  this.STATIC_FRIC = Game.physics.ballStaticFriction;
  this.DYNAMIC_FRIC = Game.physics.ballDynamicFriction;

  // mandatory
  this.x      = config.x;
  this.y      = config.y;
  this.radius = config.radius;

  // optional
  this.vx    = config.vx    || 0;   // x component of velocity, pixels/tick
  this.vy    = config.vy    || 0;   // y component of velocity, pixels/tick
  this.angle = config.angle || 0;   // angle in degrees
  this.group = config.group || 0;   // attraction color
  this.mass  = config.mass  || this.radius;
  this.color = config.color;

  this.attractionOrder = config.attractionOrder || 0;
  this.graphics = Graphics.buildBallAvatar(this);

  Game.movableElements.push(this);
  Game.flavors[this.group] = Game.flavors[this.group] || {};
  Game.flavors[this.group]['size'] = Game.flavors[this.group]['size'] || 0;
  var flavorSize = Game.flavors[this.group]['size'];
  Game.flavors[this.group][this.id] = flavorSize;
  Game.flavors[this.group]['size'] = Game.flavors[this.group]['size'] + 1;

  this.getSpeed = function() {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
  };

  this.tickPosition = function() {
    this._applyFriction();
    this._checkMaxVelocity();
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

  this._checkMaxVelocity = function() {
    var max = Game.physics.maxVelocity;
    if(Math.abs(this.vx) > Game.maxRecordedSpeed) {
      Game.maxRecordedSpeed = Math.abs(this.vx);
    }
    if(Math.abs(this.vy) > Game.maxRecordedSpeed) {
      Game.maxRecordedSpeed = Math.abs(this.vy);
    }
    if(Math.abs(this.vx) > max) {
      this.vx = (this.vx > 0 ? 1 : -1) * max;
    }
    if(Math.abs(this.vy) > max) {
      this.vy = (this.vy > 0 ? 1 : -1) * max;
    }
  };
}
