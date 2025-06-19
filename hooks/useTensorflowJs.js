'use client';

// https://www.tensorflow.org/js/models?hl=zh-tw
// https://github.com/tensorflow/tfjs-models/tree/master/face-detection

// https://js.tensorflow.org/api_node/4.16.0/
// https://blog.csdn.net/qq_41880073/article/details/115600295

import { useState, useEffect, useCallback } from 'react';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';

export function useTensorflowJs() {
  const [loading, setLoading] = useState(true);
  const [tensorflowJs, setTensorflowJs] = useState(null);

  const handleImportTensorflow = useCallback(async () => {
    setLoading(true);

    const _tensorflowJs = await import('@tensorflow/tfjs');

    setTensorflowJs(_tensorflowJs);
    setLoading(false);
  }, []);

  useIsomorphicLayoutEffect(() => {
    handleImportTensorflow();
  }, [handleImportTensorflow]);

  useEffect(() => {
    console.log({ tensorflowJs });

    return () => {
      console.log({ ['tensorflowJs?.dispose']: tensorflowJs?.dispose });
      tensorflowJs?.dispose();
      tensorflowJs?.disposeVariables(); // 清理所有訓練中的變量
    };
  }, [tensorflowJs]);

  return {
    loading,
    tensorflowJs
  };
}

export default useTensorflowJs;