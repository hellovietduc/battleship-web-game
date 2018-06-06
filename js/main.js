$("#play").click(() => {
    view.showInstruction(false);
    view.showPlayGround(true);
    init();
});

$("#restart").click(() => {
    init();
});

$(".box").click(function () {
    if (view.isBoxPressed(this.id) || game.isGameOver) return;

    const x = +this.id.charAt(1);
    const y = +this.id.charAt(2);
    const hit = game.fireAt(x, y);
    
    view.updateScore(game.countSunkShips(), game.numOfShots);
    
    if (hit) {
        view.markHitBox(this.id);
        if (game.areAllShipsSunk()) {
            const accuracy = Math.round((game.numOfShips*100/game.numOfShots)*100)/100;
            view.sendMessage(`You won! Your accuracy is ${accuracy}%.`);
            game.isGameOver = true;
        }
    }
    else {
        view.markMissBox(this.id);
    }
});

const init = () => {
    view.unmarkAllBoxes();
    view.updateScore(0, 0);
    view.updateTimer(game.countdownTime);
    game.init();
    game.startCountdown(view.updateTimer);
}

class Ship {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.isSunk = false;
    }

    fire() {
        this.isSunk = true;
    }
}

const game = {
    ships: [],
    numOfShips: 5,
    numOfShots: 0,
    countdownTime: 30,
    isGameOver: false,
    
    isShipOnMap: (ship) => {
        return ship.x >= 0 && ship.x <= 9
            && ship.y >= 0 && ship.y <= 9;
    },

    generateShips: function() {
        for (let i = 0; i < this.numOfShips; i++) {
            let newShip;
            do {
                const x = Math.floor(Math.random()*10);
                const y = Math.floor(Math.random()*10);
                newShip = new Ship(x, y);
            } while (!this.isShipOnMap(newShip) && this.ships.includes(newShip));
            this.ships.push(newShip);
        }
    },

    removeShips: function() {
        this.ships.length = 0;
    },

    init: function() {
        this.removeShips();
        this.generateShips();
        this.numOfShots = 0;
        this.isGameOver = false;
    },

    startCountdown: function(callback) {
        let count = this.countdownTime;
        
        count1sAndDo(callback);

        function count1sAndDo(callback) {
            if (count < 1) {
                game.isGameOver = true;   
                return;
            }
            setTimeout(() => {
                callback(--count);
                count1sAndDo(callback);
            }, 1000);
        }
    },

    fireAt: function(x, y) {
        this.numOfShots++;
        const hitShip = this.ships.find(ship => ship.x === x && ship.y === y);
        if (hitShip) {
            hitShip.fire();
            return true;
        }
        return false;
    },

    countSunkShips: function() {
        return this.ships.map(ship => ship.isSunk ? 1 : 0)
                         .reduce((acc, cval) => acc + cval);
    },

    areAllShipsSunk: function() {
        return this.ships.every(ship => ship.isSunk);
    }
}

const view = {
    instruction: $("#instruction"),
    playGround: $("#play-ground"),
    noti: $("#noti"),
    timer: $("#timer"),

    showInstruction: function(show) {
        if (show) this.instruction.css("display", "block");
        else this.instruction.css("display", "none");
    },

    showPlayGround: function(show) {
        if (show) this.playGround.css("display", "block");
        else this.playGround.css("display", "none");
    },

    sendMessage: function(message) {
        this.noti.text(message);
    },

    updateScore: function(hits, shots) {
        this.noti.text(`Hits: ${hits}, Shots: ${shots}`);
    },

    updateTimer: function(time) {
        view.timer.text(time + 's');
        if (time === 0) view.sendMessage('You lost!');
    },

    markMissBox: (id) => {
        $("#" + id).removeClass("box").addClass("box-miss");
    },

    markHitBox: (id) => {
        $("#" + id).removeClass("box").addClass("box-hit");
    },

    unmarkAllBoxes: () => {
        $(".box-miss").removeClass("box-miss").addClass("box");
        $(".box-hit").removeClass("box-hit").addClass("box");
    },

    isBoxPressed: (id) => !$("#" + id).hasClass("box")
}