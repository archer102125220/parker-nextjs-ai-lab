import { PhoneNumberUtil } from 'google-libphonenumber';

import PHONE_AREA_CODE from '@/assets/phoneCountryCode';

const phoneUtil = PhoneNumberUtil.getInstance();

export function checkPhone(phone = '000', countryCode = '') {
  const result = { countryCodeError: false, phoneError: true };
  if (
    isNaN(countryCode) ||
    typeof countryCode !== 'string' ||
    countryCode === ''
  ) {
    result.countryCodeError = true;
  }

  if (isNaN(phone)) {
    result.phoneError = true;
    return result;
  }

  try {
    const phoneAreaCodeObj =
      typeof countryCode === 'string' && countryCode !== ''
        ? PHONE_AREA_CODE.find(
            (_phoneCountryCode) =>
              _phoneCountryCode.phoneCode.padStart(3, 0) ===
              countryCode.padStart(3, 0)
          ) || {}
        : {};
    if (
      typeof phoneAreaCodeObj?.countryCode !== 'string' ||
      phoneAreaCodeObj?.countryCode === ''
    ) {
      result.countryCodeError = true;
    }

    const phoneCountryCode = phoneAreaCodeObj?.countryCode || 'TW';

    const phoneNumberObj = phoneUtil.parseAndKeepRawInput(
      phone,
      phoneCountryCode
    );
    result.phoneError = phoneUtil.isValidNumber(phoneNumberObj) === false;

    return result;
  } catch (error) {}

  return result;
}

export function checkTelephone(telephone = '00000', areaCode = '02') {
  return /^0\d{1,3}-\d{5,8}$/.test(`${areaCode}-${telephone}`);
}