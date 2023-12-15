import { Link } from 'react-router-dom';
import { buttonStyles } from '../../../components/Elements/Button';
import { ExtendedKanjiText } from '../../../components/Elements/CustomText';
import { useLearningHistory } from '../../../hooks/learning-history';

export const ClassicButton = ({ content }: { content: string }) => {
  const { post } = useLearningHistory();
  return (
    <Link
      className={buttonStyles.primary}
      to={`/videos/${content}`}
      onClick={() => post('genre_select', { genre: content })}
    >
      <span>
        <ExtendedKanjiText text={content}></ExtendedKanjiText>
      </span>
    </Link>
  );
};
