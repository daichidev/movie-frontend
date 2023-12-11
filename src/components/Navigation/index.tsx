import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as BackIcon } from '../../assets/svgs/back.svg';
import { ReactComponent as HomeIcon } from '../../assets/svgs/home.svg';
import { ReactComponent as LogoutIcon } from '../../assets/svgs/logout.svg';
import { buttonStyles } from '../Elements/Button';
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
          <button
            className={buttonStyles['secondary-icon']}
            onClick={() => navigate(-1)}
          >
            <BackIcon />
            もどる
          </button>
        )}
      </div>
      <div>
        {/* TODO リンク */}
        <a className={buttonStyles['secondary-icon']} href="/">
          <HomeIcon />
          {`トモプラ\nホーム`}
        </a>
        {/* TODO ログアウト処理 */}
        <button className={buttonStyles['secondary-icon']}>
          <LogoutIcon className={buttonStyles.secondary} />
          ログアウト
        </button>
      </div>
    </nav>
  );
};
