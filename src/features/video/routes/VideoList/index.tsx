import { default as JsxParser } from 'html-react-parser';
import { ExtendedKanjiText } from '../../../../components/Elements/CustomText';
import { Layout } from '../../../../components/Layout';
import { convertRuby } from '../../../../config';
import { VideoCard } from '../../component/VideoCard';
import styles from './styles.module.scss';
import { useVideoList } from './useVideoList';

export const VideoList = () => {
  const { videoList, genre, gradeId, isLoading } = useVideoList();
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
          {!isLoading ? (
            videoList.map((element) => {
              return (
                <li>
                  <VideoCard
                    title={element.name}
                    genre={element.isClassic ? element.classicType : gradeId}
                    gradeId={gradeId}
                    content={element.content}
                    videoId={element.id}
                    isClassic={element.isClassic}
                    classicType={element.classicType}
                  />
                </li>
              );
            })
          ) : (
            <span>ロード中...</span>
          )}
        </ul>
      </div>
    </Layout>
  );
};
