import { useState, useEffect } from 'react';

import { mediaTablet } from '@/styles/globals';

export function useTablet() {
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    function windowWidthListener() {
      setIsTablet(window.matchMedia(mediaTablet.replace('@media', '')).matches);
    }
    windowWidthListener();
    window.addEventListener('resize', windowWidthListener);
    return () => {
      window.removeEventListener('resize', windowWidthListener);
    };
  }, []);

  return isTablet;
}

export default useTablet;
