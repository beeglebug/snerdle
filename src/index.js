import { INITIAL_SPEED, LETTERS, SIZE, SPEED_INCREMENT } from "./consts";
import { createGrid, getElement } from "./grid";
import { bindInput } from "./input";
import { render } from "./render";
import { spawn } from "./spawn";
import { calculateState, collideTail } from "./util";
import { all, selected } from "./words";

const snake = {
  position: {
    x: 5,
    y: 5,
  },
  nextDirection: {
    x: 1,
    y: 0,
  },
  direction: {
    x: 1,
    y: 0,
  },
  tail: [],
  path: [],
};

const elements = createGrid();
bindInput(snake);

const modalContainer = document.querySelector(".modal-container");
const elAnswer = document.querySelector(".js-answer");
const elStats = document.querySelector(".js-stats");
const elTitle = document.querySelector(".js-title");
const elRestart = document.querySelector(".js-restart");
elRestart.addEventListener("click", restart);

function lose() {
  running = false;
  gtag("event", "lose");
  showStats("Game Over");
}

function win() {
  running = false;
  gtag("event", "win");
  showStats("Well Done");
}

function showStats(title) {
  elTitle.innerHTML = title;
  modalContainer.classList.remove("d-none");
  elAnswer.innerHTML = answer;

  const letters = snake.tail.length;
  const guesses = Math.floor(snake.tail.length / 5);

  elStats.innerHTML = `You ate ${letters} letter${
    letters === 1 ? "" : "s"
  } and had ${guesses} guess${guesses === 1 ? "" : "es"}.`;
}

function update() {
  const { path, tail, direction, nextDirection, position } = snake;

  direction.x = nextDirection.x;
  direction.y = nextDirection.y;

  const nextX = position.x + direction.x;
  const nextY = position.y + direction.y;

  const collideBounds =
    nextX < 0 || nextX >= SIZE || nextY < 0 || nextY >= SIZE;

  if (collideBounds) return lose();

  const collideSelf = collideTail(snake, nextX, nextY, false);

  if (collideSelf) return lose();

  const nextCell = getElement(nextX, nextY);
  const letter = nextCell.innerHTML;
  if (letter) {
    eat(letter, nextX, nextY);
  }

  path.push({ x: position.x, y: position.y });

  position.x = nextX;
  position.y = nextY;
}

function eat(letter, x, y) {
  const { tail } = snake;
  const type = "unknown";
  tail.unshift({ letter, x, y, type });
  speed -= SPEED_INCREMENT;

  if (tail.length % 5 === 0) {
    const letters = tail.slice(0, 5);
    letters.reverse();
    const word = letters.map((l) => l.letter).join("");
    guess(word);
  }

  spawn(letter, snake);
}

function guess(word) {
  if (word === answer) {
    win();
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
}

let answer;
let running = false;
let accumulator = 0;
let lastTime;
let speed;

function tick(time = 0) {
  if (running === false) return;
  requestAnimationFrame(tick);
  const delta = time - lastTime;

  accumulator += delta;

  while (accumulator > speed) {
    accumulator -= speed;
    update(snake);
    render(snake);
  }

  lastTime = time;
}

function restart(first = false) {
  if (first === false) {
    gtag("event", "restart");
  }

  elements.forEach((el) => (el.innerHTML = ""));

  for (let i = 0; i < 26; i++) {
    const letter = LETTERS[i];
    spawn(letter, snake);
  }

  modalContainer.classList.add("d-none");

  snake.position.x = 5;
  snake.position.y = 5;

  snake.nextDirection.x = 1;
  snake.nextDirection.y = 0;

  snake.direction.x = 1;
  snake.direction.y = 0;

  snake.tail = [];
  snake.path = [];

  answer = selected[Math.floor(Math.random() * selected.length)];

  running = true;
  speed = INITIAL_SPEED;
  lastTime = performance.now();
  accumulator = speed;
  tick();
}

restart(true);
