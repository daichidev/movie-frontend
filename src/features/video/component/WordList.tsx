import clsx from 'clsx';
import { ReactComponent as Dictionary } from '../../../assets/svgs/dictionary.svg';
import styles from './WordList.module.scss';

export type WordListProps = {
  className?: string;
  wordData: { id: string; word_text: string }[];
  openWordModal: (word: string) => void;
};
export const WordList = ({
  className,
  wordData,
  openWordModal,
}: WordListProps) => (
  <div className={clsx(className, styles['word-list'])}>
    <WordsInstruction />
    <div className={styles['list-container']}>
      <ul className={styles.list}>
        {wordData.map(({ id, word_text }) => (
          <li key={id}>
            <button onClick={() => openWordModal(word_text)}>
              {word_text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const WordsInstruction = () => (
  <div className={styles.instruction}>
    <div>
      どうがに
      <ruby>
        出<rt>で</rt>
      </ruby>
      てくる「ことば」
    </div>
    <div>
      <Dictionary />
      <div>
        <ruby>
          下<rt>した</rt>
        </ruby>
        のことばを おすと、
        <br />
        いみをたしかめることが できるよ。
      </div>
    </div>
  </div>
);
