'use client';

// https://www.tensorflow.org/js/models?hl=zh-tw
// https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
// https://github.com/tensorflow/tfjs-models/tree/master/face-detection

// https://js.tensorflow.org/api_node/4.16.0/
// https://blog.csdn.net/qq_41880073/article/details/115600295

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { useTranslatorHf } from '@/hooks/useTranslatorHf';

import styles from '@/app/tensorflowjs/tensorflow.module.scss';

export default function Tensorflow() {
  const imgRef = useRef(null);
  const [tensorflowLoading, setTensorflowLoading] = useState(true);
  const [tensorflowJs, setTensorflowJs] = useState(null);
  const [tensorflowMobilenet, setTensorflowMobilenet] = useState(null);
  const [tensorflowModel, setTensorflowModel] = useState(null);
  const [output, setOutput] = useState({});
  const [predictions, setPredictions] = useState([]);
  const [xenovaTranslatedLabel, setXenovaTranslatedLabel] = useState('');
  const [helsinkiNLPTranslatedLabel, setHelsinkiNLPTranslatedLabel] = useState('');

  const translateXenova = useTranslatorHf('Xenova/opus-mt-en-zh');
  const translateHelsinkiNLP = useTranslatorHf('Helsinki-NLP/opus-mt-en-zh', process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN);

  const imageClassifier = useCallback(async () => {
    const [_tensorflowJs, _mobilenet] = await window.Promise.all([
      import('@tensorflow/tfjs'),
      import('@tensorflow-models/mobilenet')
    ]);
    // Load the model.
    const model = await _mobilenet.load();

    // Classify the image.
    const _predictions = await model.classify(imgRef.current);
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

    setTensorflowJs(_tensorflowJs);
    setTensorflowMobilenet(_mobilenet);
    setTensorflowLoading(false);
    setTensorflowModel(model);
  }, []);
  useIsomorphicLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      imageClassifier();
    }
  }, []);
  useEffect(() => {
    console.log({ tensorflowJs, tensorflowModel, tensorflowMobilenet });

    return () => {
      console.log({ tensorflowModel, ['tensorflowModel?.model']: tensorflowModel?.model, ['tensorflowModel?.model?.dispose']: tensorflowModel?.model?.dispose });
      tensorflowModel?.model?.dispose(); // 清理模型
      tensorflowModel?.model?.disposeIntermediateTensors();
      // tensorflowModel?.dispose(); // 清理模型
      tensorflowJs?.dispose();
      tensorflowJs?.disposeVariables(); // 清理所有訓練中的變量
    };
  }, [tensorflowJs, tensorflowMobilenet, tensorflowModel]);


  useEffect(() => {
    async function handleTranslation() {
      if (typeof translateXenova !== 'function' || typeof translateHelsinkiNLP !== 'function' || typeof output?.className !== 'string' || output?.className === '') {
        return;
      }
      const _xenovaTranslatedLabel = await translateXenova(output.className, { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' });
      const _helsinkiNLPTranslatedLabel = await translateHelsinkiNLP(output.className, { src_lang: 'eng_Latn', tgt_lang: 'zho_Hant' });
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
      {tensorflowLoading === true ? (
        <Skeleton variant="rounded" width={600} height={106} />
      ) : (
        <div>
          <p>辨識結果: </p>
          <p>相似度最高：{output?.className}，翻譯模型翻譯為：{xenovaTranslatedLabel}，{helsinkiNLPTranslatedLabel}</p>
          <p>全部辨識結果：</p>
          {predictions.map((prediction, key) => (
            <div
              key={key}
            >
              <p>{`相似於：${prediction.className}`}</p>
              <p>{`相似度：${prediction.probability}`}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
