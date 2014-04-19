var Framework = {
  init: function() {
    // update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);
    createjs.Ticker.setFPS(30);
    createjs.Ticker.useRAF = true;
  }
};
