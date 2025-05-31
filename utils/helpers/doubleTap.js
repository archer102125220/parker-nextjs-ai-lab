// https://gist.github.com/ethanny2/44d5ad69970596e96e0b48139b89154b
export function doubleTap(doubleTapMs) {
  let timeout, lastTap = 0;
  return function detectDoubleTap(event) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (0 < tapLength && tapLength < doubleTapMs) {
      event.preventDefault();
      const doubleTap = new CustomEvent('doubletap', {
        bubbles: true,
        detail: event
      });
      event.target.dispatchEvent(doubleTap);
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), doubleTapMs);
    }
    lastTap = currentTime;
  }
}

export function customDoubleTap(func, doubleTapMs = 200, defaultFunc) {
  let timeout, lastTap = 0;
  return function detectDoubleTap(...args) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (0 < tapLength && tapLength < doubleTapMs) {
      func.apply(this, args);
    } else {
      timeout = setTimeout(() => clearTimeout(timeout), doubleTapMs);
    }
    lastTap = currentTime;
    if(typeof defaultFunc === 'function'){
      defaultFunc.apply(this, args);
    }
  }
}

export function initializeDoubleTap(doubleTapMs = 200) {
  if (typeof window === 'undefined') return;

  // initialize the new event
  // document.addEventListener('pointerup', doubleTap(doubleTapMs));
  document.addEventListener('touchend', doubleTap(doubleTapMs));
}

export default initializeDoubleTap;