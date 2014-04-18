var Framework = {
  init: function() {
    //Update stage will render next frame
    createjs.Ticker.addEventListener("tick", handleTick);
  }
};
