var Physics = {

  ballDynamicFriction: 0.95,
  ballStaticFriction: 0.1,
  collisionElasticity: 0.7,
  enableGravity: true,
  gravityFactor: 0.1,
  maxVelocity: 15,
  playerDynamicFriction: 0.95,
  playerStaticFriction: 0.4,

  calculateEnergy: function() {
    var objLength = Game.movableElements.length;
    Game.energy = 0;

    for(var i = 0; i < objLength; ++i) {
      var obj = Game.movableElements[i];
      Game.energy += Math.pow(obj.getSpeed(),2) * obj.mass;
    }
  },

  checkIfGoalHappened: function() {
    var ball = Game.ball,
    lower = (Game.area.height - Game.goal.height)/2,
    upper = (Game.area.height + Game.goal.height)/2,
    left = Game.goal.width,
    right = Game.area.width - Game.goal.width;

    if(ball.y >= lower && ball.y <= upper) {
      if(ball.x < left) {
        Game.handleGoal(2);
      } else if(ball.x > right) {
        Game.handleGoal(1);
      }
    }
  },

  collideMovables: function(a, b, normal) {
    var elasticity = Physics.collisionElasticity,
    tangent = normal.getPerpendicular(),
    av  = new Vector(a.vx, a.vy),
    bv  = new Vector(b.vx, b.vy),
    avn = normal.dotProduct(av),  // decompose normal component
    bvn = normal.dotProduct(bv),
    avt = tangent.dotProduct(av), // decompose tangent component
    bvt = tangent.dotProduct(bv),
    am  = a.mass,
    bm  = b.mass,
    avnAfter, bvnAfter, avtAfter, bvtAfter, // scalars
    avAfter, bvAfter;                       // vectors

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

    // apply elasticity
    avAfter.scale(elasticity);
    bvAfter.scale(elasticity);

    // return new velocities
    return {
      av: avAfter,
      bv: bvAfter
    };
  },

  collideMovableStatic: function(m, s, normal) {
    var elasticity = Physics.collisionElasticity,
    tangent = normal.getPerpendicular(),
    v  = new Vector(m.vx, m.vy),
    vn = normal.dotProduct(v),  // decompose normal component
    vt = tangent.dotProduct(v), // decompose tangent component
    vnAfter, vtAfter, vAfter;

    vnAfter = -1 * vn;
    vtAfter = vt;

    vAfter = normal.getScaled(vnAfter).add(tangent.getScaled(vtAfter));
    vAfter.scale(elasticity);

    return {
      vAfter: vAfter,
      normal: normal.getScaled(Math.abs(vnAfter))
    };
  },

  detectCollisions: function() {
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
          // Game.debug('collision between objects ' + i + ' and ' + j);
          var normal = new Vector(m1.x - m2.x, m1.y - m2.y).normalize();
          var v1 = new Vector(m1.vx, m1.vy);
          var v2 = new Vector(m2.vx, m2.vy);
          var v12 = -1 * v1.dotProduct(normal);
          var v21 = v2.dotProduct(normal);

          if(v12 + v21 > 0) {
            var velAfter = Physics.collideMovables(m1, m2, normal.getNormalized());

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
          var collision = Physics.collideMovableStatic(m1, s, vDist.getNormalized()),
          normal = collision.normal,
          velocity = new Vector(m1.vx, m1.vy);


          if(normal.dotProduct(velocity) < 0) {
            // set new velocity
            m1.vx = collision.vAfter.x;
            m1.vy = collision.vAfter.y;
          }
        }
      }
    }
  },

  fatalAttraction: function() {
    var alpha = Physics.gravityFactor;
    objLength = Game.movableElements.length;

    for(var i = 0; i < objLength; ++i) {
      var m1 = Game.movableElements[i];

      for(var j = i + 1; j < objLength; ++j) {
        var m2 = Game.movableElements[j],
        vDist = new Vector(m2.x - m1.x, m2.y - m1.y),

        // gravity-like force (~ k/(x^2))
        // force = alpha * m1.mass * m2.mass / vDist.dotProduct(vDist);

        // spring-like force (~ kx)
        force = alpha * (vDist.getMagnitude() - m1.radius - m2.radius) / m2.mass;

        if(m1.group != m2.group) continue;
        var order1 = Game.flavors[m1.group][m1.id];
        var order2 = Game.flavors[m2.group][m2.id];
        if(Math.abs(order1 - order2) != 1) continue;

        var f1 = vDist.getNormalized().getScaled(force);
        // m1.vx += f1.x;
        // m1.vy += f1.y;

        var f2 = f1.getScaled(-1);
        m2.vx += f2.x;
        m2.vy += f2.y;
      }
    }
  },

  tickPositions: function() {
    if(Physics.enableGravity) {
      Physics.fatalAttraction();
    }

    Physics.detectCollisions();

    for(var i in Game.movableElements) {
      if(!Game.movableElements.hasOwnProperty(i)) continue;

      var e = Game.movableElements[i];
      e.tickPosition();
    }

    Physics.checkIfGoalHappened();
  }
};
