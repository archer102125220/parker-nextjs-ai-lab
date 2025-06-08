'use client';

import { useRef, useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';

import useP5Ml5 from '@/hooks/useP5Ml5';
// import { useTranslatorApi } from '@/hooks/useTranslatorApi';
import { useTranslatorHf } from '@/hooks/useTranslatorHf';

import styles from '@/app/p5ml5/p5ml5.module.css';

export default function P5Ml5() {
  const divCanvasRef = useRef(null);
  const [resultList, setResultList] = useState(null);
  const [translatedLabel, setTranslatedLabel] = useState('');
  // const { translate } = useTranslatorApi();
  const translate = useTranslatorHf('Xenova/opus-mt-en-zh');
  const { p5Loading } = useP5Ml5({ getElementRef: () => divCanvasRef.current, getClassifier, setup });

  async function getClassifier(ml5) {
    const classifier = await ml5.imageClassifier('MobileNet');
    return classifier;
  }

  async function setup(P5, done) {
    console.log('sketch.setup');
    P5.birdImg = await P5.loadImage('images/bird.png');
    P5.createCanvas(500, 250);

    P5.ml5Classifier.classify(
      P5.birdImg,
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

    P5.image(P5.birdImg, 0, 0, 500, 250);
  }

  // useEffect(() => {
  //   async function handleTranslation() {
  //     if (!resultList) return;

  //     try {
  //       const _translatedLabel = await translate({
  //         text: resultList[0].label,
  //         srcLang: 'eng_Latn',
  //         tgtLang: 'zho_Hant'
  //       });
  //       setTranslatedLabel(_translatedLabel);
  //     } catch (error) {
  //       console.error('Translation error:', error);
  //     }
  //   }

  //   handleTranslation();
  // }, [resultList]);

  useEffect(() => {
    async function handleTranslation() {
      if (typeof translate !== 'function' || Array.isArray(resultList) === false) return;
      const translatedLabel = await translate(resultList[0].label, { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' });
      console.log({ translatedLabel });
      setTranslatedLabel(translatedLabel[0]?.translation_text || '');
    }
    handleTranslation();
  }, [resultList, translate]);

  return (
    <main className={styles.main}>
      {p5Loading === true && (
        <Skeleton variant="rounded" width={500} height={250} />
      )}

      <div ref={divCanvasRef} style={{ display: p5Loading === true ? 'none' : '' }} />

      {translatedLabel.length > 0 && (
        <div className={styles.results}>
          <h2>Classification Results:</h2>
          <p>{translatedLabel}</p>
        </div>
      )}
    </main>
  );
}
