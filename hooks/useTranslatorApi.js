import { useState } from 'react';
import { request } from '@/utils/request';

export function useTranslatorApi() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function translate(msg = '', option = {}) {
    const {
      srcLang = 'eng_Latn',
      tgtLang = 'zho_Hant'
    } = option;

    try {
      setIsLoading(true);
      setError(null);

      const response = await request.get('/api/translator', {
        msg,
        src_lang: srcLang,
        tgt_lang: tgtLang
      }, { useCache: true });

      return response.label;
    } catch (_error) {
      setError(_error);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    translate,
    isLoading,
    error
  };
}

export default useTranslatorApi;
