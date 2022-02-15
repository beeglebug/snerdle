import { SIZE } from "./consts";
import { getElement } from "./grid";
import { collideTail, randomInt } from "./util";

export function spawn(letter, snake) {
  const { position, direction } = snake;
  let escape = 0;
  // TODO probably super inneficient
  while (true) {
    if (escape++ > 20) {
      console.error("failed to spawn");
      return;
    }
    // dont spawn on outer edges
    const x = randomInt(1, SIZE - 2);
    const y = randomInt(1, SIZE - 2);
    const cell = getElement(x, y, SIZE);

    // dont spawn around head
    if (distance(position.x, position.y, x, y) < 3) continue;

    if (collideTail(snake, x, y)) continue;
    if (x === position.x && y === position.y) continue;
    if (cell.innerHTML !== "") continue;

    cell.innerHTML = letter;
    break;
  }
}

// manhattan distance
const distance = (x1, y1, x2, y2) => {
  Math.abs(x1 - x2) + Math.abs(y1 - y2);
};
