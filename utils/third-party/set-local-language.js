
export function setLocalLanguage(newLanguag) {
  if (typeof window?.localStorage === 'object') {
    window.localStorage.setItem('usedLang', newLanguag);
  }
  const locale = useCookie('___i18n_locale', {
    default: () => ''
  });
  locale.value = newLanguag;
}

export default setLocalLanguage;
