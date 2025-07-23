// src/components/board.js

export const samplePuzzle = [
  [5, 3, 0, 0, 7, 0, 0, 0, 0],
  [6, 0, 0, 1, 9, 5, 0, 0, 0],
  [0, 9, 8, 0, 0, 0, 0, 6, 0],
  [8, 0, 0, 0, 6, 0, 0, 0, 3],
  [4, 0, 0, 8, 0, 3, 0, 0, 1],
  [7, 0, 0, 0, 2, 0, 0, 0, 6],
  [0, 6, 0, 0, 0, 0, 2, 8, 0],
  [0, 0, 0, 4, 1, 9, 0, 0, 5],
  [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

export function createSudokuBoard() {
  const board = document.getElementById('sudoku-board');
  board.innerHTML = ''; // Clear if already rendered

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      const cell = document.createElement('input');
      cell.type = 'text';
      cell.maxLength = 1;
      cell.classList.add('sudoku-cell');
      cell.dataset.row = row;
      cell.dataset.col = col;
      board.appendChild(cell);
    }
  }
}

export function fillBoard(puzzle) {
  const cells = document.querySelectorAll('.sudoku-cell');
  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = puzzle[row][col];
    if (value !== 0) {
      cell.value = value;
      cell.disabled = true;
      cell.classList.add('prefilled');
    } else {
      cell.value = '';
      cell.disabled = false;
      cell.classList.remove('prefilled');
    }
  });
}
