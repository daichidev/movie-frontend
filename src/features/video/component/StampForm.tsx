import clsx from 'clsx';
import { ReactNode } from 'react';
import { ReactComponent as StampNormal } from '../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import { ReactComponent as Timer } from '../../../assets/svgs/timer.svg';
import styles from './StampForm.module.scss';

export type StampFormProps = {
  className?: string;
  normalCount: number;
  handleNormalClick: () => void;
  goodCount: number;
  handleGoodClick: () => void;
  bestCount: number;
  handleBestClick: () => void;
  showStampBarChartModal: () => void;
};
export const StampForm = ({
  normalCount,
  handleNormalClick,
  goodCount,
  handleGoodClick,
  bestCount,
  handleBestClick,
  showStampBarChartModal,
  className,
}: StampFormProps) => (
  <div className={clsx(className, styles.form)}>
    <Stamp
      label={'もっと\nしりたい'}
      Icon={<StampNormal />}
      count={normalCount}
      onClick={handleNormalClick}
    />
    <Stamp
      label={'なるほど'}
      Icon={<StampGood />}
      count={goodCount}
      onClick={handleGoodClick}
    />
    <Stamp
      label={'みんなに\nつたえたい'}
      Icon={<StampBest />}
      count={bestCount}
      onClick={handleBestClick}
    />
    <button className={styles.timer} onClick={() => showStampBarChartModal()}>
      <Timer />
      <div>{`スタンプを\nおした じかん`}</div>
    </button>
  </div>
);

type StampProps = {
  label: string;
  Icon: ReactNode;
  onClick?: () => void;
  count?: number;
  disabled?: boolean;
  submitting?: boolean;
};
const Stamp = ({
  label,
  Icon,
  count = 0,
  onClick,
  disabled,
  submitting,
}: StampProps) => {
  return (
    <div className={styles.stamp}>
      <button
        className={clsx(submitting && styles.submitting)}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
        {Icon}
      </button>
      <div className={styles.stars}>
        {Array.from({ length: 3 }, (_, i) => (
          <Star key={i} className={clsx(count > i && styles.active)} />
        ))}
      </div>
    </div>
  );
};
