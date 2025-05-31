export function googleGAInit(googleGAID = '') {
  if (typeof googleGAID !== 'string' || googleGAID === '') {
    console.error('缺少google ga id');
    return;
  } else if (typeof document !== 'object' || document === null) {
    console.error('document API遺失');
    return;
  }
  const src = `https://www.googletagmanager.com/gtag/js?id=${googleGAID}`;

  const script = document.createElement('script');
  script.onload = () => init(googleGAID);
  // script.addEventListener('load', () => init(googleGAID));

  script.async = true;
  script.setAttribute('async', true);
  script.src = src;
  script.setAttribute('src', src);

  document.querySelector('head').append(script);
}
function init(googleGAID = '') {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());

  window.gtag('config', googleGAID);
}
