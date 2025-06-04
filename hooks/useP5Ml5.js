'use client';

// https://ithelp.ithome.com.tw/articles/10275577
// https://learn.ml5js.org/#/tutorials/hello-ml5
// https://p5js.org/zh-Hans/
// https://github.com/vercel/next.js/issues/60897

// https://ithelp.ithome.com.tw/articles/10276720

import { useState, useEffect } from 'react';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export default function useP5Ml5({ elementRef, getElementRef, getClassifier, onAfterInit, setup }) {
  const [ml5Loading, setMl5Loading] = useState(true);
  const [ml5, setMl5] = useState(null);
  const [p5Js, setP5Js] = useState(null);
  const [p5JsSketch, setP5JsSketch] = useState(null);

  function p5Config(_classifier, sketch) {
    sketch.ml5ImageClassifier = _classifier;
    // sketch.preload = function () {
    //   console.log('sketch.preload');
    //   sketch['images/cat.jpg'] = sketch.loadImage('images/bird.png');
    // };
    sketch.setup = async function () {
      await setup(sketch, () => setMl5Loading(false));
    };
    // sketch.draw = function () {
    //   console.log('sketch.draw');
    // };
    setP5JsSketch(sketch);
  }

  useIsomorphicLayoutEffect(() => {
    async function p5Init() {
      const [_ml5, _p5Model] = await window.Promise.all([
        import('ml5'),
        import('p5')
      ]);
      console.log({ _p5Model });
      const P5 = _p5Model.default;

      const _classifier = await getClassifier(_ml5, P5);
      // P5.prototype.isPreloadSupported = function () {
      //   return true;
      // };
      setMl5(_ml5);
      const element = typeof getElementRef === 'function' ? getElementRef() : elementRef;
      const _P5 = new P5((...arg) => p5Config(_classifier, ...arg), element);
      setP5Js(_P5);

      if (typeof onAfterInit === 'function') {
        await onAfterInit(_ml5, P5, _classifier, _P5);
      }
    }

    if (typeof window !== 'undefined') {
      p5Init();
    }

  }, []);

  useEffect(() => {

    console.log({ p5Js, p5JsSketch, ml5 });
    return () => {
      if (typeof p5Js?.remove === 'function') {
        p5Js.remove(); // 清除 P5.js 的畫布和相關資源
      }
      if (typeof p5JsSketch?.dispose === 'function') {
        p5JsSketch.dispose(); // 清除 P5.js 的畫布和相關資源
      }
      if (typeof p5JsSketch?.ml5ImageClassifier?.dispose === 'function') {
        p5JsSketch.ml5ImageClassifier.dispose(); // 清除 ml5.js 的畫布和相關資源
      }
      console.log('ml5.js related resources cleanup attempted.');
    };
  }, [p5Js, p5JsSketch, ml5]);


  return {
    ml5Loading,
    ml5,
    p5Js,
    p5JsSketch,
  };
}