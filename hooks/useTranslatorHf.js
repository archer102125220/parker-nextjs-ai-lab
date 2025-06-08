import { useCallback, useSyncExternalStore } from 'react';
import { Translator } from '@/utils/third-party/transformers';

export function useTranslatorHf(model = 'Xenova/opus-mt-en-zh') {
  const subscribe = useCallback(() => {
    // 'Xenova/opus-mt-en-zh'
    Translator.loadTransformers(model);
    // 'Helsinki-NLP/opus-mt-en-zh'
    // await Translator.initInferenceClient(process.env.HUGGINGFACE_TOKEN, model);
    return;
  }, [model]);

  function getSnapshot() {
    if (typeof model !== 'string' || model === '' || Translator.loading === true) {
      return null;
    }
    return Translator.handleTranslate;
  }

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default useTranslatorHf;
