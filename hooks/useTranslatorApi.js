import { useState, useEffect } from 'react';
// import { request } from '@/utils/request';

import { useRequest } from '@/hooks/useRequest';

export function useTranslatorApi(msg = '', option = {}) {
  const [translatedLabel, setTranslatedLabel] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useRequest();

  useEffect(function () {
    async function translate() {
      if (msg === '') return;

      const {
        srcLang = 'eng_Latn',
        tgtLang = 'zho_Hant'
      } = option;

      setIsLoading(true);

      try {
        setError(null);

        const response = await request.get('/api/translator', {
          msg,
          src_lang: srcLang,
          tgt_lang: tgtLang
        }, { useCache: true });

        setTranslatedLabel(response.label);
      } catch (_error) {
        setError(_error);
      }

      setIsLoading(false);
    }

    translate();
  }, [request, msg, option]);

  return {
    translatedLabel,
    isLoading,
    error
  };
}

export default useTranslatorApi;
