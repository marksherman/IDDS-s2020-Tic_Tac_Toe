/* globals board gridSize emptyCells board2d compareArrays report getRows getColumns */

/* ai.js
 *
 * Tic Tac Toe Game Player File (an Artificial Intelligence program)
 *
 * by 👉enter yourself here, with email 👈
 *
 *           INSTRUCTIONS
 *
 * - Write your AI in this file.
 * - You may create new functions, variables, and anything else your AI needs in this file.
 * - Don't edit the sketch.js file. You can look, but don't touch.
 * - The AI takes one turn at a time.
 * - The AI is invoked when the game calls the aiSelect() function.
 * - The aiSelect() function returns the number of which cell to mark, 0-8:
 *
 *     0 | 1 | 2
 *    -----------
 *     3 | 4 | 5
 *    -----------
 *     6 | 7 | 8
 *
 * - The AI may NOT edit the game state in any way.
 * - The AI MUST return 0-8 from aiSelect (as long the game hasn't ended yet, after which we don't care)
 * - The AI may look at the game state variables: board, gridSize, etc, but not change them.
 *
 * - The game is 2-dimensional, but the board is stored a 1-dimensional array, using the cell numbers above.
 * - If you want to think about the board as 2D, we provided a function board2d() to provide a 2d interface to it.
 * - Each cell of the board is either 'X', 'O', or '', where empty string means the cell is empty.
 *
 *        RESOURCES
 * board        ➡️ variable containing the board state array. Readable like this: board[5]
 * gridSize     ➡️ variable describing the width (and heigh) of the board. Default is 3.
 * player       ➡️ variable containing the mark of the current player (that's you!)
 *
 * board2d()    ➡️ function to read the board while thinking 2D, like this: board(2,3) <- reads value row 2, column 3
 * cell2d()     ➡️ function that converts coordinates (row, col) into a 1D cell number.
 *
 * getRows()    ➡️ function that slices the game stateinto rows. Returns an array of the rows. Each row is an array.
 * getColumns() ➡️ function that slices the game state into columns. Returns an array of cols, each is an array.
 *
 * emptyCells() ➡️ function to give you what cells are empty in a given board state (or array). emptyCells(board)
 */

function aiSelect() {
  const center = floor(gridSize / 2);
  const empties = emptyCells(board);
  
  // Step 1: if it's an empty board, take the center (assumes an odd-numbered gridSize)
  if (empties.length === gridSize * gridSize) {
    report('taking center cell');
    return cell2d(center, center);
  }

  // Step 2: if there's only one cell left, you have to take it
  if (empties.length === 1) {
    report('only one cell left...');
    return empties[0];
  }

  // Step 3: look at all the rows. If any of them are one short of being complete with all the same mark, take it!
  // This works for a win case and a defenseive maneuver.
  const rowCheck = rowFinder(getRows(), false);
  report(`rowCheck: ${rowCheck}`);
  if (rowCheck !== undefined) {
    report(`Found a near-complete row. Playing ${rowCheck}`);
    return rowCheck;
  }

  // Step 4: do the same thing with columns
  const colCheck = rowFinder(getColumns(), true);
  report(`colCheck: ${colCheck}`);
  if (colCheck !== undefined) {
    report(`Found a near-complete column. Playing ${colCheck}`);
    return colCheck;
  }

  // Step 5: beyond this, choose at random.
  report('Choosing at random');
  return random(empties);
}

function rowFinder(rows, isActuallyColumns) {
  for (let r = 0; r < gridSize; r++) {
    const row = rows[r];
    if (emptyCells(row).length === 1) {
      // if the row has both marks in it, it's not a risk. If it doesn't, then it MUST be all the same!
      const containsBoth = row.includes(players[0]) && row.includes(players[1]);
      if (!containsBoth) {
        if (isActuallyColumns === true) {
          return emptyCells(row)[0] * gridSize + r;
        } else {
          return r * gridSize + emptyCells(row)[0];
        }
      }
    }
  }
}
