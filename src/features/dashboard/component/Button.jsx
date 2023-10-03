import { Link } from "react-router-dom";
import { KanjiText } from "../../../components/Elements/CustomText";
import { default as JsxParser } from "html-react-parser";
import { convertRuby } from "../../../config";

export const LevelButton = ({ level }) => {
  // return (
  //   <Link to={`/videos/${level}`} className="btn-level">
  //     <span>
  //       {level}{" "}
  //       {level === 1 ? "ねん" : <KanjiText title={"年"} pronun={"ねん"} />}
  //     </span>
  //   </Link>
  // );

  return (
    <Link to={`/videos/${level}`} className="btn-level">
      <span>
        {level === 1 ? "1ねん" : JsxParser(convertRuby(`${level}〓年《ねん》`))}
      </span>
    </Link>
  );
};
