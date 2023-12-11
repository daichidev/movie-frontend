import { PrimaryLink } from '../../../components/Elements/Button';
import { ExtendedKanjiText } from '../../../components/Elements/CustomText';

export const ClassicButton = ({ content }) => (
  <PrimaryLink to={`/videos/${content}`}>
    <span>
      <ExtendedKanjiText text={content}></ExtendedKanjiText>
    </span>
  </PrimaryLink>
);
