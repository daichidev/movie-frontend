import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { ReactComponent as QuestionIcon } from '../../../../assets/svgs/question.svg';
import { ReactComponent as StampIcon } from '../../../../assets/svgs/stamp.svg';
import { ExtendedKanjiText } from '../../../../components/Elements/CustomText';
import styles from './styles.module.scss';
import { useVideoCard } from './useVideoCard';

type VideoCardProps = {
  videoId: string;
  gradeId: string | number | undefined;
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
      to={disabled ? '' : to}
    >
      <div className={styles.content}>
        <div className={styles.title}>
          {title}
          <div className={styles.icons}>
            <div className={clsx(!useStamp && styles.inactive)}>
              <StampIcon />
            </div>
            <div className={clsx(!useQuestion && styles.inactive)}>
              <QuestionIcon />
            </div>
          </div>
        </div>
        <div className={styles.description}>
          <ExtendedKanjiText text={content} />
        </div>
      </div>
    </Link>
  );
};
