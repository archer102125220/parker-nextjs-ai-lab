'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { useTensorflowMobilenet } from '@/hooks/useTensorflowMobilenet';
import { useTranslatorHf } from '@/hooks/useTranslatorHf';

import styles from '@/app/tensorflowjs/tensorflow.module.scss';

export default function Tensorflowjs() {
  const { loading, tensorflowModel } = useTensorflowMobilenet();
  const translateXenova = useTranslatorHf('Xenova/opus-mt-en-zh');
  const translateHelsinkiNLP = useTranslatorHf(
    'Helsinki-NLP/opus-mt-en-zh',
    process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN
  );

  const imgRef = useRef(null);
  const [output, setOutput] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [xenovaTranslatedLabel, setXenovaTranslatedLabel] = useState('');
  const [helsinkiNLPTranslatedLabel, setHelsinkiNLPTranslatedLabel] = useState('');


  const imageClassifier = useCallback(async () => {
    if (typeof tensorflowModel?.classify !== 'function') return;

    // Classify the image.
    const _predictions = await tensorflowModel.classify(imgRef.current);
    console.log('Predictions: ');
    console.log(_predictions);
    setPredictions(_predictions);

    let _output = null;
    _predictions.forEach((prediction) => {
      if (
        _output === null ||
        _predictions?.probability <= prediction.probability
      ) {
        _output = prediction;
      }
    });
    setOutput(_output);

  }, [tensorflowModel]);

  useIsomorphicLayoutEffect(() => {
    if (typeof window === 'object') {
      imageClassifier();
    }
  }, [imageClassifier]);

  useEffect(() => {
    async function handleTranslation() {
      if (
        typeof translateXenova !== 'function' ||
        typeof translateHelsinkiNLP !== 'function' ||
        typeof output?.className !== 'string' ||
        output?.className === ''
      ) {
        return;
      }

      const [
        _xenovaTranslatedLabel,
        _helsinkiNLPTranslatedLabel
      ] = await window.Promise.all([
        translateXenova(
          output.className,
          { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' }
        ),
        translateHelsinkiNLP(
          output.className,
          { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' }
        )
      ]);
      console.log({ _xenovaTranslatedLabel, _helsinkiNLPTranslatedLabel });

      setXenovaTranslatedLabel(_xenovaTranslatedLabel[0]?.translation_text || '');
      setHelsinkiNLPTranslatedLabel(_helsinkiNLPTranslatedLabel.translation_text || '');
    }
    handleTranslation();
  }, [output, translateXenova, translateHelsinkiNLP]);

  return (
    <main className={styles.tensorflowjs_page}>
      <Image
        ref={imgRef}
        src="/images/bird.png"
        alt="bird"
        width={600}
        height={500}
      />
      {loading === true ? (
        <Skeleton variant="rounded" width={600} height={106} />
      ) : (
        <div>
          <p>辨識結果: </p>
          <p>相似度最高：{output?.className}，翻譯模型翻譯為：{xenovaTranslatedLabel}，{helsinkiNLPTranslatedLabel}</p>
          <p>全部辨識結果：</p>
          {predictions.map((prediction, key) => (
            <div key={key} >
              <p>{`相似於：${prediction.className}`}</p>
              <p>{`相似度：${prediction.probability}`}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
