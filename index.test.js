const { beforeEach, describe, expect, test } = require("@jest/globals");

const {
  createBoard,
  board,
  width,
  validatePawnMove,
  validateKnightMove,
  validateKingMove,
  validateRookMove,
} = require("./index");

// Helper function to clear the board for easier, controlled testing
function clearBoard() {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      board[r][c] = "";
    }
  }
}

describe("Board Initialization", () => {
  beforeEach(() => {
    createBoard(); // reset board before each test
  });

  test("board is 8x8", () => {
    expect(board.length).toBe(width);

    board.forEach((row) => {
      expect(row.length).toBe(width);
    });
  });

  test("white pawns are on row 1", () => {
    for (let col = 0; col < width; col++) {
      expect(board[6][col]).toBe("p");
    }
  });

  test("black pawns are on row 6", () => {
    for (let col = 0; col < width; col++) {
      expect(board[1][col]).toBe("P");
    }
  });

  test("white back rank is correct", () => {
    expect(board[0]).toEqual(["R", "N", "B", "Q", "K", "B", "N", "R"]);
  });

  test("black back rank is correct", () => {
    expect(board[7]).toEqual(["r", "n", "b", "k", "q", "b", "n", "r"]);
  });
});

describe("Pawn Movement", () => {
  beforeEach(() => {
    createBoard();
  });

  test("white pawn can move one step forward", () => {
    expect(validatePawnMove("p", [6, 0], [5, 0])).toBe(true); // a2 -> a3
  });

  test("white pawn can move two steps from start", () => {
    expect(validatePawnMove("p", [6, 0], [4, 0])).toBe(true); // a2 -> a4
  });

  test("white pawn cannot move two steps if not on start row", () => {
    expect(validatePawnMove("p", [5, 0], [3, 0])).toBe(false); // a3 -> a5
  });

  test("white pawn cannot move backwards", () => {
    expect(validatePawnMove("p", [6, 0], [7, 0])).toBe(false); // a2 -> a1
  });

  test("white pawn cannot move sideways", () => {
    expect(validatePawnMove("p", [6, 0], [6, 1])).toBe(false); // a2 -> b2
  });

  test("white pawn can capture diagonally", () => {
    // Put black pawn at b3 (row 5, col 1)
    board[5][1] = "P";
    expect(validatePawnMove("p", [6, 0], [5, 1])).toBe(true); // a2 -> b3
  });

  test("white pawn cannot capture own piece", () => {
    // Place another white pawn at b3 (row 5, col 1)
    board[5][1] = "p";
    expect(validatePawnMove("p", [6, 0], [5, 1])).toBe(false); // a2 -> b3
  });

  test("white pawn cannot move diagonally into empty square", () => {
    expect(validatePawnMove("p", [6, 0], [5, 1])).toBe(false); // a2 -> b3
  });

  test("black pawn can move one step forward", () => {
    expect(validatePawnMove("P", [1, 0], [2, 0])).toBe(true); // a7 -> a6
  });

  test("black pawn can move two steps from start", () => {
    expect(validatePawnMove("P", [1, 0], [3, 0])).toBe(true); // a7 -> a5
  });

  test("black pawn cannot move backwards", () => {
    expect(validatePawnMove("P", [1, 0], [0, 0])).toBe(false); // a7 -> a8
  });

  test("black pawn can capture diagonally", () => {
    // Put white pawn at b6 (row 2, col 1)
    board[2][1] = "p";
    expect(validatePawnMove("P", [1, 0], [2, 1])).toBe(true); // a7 -> b6
  });

  test("black pawn cannot capture own piece", () => {
    // Place another black pawn at b6 (row 2, col 1)
    board[2][1] = "P";
    expect(validatePawnMove("P", [1, 0], [2, 1])).toBe(false); // a7 -> b6
  });

  test("black pawn cannot move diagonally into empty square", () => {
    expect(validatePawnMove("P", [1, 0], [2, 1])).toBe(false); // a7 -> b6
  });
});

