import { useCallback, useSyncExternalStore } from 'react';

import { axiosInit, request as axiosRequest } from '@/utils/request';

export function useRequestInit(apiBase, errorAdapter, defaultExtendOption) {

  const subscribe = useCallback(() => {
    axiosInit(apiBase || process.env.API_BASE, errorAdapter, defaultExtendOption);

    // const _request = axiosInit(apiBase || process.env.API_BASE, errorAdapter, defaultExtendOption);
    // console.log({ _request });
  }, [apiBase, errorAdapter, defaultExtendOption]);

  const getSnapshot = useCallback(() => {
    return axiosRequest;
  }, []);

  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export default useRequestInit;