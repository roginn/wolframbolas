var Game = {
  area: {
    height: 600,
    width: 800
  },
  ball: null,
  debugMode: false,
  debugPlayer: 0,
  debugWall: 0,
  movableElements: [],
  player1: null,
  player2: null,
  staticElements: [],

  createBall: function() {
    var ballRadius = 30;

    Game.ball = new Ball(Game.area.width/2,
                         Game.area.height/2,
                         ballRadius,
                         0);

    Game.movableElements.push(Game.ball);
  },

  createPlayers: function() {
    var playerRadius = 60;

    Game.player1 = new Player(2*playerRadius,
                              Game.area.height/2,
                              playerRadius,
                              0);
    Game.player2 = new Player(Game.area.width - 2*playerRadius,
                              Game.area.height/2,
                              playerRadius,
                              180);

    Game.movableElements.push(Game.player1);
    Game.movableElements.push(Game.player2);
  },

  createWalls: function() {
    var n = new Wall(0, 0, Game.area.width, 0),
    e = new Wall(Game.area.width, 0, Game.area.width, Game.area.height),
    s = new Wall(Game.area.width, Game.area.height, 0, Game.area.height),
    w = new Wall(0, Game.area.height, 0, 0);

    Game.staticElements.push(n);
    Game.staticElements.push(e);
    Game.staticElements.push(w);
    Game.staticElements.push(s);
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
    Game.createBall();

    Game.debug('Creating statics');
    Game.createWalls();
  }
};
