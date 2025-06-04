'use client';

import { useRef, useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';

import useP5Ml5 from '@/hooks/useP5Ml5';
import useTranslatorEn from '@/hooks/useTranslatorEn';

import styles from '@/app/p5ml5/p5ml5.module.css';

export default function P5Ml5() {
  const divCanvasRef = useRef(null);
  const [resultList, setResultList] = useState(null);
  const [translatedLabel, setTranslatedLabel] = useState([]);
  const { translate } = useTranslatorEn();
  const { ml5Loading } = useP5Ml5({ getElementRef: () => divCanvasRef.current, getClassifier, setup });

  async function getClassifier(ml5) {
    const classifier = await ml5.imageClassifier('MobileNet');
    return classifier;
  }

  async function setup(P5, done) {
    console.log('sketch.setup');
    P5.birdPngImg = await P5.loadImage('images/bird.png');
    P5.createCanvas(1000, 500);

    P5.ml5ImageClassifier.classify(
      P5.birdPngImg,
      function (results) {
        if (results) {
          console.log({ results });
          // P5.createDiv(`Label: ${results[0].label}`);
          setResultList(results);
        } else {
          console.error('ml5 error');
        }
        done();
      }
    );

    // P5.image(P5.birdPngImg, 0, 0);
  }

  useEffect(() => {
    async function handleTranslation() {
      if (!resultList) return;

      try {
        const _translatedLabel = await translate({
          text: resultList[0].label,
          srcLang: 'eng_Latn',
          tgtLang: 'zho_Hant'
        });
        setTranslatedLabel(_translatedLabel);
      } catch (error) {
        console.error('Translation error:', error);
      }
    }

    handleTranslation();
  }, [resultList]);

  return (
    <main className={styles.main}>
      <div ref={divCanvasRef}>
        {ml5Loading === true && (
          <Skeleton variant="rounded" width={1000} height={1000} />
        )}
      </div>
      {translatedLabel.length > 0 && (
        <div className={styles.results}>
          <h2>Classification Results:</h2>
          <p>{translatedLabel}</p>
        </div>
      )}
    </main>
  );
}
