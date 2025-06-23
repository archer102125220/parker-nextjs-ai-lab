'use client';

import PropTypes from 'prop-types';

import { useRequestInit } from '@/hooks/useRequest/useRequestInit';

export function AxiosInit({ children }) {
  useRequestInit(process.env.NEXT_PUBLIC_API_BASE);

  return children;
}

AxiosInit.propTypes = {
  children: PropTypes.any
};

AxiosInit.defaultProps = {
  children: ''
};