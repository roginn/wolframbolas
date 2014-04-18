var Game = {
  area: {
    height: 600,
    width: 800
  },
  debugMode: false,
  movableElements: [],
  player1: null,
  player2: null,
  ball: null,

  debug: function(msg) {
    if(console && console.log && Game.debugMode) {
      console.log('[DEBUG] ' + msg);
    }
  },

  init: function() {
    var playerRadius = 60,
    ballRadius = 30;

    Game.debug('Starting game!');
    Game.debug('Initializing framework');
    Framework.init();

    Game.debug('Initializing graphics');
    Graphics.init();

    Game.debug('Creating players');
    Game.player1 = new Player(playerRadius,
                              Game.area.height/2,
                              playerRadius,
                              0);
    Game.player2 = new Player(Game.area.width - playerRadius,
                              Game.area.height/2,
                              playerRadius,
                              180);
    Game.ball = new Ball(Game.area.width/2,
                         Game.area.height/2,
                         ballRadius,
                         0);

    Game.movableElements.push(Game.player1);
    Game.movableElements.push(Game.player2);
    Game.movableElements.push(Game.ball);
  }
};
