'use client';

import { useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';

import useMl5 from '@/hooks/useMl5';

import styles from '@/app/ml5/ml5.module.css';

export default function Ml5() {
  const divCanvasRef = useRef(null);
  // const [ml5Loading, setMl5Loading] = useState(true);
  const { ml5Loading } = useMl5({ getElementRef: () => divCanvasRef.current, getClassifier, setup });

  async function getClassifier(ml5) {
    const classifier = await ml5.imageClassifier('MobileNet');
    return classifier;
  }

  async function setup(P5, finish) {

    console.log('sketch.setup');
    P5['images/cat.jpg'] = await P5.loadImage('images/bird.png');
    P5.createCanvas(1000, 500);

    P5.ml5ImageClassifier.classify(
      P5['images/cat.jpg'],
      function (results) {
        if (results) {
          console.log(results);
          P5.createDiv(`Label: ${results[0].label}`);
        } else {
          console.error('ml5 error');
        }
        finish();
      }
    );

    P5.image(P5['images/cat.jpg'], 0, 0);
  }
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
