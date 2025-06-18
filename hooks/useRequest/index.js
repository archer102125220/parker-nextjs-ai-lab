import { useState, useEffect, useCallback } from 'react';
import _cloneDeep from 'lodash/cloneDeep';

import { useRequestInit } from '@/hooks/useRequestInit';
import { CancelRequest } from '@/utils/request';

// import { axiosInit, request as axiosRequest } from '@/utils/request';

export function useRequest(
  method = 'get',
  path = '',
  payload = {},
  checkPayload,
  extendOption = { retry: 3 },
  requestOption = {}
) {
  const { apiBase, errorAdapter, defaultExtendOption } = requestOption;

  const { request: axiosRequest } = useRequestInit(apiBase || process.env.NEXT_PUBLIC_API_BASE, errorAdapter, defaultExtendOption);

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const cancelRequest = useCallback(() => {
    const _method = typeof method === 'string' ? method : '';
    return CancelRequest.handlerCancel(_method.toLocaleLowerCase(), path, payload);
  }, [method, path, payload]);

  const handleRequest = useCallback(async () => {
    if (typeof path !== 'string' || path === '' ||
      (
        typeof checkPayload === 'function' &&
        checkPayload(payload, path, extendOption) === false
      )
    ) {
      return;
    }

    setIsLoading(true);

    try {
      setError(null);

      const _extendOption = _cloneDeep(extendOption);

      delete _extendOption.retry;

      // if (/POST|PUT|DELETE/i.test(method) === false) {
      //   _extendOption.useCache = true;
      //   _extendOption.useServiceWorkerCache = true;
      // }

      if (/GETE/i.test(method) === true) {
        _extendOption.useCache = true;
        _extendOption.useServiceWorkerCache = true;
      }

      const response = await axiosRequest(
        method,
        path,
        payload,
        _extendOption
      );

      setResponse(response);

      return response;
    } catch (_error) {
      setError(_error);
    } finally {
      setIsLoading(false);
    }

  }, [axiosRequest, method, path, payload, checkPayload, extendOption]);

  const handleRetry = useCallback(async () => {
    if (error !== null && isLoading === false) return response;
    setRetryCount(retryCount + 1);
    return await handleRequest();
  }, [error, isLoading, response, handleRequest, retryCount]);

  useEffect(() => {
    handleRequest();
  }, [handleRequest]);
  useEffect(() => {
    const { retry } = extendOption;
    const _retry = typeof retry === 'number' ? retry : 3;
    if (retryCount <= _retry) {
      handleRetry();
    }
  }, [handleRetry, extendOption, retryCount]);


  return {
    cancelRequest,
    response,
    isLoading,
    error,
    refetch: handleRetry
  };
}

export default useRequest;