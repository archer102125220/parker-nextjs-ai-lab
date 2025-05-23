'use client';

// https://ithelp.ithome.com.tw/articles/10275577
// https://learn.ml5js.org/#/tutorials/hello-ml5
// https://p5js.org/zh-Hans/
// https://github.com/vercel/next.js/issues/60897

// https://ithelp.ithome.com.tw/articles/10276720

import { useState, useRef, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

import styles from '@/app/ml5/ml5.module.css';

export default function Ml5() {
  const divCanvasRef = useRef(null);
  const [ml5Loading, setMl5Loading] = useState(true);
  const [ml5, setMl5] = useState(null);
  const [p5Js, setP5Js] = useState(null);
  const [p5JsSketch, setP5JsSketch] = useState(null);

  function p5Config(classifier, sketch) {
    sketch.ml5ImageClassifier = classifier;
    sketch.preload = function () {
      sketch['images/cat.jpg'] = sketch.loadImage('images/bird.png');
    };
    sketch.setup = function () {
      sketch.createCanvas(1000, 500);
      sketch.ml5ImageClassifier.classify(
        sketch['images/cat.jpg'],
        // A function to run when we get any errors and the results
        function gotResult(error, results) {
          // Display error in the console
          if (error) {
            console.error(error);
          } else {
            // The results are in an array ordered by confidence.
            console.log(results);
            sketch.createDiv(`Label: ${results[0].label}`);
            // sketch.createDiv(`Confidence: ${nf(results[0].confidence, 0, 2)}`);
          }
          setMl5Loading(false);
        }
      );
      sketch.image(sketch['images/cat.jpg'], 0, 0);
    };
    setP5JsSketch(sketch);
  }

  useIsomorphicLayoutEffect(() => {
    async function imageClassifier() {
      const [_ml5, { default: P5 }] = await window.Promise.all([
        import('ml5'),
        import('p5')
      ]);
      const _classifier = await _ml5.imageClassifier('MobileNet');
      setMl5(_ml5);
      setP5Js(
        new P5((...arg) => p5Config(_classifier, ...arg), divCanvasRef.current)
      );
    }
    if (typeof window !== 'undefined') {
      imageClassifier();
    }

    return () => {
      if (typeof p5Js?.remove === 'function') {
        p5Js.remove(); // 清除 P5.js 的畫布和相關資源
      }
      if (typeof p5JsSketch?.dispose === 'function') {
        p5JsSketch.dispose(); // 清除 P5.js 的畫布和相關資源
      }
      console.log('ml5.js related resources cleanup attempted.');
    };
  }, []);
  useEffect(() => {
    console.log({ p5Js, p5JsSketch, ml5 });
  }, [p5Js, p5JsSketch, ml5]);

  return (
    <main className={styles.main}>
      <div ref={divCanvasRef}>
        {ml5Loading === true && (
          <Skeleton variant="rounded" width={1000} height={1000} />
        )}
      </div>
    </main>
  );
}
