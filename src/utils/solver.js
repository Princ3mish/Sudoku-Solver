export async function solveSudoku(board, visual = false, delay = 100) {
  const empty = findEmpty(board);
  if (!empty) return true;

  const [row, col] = empty;

  for (let num = 1; num <= 9; num++) {
    if (isValid(board, num, row, col)) {
      board[row][col] = num;

      if (visual) {
        await updateUICell(row, col, num, delay);
      }

      if (await solveSudoku(board, visual, delay)) return true;

      board[row][col] = 0;

      if (visual) {
        await updateUICell(row, col, '', delay, true);
      }
    }
  }

  return false;
}

function findEmpty(board) {
  for (let i = 0; i < 9; i++)
    for (let j = 0; j < 9; j++)
      if (board[i][j] === 0) return [i, j];
  return null;
}

function isValid(board, num, row, col) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }

  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = 0; i < 3; i++)
    for (let j = 0; j < 3; j++)
      if (board[boxRow + i][boxCol + j] === num) return false;

  return true;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function updateUICell(row, col, value, delay, isBacktracking = false) {
  const selector = `.sudoku-cell[data-row="${row}"][data-col="${col}"]`;
  const cell = document.querySelector(selector);
  if (cell) {
    cell.value = value;
    cell.classList.toggle('backtrack', isBacktracking);
    await sleep(delay);
  }
}
