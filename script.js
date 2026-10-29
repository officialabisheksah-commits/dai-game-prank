const inviteScreen = document.querySelector("#invite-screen");
const celebrationScreen = document.querySelector("#celebration-screen");
const yesButton = document.querySelector("#yes-button");
const noButton = document.querySelector("#no-button");
const replayButton = document.querySelector("#replay-button");
const dodgeHint = document.querySelector("#dodge-hint");
const confettiField = document.querySelector("#confetti-field");

let dodgeAttempts = 0;
let jumpResetTimeout;
const dodgeRadius = 104;
const viewportMargin = 18;

function isNearPointer(left, top, width, height, pointerX, pointerY) {
  const nearestX = Math.max(left, Math.min(pointerX, left + width));
  const nearestY = Math.max(top, Math.min(pointerY, top + height));

  return Math.hypot(pointerX - nearestX, pointerY - nearestY) < dodgeRadius;
}

function placeNoButtonAtRandomPosition(pointerX, pointerY) {
  const noBounds = noButton.getBoundingClientRect();
  const yesBounds = yesButton.getBoundingClientRect();
  const maxLeft = Math.max(0, window.innerWidth - noBounds.width - viewportMargin);
  const maxTop = Math.max(0, window.innerHeight - noBounds.height - viewportMargin);
  const minLeft = Math.min(viewportMargin, maxLeft);
  const minTop = Math.min(viewportMargin, maxTop);
  const safeGap = 14;
  const candidates = [];

  for (let attempt = 0; attempt < 120; attempt += 1) {
    const left = minLeft + Math.random() * (maxLeft - minLeft);
    const top = minTop + Math.random() * (maxTop - minTop);
    const overlapsYes =
      left < yesBounds.right + safeGap &&
      left + noBounds.width + safeGap > yesBounds.left &&
      top < yesBounds.bottom + safeGap &&
      top + noBounds.height + safeGap > yesBounds.top;
    const nearPointer = isNearPointer(
      left,
      top,
      noBounds.width,
      noBounds.height,
      pointerX,
      pointerY,
    );

    if (!overlapsYes && !nearPointer) {
      candidates.push({ left, top });
      if (candidates.length === 8) {
        break;
      }
    }
  }

  if (candidates.length === 0) {
    const fallbackPositions = [
      [minLeft, minTop],
      [maxLeft, minTop],
      [minLeft, maxTop],
      [maxLeft, maxTop],
      [maxLeft / 2, minTop],
      [maxLeft / 2, maxTop],
      [minLeft, maxTop / 2],
      [maxLeft, maxTop / 2],
    ].filter(([left, top]) => {
      const overlapsYes =
        left < yesBounds.right + safeGap &&
        left + noBounds.width + safeGap > yesBounds.left &&
        top < yesBounds.bottom + safeGap &&
        top + noBounds.height + safeGap > yesBounds.top;
      const nearPointer = isNearPointer(
        left,
        top,
        noBounds.width,
        noBounds.height,
        pointerX,
        pointerY,
      );

      return !overlapsYes && !nearPointer;
    });

    if (fallbackPositions.length === 0) {
      throw new Error("Could not find a safe position for the NO button.");
    }

    const [left, top] = fallbackPositions[Math.floor(Math.random() * fallbackPositions.length)];
    candidates.push({ left, top });
  }

  const destination = candidates[Math.floor(Math.random() * candidates.length)];
  noButton.style.left = `${destination.left}px`;
  noButton.style.top = `${destination.top}px`;
  noButton.classList.remove("is-jumping");
  void noButton.offsetWidth;
  noButton.classList.add("is-jumping");
  window.clearTimeout(jumpResetTimeout);
  jumpResetTimeout = window.setTimeout(() => {
    noButton.classList.remove("is-jumping");
  }, 90);
}

function showCelebration() {
  inviteScreen.hidden = true;
  noButton.hidden = true;
  celebrationScreen.hidden = false;
  createConfetti();
  replayButton.focus();
}

