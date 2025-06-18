import { useState, useEffect, useCallback } from 'react';

import { useRequestInit } from '@/hooks/useRequestInit';
import { CancelRequest } from '@/utils/request/';

// import { axiosInit, request as axiosRequest } from '@/utils/request';

export function useRequest(method = 'get', path = '', payload = {}, extendOption = {}, requestOption = {}) {
  const { apiBase, errorAdapter, defaultExtendOption } = requestOption;

  const { request: axiosRequest } = useRequestInit(apiBase || process.env.API_BASE, errorAdapter, defaultExtendOption);

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function handleRequest() {
      if (typeof path !== 'string' || path === '') return;

      setIsLoading(true);

      try {
        setError(null);

        const response = await axiosRequest(
          method,
          path,
          payload,
          {
            useCache: true,
            useServiceWorkerCache: /POST|PUT|DELETE/i.test(method) === false,
            ...extendOption
          }
        );

        setResponse(response);
      } catch (_error) {
        setError(_error);
      }

      setIsLoading(false);
    }

    handleRequest();
  }, [axiosRequest, method, path, payload, extendOption]);

  const cancelRequest = useCallback(() => {
    const _method = typeof method === 'string' ? method : '';
    return CancelRequest.handlerCancel(_method.toLocaleLowerCase(), path, payload);
  }, [method, path, payload]);


  return {
    cancelRequest,
    response,
    isLoading,
    error
  };
}

export default useRequest;