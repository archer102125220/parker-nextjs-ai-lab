'use client';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

import { axiosInit, request as axiosRequest } from '@/utils/request';

export function useRequest(apiBase, ...arg) {

  useIsomorphicLayoutEffect(() => {
    if (typeof axiosRequest.axios === 'object' && axiosRequest.axios !== null) {
    } else {
      const _request = axiosInit(apiBase || process.env.API_BASE, ...arg);
      console.log({ _request });
    }
  }, [apiBase]);


  return axiosRequest;
}

export default useRequest;