describe("Knight Movement", () => {
  beforeEach(() => {
    createBoard();
  });

  test("knight can move in L-shape (2 up 1 right)", () => {
    expect(validateKnightMove("n", [7, 1], [5, 2])).toBe(true); // b1 -> c3
  });

  test("knight can move in L-shape (2 up 1 left)", () => {
    expect(validateKnightMove("n", [7, 1], [5, 0])).toBe(true); // b1 -> a3
  });

  test("knight can move in L-shape (2 right 1 up)", () => {
    expect(validateKnightMove("N", [0, 1], [2, 2])).toBe(true); // b8 -> c6
  });

  test("knight cannot move straight", () => {
    expect(validateKnightMove("n", [7, 1], [6, 1])).toBe(false); // b1 -> b2
  });

  test("knight cannot move diagonal", () => {
    expect(validateKnightMove("n", [7, 1], [6, 2])).toBe(false); // b1 -> c2
  });

  test("knight can capture opponent piece", () => {
    board[5][2] = "P"; // place black pawn at c3
    expect(validateKnightMove("n", [7, 1], [5, 2])).toBe(true); // b1 -> c3
  });

  test("knight cannot capture own piece", () => {
    board[5][2] = "p"; // place white pawn at c3
    expect(validateKnightMove("n", [7, 1], [5, 2])).toBe(false); // b1 -> c3
  });
});

describe("King Movement", () => {
  beforeEach(() => {
    createBoard();
  });

  test("king can move one square forward", () => {
    // White king at e1 -> e2
    board[7][4] = "k"; // ensure position
    board[6][4] = ""; // clear square
    expect(validateKingMove("k", [7, 4], [6, 4])).toBe(true);
  });

  test("king can move one square diagonally", () => {
    board[7][4] = "k";
    board[6][3] = "";
    expect(validateKingMove("k", [7, 4], [6, 3])).toBe(true);
  });

  test("king cannot move two squares", () => {
    board[7][4] = "k";
    board[5][4] = "";
    expect(validateKingMove("k", [7, 4], [5, 4])).toBe(false);
  });

  test("king cannot stay in the same square", () => {
    board[7][4] = "k";
    expect(validateKingMove("k", [7, 4], [7, 4])).toBe(false);
  });

  test("king can capture opponent piece", () => {
    board[7][4] = "k";
    board[6][4] = "P"; // black pawn
    expect(validateKingMove("k", [7, 4], [6, 4])).toBe(true);
  });

  test("king cannot capture own piece", () => {
    board[7][4] = "k";
    board[6][4] = "p"; // white pawn
    expect(validateKingMove("k", [7, 4], [6, 4])).toBe(false);
  });
});

describe("Rook Movement", () => {
  beforeEach(() => {
    createBoard();
    clearBoard();

    // Place a white rook at a1
    board[7][0] = "r";
  });

  test("rook can move vertically forward", () => {
    expect(validateRookMove("r", [7, 0], [5, 0])).toBe(true); // a1 -> a3
  });

  test("rook can move horizontally right", () => {
    console.log(board);
    expect(validateRookMove("r", [7, 0], [7, 5])).toBe(true); // a1 -> f1
  });

  test("rook cannot move diagonally", () => {
    expect(validateRookMove("r", [7, 0], [5, 2])).toBe(false); // a1 -> c3
  });

  test("rook is blocked by piece in path", () => {
    board[6][0] = "p"; // put pawn back at a2
    expect(validateRookMove("r", [7, 0], [5, 0])).toBe(false); // blocked
  });

  test("rook can capture opponent piece", () => {
    board[5][0] = "P"; // black pawn at a3
    expect(validateRookMove("r", [7, 0], [5, 0])).toBe(true); // capture
  });

  test("rook cannot capture own piece", () => {
    board[5][0] = "p"; // white pawn at a3
    expect(validateRookMove("r", [7, 0], [5, 0])).toBe(false);
  });
});
