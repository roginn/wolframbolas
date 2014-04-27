var Game = {
  allElements: [],
  area: {
    height: 600,
    width: 1200
  },
  ball: null,
  debugMode: true,
  energy: 0,
  flavors: {},
  goal: {
    height: 300,
    width: 100
  },
  localPlayer: null,
  maxRecordedSpeed: 0,
  movableElements: [],
  numObjects: 0,
  player1: null,
  player2: null,
  remotePlayer: null,
  remoteTurn: 0,
  score: {
    p1: 0,
    p2: 0
  },
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

  debug: function(msg) {
    if(console && console.log && Game.debugMode) {
      console.log('[DEBUG] ' + msg);
    }
  },

  handleGoal: function(player) {
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
  },

  handleTickNetwork: function() {
    if(Framework.isTickPaused()) return;
    Framework.pauseTick();

    // careful with this order!
    Game.turn++;
    Network.sendControls(Game.turn);
    Game.handleTickAfterExchange();
  },

  handleTickAfterExchange: function() {
    // both handleTickNetwork and Network.receiveData
    // call this function - it should run only after
    // the game turn has been synchronized
    // Game.debug('Turn: ' + Game.turn + ', remoteTurn: ' + Game.remoteTurn);
    if(Game.remoteTurn != Game.turn) {
      return;
    }

    KeyControls.tickControls();

    if(Physics.enableGravity) {
      Physics.fatalAttraction();
    }

    Physics.detectCollisions();

    // handle objects movement
    Physics.tickPositions();
    Graphics.drawScore(Game.score.p1, Game.score.p2);

    Graphics.update();
    Framework.resumeTick();
  },

  handleTick: function() {
    // handle key presses
    KeyControls.tickControls();

    if(Physics.enableGravity) {
      Physics.fatalAttraction();
    }

    Physics.detectCollisions();

    // handle objects movement
    Physics.tickPositions();
    Graphics.drawScore(Game.score.p1, Game.score.p2);


    // debug text
    // Physics.calculateEnergy();
    // var debugText = "Energy: " + Game.energy.toFixed(2);
    // debugText += "\n\nMax speed: " + Game.maxRecordedSpeed.toFixed(2);
    // Graphics.drawDebugText(debugText);

    Graphics.update();
  },


  init: function() {
    Game.debug('Initializing graphics');
    Graphics.init();

    Game.debug('Creating scenario');
    Scenario.create();

    Game.debug('Controls setup');
    KeyControls.setup();

    Game.debug('Initializing framework');
    setTimeout(Framework.init, 2000);

    Game.debug('Game started!');
  },

  restart: function() {
    Game.debug('Restarting game...');
    Game.cleanUp();
    Game.init();
  },

  restartIfNetwork: function() {
    //
    // this function screams for refactoring! D=
    //

    var player1State = {
      x: 300,
      y: Game.area.height/2,
      vx: 0,
      vy: 0,
      angle: 0
    };


    var player2State = {
      x: Game.area.width - 300,
      y: Game.area.height/2,
      vx: 0,
      vy: 0,
      angle: 180
    };

    var ballState = {
      x: Game.area.width/2,
      y: Game.area.height/2,
      vx: 0,
      vy: 0,
      angle: 0
    };

    Game.player1.loadState(player1State);
    Game.player2.loadState(player2State);
    Game.ball.loadState(ballState);
  }
};

if(!Game.useNetwork) {
  Game.init();
}
