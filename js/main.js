const shipLocation = [];
let isSunk = true;
let guesses;

$(document).ready(() => {
    showInstruction(true);
    showPlayGround(false);
})

// Play button handler
// Can only be pressed when game ends
$("#play").click(() => {
    if (isSunk) {
        showInstruction(false);
        showPlayGround(true);
        initGame();
    }
});

// Restart button handler
// Can be pressed anytime
$("#restart").click(() => {
    shipLocation.splice(0);
    initGame();
});

// Boxes handler
// Can only be pressed when in game
$(".box").click(function () {
    if (!isSunk) {
        const userGuess = parseInt(this.id.charAt(4));
        guesses++;
        updateNumOfGuesses();

        const hit = checkGuess(userGuess);
        if (hit) {
            removeBrokenPart(userGuess);
            markHitShip(userGuess);
            if (isShipSunk()) {
                isSunk = true;
                showResult();
            }
        }
    }
});

/*** View functions ***/

function showInstruction(show) {
    const instructionDiv = $("#instruction");
    if (show) instructionDiv.css("display", "block");
    else instructionDiv.css("display", "none");
}

function showPlayGround(show) {
    const playGroundDiv = $("#play-ground");
    if (show) playGroundDiv.css("display", "block");
    else playGroundDiv.css("display", "none");
}

function updateNumOfGuesses() {
    $("#noti").text("Number of guesses: " + guesses);
}

function markHitShip(location) {
    $("#col-" + location).removeClass("box").addClass("box-hit");
}

function unmarkAllHitShips() {
    $(".box-hit").removeClass("box-hit").addClass("box");
}

function showResult() {
    const accuracy = Math.round((3*100/guesses)*100)/100;
    $("#noti").text("You won! Your accuracy is " + accuracy + "%.");
}

/*** Game logic functions ***/

function initGame() {
    locateShip();
    isSunk = false;
    guesses = 0;
    updateNumOfGuesses();
    unmarkAllHitShips();
}

function locateShip() {
    const firstPoint = Math.floor(Math.random()*10); // Random number: 0-9
    if (firstPoint + 2 > 9) { // Ship is out of range, locate it backwards
        shipLocation.push(firstPoint);
        shipLocation.push(firstPoint - 1);
        shipLocation.push(firstPoint - 2);
    }
    else { // Locate ship forwards
        shipLocation.push(firstPoint);
        shipLocation.push(firstPoint + 1);
        shipLocation.push(firstPoint + 2);
    }
}

function checkGuess(guess) {
    return shipLocation.includes(guess);
}

function removeBrokenPart(location) {
    shipLocation.splice(shipLocation.indexOf(location), 1);
}

function isShipSunk() {
    return shipLocation.length === 0;
}