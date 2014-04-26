function tickControls() {
  if (keySetB.leftHeld)     { Game.player1.turnCounterClockwise(); }
  if (keySetB.rightHeld)    { Game.player1.turnClockwise(); }
  if (keySetB.forwardHeld)  { Game.player1.accelerate(); }
  if (keySetB.backwardHeld) { Game.player1.decelerate(); }

  if (keySetA.leftHeld)     { Game.player2.turnCounterClockwise(); }
  if (keySetA.rightHeld)    { Game.player2.turnClockwise(); }
  if (keySetA.forwardHeld)  { Game.player2.accelerate(); }
  if (keySetA.backwardHeld) { Game.player2.decelerate(); }
}

function tickLocalControls() {
  if (keySetLocal.leftHeld)     { Game.localPlayer.turnCounterClockwise(); }
  if (keySetLocal.rightHeld)    { Game.localPlayer.turnClockwise(); }
  if (keySetLocal.forwardHeld)  { Game.localPlayer.accelerate(); }
  if (keySetLocal.backwardHeld) { Game.localPlayer.decelerate(); }
}

function tickRemoteControls() {
  if (keySetRemote.leftHeld)     { Game.remotePlayer.turnCounterClockwise(); }
  if (keySetRemote.rightHeld)    { Game.remotePlayer.turnClockwise(); }
  if (keySetRemote.forwardHeld)  { Game.remotePlayer.accelerate(); }
  if (keySetRemote.backwardHeld) { Game.remotePlayer.decelerate(); }
}

function tickPositions() {
  for(var i in Game.movableElements) {
    var e = Game.movableElements[i];
    e.tickPosition();
  }
}

function checkIfGoalHappened() {
  var ball = Game.ball,
  lower = (Game.area.height - Game.goal.height)/2,
  upper = (Game.area.height + Game.goal.height)/2,
  left = Game.goal.width,
  right = Game.area.width - Game.goal.width;

  if(ball.y >= lower && ball.y <= upper) {
    if(ball.x < left) {
      handleGoal(2);
    } else if(ball.x > right) {
      handleGoal(1);
    }
  }

}

function handleGoal(player) {
  if(player == 1) {
    Game.score.p1++;
  } else {
    Game.score.p2++;
  }

  if(Game.useNetwork) {
    Game.restartIfNetwork();
  } else {
    Game.restart();
  }

  return;
}

function handleTickNetwork() {
  if(Framework.isTickPaused()) return;
  Framework.pauseTick();

  // careful with this order!
  Game.turn++;
  Network.sendControls(Game.turn);
  handleTickAfterExchange();
}

function handleTickAfterExchange() {
  // both handleTickNetwork and Network.receiveData
  // call this function - it should run only after
  // the game turn has been synchronized
  // Game.debug('Turn: ' + Game.turn + ', remoteTurn: ' + Game.remoteTurn);
  if(Game.remoteTurn != Game.turn) {
    return;
  }

  tickLocalControls();
  tickRemoteControls();

  if(Physics.enableGravity) {
    Physics.fatalAttraction();
  }

  Physics.detectCollisions();

  // handle objects movement
  tickPositions();
  checkIfGoalHappened();
  Graphics.drawScore(Game.score.p1, Game.score.p2);

  Graphics.update();
  Framework.resumeTick();
};

function handleTick() {
  // handle key presses
  tickControls();

  if(Physics.enableGravity) {
    Physics.fatalAttraction();
  }

  Physics.detectCollisions();

  // handle objects movement
  tickPositions();
  checkIfGoalHappened();
  Graphics.drawScore(Game.score.p1, Game.score.p2);


  // debug text
  // Physics.calculateEnergy();
  // var debugText = "Energy: " + Game.energy.toFixed(2);
  // debugText += "\n\nMax speed: " + Game.maxRecordedSpeed.toFixed(2);
  // Graphics.drawDebugText(debugText);

  Graphics.update();
}

function wrapMap() {
  var length = Game.movableElements.length;

  for(var i = 0; i < length; ++i) {
    var e = Game.movableElements[i];

    if (e.x > Game.area.width) { e.x = 0; }
    else if (e.x < 0)          { e.x = Game.area.width; }

    if (e.y > Game.area.height) { e.y = 0; }
    else if (e.y < 0)           { e.y = Game.area.height; }
  }
}

// Game.init();
