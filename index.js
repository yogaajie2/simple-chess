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

// --- Game loop
function nextTurn() {
  printBoard();
}

// Start game
createBoard();
nextTurn();
