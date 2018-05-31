$(document).ready(() => {
    view.showInstruction(true);
    view.showPlayGround(false);
})

$("#play").click(() => {
    view.showInstruction(false);
    view.showPlayGround(true);
    init();
});

$("#restart").click(() => {
    init();
});

$(".box").click(function () {
    if (view.isBoxPressed(this.id) || game.isGameOver()) return;

    const x = +this.id.charAt(1);
    const y = +this.id.charAt(2);
    const hit = game.fireAt(x, y);
    
    view.updateNoti(`Hits: ${game.countSunkShips()}, Shots: ${game.numOfShots}`);
    
    if (hit) {
        view.markHitBox(this.id);
        if (game.isGameOver()) {
            const accuracy = Math.round((game.numOfShips*100/game.numOfShots)*100)/100;
            view.updateNoti(`You won! Your accuracy is ${accuracy}%.`);
        }
    }
    else {
        view.markMissBox(this.id);
    }
});

const init = () => {
    view.unmarkAllBoxes();
    view.updateNoti("Hits: 0, Shots: 0");
    game.removeShips();
    game.generateShips();
    game.numOfShots = 0;
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

    isGameOver: function() {
        return this.ships.every(ship => ship.isSunk);
    }
}

const view = {
    instruction: $("#instruction"),
    playGround: $("#play-ground"),
    noti: $("#noti"),

    showInstruction: function(show) {
        if (show) this.instruction.css("display", "block");
        else this.instruction.css("display", "none");
    },

    showPlayGround: function(show) {
        if (show) this.playGround.css("display", "block");
        else this.playGround.css("display", "none");
    },

    updateNoti: function(message) {
        this.noti.text(message);
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