import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { Navigation } from '../../components/Navigation';
import '../../styles/dashboard/index.scss';
import { LevelButton } from './component/Button';
import { ClassicButton } from './component/ClassicButton';
import styles from './styles.module.scss';

export const Home = () => {
  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <img src="/images/top.png" />
      </div>
      <div className={styles.body}>
        <Navigation className={styles.nav} noBack />
        <div className={styles['how-to-use']}>
          {/* TODO link先修正 */}
          <Link to={'/videos/5'}>
            <img src="/images/how-to-use.png" />
            つかいかた
          </Link>
        </div>
        <div className={styles['menu-container']}>
          <div className={styles['contents']}>
            <LevelButton level={1} />
            <LevelButton level={2} />
            <LevelButton level={3} />
            <LevelButton level={4} />
            <LevelButton level={5} />
            <LevelButton level={6} />
          </div>
          <div className={clsx(styles['contents'], styles.genre)}>
            <ClassicButton content="{古*こ*}{典*てん*}：{和*わ*}{歌*か*} • {短*たん*}{歌*か*} • {俳*はい*}{句*く*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{日*にっ*}{記*き*} • {随*ずい*}{筆*ひつ*} • {説*せつ*}{話*わ*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{伝*でん*}{統*とう*}{芸*げい*}{能*のう*}{編*へん*}" />
            <ClassicButton content="{古*こ*}{典*てん*}：{狂*きょう*}{言*げん*}「{柿*かき*}{山*やま*}{伏*ぶし*}」" />
          </div>
        </div>
      </div>
    </main>
  );
};
