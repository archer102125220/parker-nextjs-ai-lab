export default function amountFormat(
  amount,
  formater = ['\\B(?<!\\.\\d*)(?=(\\d{3})+(?!\\d))', 'g'],
  replaceString = ',',
  handleError = handleSafari
) {
  let _formater;
  try {
    if (Array.isArray(formater) && formater.length > 0) {
      _formater = new RegExp(formater[0], formater[1]);
    } else {
      _formater = formater;
    }
    if (isNaN(amount) || !_formater) return amount;
    return `${amount}`.replace(_formater, replaceString);
  } catch (error) {
    console.log('Safari error?');
    console.log(error);
    if (typeof handleError === 'function') {
      return handleError(amount, replaceString, error);
    }
  }
}

function handleSafari(amount, replaceString = ',') {
  let output = '';
  const amountArray = `${amount}`.replaceAll(',', '').split('.');
  const _amount = amountArray[0];
  for (let i = _amount.length - 1; i >= 0; i--) {
    if (output.replaceAll(',', '').length % 3 === 0) {
      output = `${_amount[i]}${replaceString}` + output;
    } else {
      output = _amount[i] + output;
    }
  }
  return output.substring(0, output.length - 1) + `.${amountArray[1] || ''}`;
}