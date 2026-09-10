export const introWords = ['Curious', 'Passionate', 'Engineer'];

export const introMotion = {
  wordInterval: 1.15,
  characterDuration: 0.65,
  enterStagger: 0.02,
  exitStagger: 0.01,
  panelDuration: 1.2,
  panelStagger: 0.4,
  controlsDuration: 0.6,
};

// Begin the curtain as soon as the final letter of Engineer settles.
export const introRevealAt =
  (introWords.length - 1) * introMotion.wordInterval +
  introMotion.characterDuration +
  (introWords.at(-1)!.length - 1) * introMotion.enterStagger;

export const introCompleteAt =
  introRevealAt + introMotion.panelDuration + introMotion.panelStagger;

// Let the switch settle as the last curtain panel clears.
export const introControlsAt = introCompleteAt - introMotion.controlsDuration;
