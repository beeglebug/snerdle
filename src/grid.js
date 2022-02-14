import { SIZE } from "./consts";

const elements = [];

export function createGrid() {
  const grid = document.querySelector(".grid");

  for (let y = 0; y < SIZE; y++) {
    const row = document.createElement("div");
    row.classList.add("row");
    grid.appendChild(row);
    for (let x = 0; x < SIZE; x++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      row.appendChild(cell);
      elements.push(cell);
    }
  }

  return elements;
}

export const getElement = (x, y) => {
  const i = y * SIZE + x;
  return elements[i];
};
