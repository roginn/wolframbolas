var Game = {
  allElements: [],
  area: {
    height: 600,
    width: 1200
  },
  debugMode: true,
  energy: 0,
  flavors: {},
  localPlayer: null,
  maxRecordedSpeed: 0,
  movableElements: [],
  numObjects: 0,
  physics: {
    enableGravity: true,
    gravityFactor: 0.1,
    ballDynamicFriction: 0.95,
    ballStaticFriction: 0.1,
    collisionElasticity: 0.7,
    maxVelocity: 15,
    playerDynamicFriction: 0.95,
    playerStaticFriction: 0.4
  },
  player1: null,
  player2: null,
  remotePlayer: null,
  remoteTurn: 0,
  staticElements: [],
  turn: 0,
  useNetwork: true,

  cleanUp: function() {
    Game.movableElements.length = 0;
    Game.staticElements.length = 0;
    Game.flavors = {};
    Game.maxRecordedSpeed = 0;
    Game.numObjects = 0;
    Graphics.cleanUp();
  },

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

    // createBall(Game.player1.x - 40, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 80, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 120, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 160, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 200, Game.player1.y, 20, 1, purple);

    // createBall(Game.player2.x + 40, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 80, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 120, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 160, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 200, Game.player2.y, 20, 2, wtf);
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

    if(Network.isHost) {
      Game.localPlayer = Game.player1;
      Game.remotePlayer = Game.player2;
    } else {
      Game.localPlayer = Game.player2;
      Game.remotePlayer = Game.player1;
    }
  },

  createWalls: function() {
    var goalWidth = 100,
    goalHeight = 300,
    areaWidth = Game.area.width,
    areaHeight = Game.area.height;

    function createVertex(x, y) {
      new Ball({
        x: x,
        y: y,
        radius: 3,
        group: -1,
        color: "white",
        mass: 1e20
      });
    }

    new Wall(goalWidth, 0, areaWidth - goalWidth, 0);
    new Wall(areaWidth - goalWidth, 0, areaWidth - goalWidth, (areaHeight - goalHeight)/2);
    createVertex(areaWidth - goalWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, (areaHeight + goalHeight)/2);
    createVertex(areaWidth - goalWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, areaHeight);
    new Wall(areaWidth - goalWidth, areaHeight, goalWidth, areaHeight);
    new Wall(goalWidth, areaHeight, goalWidth, (areaHeight + goalHeight)/2);
    createVertex(goalWidth, (areaHeight + goalHeight)/2);
    new Wall(goalWidth, (areaHeight + goalHeight)/2, 0, (areaHeight + goalHeight)/2);
    new Wall(0, (areaHeight + goalHeight)/2, 0, (areaHeight - goalHeight)/2);
    new Wall(0, (areaHeight - goalHeight)/2, goalWidth, (areaHeight - goalHeight)/2);
    createVertex(goalWidth, (areaHeight - goalHeight)/2);
    new Wall(goalWidth, (areaHeight - goalHeight)/2, goalWidth, 0);


  },

  debug: function(msg) {
    if(console && console.log && Game.debugMode) {
      console.log('[DEBUG] ' + msg);
    }
  },

  init: function() {
    Game.debug('Initializing graphics');
    Graphics.init();

    Game.debug('Creating movables');
    Game.createPlayers();
    Game.createBalls();

    Game.debug('Creating statics');
    Game.createWalls();

    Game.debug('Controls setup');
    Game.setupControls();

    Game.debug('Initializing framework');
    setTimeout(Framework.init, 2000);

    // if(Game.useNetwork) {
    //   Game.debug('Initializing Network');
      // Network.init();
    // }

    Game.debug('Game started!');
  },

  restart: function() {
    Game.debug('Restarting game...');
    Game.cleanUp();
    Game.init();
  },

  setupControls: function() {
    if(Game.useNetwork) {
      document.onkeydown = handleKeyDownNetwork;
      document.onkeyup = handleKeyUpNetwork;
    } else {
      document.onkeydown = handleKeyDown;
      document.onkeyup = handleKeyUp;
    }
  }
};
