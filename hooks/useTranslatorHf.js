import { useState, useCallback, useSyncExternalStore } from 'react';
import { Translator } from '@/utils/third-party/transformers';

export function useTranslatorHf(model = 'Xenova/opus-mt-en-zh', token = '') {
  const [loading, setLoading] = useState(false);

  const subscribe = useCallback(() => {
    async function initTranslator() {
      setLoading(true);
      if (typeof token === 'string' && token !== '') {
        // 'Helsinki-NLP/opus-mt-en-zh'
        // await Translator.initInferenceClient(process.env.HUGGINGFACE_TOKEN, model);
        await Translator.initInferenceClient(token, model);
      } else {
        // 'Xenova/opus-mt-en-zh'
        await Translator.loadTransformers(model);
      }
      setLoading(false);
    }
    initTranslator();
    return Translator.handleDispose();
  }, [model, token]);

  const getSnapshot = useCallback(() => {
    if (typeof model !== 'string' || model === '' || loading === true) {
      return null;
    }
    return Translator.handleTranslate;
  }, [model, loading]);

  // const getServerSnapshot = () => null;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default useTranslatorHf;
