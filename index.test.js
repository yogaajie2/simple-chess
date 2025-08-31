const { beforeEach, describe, expect, test } = require("@jest/globals");
const { createBoard, board, width, validatePawnMove } = require("./index");

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
});
