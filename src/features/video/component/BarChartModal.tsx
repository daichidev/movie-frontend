import clsx from 'clsx';
import { useState } from 'react';
import { ReactComponent as Arrow } from '../../../assets/svgs/arrow.svg';
import { ReactComponent as Checkbox } from '../../../assets/svgs/checkbox.svg';
import { ReactComponent as CloseAlt } from '../../../assets/svgs/close_alt.svg';
import { ReactComponent as StampNormal } from '../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../assets/svgs/star.svg';
import {
  SecondaryButton,
  buttonStyles,
} from '../../../components/Elements/Button';
import styles from './BarChartModal.module.scss';
import { StampBarChart, StampBarChartProps } from './StampBarChart';

export type BarChartModalProps = {
  onClose: () => void;
  isOpen: boolean;
  classes: { gradeId: number; class: string }[];
  classIndex: number;
  setClassIndex: (index: number) => void;
} & Omit<StampBarChartProps, 'showDelete'>;
export const BarChartModal = ({
  onClose,
  isOpen,
  classIndex,
  classes,
  setClassIndex,
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
        <Header
          date={date}
          onClose={onClose}
          classes={classes}
          classIndex={classIndex}
          setClassIndex={setClassIndex}
        />
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

const Header = ({
  date,
  onClose,
  classes,
  classIndex,
  setClassIndex,
}: {
  date: Date;
  onClose: VoidFunction;
  classes: { gradeId: number; class: string }[];
  classIndex: number;
  setClassIndex: (index: number) => void;
}) => (
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
    {classes.length > 0 && (
      <div className={styles['select-container']}>
        <Arrow />
        <select
          value={classIndex}
          onChange={(e) => setClassIndex(+e.target.value)}
        >
          {classes.map((e, i) => {
            const label = `${e.gradeId}年${e.class}組`;
            return (
              <option key={i} value={i} label={label}>
                {label}
              </option>
            );
          })}
        </select>
      </div>
    )}
    <button className={buttonStyles['secondary-icon']} onClick={onClose}>
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
        <SecondaryButton
          className={styles.remove}
          onClick={() => setShowDelete(true)}
        >
          <Star /> を
          <ruby>
            消<rt>け</rt>
          </ruby>
          す
        </SecondaryButton>
      )}
    </div>
  );
};
