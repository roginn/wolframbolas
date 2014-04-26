var ScenariosList = ScenariosList || {};

ScenariosList.field1 = {

  name: 'field1',

  create: function() {
    ScenariosList.field1.createBalls();
    ScenariosList.field1.createPlayers();
    ScenariosList.field1.createWalls();
  },

  createBalls: function() {
    function createBall(x, y, radius, group, color){
      return new Ball({
        x: x,
        y: y,
        radius: radius,
        group: group,
        color: color,
        mass: 20,
        attractionOrder: ++attractionOrder
      });
    }

    var green = "#46ac39",
    purple = "#4639ac",
    wtf = "#aca039",
    attractionOrder = 0;

    Game.ball = createBall(Game.area.width/2, Game.area.height/2, 70, 0, green);

    // createBall(Game.player1.x - 40, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 80, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 120, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 160, Game.player1.y, 20, 1, purple);
    // createBall(Game.player1.x - 200, Game.player1.y, 20, 1, purple);

    // createBall(Game.player2.x + 40, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 80, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 120, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 160, Game.player2.y, 20, 2, wtf);
    // createBall(Game.player2.x + 200, Game.player2.y, 20, 2, wtf);
  },

  createPlayers: function() {
    var playerRadius = 40;

    Game.player1 = new Player({
      x: 300,
      y: Game.area.height/2,
      radius: playerRadius,
      angle: 0,
      group: 1
    });

    Game.player2 = new Player({
      x: Game.area.width - 300,
      y: Game.area.height/2,
      radius: playerRadius,
      angle: 180,
      group: 2
    });

    if(Network.isHost) {
      Game.localPlayer = Game.player1;
      Game.remotePlayer = Game.player2;
    } else {
      Game.localPlayer = Game.player2;
      Game.remotePlayer = Game.player1;
    }
  },

  createWalls: function() {
    var goalWidth = Game.goal.width,
    goalHeight = Game.goal.height,
    areaWidth = Game.area.width,
    areaHeight = Game.area.height;

    function createVertex(x, y) {
      new Ball({
        x: x,
        y: y,
        radius: 3,
        group: -1,
        color: "white",
        mass: 1e20
      });
    }

    new Wall(goalWidth, 0, areaWidth - goalWidth, 0);
    new Wall(areaWidth - goalWidth, 0, areaWidth - goalWidth, (areaHeight - goalHeight)/2);
    createVertex(areaWidth - goalWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight - goalHeight)/2);
    new Wall(areaWidth, (areaHeight - goalHeight)/2, areaWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, (areaHeight + goalHeight)/2);
    createVertex(areaWidth - goalWidth, (areaHeight + goalHeight)/2);
    new Wall(areaWidth - goalWidth, (areaHeight + goalHeight)/2, areaWidth - goalWidth, areaHeight);
    new Wall(areaWidth - goalWidth, areaHeight, goalWidth, areaHeight);
    new Wall(goalWidth, areaHeight, goalWidth, (areaHeight + goalHeight)/2);
    createVertex(goalWidth, (areaHeight + goalHeight)/2);
    new Wall(goalWidth, (areaHeight + goalHeight)/2, 0, (areaHeight + goalHeight)/2);
    new Wall(0, (areaHeight + goalHeight)/2, 0, (areaHeight - goalHeight)/2);
    new Wall(0, (areaHeight - goalHeight)/2, goalWidth, (areaHeight - goalHeight)/2);
    createVertex(goalWidth, (areaHeight - goalHeight)/2);
    new Wall(goalWidth, (areaHeight - goalHeight)/2, goalWidth, 0);
  }

};
