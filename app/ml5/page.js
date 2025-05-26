'use client';

import { useRef } from 'react';
import Skeleton from '@mui/material/Skeleton';

import useMl5 from '@/hooks/useMl5';

import styles from '@/app/ml5/ml5.module.css';

export default function Ml5() {
  const divCanvasRef = useRef(null);
  const { ml5Loading } = useMl5({ getElementRef: () => divCanvasRef.current, gotResult });

  function gotResult(results, sketch) {
    if (results) {
      console.log(results);
      sketch.createDiv(`Label: ${results[0].label}`);
    } else {
      console.error('ml5 error');
    }
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
