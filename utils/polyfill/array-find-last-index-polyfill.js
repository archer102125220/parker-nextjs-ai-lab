
export function findLastIndex(array, callback, thisArg) {
  if (typeof callback?.call !== 'function') {
    throw new TypeError(`TypeError: ${typeof callback} is not a function`);
  }
  for (let index = array.length - 1; index >= 0; index--) {
    if (callback.call(thisArg, array[index], index, array)) return index;
  }
  return -1;
};

export function handleFindLastIndexPolyfill() {
  if (typeof Array.prototype.findLastIndex !== 'function') {
    Array.prototype.findLastIndex = function (callback, thisArg) {
      return findLastIndex(this, callback, thisArg);
    };
  }
}

export default handleFindLastIndexPolyfill;
