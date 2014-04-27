function KeySet() {
  this.backwardHeld = false;
  this.leftHeld     = false;
  this.rightHeld    = false;
  this.forwardHeld  = false;
};

var KeyControls = {
  KEYCODE_ENTER: 13,
  KEYCODE_SPACE: 32,

  KEYCODE_LEFT:  37,
  KEYCODE_UP:    38,
  KEYCODE_RIGHT: 39,
  KEYCODE_DOWN:  40,

  KEYCODE_W:     87,
  KEYCODE_A:     65,
  KEYCODE_S:     83,
  KEYCODE_D:     68,

  keySetA:      new KeySet(),
  keySetB:      new KeySet(),
  keySetLocal:  new KeySet(),
  keySetRemote: new KeySet(),

  makeControlTicker: function(keySetX, keySetY, playerX, playerY) {
    return function() {
      if(keySetX.leftHeld)     { playerX.turnCounterClockwise(); }
      if(keySetX.rightHeld)    { playerX.turnClockwise(); }
      if(keySetX.forwardHeld)  { playerX.accelerate(); }
      if(keySetX.backwardHeld) { playerX.decelerate(); }

      if(keySetY.leftHeld)     { playerY.turnCounterClockwise(); }
      if(keySetY.rightHeld)    { playerY.turnClockwise(); }
      if(keySetY.forwardHeld)  { playerY.accelerate(); }
      if(keySetY.backwardHeld) { playerY.decelerate(); }
    }
  },

  makeKeyEventHandler: function(arrowHandler, wasdHandler) {
    // if only one handler was provided, both arrows and WASD should use it
    if(typeof wasdHandler === 'undefined') {
      wasdHandler = arrowHandler;
    }

    return function handleKeyEvent(e) {
      switch(e.keyCode) {
      case KeyControls.KEYCODE_UP:    arrowHandler('forward');  break;
      case KeyControls.KEYCODE_LEFT:  arrowHandler('left');     break;
      case KeyControls.KEYCODE_DOWN:  arrowHandler('backward'); break;
      case KeyControls.KEYCODE_RIGHT: arrowHandler('right');    break;

      case KeyControls.KEYCODE_W: wasdHandler('forward');  break;
      case KeyControls.KEYCODE_A: wasdHandler('left');     break;
      case KeyControls.KEYCODE_S: wasdHandler('backward'); break;
      case KeyControls.KEYCODE_D: wasdHandler('right');    break;
      }

      return false;
    }
  },

  setup: function() {
    if(Game.useNetwork) {
      KeyControls.setupNetworkControls();
      KeyControls.tickControls = KeyControls.makeControlTicker(
        KeyControls.keySetLocal,
        KeyControls.keySetRemote,
        Game.localPlayer,
        Game.remotePlayer);
    } else {
      KeyControls.setupLocalControls();
      KeyControls.tickControls = KeyControls.makeControlTicker(
        KeyControls.keySetB,
        KeyControls.keySetA,
        Game.player1,
        Game.player2);
    }
  },

  setupLocalControls: function() {
    document.onkeydown = KeyControls.makeKeyEventHandler(
      function(direction){ KeyControls.keySetA[direction + 'Held'] = true; },
      function(direction){ KeyControls.keySetB[direction + 'Held'] = true; }
    );

    document.onkeyup = KeyControls.makeKeyEventHandler(
      function(direction){ KeyControls.keySetA[direction + 'Held'] = false; },
      function(direction){ KeyControls.keySetB[direction + 'Held'] = false; }
    );
  },

  setupNetworkControls: function() {
    var networkKeyMap = {
      forward:  0,
      left:     1,
      backward: 2,
      right:    3
    };

    document.onkeydown = KeyControls.makeKeyEventHandler(function (direction) {
      if(!KeyControls.keySetLocal[direction + 'Held']) {
        Network.keyDown(networkKeyMap[direction]);
        KeyControls.keySetLocal[direction + 'Held'] = true;
      }
    });

    document.onkeyup = KeyControls.makeKeyEventHandler(function (direction) {
      if(KeyControls.keySetLocal[direction + 'Held']) {
        Network.keyUp(networkKeyMap[direction]);
        KeyControls.keySetLocal[direction + 'Held'] = false;
      }
    });
  }
};
