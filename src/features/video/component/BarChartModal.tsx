import clsx from 'clsx';
import { useState } from 'react';
import { ReactComponent as Checkbox } from '../../../assets/svgs/checkbox.svg';
import { ReactComponent as CloseAlt } from '../../../assets/svgs/close_alt.svg';
import { ReactComponent as StampNormal } from '../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import styles from './BarChartModal.module.scss';
import { StampBarChart, StampBarChartProps } from './StampBarChart';

export type BarChartModalProps = {
  onClose: () => void;
  isOpen: boolean;
} & Omit<StampBarChartProps, 'showDelete'>;
export const BarChartModal = ({
  onClose,
  isOpen,
  submitDeleteStamp,
  ...props
}: BarChartModalProps) => {
  const [showDelete, setShowDelete] = useState(false);
  if (!isOpen) return <></>;
  const date = new Date();
  const onSubmitDeleteStamp: typeof submitDeleteStamp = async (...params) => {
    await submitDeleteStamp(...params);
    setShowDelete(false);
  };
  return (
    <div>
      <div className={styles.container}>
        <Header date={date} onClose={onClose} />
        <div className={styles.body}>
          <Control showDelete={showDelete} setShowDelete={setShowDelete} />
          <div className={styles.chart}>
            <StampBarChart
              {...props}
              showDelete={showDelete}
              submitDeleteStamp={onSubmitDeleteStamp}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Header = ({ date, onClose }: { date: Date; onClose: VoidFunction }) => (
  <div className={styles.header}>
    <div className={styles.date}>
      {date.getFullYear()}
      <ruby>
        年<rt>ねん</rt>
      </ruby>
      {date.getMonth() + 1}
      <ruby>
        月<rt>がつ</rt>
      </ruby>
      {date.getDate()}
      <ruby>
        日<rt>にち</rt>
      </ruby>
    </div>
    <div className={styles.title}>
      クラスの みんなが スタンプを おした じかん
    </div>
    <button onClick={onClose}>
      <CloseAlt />
    </button>
  </div>
);

const Control = ({
  showDelete,
  setShowDelete,
}: {
  showDelete: boolean;
  setShowDelete: (show: boolean) => void;
}) => {
  return (
    <div className={styles.control}>
      <div className={styles.stamps}>
        <button>
          <Checkbox />
          <StampNormal />
        </button>
        <button>
          <Checkbox />
          <StampGood />
        </button>
        <button>
          <Checkbox />
          <StampBest />
        </button>
      </div>
      <div className={styles.description}>
        <div>
          <ruby>
            自分
            <rt>じぶん</rt>
          </ruby>
          が
          <ruby>
            押<rt>お</rt>
          </ruby>
          した
          <ruby>
            時間<rt>じかん</rt>
          </ruby>
        </div>
        <div className={styles.stars}>
          <Star />
          <Star />
          <Star />
        </div>
      </div>
      {showDelete ? (
        <button
          className={clsx(styles.remove, styles.end)}
          onClick={() => setShowDelete(false)}
        >
          おわる
        </button>
      ) : (
        <button className={styles.remove} onClick={() => setShowDelete(true)}>
          <Star /> を
          <ruby>
            消<rt>け</rt>
          </ruby>
          す
        </button>
      )}
    </div>
  );
};
