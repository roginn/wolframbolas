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
  for(var i in Game.movableElements) {
    var e = Game.movableElements[i];
    e.tickPosition();
  }
}

function elasticCollision(a, b) {
  var normal = new Vector(a.x - b.x, a.y - b.y).normalize(),
  tangent = normal.getPerpendicular(),
  av  = new Vector(a.vx, a.vy),
  bv  = new Vector(b.vx, b.vy),
  avn = normal.dotProduct(av),  // decompose normal component
  bvn = normal.dotProduct(bv),
  avt = tangent.dotProduct(av), // decompose tangent component
  bvt = tangent.dotProduct(bv),
  am  = a.mass,
  bm  = b.mass,
  avnAfter = bvnAfter = avtAfter = bvtAfter = null, // scalars
  avAfter = bvAfter = null;                         // vectors

  // Game.debug('normal: (' + normal.x + ', ' + normal.y + ')');
  // Game.debug('tangent: (' + tangent.x + ', ' + tangent.y + ')');

  if(am + bm == 0) {
    Game.debug('ERROR: sum of object masses must not be zero');
    return;
  }

  // calculate collision on normal components
  avnAfter = avn * (am - bm) + 2 * bm * bvn;
  avnAfter /= (am + bm);

  bvnAfter = bvn * (bm - am) + 2 * am * avn;
  bvnAfter /= (am + bm);

  // tangent components stay the same
  avtAfter = avt;
  bvtAfter = bvt;

  // make resulting vectors
  avAfter = normal.getScaled(avnAfter).add(tangent.getScaled(avtAfter));
  bvAfter = normal.getScaled(bvnAfter).add(tangent.getScaled(bvtAfter));

  // return new velocities
  return {
    av: avAfter,
    bv: bvAfter
  };
}

function detectCollisions() {
  var elementCount = Game.movableElements.length;

  for(var i = 0; i < elementCount; ++i) {
    var e1 = Game.movableElements[i];

    for(var j = i + 1; j < elementCount; ++j) {
      var e2 = Game.movableElements[j],
      centerDist = new Vector(e1.x - e2.x, e1.y - e2.y),
      radiusSum = e1.radius + e2.radius;

      if(centerDist.getMagnitude() <= radiusSum){
        Game.debug('collision between objects ' + i + ' and ' + j);
        var velAfter = elasticCollision(e1, e2);

        e1.vx = velAfter.av.x;
        e1.vy = velAfter.av.y;
        e2.vx = velAfter.bv.x;
        e2.vy = velAfter.bv.y;
      }
    }
  }
}

function handleTick() {
  // handle key presses
  tickControls();

  // wrap movable elements in toroid
  wrapMap();

  detectCollisions();

  // handle objects movement
  tickPositions();


  // debug text
  var debugText = "angle: " + Game.player1.angle;
  debugText += "\n\nang: " + Game.player1.vang;
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
