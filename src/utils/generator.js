import { solveSudoku } from './solver.js';
import { removeRandomCells } from './helpers.js'; // Ensure this file exports correctly

// Async puzzle generator
export async function generatePuzzle(emptyCells = 40) {
  const fullBoard = Array.from({ length: 9 }, () => Array(9).fill(0));

  const solved = await solveSudoku(fullBoard, false); // false = no animation
  if (!solved) return null;

  let puzzle = JSON.parse(JSON.stringify(fullBoard));
  removeRandomCells(puzzle, emptyCells);

  let attempts = 0;

  // Validate puzzle has a solution before using it
  while (
    !(await solveSudoku(JSON.parse(JSON.stringify(puzzle)), false)) &&
    attempts < 10
  ) {
    puzzle = JSON.parse(JSON.stringify(fullBoard));
    removeRandomCells(puzzle, emptyCells);
    attempts++;
  }

  return puzzle;
}

// Optional helpers (can be moved to a separate file if needed)
function fillDiagonalBox(board, row, col) {
  const nums = shuffle([...Array(9).keys()].map(x => x + 1));
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      board[row + i][col + j] = nums[i * 3 + j];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
