function tickControls() {
  if (keySetA.leftHeld)     { Game.player1.turnCounterClockwise(); }
  if (keySetA.rightHeld)    { Game.player1.turnClockwise(); }
  if (keySetA.forwardHeld)  { Game.player1.accelerate(); }
  if (keySetA.backwardHeld) { Game.player1.decelerate(); }

  if (keySetB.leftHeld)     { Game.player2.turnCounterClockwise(); }
  if (keySetB.rightHeld)    { Game.player2.turnClockwise(); }
  if (keySetB.forwardHeld)  { Game.player2.accelerate(); }
  if (keySetB.backwardHeld) { Game.player2.decelerate(); }
}

function tickPositions() {
  for(i in Game.movableElements) {
    var e = Game.movableElements[i];
    e.tickPosition();
  }
}

function handleTick() {
  // handle key presses
  tickControls();

  // handle objects movement
  tickPositions();

  // wrap movable elements in toroid
  wrapMap();

  // debug text
  var debugText = "angle: " + Game.player1.angle;
  debugText += "\n\nspeed: " + Game.player1.getSpeed().toFixed(2);
  debugText += "\n\nvel. x: " + Game.player1.vx.toFixed(2);
  debugText += "\n\nvel. y: " + Game.player1.vy.toFixed(2);
  debugText += "\n\npos. x: " + Game.player1.x.toFixed(2);
  debugText += "\n\npos. y: " + Game.player1.y.toFixed(2);
  Graphics.drawDebugText(debugText);

  Graphics.update();
}

function wrapMap() {
  for(i in Game.movableElements) {
    var e = Game.movableElements[i];

    if (e.x > Game.area.width) { e.x = 0; }
    else if (e.x < 0)          { e.x = Game.area.width; }

    if (e.y > Game.area.height) { e.y = 0; }
    else if (e.y < 0)           { e.y = Game.area.height; }
  }
}

Game.init();
