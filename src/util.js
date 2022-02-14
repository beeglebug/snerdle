function countLetter(str, letter) {
  return str.split("").filter((l) => l === letter).length;
}

export function calculateState(word, answer) {
  const letters = word.split("");

  const state = letters.map((letter, ix) => ({
    letter,
    correct: answer[ix] === letter,
  }));

  letters.forEach((letter, ix) => {
    const total = countLetter(answer, letter);
    const existing = state.filter((s) => s.letter === letter);
    const existingCorrect = existing.filter((s) => s.correct);
    const existingPresent = existing.filter((s) => s.present);
    if (existingCorrect.length >= total) return;
    if (existingPresent.length >= total) return;
    state[ix].present = answer.indexOf(letter) > -1;
  });

  return state;
}

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// TODO include end param
export const collideTail = (snake, x, y, includeEnd) => {
  const { path, tail } = snake;
  const shortPath = path.slice(-tail.length);
  return shortPath.find((p) => p.x === x && p.y === y);
};
