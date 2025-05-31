export function handlePolyfillScrollEnd(el, handler, wait = 100) {
  if (typeof el?.addEventListener !== 'function') {
    console.error('missing scroll end element');
    return;
  }
  if (typeof handler !== 'function') {
    console.error('missing scroll end handler');
    return;
  }

  if ('onscrollend' in el) {
    function handleScrollEnd(...arg) {
      setTimeout(() => handler(...arg), wait);
    }
    el.addEventListener('scrollend', handleScrollEnd);
    return () => el.removeEventListener('scrollend', handleScrollEnd);
  }

  let setTimeoutTimer = 0;
  function polyfillScrollEnd(...arg) {
    if (setTimeoutTimer !== 0) {
      clearTimeout(setTimeoutTimer);
      setTimeoutTimer = 0;
    }

    setTimeoutTimer = setTimeout(() => {
      setTimeoutTimer = 0;
      handler(...arg);
    }, wait);
  }
  el.addEventListener('scroll', polyfillScrollEnd);

  return () => el.removeEventListener('scroll', polyfillScrollEnd);
};

export default handlePolyfillScrollEnd;