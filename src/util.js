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
