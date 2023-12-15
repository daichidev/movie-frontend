import clsx from 'clsx';
import { ReactNode, forwardRef, useEffect, useState } from 'react';
import { findDOMNode } from 'react-dom';
import ReactPlayer, { ReactPlayerProps } from 'react-player';
import { ReactComponent as Chapter } from '../../assets/svgs/chapter.svg';
import { ReactComponent as CloseAlt2 } from '../../assets/svgs/close_alt2.svg';
import { ReactComponent as CloseAlt3 } from '../../assets/svgs/close_alt3.svg';
import { ReactComponent as Fullscreen } from '../../assets/svgs/fullscreen.svg';
import { ReactComponent as Minimize } from '../../assets/svgs/minimize.svg';
import { ReactComponent as Pause } from '../../assets/svgs/pause.svg';
import { ReactComponent as Play } from '../../assets/svgs/play.svg';
import { useLearningHistory } from '../../hooks/learning-history';
import { formatDuration } from '../../utils/duration';
import styles from './styles.module.scss';

type PopupMode = 'chapters' | 'subtitle' | 'resolution';

type VideoProps = {
  genre: string | number;
  videoId: string;
};
export const CustomPlayer = forwardRef<
  ReactPlayer,
  ReactPlayerProps & VideoProps
>(({ genre, videoId, ...props }, ref) => {
  const { post } = useLearningHistory();
  // TODO
  const resolutions = [1080, 720, 480, 360, 240, 144];
  const chapters = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    title: `チャプター${i + 1}`,
  }));

  const [showControl, setShowControl] = useState(false);
  const [popupMode, setPopupMode] = useState<PopupMode>();

  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const [resolution, setResolution] = useState<number>();

  const [currentSec, setCurrentSec] = useState(0);
  const [totalSec, setTotalSec] = useState(0);

  const handleChapter = (id: number) => {
    // TODO
    setPopupMode(undefined);
  };
  const handleSubtitle = (showSubtitle: boolean) => {
    setShowSubtitle(showSubtitle);
    // TODO
    setPopupMode(undefined);
  };
  const handleResolution = async (resolution: number | undefined) => {
    setResolution(resolution);
    // TODO
    setPopupMode(undefined);
  };

  const handleFullscreen = (fullscreen: boolean) => {
    // @ts-ignore
    const player = ref?.current;
    if (!player) return;
    const elemnt = findDOMNode(player) as HTMLElement;
    if (!elemnt.parentElement) return;
    if (fullscreen) elemnt.parentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  useEffect(() => {
    const listener = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    window.addEventListener('fullscreenchange', listener);
    return () => {
      removeEventListener('fullscreenchange', listener);
    };
  }, []);
  console.log(ref);
  return (
    <div
      className={clsx(
        styles.container,
        (!totalSec || playing) && styles.hidden,
      )}
      onClick={() => setPlaying(!playing)}
    >
      <ReactPlayer
        {...props}
        ref={ref}
        playing={playing}
        onProgress={({ playedSeconds }) =>
          setCurrentSec(Math.floor(playedSeconds))
        }
        onEnded={() => {
          setPlaying(false);
          post('movie_end', { movie_id: videoId, genre: `${genre}` });
        }}
        onDuration={(duration) => setTotalSec(Math.floor(duration))}
      />
      <BlendContainer className={styles['control-container']}>
        <div className={styles.control}>
          {playing ? (
            <button
              onClick={() => {
                setPlaying(false);
                post('movie_pause', {
                  movie_id: videoId,
                  genre: `${genre}`,
                  pause_at: currentSec,
                });
              }}
            >
              <Pause width={22} height={22} />
            </button>
          ) : (
            <button
              onClick={() => {
                setPlaying(true);
                if (currentSec === 0) {
                  post('movie_play', { movie_id: videoId, genre: `${genre}` });
                } else {
                  post('movie_resume', {
                    movie_id: videoId,
                    genre: `${genre}`,
                    resume_at: currentSec,
                  });
                }
              }}
            >
              <Play style={{ marginTop: 3 }} />
            </button>
          )}
          <div className={styles.time}>
            {formatDuration(currentSec)}/{formatDuration(totalSec)}
          </div>
          <button
            className={styles.label}
            onClick={() => setPopupMode('subtitle')}
          >
            じまく
          </button>
          <button
            className={styles.label}
            onClick={() => setPopupMode('resolution')}
          >
            {resolution ? `${resolution}P` : 'AUTO'}
          </button>
          <button onClick={() => handleFullscreen(!fullscreen)}>
            {fullscreen ? (
              <Minimize />
            ) : (
              <Fullscreen style={{ marginTop: 3 }} />
            )}
          </button>
          {popupMode === 'subtitle' && (
            <BlendContainer
              className={clsx(styles.popup, styles['popup-subtitle'])}
            >
              <button
                className={styles.close}
                onClick={() => setPopupMode(undefined)}
              >
                <CloseAlt3 />
              </button>
              <button
                className={clsx(styles.label, styles.active)}
                onClick={() => handleSubtitle(true)}
              >
                オン
              </button>
              <button
                className={styles.label}
                onClick={() => handleSubtitle(false)}
              >
                オフ
              </button>
            </BlendContainer>
          )}
          {popupMode === 'resolution' && (
            <BlendContainer
              className={clsx(styles.popup, styles['popup-resolution'])}
            >
              <button
                className={styles.close}
                onClick={() => setPopupMode(undefined)}
              >
                <CloseAlt3 />
              </button>
              {resolutions.map((r) => (
                <button
                  key={r}
                  className={clsx(
                    styles.label,
                    r === resolution && styles.active,
                  )}
                  onClick={() => handleResolution(r)}
                >
                  {r}P
                </button>
              ))}
              <button
                className={clsx(
                  styles.label,
                  resolution == null && styles.active,
                )}
                onClick={() => handleResolution(undefined)}
              >
                AUTO
              </button>
            </BlendContainer>
          )}
        </div>
      </BlendContainer>
      {popupMode === 'chapters' ? (
        <BlendContainer className={clsx(styles.popup, styles['popup-chapter'])}>
          <button
            className={styles.close}
            onClick={() => setPopupMode(undefined)}
          >
            <CloseAlt2 />
          </button>
          <div className={styles.chapters}>
            {chapters.map(({ id, title }) => (
              <button
                key={id}
                className={styles.label}
                onClick={() => handleChapter(id)}
              >
                <span>{id}</span>
                <span>{title}</span>
              </button>
            ))}
          </div>
        </BlendContainer>
      ) : (
        <button
          className={styles.chapter}
          onClick={(e) => {
            e.stopPropagation();
            setPopupMode('chapters');
          }}
        >
          <Chapter />
        </button>
      )}
    </div>
  );
});

const BlendContainer = ({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={clsx(className, styles['blend-container-position'])}
    onClick={(e) => e.stopPropagation()}
  >
    <div className={styles['blend-container']}>
      <div className={styles.bg} />
      <div className={styles.content}>{children}</div>
    </div>
  </div>
);
