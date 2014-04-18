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

function handleKeyDown(e) {
  if(!e){ var e = window.event; }
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
  if(!e){ var e = window.event; }
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

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;
