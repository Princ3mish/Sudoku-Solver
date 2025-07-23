import './style/style.css';
import { createSudokuBoard, fillBoard, samplePuzzle } from './components/board.js';
import { createControlPanel } from './components/controlPanel.js';
import { solveSudoku } from './utils/solver.js';

let checkMode = false;
let solvedSolution = [];

function getBoardFromUI() {
  const cells = document.querySelectorAll('.sudoku-cell');
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.value);
    board[row][col] = isNaN(value) ? 0 : value;
  });

  return board;
}

function handleCheck() {
  const board = getBoardFromUI();
  const cells = document.querySelectorAll('.sudoku-cell');
  let allCorrect = true;

  cells.forEach(cell => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.value);
    const correctValue = solvedSolution[row][col];

    if (samplePuzzle[row][col] !== 0) return;

    if (value === correctValue) {
      cell.classList.remove('incorrect');
      cell.classList.add('correct');
    } else {
      cell.classList.remove('correct');
      cell.classList.add('incorrect');
      allCorrect = false;
    }
  });

  if (allCorrect) {
    alert('🎉 Puzzle correctly solved!');
  }
}

function setupButtonEvents() {
  const randomiseBtn = document.getElementById('randomise');
  const solveBtn = document.getElementById('solve');
  const speedBtn = document.getElementById('speed');

  randomiseBtn.addEventListener('click', () => {
    fillBoard(samplePuzzle);
    solveBtn.textContent = 'Solve it';
    checkMode = false;
    document.querySelectorAll('.sudoku-cell').forEach(cell => {
      cell.classList.remove('correct', 'incorrect');
    });
  });

  solveBtn.addEventListener('click', () => {
    if (checkMode) {
      handleCheck();
      return;
    }

    const board = getBoardFromUI();
    const speed = speedBtn.textContent.includes('Fast') ? 50 : 300;

    randomiseBtn.disabled = true;
    solveBtn.disabled = true;

    const start = performance.now();

    solveSudoku(board, false, speed).then(solved => {
      const end = performance.now();

      if (solved) {
        solvedSolution = JSON.parse(JSON.stringify(board));
        fillBoard(samplePuzzle); // reset to user mode
        solveBtn.textContent = 'Check';
        checkMode = true;
      } else {
        alert('No solution found.');
      }

      randomiseBtn.disabled = false;
      solveBtn.disabled = false;
    });
  });

  speedBtn.addEventListener('click', () => {
    speedBtn.textContent = speedBtn.textContent.includes('Fast')
      ? 'Speed: Slow'
      : 'Speed: Fast';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  createSudokuBoard();
  createControlPanel();
  setupButtonEvents();
});
