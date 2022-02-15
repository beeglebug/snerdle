function faceUp(snake) {
  const { direction, path, position } = snake;
  const end = path[path.length - 1];
  // would the next move make us hit the start of our own tail?
  if (end.x === position.x && end.y === position.y - 1) return;
  direction.x = 0;
  direction.y = -1;
}

function faceDown(snake) {
  const { direction, path, position } = snake;
  const end = path[path.length - 1];
  // would this move make us hit the start of our own tail?
  if (end.x === position.x && end.y === position.y + 1) return;
  direction.x = 0;
  direction.y = 1;
}

function faceLeft(snake) {
  const { direction, path, position } = snake;
  const end = path[path.length - 1];
  // would this move make us hit the start of our own tail?
  if (end.x === position.x - 1 && end.y === position.y) return;
  direction.x = -1;
  direction.y = 0;
}

function faceRight(snake) {
  const { direction, path, position } = snake;
  const end = path[path.length - 1];
  // would this move make us hit the start of our own tail?
  if (end.x === position.x + 1 && end.y === position.y) return;
  direction.x = 1;
  direction.y = 0;
}

export function bindInput(snake) {
  document.addEventListener("keydown", (e) => {
    if (e.code === "ArrowUp") return faceUp(snake);
    if (e.code === "ArrowDown") return faceDown(snake);
    if (e.code === "ArrowLeft") return faceLeft(snake);
    if (e.code === "ArrowRight") return faceRight(snake);
  });
}
