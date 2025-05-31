import { useState } from 'react';
import { request } from '@/utils/request';

export const useTranslatorEn = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  async function translate({
    text,
    srcLang = 'eng_Latn',
    tgtLang = 'zho_Hant'
  }) {
    try {
      setIsLoading(true);
      setError(null);

      const response = await request.get('/api/translator', {
        msg: text,
        src_lang: srcLang,
        tgt_lang: tgtLang
      });

      return response.label;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }

  return {
    translate,
    isLoading,
    error
  };
};

export default useTranslatorEn;
