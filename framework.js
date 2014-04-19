var Framework = {
  init: function() {
    // update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
  }
};
