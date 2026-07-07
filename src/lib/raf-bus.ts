/** Shared RAF scheduler — matches dereks-website-services.com raf-bus. */

type RafCallback = (time: number) => void;

const priority = new Set<RafCallback>();
const standard = new Set<RafCallback>();

let rafId = 0;
let hidden = typeof document !== "undefined" ? document.hidden : false;

function tick(now: number) {
  rafId = 0;
  if (hidden || (priority.size === 0 && standard.size === 0)) return;

  for (const fn of priority) {
    try {
      fn(now);
    } catch (error) {
      console.error("raf-bus priority tick error", error);
    }
  }

  for (const fn of standard) {
    try {
      fn(now);
    } catch (error) {
      console.error("raf-bus tick error", error);
    }
  }

  rafId = requestAnimationFrame(tick);
}

function ensure() {
  if (!hidden && (priority.size > 0 || standard.size > 0) && !rafId) {
    rafId = requestAnimationFrame(tick);
  }
}

function subscribe(set: Set<RafCallback>, fn: RafCallback) {
  set.add(fn);
  ensure();
  return () => {
    set.delete(fn);
    if (!priority.size && !standard.size && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  };
}

export function subscribePriorityRaf(fn: RafCallback) {
  return subscribe(priority, fn);
}

export function subscribeRaf(fn: RafCallback) {
  return subscribe(standard, fn);
}

if (typeof document !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    hidden = document.hidden;
    if (hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    } else {
      ensure();
    }
  });
}
