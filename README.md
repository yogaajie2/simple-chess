# Simple Chess Game (Built Using Node.js)

A simple console-based chess game built with Node.js.  
The game allows two players to move pieces turn by turn using standard coordinate input (e.g., `a2 a3`).  
Basic movement and capture rules are enforced for all pieces.

---

## How to Run

1. Install Node.js
   - Download and install Node.js: [https://nodejs.org/en/download](https://nodejs.org/en/download)
   - Verify installation by running:
     ```bash
     node -v
     npm -v
     ```
2. Clone or download this repository.
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the game:
   ```bash
   node index.js
   ```
5. Run tests:
   ```bash
   npm test
   ```

## Tools & Languages Used

- JavaScript (ES6)
- Node.js [(https://nodejs.org/en)](https://nodejs.org/en)
- Jest (for testing) [(https://jestjs.io/)](https://jestjs.io/)

## Known Limitations

This app implements basic movement and capture rules only:

- Pawns, Knights, Bishops, Rooks, Queens, Kings all move with correct basic rules.
- Captures follow standard chess rules.
- Game ends when one King is captured.

Due to time and complexity constraints, the following rules and mechanics are not yet implemented:

- Pawn promotion
- Castling
- En passant
- Check / Checkmate detection
- Stalemate / Draws
- Resignation

---

If you have any questions, feel free to contact me anytime.

Thank you for giving me this opportunity.
