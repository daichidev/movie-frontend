import React, { useEffect } from 'react';
import useScaleHelper from './useScaleHelper';

const ScalingProvider = (props: React.PropsWithChildren<object>) => {
  const { onWindowResized, updateContentScale } = useScaleHelper();

  useEffect(() => {
    window.addEventListener('resize', onWindowResized);
    updateContentScale();
    // eslint-disable-next-line
    const bodyElement: any = document.getElementsByTagName('body');
    if (bodyElement) {
      bodyElement[0].style.backgroundColor = '#000';
    }
    return () => window.removeEventListener('resize', onWindowResized);
    // eslint-disable-next-line
  }, []);

  return <>{props.children}</>;
};

export default React.memo(ScalingProvider);
