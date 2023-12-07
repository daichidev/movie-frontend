/**
 * 画面の拡大縮小に対応してbody要素のスケールを変更するヘルパークラスです。
 */
const useScaleHelper = () => {
  const MIN_WIDTH = 1690;
  const MIN_HEIGHT = 1080;

  /**
   * コンテンツエリアのスケールをウィンドウサイズに合わせて変更します。
   */
  const updateContentScale = () => {
    // eslint-disable-next-line
    const style: any = document.documentElement.style;
    const zoomRatio = Math.min(
      window.innerWidth / MIN_WIDTH,
      window.innerHeight / MIN_HEIGHT,
    );
    console.log(
      'zoomRatio',
      window.innerWidth / MIN_WIDTH,
      window.innerHeight / MIN_HEIGHT,
    );
    if (window.navigator.userAgent.match(/Trident/)) {
      // Internet Explorer
      style.transformOrigin = '50% 0';
      style.transform = 'translateX(' + ((1 - zoomRatio) / 2) * 100 + '%)';

      style.zoom = '' + zoomRatio;
    } else {
      /*if (style.zoom !== zoomRatio) {
        // WebKit/Blink/Edge
        style.zoom = zoomRatio;
        window.localStorage.setItem('zoom', `${zoomRatio}`);
      }*/
      style.zoom = zoomRatio;
    }
  };

  /**
   * ウィンドウがリサイズされた時に呼び出されます。
   */
  const onWindowResized = () => {
    updateContentScale();
  };

  return { updateContentScale, onWindowResized };
};

export default useScaleHelper;

// WEBPACK FOOTER //
// ./app/html/common/js/ui.ts
