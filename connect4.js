/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])
let gameOver = false; // game over flag, if true no more pieces can be dropped

const newGameButton = document.querySelector("button");
newGameButton.addEventListener("click", () => newGame());

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = (height, width) => {
  // Set "board" to empty HEIGHT x WIDTH matrix array
  let localBoard = [];
  for (let y = 0; y < height; y++) {
    localBoard.push(new Array(width).fill(null));
  }
  return localBoard;
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // Create top header row of table
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);
  // Append a table cell to header ro for every column in table
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // Add tr elements to table based on HEIGHT
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      // create an empty slot div do give empty slot appearance on board
      const slot = document.createElement("div");
      slot.classList.add("slot");
      cell.append(slot);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** given x and y, update in memory board with player value */
const updateBoardWithPlayer = (x, y, p) => {
  board[y][x] = p;
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = (x) => {
  // loop backwords on each row for the given column x to find first available slot
  for (let i = HEIGHT - 1; i >= 0; i--) {
    if (!board[i][x]) {
      return i;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  const piece = document.createElement("div");
  piece.classList.add("piece");
  piece.classList.add(`p${currPlayer}`);

  const td = document.getElementById(`${y}-${x}`);
  // remove empty slot
  td.firstChild.remove();
  // add piece in its place
  td.append(piece);
};

/** endGame: announce game end */

const endGame = (msg) => {
  gameOver = true;
  setTimeout(() => {
    alert(msg);
  }, 50);
};

/** handleClick: handle click of column top to play piece */

const handleClick = (evt) => {
  if (gameOver) return;

  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  flashColumnSlots(y, x);

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // add line to update in-memory board
  updateBoardWithPlayer(x, y, currPlayer);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (checkForTie()) {
    return endGame(`Tie Game!`);
  }

  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
  setPlayerTurnInfo();
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  };

  // loop through the y axis of the board
  for (let y = 0; y < HEIGHT; y++) {
    // for each x value on the y-axis, create all possible winning coordinate arrays
    for (let x = 0; x < WIDTH; x++) {
      // create possible winning horizontal coordinates array for y, x
      const horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3],
      ];
      // create possible winning vertical coordinates array for y, x
      const vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x],
      ];
      // create possible winning diagonal-down-right coordinates array for y, x
      const diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3],
      ];
      // create possible winning diagonal-down-left coordinates array for y, x
      const diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3],
      ];

      // pass each possible winning cooridinates array into the _win function to see if at least 1 is a winner
      //   use the winning coordinates to highlight the winning pieces on the game board
      if (_win(horiz)) {
        highlightWinningSlots(horiz);
        return true;
      } else if (_win(vert)) {
        highlightWinningSlots(vert);
        return true;
      } else if (_win(diagDR)) {
        highlightWinningSlots(diagDR);
        return true;
      } else if (_win(diagDL)) {
        highlightWinningSlots(diagDL);
        return true;
      }
    }
  }
};

const highlightWinningSlots = (coords) => {
  for (coord of coords) {
    [y, x] = coord;
    const piece = document.getElementById(`${y}-${x}`).firstChild;
    piece.classList.add("win");
  }
};

const checkForTie = () => {
  for (row of board) {
    if (row.some((slot) => slot === null)) {
      return false;
    }
  }
  return true;
};

const flashColumnSlots = (y, x) => {
  // flash empty slots with color for falling effect
  // get all tds in column up to y slot
  for (let i = 0; i < y; i++) {
    const slot = document.getElementById(`${i}-${x}`).firstChild;
    delayColorSet(slot, currPlayer, 10);
    delayColorSet(slot, currPlayer, 200);
  }
};

const delayColorSet = (slot, player, time) => {
  setTimeout(() => {
    slot.classList.toggle(`p${player}`);
  }, time);
};

const setPlayerTurnInfo = () => {
  const playerPiece = document.getElementById("player-turn-piece");
  const playerNumber = document.getElementById("player-turn-number");

  playerPiece.classList.remove("p1");
  playerPiece.classList.remove("p2");

  playerPiece.classList.add(`p${currPlayer}`);
  playerNumber.innerText = `Player ${currPlayer} Turn`;
};

const newGame = () => {
  currPlayer = 1; // active player: 1 or 2
  board = makeBoard(HEIGHT, WIDTH); // array of rows, each row is array of cells  (board[y][x])
  gameOver = false;

  removePreviousHtmlBoard();
  addNewHtmlBoard();
  setPlayerTurnInfo();
  makeBoard();

  makeHtmlBoard();
};

const removePreviousHtmlBoard = () => {
  // remove old DOM elements
  const oldLegs = document.querySelectorAll(".leg");
  for (leg of oldLegs) {
    leg.remove();
  }
  const oldBoard = document.getElementById("board");
  oldBoard.remove();
};

const addNewHtmlBoard = () => {
  // add new DOM elements
  const newLeftLeg = document.createElement("div");
  newLeftLeg.classList.add("leg");
  const newRightLeg = document.createElement("div");
  newRightLeg.classList.add("leg");
  const newBoard = document.createElement("table");
  newBoard.id = "board";

  const game = document.getElementById("game");

  game.append(newLeftLeg);
  game.append(newBoard);
  game.append(newRightLeg);
};

setPlayerTurnInfo();
board = makeBoard(HEIGHT, WIDTH);
makeHtmlBoard();
