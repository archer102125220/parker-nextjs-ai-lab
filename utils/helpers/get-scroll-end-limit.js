export function getScrollEndLimit(element, vertical = true) {
  const scrollEndLimit =
    vertical === true
      ? Math.max(element?.scrollHeight, element?.offsetHeight, 0) -
      (element?.clientHeight || 0)
      : Math.max(element?.scrollWidth, element?.offsetWidth, 0) -
      (element?.clientWidth || 0);

  return scrollEndLimit;
}

export default getScrollEndLimit;