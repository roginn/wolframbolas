var Network = {
  buffer: [],
  conn: null,
  isHost: false,
  lastSentTimestamp: null,
  peer: null,

  client: function(hostKey) {
    Network.conn = Network.peer.connect(hostKey, {reliable: true});
    Network.conn.on('data', Network.handleReceivedData);

    console.log('Connected to a new game!');
    Game.init();
  },

  handleReceivedData: function(data) {
    if(data == "ACK") {
      // roundTrip = Date.now() - Network.lastSentTimestamp;
      // console.log("ACKED - message took " + roundTrip + "ms");
    } else {

      // synchronize object states
      if(typeof data.state !== "undefined") {
        var stateLength = data.state.length;
        for(var i = 0; i < stateLength; ++i) {
          Game.allElements[i].loadState(data.state[i]);
        }

        if(Game.score.p1 != data.score.p1 || Game.score.p2 != data.score.p2) {
          Game.score.p1 = data.score.p1;
          Game.score.p2 = data.score.p2;
          Graphics.drawScore(Game.score.p1, Game.score.p2);
        }
      }

      var controlLength = data.controls.length;
      for(var i = 0; i < controlLength; ++i) {
        var c = data.controls[i];
        if(c.action == 'u') {
          switch(c.key) {
          case 0: keySetRemote.forwardHeld  = false; break;
          case 1: keySetRemote.leftHeld     = false; break;
          case 2: keySetRemote.backwardHeld = false; break;
          case 3: keySetRemote.rightHeld    = false; break;
          }
        } else {
          switch(c.key) {
          case 0: keySetRemote.forwardHeld  = true; break;
          case 1: keySetRemote.leftHeld     = true; break;
          case 2: keySetRemote.backwardHeld = true; break;
          case 3: keySetRemote.rightHeld    = true; break;
          }
        }
      }

      Game.remoteTurn = data.turn;
      handleTickAfterExchange();
    }
  },

  host: function() {
    Network.isHost = true;

    Network.peer.on('connection', function(conn) {
      Network.conn = conn;
      Network.conn.on('data', Network.handleReceivedData);
      Game.init();
    });

    console.log('Hosting game!');
  },

  init: function() {
    var peer = new Peer({key: '3c8e8hl4a8xgvi'});
    Network.peer = peer;

    peer.on('open', function(id) {
      console.log('My peer ID is: ' + id);
    });
  },

  keyUp: function(key) {
    Network.buffer.push({key: key, action: 'u'});
  },

  keyDown: function(key) {
    Network.buffer.push({key: key, action: 'd'});
  },

  send: function(data) {
    // console.log('sending data', data);
    Network.lastSentTimestamp = Date.now();
    Network.conn.send(data);
  },

  sendControls: function(turn) {
    obj = {
      turn: turn,
      controls: Network.buffer
    };

    if(Network.isHost && Game.turn % 10 == 0) {
      obj.state = [];
      var elementsLength = Game.allElements.length;
      for(var i = 0; i < elementsLength; ++i) {
        obj.state.push(Game.allElements[i].getState());
      }

      obj.score = {
        p1: Game.score.p1,
        p2: Game.score.p2
      };
    }

    Network.send(obj);
    Network.buffer.length = 0;
  }
};
