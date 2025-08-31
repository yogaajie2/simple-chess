const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const width = 8;
let playerTurn = "white";

// prettier-ignore
const startPieces = [
  "R","N","B","Q","K","B","N","R",
  "P","P","P","P","P","P","P","P",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "","","","","","","","",
  "p","p","p","p","p","p","p","p",
  "r","n","b","k","q","b","n","r"
];

let board = [];

// Initialize board as 2D array
function createBoard() {
  for (let row = 0; row < width; row++) {
    board[row] = [];

    for (let col = 0; col < width; col++) {
      board[row][col] = startPieces[row * width + col];
    }
  }
}

// Print board to console
function printBoard() {
  console.log("\n   a b c d e f g h");
  console.log("  -----------------");

  for (let row = 0; row < width; row++) {
    let rowStr = 8 - row + " |";

    for (let col = 0; col < width; col++) {
      rowStr += (board[row][col] || ".") + " ";
    }

    console.log(rowStr + "|" + (8 - row));
  }

  console.log("  -----------------");
  console.log("   a b c d e f g h\n");
}

// Convert input into row, col
function parsePosition(pos) {
  const col = pos[0].toLowerCase().charCodeAt(0) - 97; // Convert character to zero-based index
  const row = 8 - parseInt(pos[1]); // invert row index
  return [row, col];
}

function validatePawnMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const target = board[toRow][toCol];

  const direction = piece === "P" ? 1 : -1; // White = p moves up, Black = P moves down
  const startRow = piece === "P" ? 1 : 6; // White pawns start at row 1, black at row 6

  // 1 step forward
  if (toCol === fromCol && toRow === fromRow + direction && !target) {
    return true;
  }

  // 2 steps forward from starting position
  if (
    toCol === fromCol && // same column
    fromRow === startRow && // starting row
    toRow === fromRow + 2 * direction && // two steps forward
    !target // target square empty
  ) {
    // ensure no piece in between
    const middleRow = fromRow + direction;
    if (!board[middleRow][toCol]) return true;
  }

  // Diagonal capture
  if (
    Math.abs(toCol - fromCol) === 1 && // one column diagonal
    toRow === fromRow + direction && // one row forward
    target // there is a piece to capture
  ) {
    // Ensure capture is opponent piece
    if (
      (piece === "P" && target === target.toLowerCase()) ||
      (piece === "p" && target === target.toUpperCase())
    ) {
      return true;
    }
  }

  return false;
}

function validateKnightMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const target = board[toRow][toCol];
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Validate L-shape movement
  if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
    return false;
  }

  // Ensure empty square
  if (!target) return true;

  // If capturing, must be opponent
  if (
    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
    (piece === piece.toLowerCase() && target === target.toUpperCase())
  ) {
    return true;
  }

  return false;
}

function validateKingMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const target = board[toRow][toCol];
  const rowDiff = Math.abs(toRow - fromRow);
  const colDiff = Math.abs(toCol - fromCol);

  // Can only move 1 step in any direction
  if (rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0)) {
    // Ensure empty square
    if (!target) return true;

    // If capturing, must be opponent
    if (
      (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
      (piece === piece.toLowerCase() && target === target.toUpperCase())
    ) {
      return true;
    }
  }

  return false;
}

function validateRookMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const target = board[toRow][toCol];

  // Must move in straight line
  if (fromRow !== toRow && fromCol !== toCol) {
    return false;
  }

  // Check for any blocking pieces along the path
  // Determine direction of movement
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  // Loop through path until destination
  while (r !== toRow || c !== toCol) {
    if (board[r][c]) return false; // Path blocked
    r += rowStep;
    c += colStep;
  }

  // Ensure destination is empty
  if (!target) return true;

  // Capture if destination piece is an opponent
  if (
    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
    (piece === piece.toLowerCase() && target === target.toUpperCase())
  ) {
    return true;
  }

  return false;
}

// Similar logic to Rook, but only moves diagonally
function validateBishopMove(piece, from, to) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;
  const target = board[toRow][toCol];

  // Must move diagonally
  if (Math.abs(toRow - fromRow) !== Math.abs(toCol - fromCol)) {
    return false;
  }

  // Check for any blocking pieces along the path
  // Determine direction of movement
  const rowStep = Math.sign(toRow - fromRow);
  const colStep = Math.sign(toCol - fromCol);

  let r = fromRow + rowStep;
  let c = fromCol + colStep;

  // Loop through path until destination
  while (r !== toRow && c !== toCol) {
    if (board[r][c]) return false; // Path blocked
    r += rowStep;
    c += colStep;
  }

  // Ensure destination is empty
  if (!target) return true;

  // Capture if destination piece is an opponent
  if (
    (piece === piece.toUpperCase() && target === target.toLowerCase()) ||
    (piece === piece.toLowerCase() && target === target.toUpperCase())
  ) {
    return true;
  }

  return false;
}

