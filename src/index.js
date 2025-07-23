import "./style/style.css";
import {
  createSudokuBoard,
  fillBoard,
  samplePuzzle,
} from "./components/board.js";
import { createControlPanel } from "./components/controlPanel.js";
import { solveSudoku } from "./utils/solver.js";
import { generatePuzzle } from "./utils/generator.js";

let checkMode = false;
let solvedSolution = [];
let solveBtn;
let currentPuzzle = null;

function getBoardFromUI() {
  const cells = document.querySelectorAll(".sudoku-cell");
  const board = Array.from({ length: 9 }, () => Array(9).fill(0));

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.value);
    board[row][col] = isNaN(value) ? 0 : value;
  });

  return board;
}

function handleCheck() {
  const board = getBoardFromUI();
  const cells = document.querySelectorAll(".sudoku-cell");
  let allCorrect = true;

  cells.forEach((cell) => {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    const value = parseInt(cell.value);
    const correctValue = solvedSolution[row][col];

    if (samplePuzzle[row][col] !== 0) return;

    if (value === correctValue) {
      cell.classList.remove("incorrect");
      cell.classList.add("correct");
    } else {
      cell.classList.remove("correct");
      cell.classList.add("incorrect");
      allCorrect = false;
    }
  });

  if (allCorrect) {
    alert("🎉 Puzzle correctly solved!");
  }
}

function enableManualSolvingMode() {
  if (!checkMode) {
    solveBtn.textContent = "Check";
    checkMode = true;
  }
}

function animateInput(cell, finalValue) {
  let current = 1;
  cell.setAttribute("disabled", "true");

  const interval = setInterval(() => {
    if (current > 9) {
      clearInterval(interval);
      cell.value = finalValue;
      cell.removeAttribute("disabled");
      return;
    }

    cell.value = current;
    current++;
  }, 30);
}

