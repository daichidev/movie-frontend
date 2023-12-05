import { Link } from 'react-router-dom';
import { ExtendedKanjiText } from '../../../components/Elements/CustomText';

export const ClassicButton = ({ content }) => {
  return (
    <Link to={`/videos/${content}`}>
      <span>
        <ExtendedKanjiText text={content}></ExtendedKanjiText>
      </span>
    </Link>
  );

  // return (
  //   <Link to={`/videos/${content}`} className="btn-level">
  //     <span>{JsxParser(convertRuby(content))}</span>
  //   </Link>
  // );
};
