import { axiosInit, request as axiosRequest } from '@/utils/request';

export function useRequestInit(apiBase, errorAdapter, defaultExtendOption) {

  if (typeof axiosRequest.ax === 'object') {
    axiosInit(apiBase || process.env.API_BASE, errorAdapter, defaultExtendOption);
  }

  return axiosRequest;
}

export default useRequestInit;