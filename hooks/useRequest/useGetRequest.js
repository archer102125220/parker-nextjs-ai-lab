import { useState, useCallback, useEffect } from 'react';
// import { request } from '@/utils/request';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

export function useGetRequest(
  path = '',
  payload = {},
  checkPayload,
  extendOption = {},
  requestOption = {}
) {
  const { apiBase, errorAdapter, defaultExtendOption } = requestOption;

  const { request: axiosRequest } = useRequestInit(
    apiBase || process.env.NEXT_PUBLIC_API_BASE,
    errorAdapter,
    defaultExtendOption
  );

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const cancelRequest = useCallback(() => {
    return axiosRequest.getCancel(path, payload);
  }, [axiosRequest, path, payload]);

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

      const response = await axiosRequest.get(
        path,
        payload,
        {
          useCache: true,
          useServiceWorkerCache: true,
          ...extendOption
        }
      );

      setResponse(response);

      return response;
    } catch (_error) {
      setError(_error);
    } finally {
      setIsLoading(false);
    }

  }, [axiosRequest, path, payload, checkPayload, extendOption]);

  const handleRetry = useCallback(async () => {
    if (error !== null && isLoading === false) return response;
    setRetryCount(retryCount + 1);
    return await handleRequest();
  }, [error, isLoading, response, handleRequest, retryCount]);

  useEffect(() => {
    handleRequest();
  }, [payload, handleRequest]);

  // useEffect(() => {
  //   const { retry } = extendOption;
  //   const _retry = typeof retry === 'number' ? retry : 3;
  //   console.log({ retryCount, _retry });
  //   if (retryCount <= _retry) {
  //     handleRetry();
  //   }
  // }, [handleRetry, extendOption, retryCount]);

  return {
    cancelRequest,
    response,
    isLoading,
    error,
    refetch: handleRetry
  };
}

export default useGetRequest;
