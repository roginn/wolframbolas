// function Player(x, y, radius, angle, attractionColor) {
function Player(config) {

  this.id = Game.numObjects++;
  this.ACCEL_FACTOR = 1;
  this.STATIC_FRIC  = Physics.playerStaticFriction;
  this.DYNAMIC_FRIC = Physics.playerDynamicFriction;

  // simple turning mode
  this.CONST_TURN_FACTOR = 5;   // degrees

  // angular acceleration mode
  this.ANG_ACCEL_FACTOR  = 0.8; // degrees / tick^2
  this.ANG_DYNAMIC_FRIC  = 0.9;
  this.ANG_STATIC_FRIC   = 0.5;

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

  this.vang  = 0;      // angular velocity, degrees/tick
  this.accelCount = 0; // how many times it was accelerated

  this.useAngularAccel = false;
  this.useWiggle       = false;
  this.graphics = Graphics.buildPlayerAvatar(this);

  Game.allElements.push(this);
  Game.movableElements.push(this);
  Game.flavors[this.group] = Game.flavors[this.group] || {};
  Game.flavors[this.group].size = Game.flavors[this.group].size || 0;
  var flavorSize = Game.flavors[this.group].size;
  Game.flavors[this.group][this.id] = flavorSize;
  Game.flavors[this.group].size++;

  this.accelerate = function() {
    this._accelerate(this.ACCEL_FACTOR);
    this._wiggle();
  };

  this.decelerate = function() {
    this._accelerate(-1 * this.ACCEL_FACTOR);
    this._wiggle();
  };

  this.getSpeed = function() {
    return Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
  };

  this.getState = function() {
    return {
      x: this.x,
      y: this.y,
      vx: this.vx,
      vy: this.vy,
      angle: this.angle
    };
  };

  this.loadState = function(state) {
    this.x     = state.x;
    this.y     = state.y;
    this.vx    = state.vx;
    this.vy    = state.vy;
    this.angle = state.angle;
  };

  this.tickPosition = function() {
    this._applyAngFriction();
    this._applyAngVelocity();
    this._applyFriction();
    this._checkMaxVelocity();
    this._applyVelocity();
    this.graphics.setPosition(this.x, this.y);
    this.graphics.rotate(this.angle);
  };

  this.turnClockwise = function() {
    if(this.useAngularAccel) {
      this._angAccelerate(-1 * this.ANG_ACCEL_FACTOR);
    } else {
      this.angle = (360 + this.angle - this.CONST_TURN_FACTOR) % 360;
    }
  };

  this.turnCounterClockwise = function() {
    if(this.useAngularAccel) {
      this._angAccelerate(this.ANG_ACCEL_FACTOR);
    } else {
      this.angle = (this.angle + this.CONST_TURN_FACTOR) % 360;
    }
  };

  //
  // private
  //

  this._accelerate = function(factor) {
    this.vx += Math.cos(this.angle * Math.PI / 180) * factor;
    this.vy -= Math.sin(this.angle * Math.PI / 180) * factor;
  };

  this._angAccelerate = function(factor) {
    this.vang += factor;
  };

  // reduces angular velocity
  this._applyAngFriction = function() {
    if(Math.abs(this.vang) > this.ANG_STATIC_FRIC) {
      this.vang *= this.ANG_DYNAMIC_FRIC;
    } else {
      this.vang = 0;
    }
  };

  // updates angle based on angular velocity
  this._applyAngVelocity = function() {
    if(!this.useAngularAccel) return;

    var sign = (this.vang >= 0 ? 1 : -1);
    this.angle = (360 + this.angle + (Math.abs(this.vang) % 360) * sign) % 360;
  };

  // reduces velocity
  this._applyFriction = function() {
    if(this.getSpeed() > this.STATIC_FRIC) {
      this.vx *= this.DYNAMIC_FRIC;
      this.vy *= this.DYNAMIC_FRIC;
    } else {
      this.vx = this.vy = 0;
    }
  };

  // updates (x,y) based on velocity
  this._applyVelocity = function() {
    this.x += this.vx;
    this.y += this.vy;
  };

  this._checkMaxVelocity = function() {
    var max = Physics.maxVelocity;
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

  this._wiggle = function() {
    if(!this.useWiggle) return;

    this.accelCount++;
    this.angle += 10*Math.sin(this.accelCount);
  };
}
