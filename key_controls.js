var KEYCODE_ENTER = 13;
var KEYCODE_SPACE = 32;

var KEYCODE_LEFT  = 37;
var KEYCODE_UP    = 38;
var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN  = 40;

var KEYCODE_W     = 87;
var KEYCODE_A     = 65;
var KEYCODE_S     = 83;
var KEYCODE_D     = 68;

keySetA = {
  backwardHeld: false,
  leftHeld:     false,
  rightHeld:    false,
  forwardHeld:  false
};

keySetB = {
  backwardHeld: false,
  leftHeld:     false,
  rightHeld:    false,
  forwardHeld:  false
};

keySetLocal = {
  backwardHeld: false,
  leftHeld:     false,
  rightHeld:    false,
  forwardHeld:  false
};

keySetRemote = {
  backwardHeld: false,
  leftHeld:     false,
  rightHeld:    false,
  forwardHeld:  false
};

function handleKeyDown(e) {
  // if(!e){ var e = window.event; }
  switch(e.keyCode) {
  case KEYCODE_UP:    keySetA.forwardHeld  = true; break;
  case KEYCODE_LEFT:  keySetA.leftHeld     = true; break;
  case KEYCODE_DOWN:  keySetA.backwardHeld = true; break;
  case KEYCODE_RIGHT: keySetA.rightHeld    = true; break;

  case KEYCODE_W: keySetB.forwardHeld  = true; break;
  case KEYCODE_A: keySetB.leftHeld     = true; break;
  case KEYCODE_S: keySetB.backwardHeld = true; break;
  case KEYCODE_D: keySetB.rightHeld    = true; break;
  }

  return false;
}

function handleKeyUp(e) {
  // if(!e){ var e = window.event; }
  switch(e.keyCode) {
  case KEYCODE_UP:    keySetA.forwardHeld  = false; break;
  case KEYCODE_LEFT:  keySetA.leftHeld     = false; break;
  case KEYCODE_DOWN:  keySetA.backwardHeld = false; break;
  case KEYCODE_RIGHT: keySetA.rightHeld    = false; break;

  case KEYCODE_W: keySetB.forwardHeld  = false; break;
  case KEYCODE_A: keySetB.leftHeld     = false; break;
  case KEYCODE_S: keySetB.backwardHeld = false; break;
  case KEYCODE_D: keySetB.rightHeld    = false; break;
  }

  return false;
}

function handleKeyDownNetwork(e) {
  // if(!e){ var e = window.event; }
  switch(e.keyCode) {
  case KEYCODE_UP:
  case KEYCODE_W: {
    if(!keySetLocal.forwardHeld) {
      Network.keyDown(0);
      keySetLocal.forwardHeld = true;
    }
    break; }

  case KEYCODE_LEFT:
  case KEYCODE_A: {
    if(!keySetLocal.leftHeld) {
      Network.keyDown(1);
      keySetLocal.leftHeld = true;
    }
    break; }

  case KEYCODE_DOWN:
  case KEYCODE_S: {
    if(!keySetLocal.backwardHeld) {
      Network.keyDown(2);
      keySetLocal.backwardHeld = true;
    }
    break; }

  case KEYCODE_RIGHT:
  case KEYCODE_D: {
    if(!keySetLocal.rightHeld) {
      Network.keyDown(3);
      keySetLocal.rightHeld = true;
    }
    break; }
  }

  return false;
}

function handleKeyUpNetwork(e) {
  // if(!e){ var e = window.event; }
  switch(e.keyCode) {
  case KEYCODE_UP:
  case KEYCODE_W: {
    if(keySetLocal.forwardHeld) {
      Network.keyUp(0);
      keySetLocal.forwardHeld = false;
    }
    break; }

  case KEYCODE_LEFT:
  case KEYCODE_A: {
    if(keySetLocal.leftHeld) {
      Network.keyUp(1);
      keySetLocal.leftHeld = false;
    }
    break; }

  case KEYCODE_DOWN:
  case KEYCODE_S: {
    if(keySetLocal.backwardHeld) {
      Network.keyUp(2);
      keySetLocal.backwardHeld = false;
    }
    break; }

  case KEYCODE_RIGHT:
  case KEYCODE_D: {
    if(keySetLocal.rightHeld) {
      Network.keyUp(3);
      keySetLocal.rightHeld = false;
    }
    break; }
  }

  return false;
}

function tickControls() {
  if(Game.useNetwork) {
    if(keySetLocal.leftHeld)     { Game.localPlayer.turnCounterClockwise(); }
    if(keySetLocal.rightHeld)    { Game.localPlayer.turnClockwise(); }
    if(keySetLocal.forwardHeld)  { Game.localPlayer.accelerate(); }
    if(keySetLocal.backwardHeld) { Game.localPlayer.decelerate(); }

    if(keySetRemote.leftHeld)     { Game.remotePlayer.turnCounterClockwise(); }
    if(keySetRemote.rightHeld)    { Game.remotePlayer.turnClockwise(); }
    if(keySetRemote.forwardHeld)  { Game.remotePlayer.accelerate(); }
    if(keySetRemote.backwardHeld) { Game.remotePlayer.decelerate(); }

  } else {

    if(keySetB.leftHeld)     { Game.player1.turnCounterClockwise(); }
    if(keySetB.rightHeld)    { Game.player1.turnClockwise(); }
    if(keySetB.forwardHeld)  { Game.player1.accelerate(); }
    if(keySetB.backwardHeld) { Game.player1.decelerate(); }

    if(keySetA.leftHeld)     { Game.player2.turnCounterClockwise(); }
    if(keySetA.rightHeld)    { Game.player2.turnClockwise(); }
    if(keySetA.forwardHeld)  { Game.player2.accelerate(); }
    if(keySetA.backwardHeld) { Game.player2.decelerate(); }
  }
}
