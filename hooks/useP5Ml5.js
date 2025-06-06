'use client';

// https://ithelp.ithome.com.tw/articles/10275577
// https://learn.ml5js.org/#/tutorials/hello-ml5
// https://p5js.org/zh-Hans/
// https://github.com/vercel/next.js/issues/60897

// https://ithelp.ithome.com.tw/articles/10276720

import { useState, useEffect } from 'react';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import useMl5 from '@/hooks/useMl5';

export default function useP5Ml5({ elementRef, getElementRef, getClassifier, onBeforeInit, onAfterInit, setup } = {}) {
  const { ml5, ml5Loading } = useMl5({ getClassifier });

  const [p5Loading, setP5Loading] = useState(true);
  const [p5Js, setP5Js] = useState(null);
  const [p5JsSketch, setP5JsSketch] = useState(null);

  function p5Config(ml5Classifier, sketch) {
    sketch.ml5Classifier = ml5Classifier;
    // sketch.preload = function () {
    //   console.log('sketch.preload');
    //   sketch['images/cat.jpg'] = sketch.loadImage('images/bird.png');
    // };
    sketch.setup = async function () {
      await setup(sketch, () => setP5Loading(false));
    };
    // sketch.draw = function () {
    //   console.log('sketch.draw');
    // };
    setP5JsSketch(sketch);
  }

  useIsomorphicLayoutEffect(() => {
    async function p5Init() {
      if (ml5 === null) return;

      if (typeof onBeforeInit === 'function') {
        await onBeforeInit(ml5, P5);
      }

      const _p5Model = await import('p5');
      const P5 = _p5Model.default;

      const ml5Classifier = await getClassifier(ml5, P5);
      // P5.prototype.isPreloadSupported = function () {
      //   return true;
      // };
      const element = typeof getElementRef === 'function' ? getElementRef() : elementRef;
      const _P5 = new P5((...arg) => p5Config(ml5Classifier, ...arg), element);
      setP5Js(_P5);

      if (typeof onAfterInit === 'function') {
        await onAfterInit(ml5, P5, ml5Classifier, _P5);
      }
    }

    if (typeof window !== 'undefined') {
      p5Init();
    }

  }, [ml5]);

  useIsomorphicLayoutEffect(() => {
    async function p5Init() {
      if (ml5 === null) return;

      if (typeof onBeforeInit === 'function') {
        await onBeforeInit(ml5, P5);
      }

      const _p5Model = await import('p5');
      const P5 = _p5Model.default;

      const ml5Classifier = await getClassifier(ml5, P5);
      // P5.prototype.isPreloadSupported = function () {
      //   return true;
      // };
      const element = typeof getElementRef === 'function' ? getElementRef() : elementRef;
      const _P5 = new P5((...arg) => p5Config(ml5Classifier, ...arg), element);
      setP5Js(_P5);

      if (typeof onAfterInit === 'function') {
        await onAfterInit(ml5, P5, ml5Classifier, _P5);
      }
    }

    if (typeof window !== 'undefined') {
      p5Init();
    }

  }, [ml5]);

  useEffect(() => {

    console.log({ p5Js, p5JsSketch });
    return () => {
      if (typeof p5Js?.remove === 'function') {
        p5Js.remove(); // 清除 P5.js 的畫布和相關資源
      }
      if (typeof p5JsSketch?.dispose === 'function') {
        p5JsSketch.dispose(); // 清除 P5.js 的畫布和相關資源
      }
      if (typeof p5JsSketch?.ml5Classifier?.dispose === 'function') {
        p5JsSketch.ml5Classifier.dispose(); // 清除 ml5.js 的相關資源
      }
      console.log('p5.js related resources cleanup attempted.');
    };
  }, [p5Js, p5JsSketch, ml5]);


  return {
    ml5Loading,
    ml5,
    p5Loading,
    p5Js,
    p5JsSketch,
  };
}