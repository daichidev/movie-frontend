import { detect } from 'detect-browser';
import React, {
  MouseEventHandler,
  TouchEventHandler,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export interface CanvasPropType {
  width: number;
  height: number;
  left: number;
  top: number;
  functionListener: (functions: CanvasOperation) => void;
  phase: number;
  // 描き終えた時点で持ってる全ての筆跡をコールバックする
  onEndDraw: (plotEvents: PlotEventType[]) => void;
  plotEvents: PlotEventType[];
}

export interface CanvasOperation {
  back: () => void;
  clear: () => void;
}

export interface PlotEventType {
  action: 'begin' | 'continue' | 'end';
  x?: number | undefined;
  y?: number | undefined;
}

const Canvas = (props: CanvasPropType) => {
  const [drawing, setDrawing] = useState(false);
  const plotEvents = useRef<PlotEventType[]>(props.plotEvents);
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
    return canvas?.getContext('2d');
  };

  const _getZoom = () => {
    // eslint-disable-next-line
    const style: any = document.documentElement.style;
    return style.zoom;
  };

  const mouseDown: MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (plotEvents.current && props.phase === 0) {
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
      plotEvents.current = [...plotEvents.current, plotEvent];
    }
  };

  // 追従ポイント
  const mouseMove: MouseEventHandler = (
    e: React.MouseEvent<HTMLInputElement>,
  ) => {
    if (drawing && plotEvents.current && props.phase === 0) {
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
      plotEvents.current = [...plotEvents.current, plotEvent];
    }
  };

  // 線描画完了
  const endDrawing = () => {
    if (drawing && plotEvents.current && props.phase === 0) {
      //console.log('end');
      setDrawing(false);
      const plotEvent: PlotEventType = { action: 'end' };
      //draw(mouseX ?? 0, mouseY ?? 0);
      plotEvents.current = [...plotEvents.current, plotEvent];
      props.onEndDraw(plotEvents.current);
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
    if (plotEvents.current && props.phase === 0) {
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
      plotEvents.current = [...plotEvents.current, plotEvent];
    }
  };

  // 追従ポイント
  const touchMove: TouchEventHandler = (
    e: React.TouchEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (drawing && plotEvents.current && props.phase === 0) {
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
      plotEvents.current = [...plotEvents.current, plotEvent];
    }
  };

  // 線描画完了
  const touchEnd: TouchEventHandler = (
    e: React.TouchEvent<HTMLInputElement>,
  ) => {
    e.preventDefault();
    if (drawing && plotEvents.current && props.phase === 0) {
      //console.log('end');
      setDrawing(false);
      const plotEvent: PlotEventType = { action: 'end' };
      //draw(mouseX ?? 0, mouseY ?? 0);
      plotEvents.current = [...plotEvents.current, plotEvent];
      props.onEndDraw(plotEvents.current);
    }
  };

  const draw = (x: number, y: number) => {
    if (plotEvents.current) {
      const ctx = getContext();
      ctx.beginPath();
      ctx.globalAlpha = 1.0;
      if (
        plotEvents.current.length === 0 ||
        plotEvents.current[plotEvents.current.length - 1].action === 'end'
      ) {
        ctx.moveTo(x, y);
      } else {
        const plotEvent = plotEvents.current[plotEvents.current.length - 1];
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
    if (plotEvents.current) {
      const work = [...plotEvents.current.reverse()];
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
      plotEvents.current = work;
      props.onEndDraw(plotEvents.current);
    }
    // eslint-disable-next-line
  }, []);

  const _reset = useCallback(() => {
    const ctx = getContext();
    ctx?.clearRect(0, 0, width, height);
    plotEvents.current = [];
    props.onEndDraw(plotEvents.current);
    // eslint-disable-next-line
  }, []);

  const _redraw = async () => {
    if (plotEvents.current) {
      const work = [...plotEvents.current];
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
