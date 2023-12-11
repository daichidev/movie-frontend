import { default as JsxParser } from 'html-react-parser';
import { PrimaryLink } from '../../../components/Elements/Button';
import { convertRuby } from '../../../config';
import styles from '../styles.module.scss';

export const LevelButton = ({ level }) => (
  <PrimaryLink to={`/videos/${level}`}>
    <span className={styles.grade}>{level}</span>
    <span>{level === 1 ? 'ねん' : JsxParser(convertRuby(`年《ねん》`))}</span>
  </PrimaryLink>
);
