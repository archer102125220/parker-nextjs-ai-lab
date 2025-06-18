import {
  // useState,
  useRef,
  useCallback,
  useSyncExternalStore
} from 'react';
import {
  // Translator,
  TranslatorConstructor
} from '@/utils/third-party/transformers';

export function useTranslatorHf(model = '', token = '') {
  // const [loading, setLoading] = useState(false);
  const translatorRef = useRef(null);

  const initTranslator = useCallback(async () => {
    // setLoading(true);
    const translator = new TranslatorConstructor();
    if (typeof token === 'string' && token !== '') {
      const _model = model || 'Helsinki-NLP/opus-mt-en-zh';
      // await Translator.initInferenceClient(token || process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN, _model);
      await translator.initInferenceClient(token || process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN, _model);
    } else {
      const _model = model || 'Xenova/opus-mt-en-zh';
      // await Translator.loadTransformers(_model);
      await translator.loadTransformers(_model);
    }
    translatorRef.current = translator;
    // setLoading(false);
  }, [model, token]);

  const subscribe = useCallback(() => {
    initTranslator();
    // return () => Translator.handleDispose();
    return () => translatorRef.current?.handleDispose();
  }, [initTranslator]);

  // const getSnapshot = useCallback(() => {
  //   if (typeof model !== 'string' || model === '' || loading === true) {
  //     return null;
  //   }
  //   return Translator.handleTranslate;
  // }, [model, loading]);
  const getSnapshot = useCallback(() => {
    if (typeof translatorRef.current?.handleTranslate !== 'function') {
      return null;
    }
    return translatorRef.current.handleTranslate;
  }, []);

  // const getServerSnapshot = () => null;

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default useTranslatorHf;
