var Framework = {
  init: function() {
    // update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);
  }
};
