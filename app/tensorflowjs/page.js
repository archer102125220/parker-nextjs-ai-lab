'use client';

// https://www.tensorflow.org/js/models?hl=zh-tw
// https://github.com/tensorflow/tfjs-models/tree/master/mobilenet
// https://github.com/tensorflow/tfjs-models/tree/master/face-detection

// https://js.tensorflow.org/api_node/4.16.0/
// https://blog.csdn.net/qq_41880073/article/details/115600295

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Skeleton from '@mui/material/Skeleton';
import styles from '@/app/tensorflowjs/tensorflow.module.css';
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export default function Tensorflow() {
  const imgRef = useRef(null);
  const [tensorflowLoading, setTensorflowLoading] = useState(true);
  const [tensorflowJs, setTensorflowJs] = useState(null);
  const [tensorflowMobilenet, setTensorflowMobilenet] = useState(null);
  const [tensorflowModel, setTensorflowModel] = useState(null);
  const [output, setOutput] = useState({});
  const [predictions, setPredictions] = useState([]);

  useIsomorphicLayoutEffect(() => {
    async function imageClassifier() {
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
    }
    if (typeof window !== 'undefined') {
      imageClassifier();
    }

  }, []);
  useEffect(() => {
    console.log({ tensorflowJs, tensorflowModel, tensorflowMobilenet });
    return () => {
      tensorflowModel?.model?.dispose();
      // tensorflowJs?.engine?.()?.endScope?.(); // 清理所有未釋放的張量
      tensorflowJs?.dispose();
      tensorflowJs?.disposeVariables(); // 清理所有訓練中的變量
    }
  }, [tensorflowJs, tensorflowMobilenet, tensorflowModel]);

  return (
    <main className={styles.main}>
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
          <p>Predictions: </p>
          {predictions.map((prediction, key) => (
            <p
              key={key}
            >{`相似於：${prediction.className}，相似度：${prediction.probability}`}</p>
          ))}
          <p>相似度最高：{output?.className}</p>
        </div>
      )}
    </main>
  );
}
