import { Modal as MuiModal } from '@mui/material';
import { useEffect, useState } from 'react';
import { ReactComponent as Arrow } from '../../../assets/svgs/arrow.svg';
import { ReactComponent as ToiBox } from '../../../assets/svgs/toi_box.svg';
import { useLearningHistory } from '../../../hooks/learning-history';
import styles from './QuestionEditorModal.module.scss';

const QUESTION_MAX_LENGTH = 60;
export type QuestionEditorModalProps = {
  videoId: string;
  genre: string | number;
  onClose: () => void;
  isOpen: boolean;
  submit: (data: {
    gradeId: number;
    class: string;
    question: string;
  }) => Promise<void>;
  questionsByClass: {
    gradeId: number;
    class: string;
    question: string;
  }[];
  defaultQuestion: string;
};
export const QuestionEditorModal = ({
  videoId,
  genre,
  onClose,
  isOpen,
  submit,
  questionsByClass,
  defaultQuestion,
}: QuestionEditorModalProps) => {
  const { post: postLearningHistory } = useLearningHistory();
  const [classIndex, setClassIndex] = useState(0);
  const [question, setQuestion] = useState('');

  const setDefaultQuestion = () => setQuestion(defaultQuestion);
  const onSubmit = async () => {
    const selectedClass = questionsByClass[classIndex];
    await submit({ ...selectedClass, question });
    if (question === defaultQuestion) {
      postLearningHistory('toibox_question_reset', {
        movie_id: videoId,
        genre: `${genre}`,
      });
    } else {
      postLearningHistory('toibox_question_edit_save', {
        movie_id: videoId,
        genre: `${genre}`,
        question,
      });
    }
    onClose();
  };

  useEffect(() => {
    setQuestion(questionsByClass[classIndex]?.question ?? defaultQuestion);
  }, [classIndex]);
  return (
    <MuiModal open={isOpen} onClose={onClose}>
      <div
        className={styles.outer}
        onClick={() => {
          postLearningHistory('toibox_question_edit_cancel', {
            movie_id: videoId,
            genre: `${genre}`,
          });
          onClose();
        }}
      >
        <div className={styles.container} onClick={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles['select-container']}>
              <Arrow />
              <select
                id="select"
                value={classIndex}
                onChange={(e) => setClassIndex(+e.target.value)}
              >
                {questionsByClass?.map((element, i) => (
                  <option
                    key={element.class}
                    label={`${element.gradeId}年${element.class}`}
                    value={i}
                  >
                    {`${element.gradeId}年${element.class}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.body}>
            <div className={styles.content}>
              <div className={styles.question}>
                <div className={styles.icon}>
                  <ToiBox />
                  <div>
                    <ruby>
                      問<rt>と</rt>
                    </ruby>
                    いボックス
                  </div>
                </div>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  maxLength={QUESTION_MAX_LENGTH}
                />
                <div className={styles.counter}>
                  {question.length}字／{QUESTION_MAX_LENGTH}字
                </div>
              </div>
              <div className={styles.buttons}>
                <button onClick={setDefaultQuestion}>最初の問いに戻す</button>
                <button onClick={onSubmit}>変更する</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MuiModal>
  );
};
