'use client';

// https://ithelp.ithome.com.tw/articles/10275577
// https://learn.ml5js.org/#/tutorials/hello-ml5
// https://p5js.org/zh-Hans/

import { useState, useRef, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import styles from '@/app/tensorflowjs/tensorflow.module.css';

export default function Tensorflow() {
  const divCanvasRef = useRef(null);
  const [ml5Loading, setMl5Loading] = useState(true);
  const [p5Js, setP5Js] = useState(null);
  const [p5JsSketch, setP5JsSketch] = useState(null);

  function p5Config(classifier, sketch) {
    sketch.ml5ImageClassifier = classifier;
    sketch.preload = function () {
      sketch['images/cat.jpg'] = sketch.loadImage('images/bird.png');
    };
    sketch.setup = function () {
      sketch.createCanvas(500, 500);
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

  useEffect(() => {
    async function imageClassifier() {
      const [ml5, { default: P5 }] = await window.Promise.all([
        import('ml5'),
        import('p5')
      ]);
      const _classifier = await ml5.imageClassifier('MobileNet');
      setP5Js(
        new P5((...arg) => p5Config(_classifier, ...arg), divCanvasRef.current)
      );
    }
    if (typeof window !== 'undefined') {
      imageClassifier();
    }
  }, []);
  useEffect(() => {
    console.log({ p5Js, p5JsSketch });
  }, [p5Js, p5JsSketch]);

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
