console.log('main.loaded');

const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('.option-container');
const flipButton = document.querySelector('#flip-button');
const startButton = document.getElementById("strat-button");

// Option choosing
let rotationAngle = 0;
function flip() {
    const optionShips = optionContainer.children;
    rotationAngle = rotationAngle === 0 ? 90 : 0;

    for (let i = 0; i < optionShips.length; i++) {
        optionShips[i].style.transform = `rotate(${rotationAngle}deg)`;
    }
}
flipButton.addEventListener('click', flip);

// Creating boards
const width = 10;
function createBoard(color, user) {
    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.style.backgroundColor = color;
    gameBoardContainer.id = user;

    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.appendChild(block);
    }

    gamesBoardContainer.appendChild(gameBoardContainer);

    return gameBoardContainer;
}

const playerBoard = createBoard('lightblue', 'player');
const computerBoard = createBoard('lightblue', 'computer');

// Click events on blocks
const blockElements = document.querySelectorAll('.block');

for (let i = 0; i < blockElements.length; i++) {
    blockElements[i].addEventListener('click', function () {
        if (this.parentNode.id === 'computer') {
            if (this.classList.contains('ship')) {
                this.style.backgroundColor = 'red';
            } else {
                this.style.backgroundColor = 'yellow';
            }
        }
    });
}

// Ship dragging
const shipPreviews = document.querySelectorAll('.ship-preview');
let selectedShip;

for (let i = 0; i < shipPreviews.length; i++) {
    shipPreviews[i].addEventListener('dragstart', function (event) {
        selectedShip = this.cloneNode(true);
        event.dataTransfer.setData('text/plain', '');
    });
}

// Block dropping
const ships = document.querySelectorAll('.option-container > div');
const blocks = document.querySelectorAll('.block');

let selectedShipElement = null;
let occupiedBlocks = []

for (let i = 0; i < ships.length; i++) {
    ships[i].addEventListener('dragstart', function (event) {
        selectedShipElement = this;
        event.dataTransfer.setData('text/plain', '');
    });
}

for (let i = 0; i < blocks.length; i++) {
    blocks[i].addEventListener('dragover', function (event) {
        event.preventDefault();
    });

    if (blocks[i].parentNode.id === 'player') {
        blocks[i].addEventListener('drop', function (event) {
            event.preventDefault();
            if (!this.querySelector('.ship') && !occupiedBlocks.includes(this.id)) {
                const shipWidth = selectedShipElement.offsetWidth;
                const shipHeight = selectedShipElement.offsetHeight;
                const offsetX = (this.offsetWidth - shipWidth) / 1.5;
                const offsetY = (this.offsetHeight - shipHeight) / 5;
                selectedShipElement.style.left = `${offsetX}px`;
                selectedShipElement.style.top = `${offsetY}px`;
                selectedShipElement.style.position = 'relative';
                this.appendChild(selectedShipElement);
                occupiedBlocks.push(this.id);
            }
        });
    }
}


for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
}
// Place computer ships
placeComputerShips();

function placeComputerShips() {
    const shipSizes = [5, 3, 4, 2];

    for (let i = 0; i < shipSizes.length; i++) {
        const shipSize = shipSizes[i];
        const shipElement = document.createElement('div');
        shipElement.classList.add('ship');
        shipElement.style.width = `${shipSize * 60}px`;

        let validPosition = false;
        let startPosition;

        while (!validPosition) {
            startPosition = Math.floor(Math.random() * 100);
            const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
            validPosition = checkValidPosition(startPosition, shipSize, orientation);
        }

        placeShip(startPosition, shipSize, shipElement);
    }
}


function checkValidPosition(startPosition, shipSize, orientation) {
    const startRow = Math.floor(startPosition / 10);
    const startCol = startPosition % 10;

    if (orientation === 'horizontal') {
        if (startCol + shipSize > 10) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            const block = computerBoard.children[startPosition + i];
            if (block && block.classList.contains('ship')) {
                return false;
            }
        }
    } else {
        if (startRow + shipSize > 10) {
            return false;
        }

        for (let i = 0; i < shipSize; i++) {
            const block = computerBoard.children[startPosition + i * 10];
            if (block && block.classList.contains('ship')) {
                return false;
            }
        }
    }

    return true;
}

function placeShip(startPosition, shipSize, shipElement) {
    const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';

    if (orientation === 'horizontal') {
        for (let i = 0; i < shipSize; i++) {
            const block = computerBoard.children[startPosition + i];
            block.classList.add('ship');
            block.appendChild(shipElement.cloneNode(true));
        }
    } else {
        for (let i = 0; i < shipSize; i++) {
            const block = computerBoard.children[startPosition + i * 10];
            block.classList.add('ship');
            block.appendChild(shipElement.cloneNode(true));
        }
    }
}

// Functie om een aanval uit te voeren
const playerShips = [
    { name: 'destroyer', size: 2, positions: [] },
    { name: 'submarine', size: 3, positions: [] },
    { name: 'cruise', size: 3, positions: [] },
    { name: 'battleship', size: 4, positions: [] },
    { name: 'carrier', size: 5, positions: [] }
];

function aanval(e) {
    const block = e.target;
    const x = block.dataset.x;
    const y = block.dataset.y;

    // Controleer elk schip om te zien of het is geraakt
    for (const schip of playerShips) {
        for (const positie of schip.positions) {
            if (positie[0] == x && positie[1] == y) {
                block.style.backgroundColor = 'red';
                return;
            }
        }
    }

    // Als geen enkel schip is geraakt, is het een misser
    block.style.backgroundColor = 'yellow';

}


// Voeg event listeners toe aan elke block// Voeg event listeners toe aan elke block
blocks.forEach(block => {
    // Controleer of het blok zich op het bord van de speler bevindt
    if (block.parentNode.id === 'player') {
        block.addEventListener('click', aanval);
    }
});


const playerName = prompt("Voer je naam in om het spel te starten:");

if (playerName) {
    const playerNameDisplay = document.querySelector("#player-name-display");
    const computerNameDisplay = document.querySelector("#computer-name-display");


    playerNameDisplay.textContent = playerName;
    computerNameDisplay.textContent = "Computer";
    startButton.disabled = true;
} else {
    alert("Je moet je naam invoeren om het spel te starten.");
    window.location.href = "index.html";
};

flipButton.addEventListener("click", function () {
    // Voer hier de code in om de schepen te plaatsen   
    startButton.disabled = false;

});

startButton.addEventListener("click", function () {

    flipButton.disabled = true;
});