// utils/helpers.js

// Removes a given number of cells from a board randomly
export function removeRandomCells(board, count) {
  const coords = [];

  // Create a list of all cell positions
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      coords.push([row, col]);
    }
  }

  // Shuffle the list of coordinates
  for (let i = coords.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [coords[i], coords[j]] = [coords[j], coords[i]];
  }

  // Remove `count` cells
  for (let i = 0; i < count && i < coords.length; i++) {
    const [row, col] = coords[i];
    board[row][col] = 0;
  }

  return board;
}
