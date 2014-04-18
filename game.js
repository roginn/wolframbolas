var Game = {
  area: {
    height: 600,
    width: 800
  },
  debugMode: true,
  movableElements: [],
  player1: null,
  player2: null,

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

    Game.debug('Creating players');
    Game.player1 = new Player(Graphics.buildPlayerAvatar());
    Game.player2 = new Player(Graphics.buildPlayerAvatar());
    Game.movableElements.push(Game.player1);
    Game.movableElements.push(Game.player2);
  }
};
