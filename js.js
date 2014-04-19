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

function tickPositions() {
  for(var i in Game.movableElements) {
    var e = Game.movableElements[i];
    e.tickPosition();
  }
}

function fatalAttraction() {
  var alpha = 10,
  objLength = Game.movableElements.length;

  for(var i = 0; i < objLength; ++i) {
    var m1 = Game.movableElements[i];

    for(var j = i + 1; j < objLength; ++j) {
      var m2 = Game.movableElements[j],
      vDist = new Vector(m2.x - m1.x, m2.y - m1.y),
      force = alpha * m1.mass * m2.mass / vDist.dotProduct(vDist);
      if(force < 0.01) continue;
      // console.log(force);

      var f1 = vDist.getNormalized().getScaled(force);
      m2.vx += f1.x;
      m2.vy += f1.y;

      var f2 = f1.getScaled(-1);
      // m1.vx = f2.x;
      // m1.vy = f2.y;
    }
  }
}

function collideMovableStatic(m, s, normal) {
  var tangent = normal.getPerpendicular(),
  v  = new Vector(m.vx, m.vy),
  vn = normal.dotProduct(v),  // decompose normal component
  vt = tangent.dotProduct(v), // decompose tangent component
  vnAfter, vtAfter, vAfter;

  vnAfter = -1 * vn;
  vtAfter = vt;

  vAfter = normal.getScaled(vnAfter).add(tangent.getScaled(vtAfter));

  return {
    vAfter: vAfter,
    normal: normal.getScaled(Math.abs(vnAfter))
  };
}

function collideMovables(a, b, normal) {
  var tangent = normal.getPerpendicular(),
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

  if(am + bm === 0) {
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
  var movableCount = Game.movableElements.length,
  staticCount = Game.staticElements.length;

  for(var i = 0; i < movableCount; ++i) {
    var m1 = Game.movableElements[i];

    // movable-movable collisions
    for(var j = i + 1; j < movableCount; ++j) {
      var m2 = Game.movableElements[j],
      centerDist = new Vector(m1.x - m2.x, m1.y - m2.y),
      radiusSum = m1.radius + m2.radius;

      if(centerDist.getMagnitude() <= radiusSum){
        Game.debug('collision between objects ' + i + ' and ' + j);
        var normal = new Vector(m1.x - m2.x, m1.y - m2.y).normalize();
        var v1 = new Vector(m1.vx, m1.vy);
        var v2 = new Vector(m2.vx, m2.vy);
        var v12 = -1 * v1.dotProduct(normal);
        var v21 = v2.dotProduct(normal);

        if(v12 + v21 > 0) {
          var velAfter = collideMovables(m1, m2, normal.getNormalized());

          m1.vx = velAfter.av.x;
          m1.vy = velAfter.av.y;
          m2.vx = velAfter.bv.x;
          m2.vy = velAfter.bv.y;
        }

      }
    }

    // movable-static collisions
    for(var j = 0; j < staticCount; ++j) {
      // A, B: vertices of the static element
      // C: center of the movable element
      var s = Game.staticElements[j],
      vAB = new Vector(s.x2 - s.x1, s.y2 - s.y1),
      vAC = new Vector(m1.x - s.x1, m1.y - s.y1),
      vBC = new Vector(s.x2 - m1.x, s.y2 - m1.y),
      projAC_AB = vAC.dotProduct(vAB) / vAB.getMagnitude(),
      vProjAC_AB = vAB.getNormalized().getScaled(projAC_AB),
      vDist = vProjAC_AB.getScaled(-1).add(vAC),
      dist = vDist.getMagnitude();

      if(dist < m1.radius &&
         vAB.dotProduct(vAC)*vAB.dotProduct(vBC) >= 0)
      {
        var collision = collideMovableStatic(m1, s, vDist.getNormalized()),
        normal = collision.normal,
        velocity = new Vector(m1.vx, m1.vy);


        if(normal.dotProduct(velocity) < 0) {
          // set new velocity
          m1.vx = collision.vAfter.x;
          m1.vy = collision.vAfter.y;
        }

        // if(i == Game.debugPlayer && j == Game.debugWall) {
        //   var debugText = "";
        //   debugText += "vAC: " + vAC.getMagnitude().toFixed(2);
        //   debugText += "\n\nvBC: " + vBC.getMagnitude().toFixed(2);
        //   debugText += "\n\nproj: " + projAC_AB.toFixed(2);
        //   debugText += "\n\nvDist: " + vDist.getMagnitude().toFixed(2);
        //   debugText += "\n\nvDist: (" + vDist.x.toFixed(2) + ", " + vDist.y.toFixed(2) + ")";
        //   debugText += "\n\nnormal: (" + normal.x.toFixed(2) + ", " + normal.y.toFixed(2) + ")";
        //   debugText += "\n\nvAB.vAC: " + vAB.dotProduct(vAC).toFixed(2);
        //   debugText += "\n\nvAB.vBC: " + vAB.dotProduct(vBC).toFixed(2);
        //   Graphics.drawDebugText(debugText);
        // }
      }
    }
  }
}

function handleTick() {
  // handle key presses
  tickControls();

  fatalAttraction();

  detectCollisions();

  // handle objects movement
  tickPositions();


  // debug text
  // var debugText = "angle: " + Game.player1.angle.toFixed(2);
  // debugText += "\n\nang: " + Game.player1.vang;
  // debugText += "\n\nspeed: " + Game.player1.getSpeed().toFixed(2);
  // debugText += "\n\nvel. x: " + Game.player1.vx.toFixed(2);
  // debugText += "\n\nvel. y: " + Game.player1.vy.toFixed(2);
  // debugText += "\n\npos. x: " + Game.player1.x.toFixed(2);
  // debugText += "\n\npos. y: " + Game.player1.y.toFixed(2);
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

Game.init();
