'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Button from '@mui/material/Button';

// import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { useTensorflowMobilenet } from '@/hooks/useTensorflowMobilenet';
import { useTranslatorHf } from '@/hooks/useTranslatorHf';

import { ImageUpload } from '@/components/ImageUpload';

import styles from '@/app/tensorflowjs/mobilenet/mobilenet.module.scss';

export default function TensorflowjsMobilenet() {
  const { loading, tensorflowModel } = useTensorflowMobilenet();
  const translateXenova = useTranslatorHf('Xenova/opus-mt-en-zh');
  const translateHelsinkiNLP = useTranslatorHf(
    'Helsinki-NLP/opus-mt-en-zh',
    process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN
  );

  const imgRef = useRef(null);
  const imgUploadRef = useRef(null);

  const [imgFile, setImgFile] = useState('/images/bird.png');
  const [previewImg, setPreviewImg] = useState('/images/bird.png');
  const [output, setOutput] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [xenovaTranslatedLabel, setXenovaTranslatedLabel] = useState('');
  const [helsinkiNLPTranslatedLabel, setHelsinkiNLPTranslatedLabel] = useState('');

  const imageClassifier = useCallback(async () => {
    if (typeof tensorflowModel?.classify !== 'function') return;
    console.log({ imgRef });

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

  // useIsomorphicLayoutEffect(() => {
  //   if (typeof window === 'object') {
  //     imageClassifier();
  //   }
  // }, [imageClassifier]);

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

  useEffect(() => {
    console.log({ imgUploadRef, imgRef });
  }, [imgUploadRef, imgRef]);

  useEffect(() => {
    console.log({ imgFile, previewImg });
  }, [imgFile, previewImg]);

  return (
    <main className={styles.mobilenet_page}>
      <h2>Tensorflow.js 使用 mobilenet 模型</h2>
      <ImageUpload
        ref={imgUploadRef}
        imgRef={imgRef}
        src={previewImg}
        width={600}
        height={500}
        change={setImgFile}
        previewImgChange={setPreviewImg}
      />

      {loading === true ? (
        <Skeleton variant="rounded" width={600} height={106} />
      ) : (
        <Box>
          <Button
            onClick={imageClassifier}
          >
            開始辨識
          </Button>
          <p>辨識結果: </p>
          <p>相似度最高：{output?.className || '-'}，翻譯模型翻譯為：{xenovaTranslatedLabel || '-'}，{helsinkiNLPTranslatedLabel || '-'}</p>
          <p>全部辨識結果：</p>
          {predictions.map((prediction, key) => (
            <div key={key} >
              <p>{`相似於：${prediction.className}`}</p>
              <p>{`相似度：${prediction.probability}`}</p>
            </div>
          ))}
        </Box>
      )}
    </main>
  );
}