function setupButtonEvents() {
  const randomiseBtn = document.getElementById("randomise");
  solveBtn = document.getElementById("solve");
  const speedBtn = document.getElementById("speed");
  const stuckBtn = document.getElementById("stuck");

  randomiseBtn.addEventListener("click", async () => {
    const puzzle = await generatePuzzle(40);

    if (puzzle) {
      fillBoard(puzzle);
      solveBtn.textContent = "Solve it";
      checkMode = false;
      currentPuzzle = JSON.parse(JSON.stringify(puzzle)); // Store the generated puzzle

      document.querySelectorAll(".sudoku-cell").forEach((cell) => {
        cell.classList.remove("correct", "incorrect");
        cell.removeAttribute("readonly");
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);

        if (samplePuzzle[row][col] === 0) {
          const newCell = cell.cloneNode(true);
          cell.parentNode.replaceChild(newCell, cell);

          newCell.addEventListener("input", (e) => {
            let inputValue = e.target.value;

            if (!/^[1-9]$/.test(inputValue)) {
              newCell.value = "";
              return;
            }

            newCell.classList.remove("correct", "incorrect");
            animateInput(newCell, inputValue);
            enableManualSolvingMode();
          });
        }
      });
    } else {
      alert("Couldn't generate a new puzzle. Try again.");
    }
  });

  solveBtn.addEventListener("click", () => {
    if (checkMode) {
      handleCheck();
      return;
    }

    const board = getBoardFromUI();
    const speed = speedBtn.textContent.includes("Fast") ? 50 : 300;

    randomiseBtn.disabled = true;
    solveBtn.disabled = true;

    const start = performance.now();

    solveSudoku(board, true, speed).then((solved) => {
      const end = performance.now();

      if (solved) {
        solvedSolution = JSON.parse(JSON.stringify(board));

        document.querySelectorAll(".sudoku-cell").forEach((cell) => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          const value = parseInt(cell.value);

          if (samplePuzzle[row][col] === 0 && value !== 0) {
            cell.classList.add("correct");
          }
        });

        solveBtn.textContent = "Check";
        checkMode = true;
      } else {
        alert("No solution found.");
      }

      randomiseBtn.disabled = false;
      solveBtn.disabled = false;
    });
  });

  stuckBtn.addEventListener("click", () => {
    const board = getBoardFromUI();
    const speed = speedBtn.textContent.includes("Fast") ? 50 : 300;

    randomiseBtn.disabled = true;
    solveBtn.disabled = true;
    stuckBtn.disabled = true;

    solveSudoku(board, true, speed).then((solved) => {
      if (solved) {
        solvedSolution = JSON.parse(JSON.stringify(board));

        document.querySelectorAll(".sudoku-cell").forEach((cell) => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          const value = parseInt(cell.value);

          if (
            (currentPuzzle
              ? currentPuzzle[row][col]
              : samplePuzzle[row][col]) === 0 &&
            value !== 0
          ) {
            cell.classList.add("correct");
          }
        });

        solveBtn.textContent = "Check";
        checkMode = true;
      } else {
        document.querySelectorAll(".sudoku-cell").forEach((cell) => {
          const row = parseInt(cell.dataset.row);
          const col = parseInt(cell.dataset.col);
          cell.classList.remove("correct", "incorrect");
          if (
            (currentPuzzle
              ? currentPuzzle[row][col]
              : samplePuzzle[row][col]) === 0
          ) {
            cell.value = "";
            cell.disabled = false;
            cell.classList.remove("prefilled");
          } else {
            cell.value = currentPuzzle
              ? currentPuzzle[row][col]
              : samplePuzzle[row][col];
            cell.disabled = true;
            cell.classList.add("prefilled");
          }
        });
        // Try to solve the original puzzle (not the current board)
        const puzzleToSolve = currentPuzzle
          ? JSON.parse(JSON.stringify(currentPuzzle))
          : JSON.parse(JSON.stringify(samplePuzzle));
        solveSudoku(puzzleToSolve, true, speed).then((solvedAfterClear) => {
          if (solvedAfterClear) {
            solvedSolution = JSON.parse(JSON.stringify(puzzleToSolve));
            // Fill the board with the correct solution
            document.querySelectorAll(".sudoku-cell").forEach((cell) => {
              const row = parseInt(cell.dataset.row);
              const col = parseInt(cell.dataset.col);
              if (
                (currentPuzzle
                  ? currentPuzzle[row][col]
                  : samplePuzzle[row][col]) === 0
              ) {
                cell.value = solvedSolution[row][col];
                cell.classList.add("correct");
              }
            });
            solveBtn.textContent = "Check";
            checkMode = true;
          } else {
            alert("No solution found. The puzzle cannot be solved.");
          }
          randomiseBtn.disabled = false;
          solveBtn.disabled = false;
          stuckBtn.disabled = false;
        });
        return;
      }
      randomiseBtn.disabled = false;
      solveBtn.disabled = false;
      stuckBtn.disabled = false;
    });
  });

  speedBtn.addEventListener("click", () => {
    speedBtn.textContent = speedBtn.textContent.includes("Fast")
      ? "Speed: Slow"
      : "Speed: Fast";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  createSudokuBoard();
  createControlPanel();
  setupButtonEvents();

  let layout = document.getElementById("layout");
  if (layout && !document.getElementById("rules-box")) {
    const rulesBox = document.createElement("div");
    rulesBox.id = "rules-box";
    rulesBox.innerHTML = `
      <h3 style="margin-top:0;">How to Play Sudoku</h3>
      <ul style="padding-left:18px; margin:0;">
        <li>Fill the grid so every row, column, and 3x3 box contains the digits 1 to 9.</li>
        <li>No number may appear more than once in any row, column, or 3x3 box.</li>
        <li>Click on a cell and type a number (1-9) to fill it in.</li>
        <li>Use the control panel to randomize, solve, or check your solution.</li>
        <li>Have fun and challenge yourself!</li>
      </ul>
    `;
    layout.appendChild(rulesBox);
  }

  if (!document.querySelector("footer")) {
    const footer = document.createElement("footer");
    footer.innerHTML = `
      <span>Sudoku Solver &copy; 2024</span>
      <a href="https://github.com/Princ3mish" target="_blank" aria-label="GitHub">
        <svg height="1.5em" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M12 0C5.37 0 0 5.373 0 12c0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.468-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23.957-.266 1.984-.399 3.003-.404 1.018.005 2.045.138 3.003.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .321.218.694.825.576C20.565 21.796 24 17.299 24 12c0-6.627-5.373-12-12-12z"/></svg>
      </a>
      <a href="https://www.linkedin.com/in/pmish04/" target="_blank" aria-label="LinkedIn">
        <svg height="1.5em" viewBox="0 0 24 24" fill="currentColor" style="vertical-align:middle;"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 11.28h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v5.59z"/></svg>
      </a>
    `;
    document.body.appendChild(footer);
  }
});
