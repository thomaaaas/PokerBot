module.exports = Player;

var readlineSync = require('readline-sync');
var PokerEvaluator = require('poker-evaluator');
var debug = true;

function logd(message) {
    if (debug) {
        console.log(message);
    }
}

function Player(options) {
    this.id = options.id;
    this.name = options.name;
    this.chips = options.chips;
    this.bot = true;
    this.game = null;
    this.firstCard = {};
    this.secondCard = {};
    this.bet = 0;
    this.lastAction = "";
    this.hasActed = false;      // acted for one round (call/check/raise)
    this.hasDone = false;       // finish acted for one game (fold/allin)
}

Player.prototype.effectuerAction = function(){
    if (this.id === 1){
        var choix = readlineSync.question('Action: (all-in)(fold)(callorcheck)(raise):  ');
        this.uneAction(choix);
    }else{
        this.botPlay();
    }
};

Player.prototype.botPlay = function(){
    var randomNb = Math.floor(Math.random() * 10);
    var randomAmount = Math.floor(Math.random() * 1000);
    switch (randomNb) {
        case 1:
            this.fold();
            break;
        case 2:
            this.raise(randomAmount);
            break;
        default:
            this.callOrCheck();
    }

/*    var hands = [];
    var evalHands = [];
    for (var i=0; i<this.game.players.length; i++) {
        switch (this.game.round) {
            case "deal":
                hands.push([
                    this.game.players[i].firstCard,
                    this.game.players[i].secondCard
                ]);
                for (i=0; i<hands.length; i++) {
                    evalHands.push(PokerEvaluator.evalHand(hands[i]));
                }
                break;
            case "flop":
                hands.push([
                    this.game.communityCards[0],
                    this.game.communityCards[1],
                    this.game.communityCards[2]
                ]);
                for (i=0; i<hands.length; i++) {
                    evalHands.push(PokerEvaluator.evalHand(hands[i]));
                }
                break;
            case "turn":
                hands.push([
                    this.game.communityCards[3]
                ]);
                for (i=0; i<hands.length; i++) {
                    evalHands.push(PokerEvaluator.evalHand(hands[i]));
                }
                break;
            case "river":
                hands.push([
                    this.game.communityCards[4]
                ]);
                for (i=0; i<hands.length; i++) {
                    evalHands.push(PokerEvaluator.evalHand(hands[i]));
                }
                break;

        }
    }*/
};

Player.prototype.uneAction = function(resultat){
    switch (resultat) {
        case 'all-in':
            this.allin();
            break;
        case 'fold':
            this.fold();
            break;
        case 'callorcheck':
            this.callOrCheck();
            break;
        case 'raise':
            var montant = readlineSync.question('Montant:  ');
            this.raise(parseInt(montant));
            break;
        default:
            logd('Erreur, selectionner une action');
    }
};

/**
 * Folds the game
 */
Player.prototype.fold = function() {
    logd('Player ' + this.name + ' FOLD');

    this.lastAction = "fold";
    this.hasDone = true;

    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
};

/**
 * Puts all your chips to your bet
 */
Player.prototype.allin = function() {
    logd('Player ' + this.name + ' ALL-IN : ' + this.chips);

    this.lastAction = "allin";
    this.hasDone = true;

    this.addBet(this.chips);
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
};

/**
 * Adds some chips to your bet
 * So that your bet is equal
 * With the highest bet in the table
 * If highest bet is 0, will do nothing
 */
Player.prototype.callOrCheck = function() {
    this.hasActed = true;

    var diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff);

    if (diff > 0) {
        this.lastAction = "call";
        logd('Player ' + this.name + ' CALL : ' + diff);
    } else {
        this.lastAction = "check";
        logd('Player ' + this.name + ' CHECK');
    }
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
};

/**
 * Raise your bet
 * If your bet is not the same with highest bet
 * Add to your bet altogether with difference
 * @param amount
 */
Player.prototype.raise = function(amount) {
    this.lastAction = "raise";

    var diff = this.game.getHighestBet() - this.bet;
    this.addBet(diff + amount);

    logd('Player ' + this.name + ' Raises : ' + (diff + amount));

    this.game.requestPlayerAction(); // other players must act
    this.hasActed = true;
    this.game.incrementPlayerTurn();
    this.game.checkForNextRound();
};

/**
 * Resets the player state
 */
Player.prototype.reset = function() {
    this.firstCard = {};
    this.secondCard = {};
    this.bet = 0;

    this.lastAction = "";
    this.hasActed = false;
    this.hasDone = false;
};

/**
 * Removes player's chip
 * Adds them to player's bet
 * @param amount
 */
Player.prototype.addBet = function(amount) {
    if (this.chips < amount) {
        return "error - not enough chips";
    }
    this.chips -= amount;
    this.bet += amount;
};