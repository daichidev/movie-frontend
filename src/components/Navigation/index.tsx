import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/svgs/back.svg';
import { ReactComponent as HomeIcon } from '../../assets/svgs/home.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svgs/logout.svg';
import styles from './styles.module.scss';

export const Navigation = ({
  className,
  noBack,
}: {
  className?: string;
  noBack?: boolean;
}) => {
  const navigate = useNavigate();
  return (
    <nav className={clsx(className, styles.nav)}>
      <div>
        {!noBack && (
          <button onClick={() => navigate(-1)}>
            <BackIcon />
            もどる
          </button>
        )}
      </div>
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
  );
};
