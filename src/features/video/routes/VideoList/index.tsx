import { default as JsxParser } from 'html-react-parser';
import { Navigation } from '../../../../components/Navigation';
import { convertRuby } from '../../../../config';
import { VideoCard } from '../../component/VideoCard';
import styles from './styles.module.scss';
import { useVideoList } from './useVideoList';

export const VideoList = () => {
  const { videoList, gradeId } = useVideoList();
  return (
    <main className={styles.main}>
      <Navigation className={styles.nav} />
      <div className={styles.body}>
        <div className={styles.title}>
          <span>{gradeId}</span>
          <span>
            {gradeId === 1 ? 'ねん' : JsxParser(convertRuby(`年《ねん》`))}
          </span>
        </div>
        <hr />
        <ul className={styles.list}>
          {videoList.map((element) => {
            return (
              <li>
                <VideoCard
                  title={element.name}
                  gradeId={gradeId}
                  content={element.content}
                  videoId={element.id}
                  isClassic={element.isClassic}
                  classicType={element.classicType}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
};
