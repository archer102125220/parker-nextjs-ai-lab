import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

export function AxiosInit({ children }) {
  useRequestInit(process.env.API_BASE);

  return children;
}