function returnToInvitation() {
  celebrationScreen.hidden = true;
  inviteScreen.hidden = false;
  noButton.hidden = false;
  confettiField.replaceChildren();
  dodgeAttempts = 0;
  dodgeHint.textContent = "Pick your fighter. (The red button is feeling suspicious…)";
  noButton.tabIndex = -1;
  placeNoButtonAtRandomPosition(window.innerWidth / 2, window.innerHeight / 2);
  yesButton.focus();
}

function createConfetti() {
  const colors = ["#ffe15a", "#57f59b", "#ff5b83", "#61dcff", "#b98cff"];
  const pieces = document.createDocumentFragment();

  for (let index = 0; index < 48; index += 1) {
    const piece = document.createElement("span");
    const size = 5 + Math.random() * 7;

    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${size}px`);
    piece.style.setProperty("--color", colors[index % colors.length]);
    piece.style.setProperty("--duration", `${2.8 + Math.random() * 2.5}s`);
    piece.style.setProperty("--delay", `${Math.random() * 2.8}s`);
    piece.style.setProperty("--sway", `${Math.random() * 140 - 70}px`);
    pieces.append(piece);
  }

  confettiField.replaceChildren(pieces);
}

function recordDodge() {
  dodgeAttempts += 1;

  if (dodgeAttempts >= 4) {
    dodgeHint.textContent = "DAI, K vayoo No click vayena HAHAHA 😂";
  } else if (dodgeAttempts > 1) {
    dodgeHint.textContent = "Ayy, almost! The red button has its own plans 😈";
  }
}

function dodgeNoButton(pointerX, pointerY) {
  recordDodge();
  placeNoButtonAtRandomPosition(pointerX, pointerY);
}

function handlePointerApproach(event) {
  if (!inviteScreen.hidden) {
    const bounds = noButton.getBoundingClientRect();
    const nearestX = Math.max(bounds.left, Math.min(event.clientX, bounds.right));
    const nearestY = Math.max(bounds.top, Math.min(event.clientY, bounds.bottom));
    const distance = Math.hypot(event.clientX - nearestX, event.clientY - nearestY);

    if (distance <= dodgeRadius) {
      dodgeNoButton(event.clientX, event.clientY);
    }
  }
}

function handleNoButtonActivation(event) {
  event.preventDefault();
  event.stopPropagation();
  dodgeNoButton(event.clientX || window.innerWidth / 2, event.clientY || window.innerHeight / 2);
}

function initializeNoButtonPosition() {
  const bounds = noButton.getBoundingClientRect();

  document.body.append(noButton);
  noButton.classList.add("is-dodging");
  noButton.style.left = `${bounds.left}px`;
  noButton.style.top = `${bounds.top}px`;
  noButton.tabIndex = -1;
}

function keepNoButtonInsideViewport() {
  if (inviteScreen.hidden) {
    return;
  }

  const bounds = noButton.getBoundingClientRect();
  const left = Math.min(
    Math.max(0, bounds.left),
    Math.max(0, window.innerWidth - bounds.width),
  );
  const top = Math.min(
    Math.max(0, bounds.top),
    Math.max(0, window.innerHeight - bounds.height),
  );

  noButton.style.left = `${left}px`;
  noButton.style.top = `${top}px`;
  placeNoButtonAtRandomPosition(window.innerWidth / 2, window.innerHeight / 2);
}

function handleNoButtonKeydown(event) {
  event.preventDefault();
  event.stopPropagation();
  dodgeNoButton(window.innerWidth / 2, window.innerHeight / 2);
}

initializeNoButtonPosition();
document.addEventListener("pointermove", handlePointerApproach, { passive: true });
document.addEventListener("pointerdown", handlePointerApproach, { passive: true });
window.addEventListener("resize", keepNoButtonInsideViewport);
noButton.addEventListener("click", handleNoButtonActivation);
noButton.addEventListener("keydown", handleNoButtonKeydown);

yesButton.addEventListener("click", showCelebration);
replayButton.addEventListener("click", returnToInvitation);
noButton.addEventListener("auxclick", handleNoButtonActivation);
noButton.addEventListener("contextmenu", (event) => event.preventDefault());
noButton.addEventListener("focus", () => {
  noButton.blur();
});
