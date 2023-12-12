import clsx from 'clsx';
import { ReactNode, useState } from 'react';
import { ReactComponent as StampNormal } from '../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import { ReactComponent as Timer } from '../../../assets/svgs/timer.svg';
import styles from './StampForm.module.scss';

export type StampFormProps = {
  className?: string;
  normalCount: number;
  handleNormalClick: () => Promise<void>;
  goodCount: number;
  handleGoodClick: () => Promise<void>;
  bestCount: number;
  handleBestClick: () => Promise<void>;
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
      className={styles.normal}
      label={'もっと\nしりたい'}
      Icon={<StampNormal />}
      count={normalCount}
      onClick={handleNormalClick}
    />
    <Stamp
      className={styles.good}
      label={'なるほど'}
      Icon={<StampGood />}
      count={goodCount}
      onClick={handleGoodClick}
    />
    <Stamp
      className={styles.best}
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
  onClick: () => Promise<void>;
  count?: number;
  disabled?: boolean;
  className?: string;
};
const Stamp = ({
  label,
  Icon,
  count = 0,
  onClick,
  disabled,
  className,
}: StampProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <div className={clsx(className, styles.stamp)}>
      <button
        className={clsx(isSubmitting && styles.submitting)}
        onClick={async () => {
          setIsSubmitting(true);
          await onClick();
          setIsSubmitting(false);
        }}
        disabled={isSubmitting || disabled}
      >
        <span>{label}</span>
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
