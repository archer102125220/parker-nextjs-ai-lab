export function numberUnit(input = 0, unitIndex = 0, step = 10000, unit) {
  let _input = Number(input);

  if (_input < 10000) return _input;

  let _unitIndex = Number(unitIndex || 0);
  let _step = Number(step || 10000);

  while (Math.abs(_input) >= _step) {
    _input = _input / _step;
    _unitIndex = _unitIndex + 1;
  }

  // if (Math.abs(input) >= _step) {
  //   return numberUnit(_input / _step, _unitIndex + 1, _step, unit);
  // }

  // ['万', '十万', '百万', '千万', '亿', '兆', '京'];
  // ['萬', '十萬', '百萬', '千萬', '億', '兆', '京'];
  const _unit = unit || ['万', '十万', '百万', '千万', '亿', '兆', '京'];

  return Number(_input.toFixed(1)) + (_unit[_unitIndex] || '');
}

export default numberUnit;