// Reuse and combine Rook and Bishop logic
function validateQueenMove(piece, from, to) {
  if (validateRookMove(piece, from, to)) return true;
  if (validateBishopMove(piece, from, to)) return true;
  return false;
}

function isValidMove(piece, from, to) {
  const pieceType = piece.toLowerCase();

  switch (pieceType) {
    case "p":
      return validatePawnMove(piece, from, to);
    case "n":
      return validateKnightMove(piece, from, to);
    case "k":
      return validateKingMove(piece, from, to);
    case "r":
      return validateRookMove(piece, from, to);
    case "b":
      return validateBishopMove(piece, from, to);
    case "q":
      return validateQueenMove(piece, from, to);
    default:
      return false;
  }
}

function checkWinCondition() {
  let hasWhiteKing = false;
  let hasBlackKing = false;

  // Traverse board, ensure both kings exist
  for (let row = 0; row < width; row++) {
    for (let col = 0; col < width; col++) {
      if (board[row][col] === "k") hasWhiteKing = true;
      if (board[row][col] === "K") hasBlackKing = true;
    }
  }

  // End the game
  if (!hasWhiteKing) {
    console.log("Black wins! The White King has been captured.");

    process.exit(0);
  }

  if (!hasBlackKing) {
    console.log("White wins! The Black King has been captured.");

    process.exit(0);
  }
}

function isCorrectPiece(piece, player) {
  if (player === "black" && piece === piece.toUpperCase()) return true;
  if (player === "white" && piece === piece.toLowerCase()) return true;
  return false;
}

// Move piece
function movePiece(from, to) {
  const [fromRow, fromCol] = parsePosition(from);
  const [toRow, toCol] = parsePosition(to);

  const piece = board[fromRow][fromCol];

  // Check piece
  if (!piece) {
    console.log("No piece at that position.");
    return false;
  }

  // Piece ownership validation
  if (!isCorrectPiece(piece, playerTurn)) {
    console.log(
      `Wrong piece selected. It's ${playerTurn}'s ${
        playerTurn === "white" ? "(lowercase pieces)" : "(uppercase pieces)"
      } turn.`
    );

    return false;
  }

  // Update piece position if valid then check win condition
  if (isValidMove(piece, [fromRow, fromCol], [toRow, toCol])) {
    board[toRow][toCol] = piece;
    board[fromRow][fromCol] = "";
    checkWinCondition();
    return true;
  }

  console.log("Invalid move.");
  return false;
}

function validateCoordinates(coord) {
  // Only accept two characters
  if (!coord || coord.length !== 2) return false;

  // Only accepts the letter a-h and numbers 1-8
  const file = coord[0].toLowerCase();
  const rank = coord[1];
  return file >= "a" && file <= "h" && rank >= "1" && rank <= "8";
}

// Game loop
function nextTurn() {
  printBoard();

  rl.question(
    `${playerTurn}'s ${
      playerTurn === "white" ? "(lowercase pieces)" : "(uppercase pieces)"
    } move (e.g., a2 a3): `,
    (answer) => {
      const parts = answer.trim().split(/\s+/);

      // Only accepts proper coordinates input format
      if (parts.length !== 2) {
        console.log("Invalid input format. Use e.g. 'a2 a3'.");
        return nextTurn();
      }

      const [from, to] = parts;

      // Input format validation
      if (!validateCoordinates(from) || !validateCoordinates(to)) {
        console.log(
          "Invalid coordinates. Use files a-h and ranks 1-8 (e.g., 'a2 a3')."
        );

        return nextTurn();
      }

      if (movePiece(from, to)) {
        // Switch turn
        playerTurn = playerTurn === "white" ? "black" : "white";
      }

      nextTurn();
    }
  );
}

// Start game
createBoard();
nextTurn();

module.exports = {
  createBoard,
  board,
  width,
  validatePawnMove,
  validateKnightMove,
  validateKingMove,
  validateRookMove,
};
