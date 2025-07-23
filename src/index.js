import './style/style.css';
import { createSudokuBoard, fillBoard, samplePuzzle } from './components/board.js';
import { createControlPanel } from './components/controlPanel.js';
import { solveSudoku } from './utils/solver.js';
import { generatePuzzle } from './utils/generator.js';

let checkMode = false;
let solvedSolution = [];
let solveBtn; // Needed for enableManualSolvingMode

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

function enableManualSolvingMode() {
  if (!checkMode) {
    solveBtn.textContent = 'Check';
    checkMode = true;
  }
}

function animateInput(cell, finalValue) {
  let current = 1;
  cell.setAttribute('disabled', 'true'); // prevent typing during animation

  const interval = setInterval(() => {
    if (current > 9) {
      clearInterval(interval);
      cell.value = finalValue;
      cell.removeAttribute('disabled'); // re-enable after animation
      return;
    }

    cell.value = current;
    current++;
  }, 30);
}

function setupButtonEvents() {
  const randomiseBtn = document.getElementById('randomise');
  solveBtn = document.getElementById('solve');
  const speedBtn = document.getElementById('speed');
  const stuckBtn = document.getElementById('stuck');

  randomiseBtn.addEventListener('click', async () => {
    const puzzle = await generatePuzzle(40);

    if (puzzle) {
      fillBoard(puzzle);
      solveBtn.textContent = 'Solve it';
      checkMode = false;

      document.querySelectorAll('.sudoku-cell').forEach(cell => {
        cell.classList.remove('correct', 'incorrect');
        cell.removeAttribute('readonly');
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (samplePuzzle[row][col] === 0) {
          const newCell = cell.cloneNode(true);
          cell.parentNode.replaceChild(newCell, cell);

          newCell.addEventListener('input', (e) => {
            let inputValue = e.target.value;

            if (!/^[1-9]$/.test(inputValue)) {
              newCell.value = '';
              return;
            }

            newCell.classList.remove('correct', 'incorrect');
            animateInput(newCell, inputValue);
            enableManualSolvingMode();
          });
        }
      });
    } else {
      alert("Couldn't generate a new puzzle. Try again.");
    }
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

    solveSudoku(board, true, speed).then(solved => {
      const end = performance.now();

      if (solved) {
        solvedSolution = JSON.parse(JSON.stringify(board));

        document.querySelectorAll('.sudoku-cell').forEach(cell => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          const value = parseInt(cell.value);

          if (samplePuzzle[row][col] === 0 && value !== 0) {
            cell.classList.add('correct');
          }
        });

        solveBtn.textContent = 'Check';
        checkMode = true;
      } else {
        alert('No solution found.');
      }

      randomiseBtn.disabled = false;
      solveBtn.disabled = false;
    });
  });

  stuckBtn.addEventListener('click', () => {
    const board = getBoardFromUI();
    const speed = speedBtn.textContent.includes('Fast') ? 50 : 300;

    randomiseBtn.disabled = true;
    solveBtn.disabled = true;
    stuckBtn.disabled = true;

    solveSudoku(board, true, speed).then(solved => {
      if (solved) {
        solvedSolution = JSON.parse(JSON.stringify(board));

        document.querySelectorAll('.sudoku-cell').forEach(cell => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          const value = parseInt(cell.value);

          if (samplePuzzle[row][col] === 0 && value !== 0) {
            cell.classList.add('correct');
          }
        });

        solveBtn.textContent = 'Check';
        checkMode = true;
      } else {
        alert('No solution found.');
      }

      randomiseBtn.disabled = false;
      solveBtn.disabled = false;
      stuckBtn.disabled = false;
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
