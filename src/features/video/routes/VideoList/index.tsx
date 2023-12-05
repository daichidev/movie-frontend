import { default as JsxParser } from 'html-react-parser';
import { ReactComponent as BackIcon } from '../../../../assets/svgs/back.svg';
import { ReactComponent as HomeIcon } from '../../../../assets/svgs/home.svg';
import { ReactComponent as LogoutIcon } from '../../../../assets/svgs/logout.svg';
import { convertRuby } from '../../../../config';
import { VideoCard } from '../../component/VideoCard';
import styles from './styles.module.scss';
import { useVideoList } from './useVideoList';

export const VideoList = () => {
  const { videoList, gradeId } = useVideoList();
  return (
    <main className={styles.main}>
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
      <nav className={styles.nav}>
        <button>
          <BackIcon />
          もどる
        </button>
        <div>
          {/* TODO リンク */}
          <a href="/">
            <HomeIcon />
            {`トモプラ\nホーム`}
          </a>
          {/* TODO ログアウト処理 */}
          <button>
            <LogoutIcon />
            ログアウト
          </button>
        </div>
      </nav>
    </main>
  );
};
