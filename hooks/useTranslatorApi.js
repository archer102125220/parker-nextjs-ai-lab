import { useGetRequest } from '@/hooks/useRequest';
import { useCallback, useState, useEffect } from 'react';

export function useTranslatorApi(option = { msg: '' }) {
  // const [translatedLabel, setTranslatedLabel] = useState('');

  // const [isLoading, setIsLoading] = useState(false);
  const [payload, setIsPayload] = useState(null);
  // const [error, setError] = useState(null);

  // const { request } = useRequestInit();

  const handlerCheckPayload = useCallback((_payload) => {
    console.log({ _payload });
    return typeof _payload?.msg === 'string' && _payload?.msg !== '';
  }, []);

  const {
    response: translatedLabel,
    isLoading,
    error
  } = useGetRequest(
    '/translator',
    payload,
    handlerCheckPayload
  );

  useEffect(() => {
    const msg = option?.msg || '';
    const src_lang = option?.srcLang || 'eng_Latn';
    const tgt_lang = option?.tgtLang || 'zho_Hant';

    if (typeof msg === 'string' && msg !== '') {
      setIsPayload({ msg, src_lang, tgt_lang });
    }
  }, [option]);

  return {
    translatedLabel: translatedLabel?.label || '',
    isLoading,
    error
  };
}

export default useTranslatorApi;
