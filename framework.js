var Framework = {
  init: function() {
    if(Game.useNetwork) {
      createjs.Ticker.addEventListener("tick", handleTickNetwork);
    } else {
      createjs.Ticker.addEventListener("tick", handleTick);
    }
    createjs.Ticker.setFPS(30);
    createjs.Ticker.useRAF = true;
  },

  isTickPaused: function() {
    return createjs.Ticker.getPaused();
  },

  pauseTick: function() {
    createjs.Ticker.setPaused(true);
  },

  resumeTick: function() {
    createjs.Ticker.setPaused(false);
  }
};
