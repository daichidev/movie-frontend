import { default as JsxParser } from 'html-react-parser';
import { ExtendedKanjiText } from '../../../../components/Elements/CustomText';
import { Layout } from '../../../../components/Layout/Layout';
import { convertRuby } from '../../../../config';
import { VideoCard } from '../../component/VideoCard';
import styles from './styles.module.scss';
import { useVideoList } from './useVideoList';

export const VideoList = () => {
  const { videoList, genre, gradeId } = useVideoList();
  return (
    <Layout className={styles.main}>
      <div className={styles.body}>
        <div className={styles.title}>
          <span>
            <ExtendedKanjiText text={genre} />
          </span>
          {genre && !Number.isNaN(+genre) && (
            <span>
              {+genre === 1 ? 'ねん' : JsxParser(convertRuby(`年《ねん》`))}
            </span>
          )}
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
    </Layout>
  );
};
