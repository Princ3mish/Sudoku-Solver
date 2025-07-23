import { solveSudoku } from "./solver.js"; 

async function countSolutions(board) {
  let count = 0;
  async function solveCount(bd) {
    const empty = (() => {
      for (let i = 0; i < 9; i++)
        for (let j = 0; j < 9; j++) if (bd[i][j] === 0) return [i, j];
      return null;
    })();
    if (!empty) {
      count++;
      return;
    }
    const [row, col] = empty;
    for (let num = 1; num <= 9; num++) {
      if (isValid(bd, num, row, col)) {
        bd[row][col] = num;
        await solveCount(bd);
        if (count > 1) return; 
        bd[row][col] = 0;
      }
    }
  }
  function isValid(bd, num, row, col) {
    for (let i = 0; i < 9; i++) {
      if (bd[row][i] === num || bd[i][col] === num) return false;
    }
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (bd[boxRow + i][boxCol + j] === num) return false;
    return true;
  }
  await solveCount(JSON.parse(JSON.stringify(board)));
  return count;
}

export async function generatePuzzle(emptyCells = 40) {
  const fullBoard = Array.from({ length: 9 }, () => Array(9).fill(0));
  const solved = await solveSudoku(fullBoard, false); // false = no animation
  if (!solved) return null;
  let puzzle = JSON.parse(JSON.stringify(fullBoard));

  // Remove cells one by one, only if unique solution remains
  let cellsToRemove = emptyCells;
  const coords = [];
  for (let row = 0; row < 9; row++)
    for (let col = 0; col < 9; col++) coords.push([row, col]);
  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }
  for (let i = 0; i < coords.length && cellsToRemove > 0; i++) {
    const [row, col] = coords[i];
    const backup = puzzle[row][col];
    puzzle[row][col] = 0;
    const numSolutions = await countSolutions(puzzle);
    if (numSolutions !== 1) {
      puzzle[row][col] = backup; // revert if not unique
    } else {
      cellsToRemove--;
    }
  }
  return puzzle;
}

function fillDiagonalBox(board, row, col) {
  const nums = shuffle([...Array(9).keys()].map((x) => x + 1));
  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++) board[row + i][col + j] = nums[i * 3 + j];
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
