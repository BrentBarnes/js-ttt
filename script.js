let gameBoard = (function() {
  let rows = 3
  let columns = 3
  let board = []

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    let rowLetter = String.fromCharCode(i + 97)

    for (let j = 0; j < columns; j++) {
      let columnNumber = (j + 1).toString();
      let coordinate = rowLetter + columnNumber

      board[i].push(Cell(coordinate));
    }
  }

  const getBoard = () => board

  const dropToken = (row, column, player) => {
    cellValue = board[row][column].getValue();
    if (!cellValue == "") {
      switchPlayerTurn();
      return
    };
    board[row][column].addToken(player)
  };

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue));
    console.log(boardWithCellValues);
  };

  return { getBoard, dropToken, printBoard }
})();

function Cell() {
  let value = "";

  const getValue = () => value;

  const addToken = (player) => {
    value = player;
  };

  return {
    getValue,
    addToken
  };
}

let gameController = (function() {
  playerOneName = "Player One";
  playerTwoName = "Player Two";

  const board = gameBoard;

  const players = [
    {
      name: playerOneName,
      token: "X"
    },
    {
      name: playerTwoName,
      token: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0]; 
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn`);
  }

  const playRound = (row, column) => {
    console.log(
      `Dropping ${getActivePlayer().name}'s token into coordinate ${row} ${column}`
    );

    board.dropToken(row, column, getActivePlayer().token)

      //check for win conditions

    switchPlayerTurn();
    printNewRound();
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard
  }
})();

let screenController = (function() {
  const game = gameController;
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('.board');

  const updateScreen = () => {
    boardDiv.textContent = "";

    const board = game.getBoard();
    const activePlayer = game.getActivePlayer().name;

    playerTurnDiv.textContent = `${activePlayer}'s turn`;

    board.forEach((row, rowIndex) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.row = rowIndex;
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  }

  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row;
    const selectedColumn = e.target.dataset.column;
    if (!selectedRow || !selectedColumn) return;

    game.playRound(selectedRow, selectedColumn)
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);
  updateScreen();
})();

