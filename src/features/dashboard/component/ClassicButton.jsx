import { Link } from "react-router-dom";
import { ExtendedKanjiText } from "../../../components/Elements/CustomText";
import { default as JsxParser } from "html-react-parser";
import { convertRuby } from "../../../config";

export const ClassicButton = ({ content }) => {
  return (
    <Link to={`/videos/${content}`} className="btn-level">
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
