import { Link } from 'react-router-dom';
import { buttonStyles } from '../../../components/Elements/Button';
import { ExtendedKanjiText } from '../../../components/Elements/CustomText';

export const ClassicButton = ({ content }) => (
  <Link className={buttonStyles.primary} to={`/videos/${content}`}>
    <span>
      <ExtendedKanjiText text={content}></ExtendedKanjiText>
    </span>
  </Link>
);
