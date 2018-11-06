var Game = require('./game');
var game = new Game();

game.addPlayer({
    name: "thomas",
    chips: 20000,
    id: 1
});
game.addPlayer({
    name: "bot",
    chips: 20000,
    id: 2
});
game.addPlayer({
    name: "bot2",
    chips: 20000,
    id: 3
});

game.start();
while(!game.endGame){
    game.getCurrentPlayer().effectuerAction();
}

