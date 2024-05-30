const cells = document.querySelectorAll(".cell");
const resultMessage = document.querySelector(".result-message");
const resetButton = document.querySelector(".reset-button");

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];

function resetBoard() {
    board = ['', '', '', '', '', '', '', '', ''];
    updateBoard();
    resultMessage.textContent = ' ';
}

function checkResult() {
    let winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Horizontaal
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Verticaal
        [0, 4, 8], [2, 4, 6]              // Diagonaal
    ];

    for (let i = 0; i < winCombos.length; i++) {
        let combo = winCombos[i];
        let a = combo[0], b = combo[1], c = combo[2];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }

    if (board.every(function(cell) {
        return cell !== '';
    })) {
        return 'T';
    } else {
        return null;
    }
}

function updateBoard() {
    cells.forEach(function(cell, index) {
        cell.textContent = board[index];
    });
}

cells.forEach(function(cell, index) {
    cell.addEventListener('click', function() {
        if (board[index] === '' && checkResult() === null) {
            board[index] = currentPlayer;
            updateBoard();

            let result = checkResult();
            if (result === 'T') {
                resultMessage.textContent = 'Gelijkspel!';
            } else if (result) {
                resultMessage.textContent = 'Speler ' + result + ' wint!';
            } else {
                if (currentPlayer === 'X') {
                    currentPlayer = 'O';
                } else {
                    currentPlayer = 'X';
                }
            }
        }
    });
});

resetButton.addEventListener('click', function(){
    resetBoard();
});

updateBoard();
