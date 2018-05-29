const shipCoordinate = { x: [], y: [] };
const shipLength = 4;
const isCoordinateSatisfying = c => c >= 0 && c <= 9;
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
    shipCoordinate.x.splice(0);
    shipCoordinate.y.splice(0);
    initGame();
});

// Boxes handler
// Can only be pressed when in game
$(".box").click(function () {
    if (!isSunk) {
        const userGuess = {
            x: parseInt(this.id.charAt(1)),
            y: parseInt(this.id.charAt(2))
        }
        guesses++;
        updateNumOfGuesses();
        markChoosenBox(this.id);

        const hit = checkGuess(userGuess);
        if (hit) {
            markShipAsHit(userGuess);
            markHitBox(userGuess);
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

function markChoosenBox(id) {
    $("#" + id).removeClass("box").addClass("box-choosen");
}

function markHitBox(coordinate) {
    $("#c" + coordinate.x + coordinate.y).removeClass("box").addClass("box-hit");
}

function unmarkAllBoxes() {
    $(".box-choosen").removeClass("box-choosen").addClass("box");
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
    unmarkAllBoxes();
}

function locateShip() {
    const baseX = Math.floor(Math.random()*10); // Random number: 0-9
    const baseY = Math.floor(Math.random()*10);
    const horizontalShip = randomOf(0, 1); // 0 means vertical ship

    if (horizontalShip) createShip(shipCoordinate.y, shipCoordinate.x, baseY, baseX);
    else createShip(shipCoordinate.x, shipCoordinate.y, baseX, baseY);
}

function checkGuess(guess) {
    return shipCoordinate.x.includes(guess.x) && shipCoordinate.y.includes(guess.y);
}

function markShipAsHit(coordinate) {
    shipCoordinate.x.splice(shipCoordinate.x.indexOf(coordinate.x), 1);
    shipCoordinate.y.splice(shipCoordinate.y.indexOf(coordinate.y), 1);
}

function isShipSunk() {
    return shipCoordinate.x.length === 0 && shipCoordinate.y.length === 0;
}

// Create a ship with predefined length that fits in the map
function createShip(staticCoordinate, dynamicCoordinate, staticBase, dynamicBase) {
    // Locate static coordinate
    for (let i = 0; i < shipLength; i++) staticCoordinate.push(staticBase);

    // Locate dynamic coordinate
    while (true) {
        dynamicCoordinate.push(dynamicBase);
        expandArray(dynamicCoordinate, shipLength);
        if (dynamicCoordinate.every(isCoordinateSatisfying)) break;
        else dynamicCoordinate.splice(0);
    }
}

// Return a random number from 2 numbers passed in
function randomOf(num1, num2) {
    num1 = parseInt(num1);
    num2 = parseInt(num2);
    if (isNaN(num1) && isNaN(num2)) return null;
    if (isNaN(num1)) return num2;
    if (isNaN(num2)) return num1;
    const rand = Math.floor(Math.random()*10);
    return rand % 2 === 0 ? num1 : num2;
}

// Expand an array 'times' times, with the expanded values are
// first element minus 1 or last element plus 1
function expandArray(arr, times) {
    for (let i = 0; i < times - 1; i++) {
        const posible1 = arr[0] - 1;
        const posible2 = arr[arr.length - 1] + 1;
        arr.push(randomOf(posible1, posible2));
        arr.sort((a, b) => a - b);
    }
}