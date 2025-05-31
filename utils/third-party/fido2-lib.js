import { Fido2Lib } from 'fido2-lib';

let f2l;
let option;

export * from 'fido2-lib';

export function fido2LibIsInitialized() {
  return f2l instanceof Fido2Lib;
}

export function getFido2Lib() {
  if (f2l instanceof Fido2Lib === false) {
    throw new Error('Fido2Lib Not initialized');
  }

  return f2l;
}

export function fido2LibInitialize(_option) {
  option = _option;
  return f2l = new Fido2Lib(option);
}

export function newFido2Lib(_option) {
  return new Fido2Lib(_option);
}

export function reNewFido2Lib() {
  return new Fido2Lib(option);
}

export function setFido2Lib(newF2l) {
  if (newF2l instanceof Fido2Lib === false) {
    throw new Error('Not Fido2Lib Object');
  }
  f2l = newF2l
}

export default { getFido2Lib, fido2LibInitialize, fido2LibIsInitialized, newFido2Lib, setFido2Lib }