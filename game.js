var Game = {
  area: {
    height: 600,
    width: 1200
  },
  debugMode: false,
  debugPlayer: 0,
  debugWall: 0,
  flavors: {},
  movableElements: [],
  numObjects: 0,
  physics: {
    enableGravity: true,
    gravityFactor: 0.1,
    ballDynamicFriction: 0.95,
    ballStaticFriction: 0.1,
    collisionElasticity: 0.7,
    maxVelocity: 10,
    playerDynamicFriction: 0.95,
    playerStaticFriction: 0.4
  },
  player1: null,
  player2: null,
  staticElements: [],

  createBalls: function() {
    function createBall(x, y, radius, group, color){
      new Ball({
        x: x,
        y: y,
        radius: radius,
        group: group,
        color: color,
        attractionOrder: ++attractionOrder
      });
    }

    var green = "#46ac39",
    purple = "#4639ac",
    wtf = "#aca039",
    attractionOrder = 0;

    createBall(Game.area.width/2, Game.area.height/2, 70, 0, green);

    createBall(Game.player1.x - 40, Game.player1.y, 20, 1, purple);
    createBall(Game.player1.x - 80, Game.player1.y, 20, 1, purple);
    createBall(Game.player1.x - 120, Game.player1.y, 20, 1, purple);
    createBall(Game.player1.x - 160, Game.player1.y, 20, 1, purple);

    createBall(Game.player2.x + 40, Game.player2.y, 20, 2, wtf);
    createBall(Game.player2.x + 80, Game.player2.y, 20, 2, wtf);
    createBall(Game.player2.x + 120, Game.player2.y, 20, 2, wtf);
    createBall(Game.player2.x + 160, Game.player2.y, 20, 2, wtf);
  },

  createPlayers: function() {
    var playerRadius = 30;

    Game.player1 = new Player({
      x: 300,
      y: Game.area.height/2,
      radius: playerRadius,
      angle: 0,
      group: 1
    });

    Game.player2 = new Player({
      x: Game.area.width - 300,
      y: Game.area.height/2,
      radius: playerRadius,
      angle: 180,
      group: 2
    });

    // Game.movableElements.push(Game.player2);
  },

  createWalls: function() {
    var goalWidth = 100,
    goalHeight = 300,
    areaWidth = Game.area.width,
    areaHeight = Game.area.height;

    new Wall(goalWidth, 0, areaWidth - goalWidth, 0);
    new Wall(areaWidth - goalWidth, 0, areaWidth - goalWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, areaHeight);
    new Wall(areaWidth - goalWidth, areaHeight, goalWidth, areaHeight);
    new Wall(goalWidth, areaHeight, goalWidth, (areaHeight + goalHeight)/2);
    new Wall(goalWidth, (areaHeight + goalHeight)/2, 0, (areaHeight + goalHeight)/2);
    new Wall(0, (areaHeight + goalHeight)/2, 0, (areaHeight - goalHeight)/2);
    new Wall(0, (areaHeight - goalHeight)/2, goalWidth, (areaHeight - goalHeight)/2);
    new Wall(goalWidth, (areaHeight - goalHeight)/2, goalWidth, 0);

  },

  debug: function(msg) {
    if(console && console.log && Game.debugMode) {
      console.log('[DEBUG] ' + msg);
    }
  },

  init: function() {
    Game.debug('Starting game!');
    Game.debug('Initializing framework');
    Framework.init();

    Game.debug('Initializing graphics');
    Graphics.init();

    Game.debug('Creating movables');
    Game.createPlayers();
    Game.createBalls();

    Game.debug('Creating statics');
    Game.createWalls();
  }
};
