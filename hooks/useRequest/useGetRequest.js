import { useState, useCallback, useEffect } from 'react';
// import { request } from '@/utils/request';

import { useRequestInit } from '@/hooks/useRequest';

export function useGetRequest(path = '', payload = {}, extendOption = {}, requestOption = {}) {
  const { apiBase, errorAdapter, defaultExtendOption } = requestOption;

  const { request: axiosRequest } = useRequestInit(apiBase || process.env.API_BASE, errorAdapter, defaultExtendOption);

  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const cancelRequest = useCallback(() => {
    return axiosRequest.getCancel(path, payload);
  }, [axiosRequest, path, payload]);

  useEffect(() => {
    async function handleRequest() {
      if (typeof path !== 'string' || path === '') return;

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
      } catch (_error) {
        setError(_error);
      }

      setIsLoading(false);
    }

    handleRequest();
  }, [axiosRequest, path, payload, extendOption]);

  return {
    cancelRequest,
    response,
    isLoading,
    error
  };
}

export default useGetRequest;
