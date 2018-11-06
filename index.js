var Game = require('./game');
var game = new Game();
var readlineSync = require('readline-sync');

var nom = readlineSync.question('Entrez votre nom:  ');

game.addPlayer({
    name: nom,
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


