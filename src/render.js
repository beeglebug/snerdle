import { getElement } from "./grid";

const classnames = ["unknown", "bad", "head", "correct", "present", "miss"];
const selector = classnames.map((name) => "." + name).join();

export function render(snake) {
  const { tail, path, position, direction } = snake;

  // reset
  document.querySelectorAll(selector).forEach((el) => {
    el.innerHTML = "";
    el.classList.remove(...classnames);
  });

  const head = getElement(position.x, position.y);
  head.classList.add("head");

  const char = getCharForDirection(direction);

  head.innerHTML = char;

  for (let i = 0; i < tail.length; i++) {
    const ix = path.length - 1 - i;
    const { x, y } = path[ix];
    const el = getElement(x, y);

    const { letter, type } = tail[i];
    el.classList.add(type);
    el.innerHTML = letter;
  }
}

function getCharForDirection({ x, y }) {
  if (x === 1) return "▶";
  if (x === -1) return "◀";
  if (y === 1) return "▼";
  if (y === -1) return "▲";
}
