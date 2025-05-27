'use client';

import { useState, useEffect } from 'react';
import { pipeline } from '@huggingface/transformers';


export function useTranslatorEn({ model = '', loading, loaded } = {}) {
  const [translatorEn, setTranslator] = useState(null);

  useEffect(() => {
    async function loadTranslator() {
      try {

        console.log('Loading translation model...');

        if (typeof loading === 'function') {
          loading();
        }
        // 選擇一個英翻中的模型
        // 例如：'Helsinki-NLP/opus-mt-en-zh' 是 Helsinki-NLP 系列的一個常用模型
        // 'facebook/nllb-200-distilled-600M'
        const _translator = await pipeline('translation', model || 'Xenova/nllb-200-distilled-600M', { device: 'webgpu' });
        console.log({ _translator });
        setTranslator(_translator);

        if (typeof loaded === 'function') {
          loaded();
        }

        console.log('Translation model loaded.');
      } catch (error) {
        console.error(error);
      }
    }

    loadTranslator();

  }, []);


  return translatorEn;
}


export default useTranslatorEn;