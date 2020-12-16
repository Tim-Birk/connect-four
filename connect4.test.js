describe("board tests", () => {
  beforeEach(() => {
    board = makeBoard(HEIGHT, WIDTH);
  });

  it("should make an array with the length of HEIGHT where each item is its own array of null valueswith a length of WIDTH", () => {
    expect(board.length).toEqual(HEIGHT);
    expect(board.every((row) => row.every((slot) => slot === null))).toEqual(
      true
    );
  });

  it("should update the correct board subarray and element in the subarray with the correct player number on updateBoardWithPlayer", () => {
    updateBoardWithPlayer(2, 1, 2);
    expect(board[1][2]).toEqual(2);

    updateBoardWithPlayer(4, 5, 1);
    expect(board[5][4]).toEqual(1);
  });

  it("should return the bottom most empty y-position in the current x-column on findSpotForCol()", () => {
    // on empty column it should return the bottom row index (5)
    expect(findSpotForCol(2)).toEqual(5);

    // if the bottom slot in a column is filled, it should return the next bottom-most index
    updateBoardWithPlayer(2, 5, 1);
    expect(findSpotForCol(2)).toEqual(4);
  });

  afterEach(() => {
    board = makeBoard(HEIGHT, WIDTH);
  });
});

describe("HtmlBoard tests", () => {
  beforeAll(() => {
    currPlayer = 1;
    removePreviousHtmlBoard();
    addNewHtmlBoard();
    makeHtmlBoard();
  });
  const boardRows = document.querySelectorAll("#board tr");

  it("should make a table on the DOM that has rows of (HEIGHT + 1)", () => {
    expect(boardRows.length).toEqual(HEIGHT + 1);
  });
  it("should make the first row of the table have an id of 'column-top'", () => {
    expect(boardRows[0].getAttribute("id")).toEqual("column-top");
  });

  it("should add a div.piece to the correct td in the correct tr and remove the empty-slot div on placeInTable()", () => {
    currPlayer = 2;
    let y = 1,
      x = 3;
    placeInTable(y, x);
    const td = document.getElementById(`${y}-${x}`);
    expect(td.getAttribute("id")).toEqual(`${y}-${x}`);
    expect(td.children.length).toEqual(1);
  });
  afterAll(() => {
    currPlayer = 1;
    removePreviousHtmlBoard();
    addNewHtmlBoard();
    makeHtmlBoard();
  });
});

describe("checkForWin tests", () => {
  beforeEach(() => {
    currPlayer = 1;
    board = makeBoard(HEIGHT, WIDTH);
  });

  it("should return true where 4 consecutive colors match vertically on checkForWin()", () => {
    currPlayer = 2;
    board[5][2] = 2;
    board[4][2] = 2;
    board[3][2] = 2;
    board[2][2] = 2;

    expect(checkForWin()).toEqual(true);
  });

  it("should return true where 4 consecutive colors match horizontally on checkForWin()", () => {
    currPlayer = 2;
    board[1][2] = 2;
    board[1][3] = 2;
    board[1][4] = 2;
    board[1][5] = 2;

    expect(checkForWin()).toEqual(true);
  });

  it("should return true where 4 consecutive colors match diagonally down right on checkForWin()", () => {
    currPlayer = 2;
    board[1][2] = 2;
    board[2][3] = 2;
    board[3][4] = 2;
    board[4][5] = 2;

    expect(checkForWin()).toEqual(true);
  });

  it("should return true where 4 consecutive colors match diagonally down left on checkForWin()", () => {
    currPlayer = 2;
    board[1][4] = 2;
    board[2][3] = 2;
    board[3][2] = 2;
    board[4][1] = 2;

    expect(checkForWin()).toEqual(true);
  });

  afterEach(() => {
    currPlayer = 1;
    board = makeBoard(HEIGHT, WIDTH);
    removePreviousHtmlBoard();
    addNewHtmlBoard();
    makeHtmlBoard();
  });
});

describe("checkForTie tests", () => {
  beforeEach(() => {
    board = makeBoard(HEIGHT, WIDTH);
  });

  it("should return true when every value in the board sub arrays is not null on checkForTie()", () => {
    // loop through the y axis of the board
    for (let y = 0; y < HEIGHT; y++) {
      // for each x value on the y-axis, add a value other than null
      for (let x = 0; x < WIDTH; x++) {
        board[y][x] = 3;
      }
    }
    expect(checkForTie()).toEqual(true);
  });

  afterEach(() => {
    board = makeBoard(HEIGHT, WIDTH);
  });
});
