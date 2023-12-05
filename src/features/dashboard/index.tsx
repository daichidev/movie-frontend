import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as HomeIcon } from '../../assets/svgs/home.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svgs/logout.svg';
import '../../styles/dashboard/index.scss';
import { LevelButton } from './component/Button';
import { ClassicButton } from './component/ClassicButton';
import styles from './styles.module.scss';

export const Home = () => {
  const navigate = useNavigate();
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img src="/images/top.png" />
      </div>
      <div className={styles.body}>
        <div className={styles['menu-container']}>
          <div className={styles['contents']}>
            <LevelButton level={1} />
            <LevelButton level={2} />
            <LevelButton level={3} />
            <LevelButton level={4} />
            <LevelButton level={5} />
            <LevelButton level={6} />
          </div>
          <div className={styles['contents']}>
            <ClassicButton content="{古*こ*}{典*てん*}：{和*わ*}{歌*か*} • {短*たん*}{歌*か*} • {俳*はい*}{句*く*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{日*にっ*}{記*き*} • {随*ずい*}{筆*ひつ*} • {説*せつ*}{話*わ*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{伝*でん*}{統*とう*}{芸*げい*}{能*のう*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{狂*きょう*}{言*げん*}「{柿*かき*}{山*やま*}{伏*ぶし*}」" />
          </div>
        </div>
        <nav className={styles.nav}>
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
        </nav>
        <div className={styles['how-to-use']}>
          <Link to={'/videos/5'}>
            <img src="/images/how-to-use.png" />
            つかいかた
          </Link>
        </div>
      </div>
    </main>
  );
};
