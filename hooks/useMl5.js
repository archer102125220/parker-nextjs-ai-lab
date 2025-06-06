'use client';

// https://ithelp.ithome.com.tw/articles/10275577
// https://learn.ml5js.org/#/tutorials/hello-ml5
// https://p5js.org/zh-Hans/
// https://github.com/vercel/next.js/issues/60897

// https://ithelp.ithome.com.tw/articles/10276720

import { useState, useEffect } from 'react';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export default function useMl5({ getClassifier } = {}) {
  const [ml5Loading, setMl5Loading] = useState(true);
  const [ml5, setMl5] = useState(null);
  const [ml5Classifier, setMl5Classifier] = useState(null);

  useIsomorphicLayoutEffect(() => {
    setMl5Loading(true);
    async function ml5Init() {
      const _ml5 = await import('ml5');

      const _ml5Classifier = await getClassifier(_ml5);
      setMl5(_ml5);
      setMl5Classifier(_ml5Classifier);
      setMl5Loading(false);
    }

    if (typeof window !== 'undefined') {
      ml5Init();
    }

  }, []);

  useEffect(() => {

    console.log({ ml5 });
    return () => {
      if (typeof ml5?.dispose === 'function') {
        ml5.dispose(); // 清除 ml5.js 的相關資源
      }
      console.log('ml5.js related resources cleanup attempted.');
    };
  }, [ml5]);


  return {
    ml5Loading,
    ml5,
    ml5Classifier,
  };
}