let shipLocation = [];
let isSunk = false;
let message;

window.onload = () => {
    locateShip();
    while (!isSunk) {
        alert(message);
        let userGuess = getUserGuess();
        let hit = checkGuess(userGuess);
        if (hit) {
            markShipAsHit(userGuess);
            if (isShipSunk()) isSunk = true;
        }
    }
    alert(message);
};

function locateShip() {
    let firstPoint = Math.round(Math.random()*10);
    if (firstPoint + 2 > 9) {
        shipLocation.push(firstPoint);
        shipLocation.push(firstPoint - 1);
        shipLocation.push(firstPoint - 2);
    }
    else {
        shipLocation.push(firstPoint);
        shipLocation.push(firstPoint + 1);
        shipLocation.push(firstPoint + 2);
    }
    message = "The ship has been located. Can you sink it?";
}

function getUserGuess() {
    let guess;
    do {
        guess = parseInt(prompt("Guess the location of the ship (0-9):"));
    } while (guess < 0 || guess > 9);
    return guess;
}

function checkGuess(guess) {
    if (shipLocation.includes(guess)) {
        message = "You hit the ship!";
        return true;
    }
    message = "You missed that!";
    return false;
}

function isShipSunk() {
    if (shipLocation.length === 0) {
        message = "Ship sunk! You won!";
        return true;
    }
    return false;
}

function markShipAsHit(location) {
    shipLocation.splice(shipLocation.indexOf(location), 1);
}