import { default as JsxParser } from 'html-react-parser';
import { Link } from 'react-router-dom';
import { convertRuby } from '../../../config';
import styles from '../styles.module.scss';

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
    <Link to={`/videos/${level}`}>
      <span className={styles.grade}>{level}</span>
      <span>{level === 1 ? 'ねん' : JsxParser(convertRuby(`年《ねん》`))}</span>
    </Link>
  );
};
