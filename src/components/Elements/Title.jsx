import { isNumber } from "../../config";
import { ExtendedKanjiText, KanjiText } from "./CustomText";

export const Title = ({ title }) => {
  const newTitle = parseInt(title);
  return (
    <div className="col-md-12 mt-5 title">
      <span>
        {isNumber(newTitle) ? (
          <>
            {newTitle}{" "}
            {newTitle === 1 ? (
              "ねん"
            ) : (
              <KanjiText title={"年"} pronun={"ねん"} />
            )}
          </>
        ) : (
          <ExtendedKanjiText text={title}></ExtendedKanjiText>
        )}
      </span>
    </div>
  );
};
