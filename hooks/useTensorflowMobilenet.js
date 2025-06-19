'use client';

// https://github.com/tensorflow/tfjs-models/tree/master/mobilenet

import { useState, useEffect, useCallback } from 'react';

import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect';
import { useTensorflowJs } from '@/hooks/useTensorflowJs';

export function useTensorflowMobilenet() {
  const { tensorflowJs, loading: tensorflowLoading } = useTensorflowJs();

  const [tensorflowMobilenetLoading, setTensorflowMobilenetLoading] = useState(true);
  const [tensorflowMobilenet, setTensorflowMobilenet] = useState(null);
  const [tensorflowModel, setTensorflowModel] = useState(null);

  const handleImportTensorflowMobilenet = useCallback(async () => {
    if (typeof tensorflowJs !== 'object' || tensorflowJs === null) return;

    setTensorflowMobilenetLoading(true);

    const _tensorflowMobilenet = await import('@tensorflow-models/mobilenet');
    // Load the model.
    const _tensorflowModel = await _tensorflowMobilenet.load();

    setTensorflowModel(_tensorflowModel);
    setTensorflowMobilenet(_tensorflowMobilenet);
    setTensorflowMobilenetLoading(false);
  }, [tensorflowJs]);

  useIsomorphicLayoutEffect(() => {
    handleImportTensorflowMobilenet();
  }, [tensorflowJs]);

  useEffect(() => {
    console.log({
      tensorflowModel,
      tensorflowMobilenet
    });

    return () => {
      console.log({
        tensorflowModel,
        ['tensorflowModel?.model']: tensorflowModel?.model,
        ['tensorflowModel?.model?.dispose']: tensorflowModel?.model?.dispose
      });

      tensorflowModel?.model?.dispose(); // 清理模型
      tensorflowModel?.model?.disposeIntermediateTensors();
      // tensorflowModel?.dispose(); // 清理模型
    };
  }, [tensorflowMobilenet, tensorflowModel]);

  return {
    tensorflowMobilenetLoading,
    tensorflowLoading,
    loading: tensorflowMobilenetLoading || tensorflowLoading,
    tensorflowMobilenet,
    tensorflowModel
  };
}

export default useTensorflowMobilenet;