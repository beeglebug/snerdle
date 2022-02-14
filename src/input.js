// TODO a nextDirection which is not commited until next update
function faceUp(snake) {
  if (snake.direction.y === 1) return;
  snake.nextDirection.x = 0;
  snake.nextDirection.y = -1;
}

function faceDown(snake) {
  if (snake.direction.y === -1) return;
  snake.nextDirection.x = 0;
  snake.nextDirection.y = 1;
}

function faceLeft(snake) {
  if (snake.direction.x === 1) return;
  snake.nextDirection.x = -1;
  snake.nextDirection.y = 0;
}

function faceRight(snake) {
  if (snake.direction.x === -1) return;
  snake.nextDirection.x = 1;
  snake.nextDirection.y = 0;
}

export function bindInput(snake) {
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") return faceUp(snake);
    if (e.code === "ArrowDown") return faceDown(snake);
    if (e.code === "ArrowLeft") return faceLeft(snake);
    if (e.code === "ArrowRight") return faceRight(snake);
  });
}
