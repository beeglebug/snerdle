import { calculateState } from "./util";
import { all, selected } from "./words";

const grid = document.querySelector(".grid");

const size = 15;

const elements = [];

for (let y = 0; y < size; y++) {
  const row = document.createElement("div");
  row.classList.add("row");
  grid.appendChild(row);
  for (let x = 0; x < size; x++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    row.appendChild(cell);
    elements.push(cell);
  }
}

const getElement = (x, y) => {
  const i = y * size + x;
  return elements[i];
};

const snake = {
  position: {
    x: 5,
    y: 5,
  },
  direction: {
    x: 1,
    y: 0,
  },
  tail: [],
  path: [],
};

const answer = selected[Math.floor(Math.random() * selected.length)];

function render() {
  const { tail, path, position, direction } = snake;

  // reset
  document
    .querySelectorAll(".unknown, .bad, .head, .correct, .present, .miss")
    .forEach((el) => {
      el.innerHTML = "";
      el.classList.remove("unknown", "correct", "present", "miss", "bad");
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

render();

function die() {
  clearInterval(loop);
}

function update() {
  const { path, tail, direction, position } = snake;

  const nextX = position.x + direction.x;
  const nextY = position.y + direction.y;

  const collideBounds =
    nextX < 0 || nextX >= size || nextY < 0 || nextY >= size;

  if (collideBounds) return die();

  const collideSelf = collideTail(nextX, nextY, false);

  if (collideSelf) return die();

  const nextCell = getElement(nextX, nextY);
  const letter = nextCell.innerHTML;
  if (letter) {
    eat(letter, nextX, nextY);
  }

  path.push({ x: position.x, y: position.y });

  // TODO truncate path

  position.x = nextX;
  position.y = nextY;
}

function eat(letter, x, y) {
  const { tail } = snake;
  const type = "unknown";
  tail.unshift({ letter, x, y, type });

  if (tail.length % 5 === 0) {
    const letters = tail.slice(0, 5);
    letters.reverse();
    const word = letters.map((l) => l.letter).join("");
    guess(word);
  }

  spawn(letter);
}

function guess(word) {
  console.log(word);
  if (word === answer) {
    die();
    return;
  }

  if (all.indexOf(word) === -1) {
    for (let i = 0; i < 5; i++) {
      snake.tail[i].type = "bad";
    }
    return;
  }

  const state = calculateState(word, answer);

  state.forEach((letter, ix) => {
    const segment = snake.tail[4 - ix];
    if (letter.present) {
      segment.type = "present";
    } else if (letter.correct) {
      segment.type = "correct";
    } else {
      segment.type = "miss";
    }
  });

  console.log(state);
}

// TODO a nextDirection which is not commited until next update
function faceUp() {
  if (snake.direction.y === 1) return;
  snake.direction.x = 0;
  snake.direction.y = -1;
}

function faceDown() {
  if (snake.direction.y === -1) return;
  snake.direction.x = 0;
  snake.direction.y = 1;
}

function faceLeft() {
  if (snake.direction.x === 1) return;
  snake.direction.x = -1;
  snake.direction.y = 0;
}

function faceRight() {
  if (snake.direction.x === -1) return;
  snake.direction.x = 1;
  snake.direction.y = 0;
}

document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") return faceUp();
  if (e.code === "ArrowDown") return faceDown();
  if (e.code === "ArrowLeft") return faceLeft();
  if (e.code === "ArrowRight") return faceRight();
});

function tick() {
  update();
  render();
}

// TODO variable interval via accumulator loop
const loop = setInterval(tick, 500);

const letters = "abcdefghijklmnopqrstuvwxyz".split("");

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

function spawn(letter) {
  const { position } = snake;

  // TODO dont spawn in radius around head

  // TODO probably super inneficient
  while (true) {
    const x = randomInt(0, size - 1);
    const y = randomInt(0, size - 1);
    if (collideTail(x, y) || (x === position.x && y === position.y)) continue;
    const cell = getElement(x, y);
    if (cell.innerHTML !== "") continue;
    cell.innerHTML = letter;
    break;
  }
}
// TODO include end param
const collideTail = (x, y, includeEnd) => {
  const { path, tail } = snake;
  const shortPath = path.slice(-tail.length);
  return shortPath.find((p) => p.x === x && p.y === y);
};

for (let i = 0; i < 26; i++) {
  const letter = letters[i];
  spawn(letter);
}
