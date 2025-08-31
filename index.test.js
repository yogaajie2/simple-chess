const { beforeEach, describe, expect, test } = require("@jest/globals");
const { createBoard, board, width } = require("./index");

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
