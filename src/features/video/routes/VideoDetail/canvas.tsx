import { detect } from 'detect-browser';
import React, {
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

interface Window {
  plotEvents: PlotEventType[];
  navigator: Navigator;
}
declare let window: Window;

export interface CanvasPropType {
  width: number;
  height: number;
  left: number;
  top: number;
  functionListener: (functions: CanvasOperation) => void;
  phase: number;
  // 描き終えた時点で持ってる全ての筆跡をコールバックする
  onEndDraw: (plotEvents: PlotEventType[]) => void;
}

export interface CanvasOperation {
  back: () => void;
  clear: () => void;
}

export interface PlotEventType {
  action: string;
  x?: number | undefined;
  y?: number | undefined;
}

const Canvas = (props: CanvasPropType) => {
  const [drawing, setDrawing] = useState(false);
  const browser = detect();

  const { width, height } = props;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [adjustPlot, setAdjustPlot] = useState(false);

  useEffect(() => {
    const current = canvasRef.current;
    if (!current) return;
    const onTouchStart = (event: Event) => {
      event.preventDefault();
      //console.log('called default onTouchStart.');
    };
    current.addEventListener('touchstart', onTouchStart);
    console.log(`browserName: ${browser?.name ?? ''}`);
    console.log(`detectOS: ${browser?.os ?? ''}`);
    if ((browser?.name ?? '') === 'chrome') {
      console.log('全OSのchrome');
      setAdjustPlot(true);
    } else if (
      (browser?.name ?? '') === 'crios' &&
      (browser?.os as string) === 'iOS'
    ) {
      console.log('iOSのchrome');
      //setAdjustPlot(true);
    } else if (
      (browser?.name ?? '') === 'safari' &&
      (browser?.os as string) === 'Mac OS'
    ) {
      console.log('iOSのsafari');
      setAdjustPlot(true);
    }
    return () => {
      current.removeEventListener('touchstart', onTouchStart);
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const functions = {
      back: _back,
      clear: _reset,
    };
    props.functionListener(functions);
    _redraw();
    // eslint-disable-next-line
  }, []);

  const getContext = (): CanvasRenderingContext2D => {
    // eslint-disable-next-line
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const _getZoom = () => {
    // eslint-disable-next-line
    const style: any = document.documentElement.style;
    return style.zoom;
  };

  const mouseDown: MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (window.plotEvents && props.phase === 0) {
      const { offsetX: x, offsetY: y } = e.nativeEvent;
      //console.log(`start - clientX: ${x}; clientY: ${y}`);
      setDrawing(true);
      const zoom = _getZoom();
      const zoomedX = x / zoom;
      const zoomedY = y / zoom;
      const plotEvent = {
        action: 'begin',
        x: zoomedX,
        y: zoomedY,
      } as PlotEventType;
      draw(zoomedX, zoomedY);
      window.plotEvents = [...window.plotEvents, plotEvent];
    }
  };

  // 追従ポイント
  const mouseMove: MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (drawing && window.plotEvents && props.phase === 0) {
      const { offsetX: x, offsetY: y } = e.nativeEvent;
      //console.log(`move - clientX: ${x}; clientY: ${y}`);
      const zoom = _getZoom();
      const zoomedX = x / zoom;
      const zoomedY = y / zoom;
      const plotEvent = {
        action: 'continue',
        x: zoomedX,
        y: zoomedY,
      } as PlotEventType;
      draw(zoomedX, zoomedY);
      window.plotEvents = [...window.plotEvents, plotEvent];
    }
  };

  // 線描画完了
  const endDrawing = () => {
    if (drawing && window.plotEvents && props.phase === 0) {
      //console.log('end');
      setDrawing(false);
      const plotEvent = { action: 'end' };
      //draw(mouseX ?? 0, mouseY ?? 0);
      window.plotEvents = [...window.plotEvents, plotEvent];
      props.onEndDraw(window.plotEvents);
    }
  };

  const _getFinderPosition = (event: React.TouchEvent<HTMLInputElement>) => {
    if (canvasRef.current) {
      const rect_ = canvasRef.current.getBoundingClientRect();
      if (adjustPlot) {
        const zoom = _getZoom();
        return {
          x: event.nativeEvent.touches[0].clientX - (rect_.left ?? 0) * zoom,
          y: event.nativeEvent.touches[0].clientY - (rect_.top ?? 0) * zoom,
        };
      } else {
        return {
          x: event.nativeEvent.touches[0].clientX - rect_.left ?? 0,
          y: event.nativeEvent.touches[0].clientY - rect_.top ?? 0,
        };
      }
    } else {
      return { x: 0, y: 0 };
    }
  };

  // 開始ポイント
  const touchStart: TouchEventHandler = (
    e: React.TouchEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    //console.log('called react-dom onTouchStart');
    if (window.plotEvents && props.phase === 0) {
      const position = _getFinderPosition(e);
      //console.log(`start - clientX: ${position.x}; clientY: ${position.y}`);
      /*if (clientPos && adjustPlot) {
        x -= clientPos[0];
        y -= clientPos[1];
      }*/
      //console.log(`start adjusted - clientX: ${x}; clientY: ${y}`);
      setDrawing(true);
      const zoom = _getZoom();
      const zoomedX = position.x / zoom;
      const zoomedY = position.y / zoom;
      const plotEvent = {
        action: 'begin',
        x: zoomedX,
        y: zoomedY,
      } as PlotEventType;
      draw(zoomedX, zoomedY);
      window.plotEvents = [...window.plotEvents, plotEvent];
    }
  };

  // 追従ポイント
  const touchMove: TouchEventHandler = (
    e: React.TouchEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (drawing && window.plotEvents && props.phase === 0) {
      const position = _getFinderPosition(e);
      //console.log(`move - clientX: ${position.x}; clientY: ${position.y}`);
      /*if (clientPos && adjustPlot) {
        x -= clientPos[0];
        y -= clientPos[1];
      }
      console.log(`move adjusted - clientX: ${x}; clientY: ${y}`);*/
      const zoom = _getZoom();
      const zoomedX = position.x / zoom;
      const zoomedY = position.y / zoom;
      const plotEvent = {
        action: 'continue',
        x: zoomedX,
        y: zoomedY,
      } as PlotEventType;
      draw(zoomedX, zoomedY);
      window.plotEvents = [...window.plotEvents, plotEvent];
      console.log(e);
    }
  };

  // 線描画完了
  const touchEnd: TouchEventHandler = (
    e: React.TouchEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (drawing && window.plotEvents && props.phase === 0) {
      //console.log('end');
      setDrawing(false);
      const plotEvent = { action: 'end' };
      //draw(mouseX ?? 0, mouseY ?? 0);
      window.plotEvents = [...window.plotEvents, plotEvent];
      props.onEndDraw(window.plotEvents);
    }
  };

  const draw = (x: number, y: number) => {
    if (window.plotEvents) {
      const ctx = getContext();
      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      if (
        window.plotEvents.length === 0 ||
        window.plotEvents[window.plotEvents.length - 1].action === 'end'
      ) {
        ctx.moveTo(x, y);
      } else {
        const plotEvent = window.plotEvents[window.plotEvents.length - 1];
        if (plotEvent.x !== undefined && plotEvent.y !== undefined) {
          ctx.moveTo(plotEvent.x, plotEvent.y);
        }
        ctx.lineTo(x, y);
      }
      ctx.lineCap = 'round';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
    }
  };

  const _back = useCallback(async () => {
    if (window.plotEvents) {
      const work = [...window.plotEvents.reverse()];
      const qty = work.length;
      for (let index = 0; index < qty; index++) {
        const element = work[index];
        if (element.action === 'begin') {
          work.splice(0, index + 1);
          break;
        }
      }
      work.reverse();
      const ctx = getContext();
      ctx.clearRect(0, 0, width, height);
      ctx.beginPath();
      for (const element of work) {
        if (element.action === 'begin') {
          if (element.x !== undefined && element.y !== undefined) {
            ctx.moveTo(element.x, element.y);
          }
        } else if (element.action === 'continue') {
          if (element.x !== undefined && element.y !== undefined) {
            ctx.lineTo(element.x, element.y);
          }
        }
      }
      ctx.lineCap = 'round';
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#000000';
      ctx.stroke();
      window.plotEvents = work;
    }
    // eslint-disable-next-line
  }, []);

  const _reset = useCallback(() => {
    const ctx = getContext();
    ctx.clearRect(0, 0, width, height);
    window.plotEvents = [];
    // eslint-disable-next-line
  }, []);

  const _redraw = async () => {
    if (window.plotEvents) {
      const work = [...window.plotEvents];
      const ctx = getContext();
      ctx.clearRect(0, 0, width, height);
      for (const element of work) {
        if (element.action === 'begin') {
          if (element.x !== undefined && element.y !== undefined) {
            ctx.beginPath();
            ctx.moveTo(element.x, element.y);
          }
        } else if (element.action === 'continue') {
          if (element.x !== undefined && element.y !== undefined) {
            ctx.lineTo(element.x, element.y);
          }
        } else if (element.action === 'end') {
          ctx.lineCap = 'round';
          ctx.lineWidth = 10;
          ctx.strokeStyle = '#000000';
          ctx.stroke();
        }
      }
    }
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          left: props.left,
          top: props.top,
        }}
      >
        <canvas
          onMouseDown={mouseDown}
          onMouseMove={mouseMove}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={touchStart}
          onTouchMove={touchMove}
          onTouchEnd={touchEnd}
          ref={canvasRef}
          width={`${width}px`}
          height={`${height}px`}
          style={{ backgroundColor: 'rgba(0,0,0,0)' }}
        />
      </div>
      {/*<div>
        <button onClick={Reset}>リセット</button>
      </div>*/}
    </>
  );
};

export default Canvas;
