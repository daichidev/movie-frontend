import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ReactComponent as QuestionIcon } from '../../../../assets/svgs/question.svg';
import { ReactComponent as StampIcon } from '../../../../assets/svgs/stamp.svg';
import { ExtendedKanjiText } from '../../../../components/Elements/CustomText';
import styles from './styles.module.scss';
import { useVideoCard } from './useVideoCard';

type VideoCardProps = {
  videoId: string;
  gradeId: number;
  title: string;
  content: any;
  isClassic: boolean;
  classicType: string;
};

export const VideoCard = ({
  title,
  content,
  gradeId,
  videoId,
  isClassic,
  classicType,
}: VideoCardProps) => {
  const { to, useStamp, useQuestion, disabled } = useVideoCard({
    videoId,
    gradeId,
  });
  return (
    <Link
      className={clsx(styles.card, disabled && styles.inactive)}
      to={disabled ? to : ''}
    >
      <div className={styles.content}>
        <div className={styles.title}>
          {title}
          <div className={styles.buttons}>
            <button className={clsx(!useStamp && styles.inactive)}>
              <StampIcon />
            </button>
            <button className={clsx(!useQuestion && styles.inactive)}>
              <QuestionIcon />
            </button>
          </div>
        </div>
        <div className={styles.description}>
          <ExtendedKanjiText text={content} />
        </div>
        {/* <div className="btn-stamp">
          <div className={useStamp ? 'stamp' : ''}>
            <span>{useStamp ? 'スタンプ' : ''}</span>
          </div>
          <div className={useQuestion ? 'question' : ''}>
            {useQuestion ? (
              <img src={'medal'} alt="medal-img" width="105%"></img>
            ) : (
              <span></span>
            )}
          </div>
        </div> */}
      </div>
    </Link>
  );
};
