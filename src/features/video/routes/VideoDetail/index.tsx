import clsx from 'clsx';
import { ReactNode, useRef, useState } from 'react';
import { ReactComponent as Camera } from '../../../../assets/svgs/camera.svg';
import { ReactComponent as Dictionary } from '../../../../assets/svgs/dictionary.svg';
import { ReactComponent as Eraser } from '../../../../assets/svgs/eraser.svg';
import { ReactComponent as EraserAll } from '../../../../assets/svgs/eraser_all.svg';
import { ReactComponent as Keyboard } from '../../../../assets/svgs/keyboard.svg';
import { ReactComponent as Pen } from '../../../../assets/svgs/pen.svg';
import { ReactComponent as PenAlt } from '../../../../assets/svgs/pen_alt.svg';
import { ReactComponent as PenWhite } from '../../../../assets/svgs/pen_white.svg';
import { ReactComponent as StampNormal } from '../../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../../assets/svgs/star.svg';
import { ReactComponent as Timer } from '../../../../assets/svgs/timer.svg';
import { ReactComponent as ToiBox } from '../../../../assets/svgs/toi_box.svg';
import { CustomPlayer } from '../../../../components/CustomPlayer';
import { Layout } from '../../../../components/Layout';
import { useAuthContext } from '../../../../utils/auth/middleware/auth/AuthContext';
import { BarChartModal } from '../../component/BarChartModal';
import {
  QuestionEditorModal,
  QuestionEditorModalProps,
} from '../../component/QuestionEditorModal';
import {
  MOCK_MY_STAMPS,
  MOCK_STAMP_CHART_DATA,
  StampType,
} from '../../component/StampBarChart';
import { WordModal } from '../../component/WordModal';
import Canvas, { CanvasOperation, PlotEventType } from './canvas';
import styles from './styles.module.scss';
import { useVideoDetail } from './useVideoDetail';

export const VideoDetail = () => {
  const auth = useAuthContext();
  const isTeacher = auth.isTeacher?.() || false;

  const {
    videoRef,
    videoURL,

    openWordModal,
    closeWordModal,
    word,

    normalCount,
    goodCount,
    bestCount,
    handleNormalClick,
    handleGoodClick,
    handleBestClick,

    answerText,
    setAnswerText,
    answerDrawing,
    setAnswerDrawing,

    showQuestionModal,
    openQuestionModal,
    closeQuestionModal,

    ...values
  } = useVideoDetail();
  const wordsData = (values.wordsData || []) as {
    id: string;
    word_text: string;
  }[];
  const inputMode = values.inputMode as QuestionBoardProps['inputMode'];
  const setInputMode =
    values.setInputMode as QuestionBoardProps['setInputMode'];

  const [showStampBarChartModal, setShowStampBarChartModal] = useState(false);

  // TODO 回答保存・文字認識周りの処理
  const submitAnswer = async (data: {
    mode: 'keyboard' | 'touch';
    text: string;
    drawing: PlotEventType[];
  }) => {};

  // TODO 「問い」更新周りのサーバー連携
  const saveQuestion = async (data: {
    gradeId: number;
    class: string;
    question: string;
  }) => {};
  const questionByClass: QuestionEditorModalProps['questionsByClass'] = [
    {
      gradeId: 2,
      class: '1組',
      question: 'どうがを見て、どんなことを思いましたか。',
    },
    {
      gradeId: 2,
      class: '2組',
      question: 'どうがを見て、どんなことを思いませんでしたか。',
    },
  ];
  const defaultQuestion =
    'どうがを見て、どんなことを思いましたか。\n書いてみましょう。';
  const question = values.question || defaultQuestion;

  // TODO stamp周りのサーバー連携
  const classes = isTeacher
    ? [
        { gradeId: 2, class: '1' },
        { gradeId: 2, class: '2' },
        { gradeId: 2, class: '3' },
      ]
    : [];
  const [classIndex, setClassIndex] = useState(0);
  const stampChartData = MOCK_STAMP_CHART_DATA;
  const myStamps = MOCK_MY_STAMPS;
  const submitDeleteStamps = async (time: number, stamps: StampType[]) => {};

  return (
    <>
      <Layout className={styles.main}>
        <div className={clsx(styles.body, inputMode && styles.inputting)}>
          <div className={styles.video}>
            <div className={styles['player-container']}>
              <p>どうがを みて、かんじた きもちの ボタンを おしましょう。</p>
              <div className={styles.row}>
                <div className={styles.player}>
                  <CustomPlayer
                    ref={videoRef}
                    url={videoURL}
                    id="MainPlay"
                    width="100%"
                    height="100%"
                  />
                </div>
                <div className={styles.stamps}>
                  <Stamp
                    label={'もっと\nしりたい'}
                    Icon={<StampNormal />}
                    count={normalCount}
                    onClick={handleNormalClick}
                  />
                  <Stamp
                    label={'なるほど'}
                    Icon={<StampGood />}
                    count={goodCount}
                    onClick={handleGoodClick}
                  />
                  <Stamp
                    label={'みんなに\nつたえたい'}
                    Icon={<StampBest />}
                    count={bestCount}
                    onClick={handleBestClick}
                  />
                  <button
                    className={styles.timer}
                    onClick={() => setShowStampBarChartModal(true)}
                  >
                    <Timer />
                    <div>{`スタンプを\nおした じかん`}</div>
                  </button>
                </div>
              </div>
            </div>
            <div className={styles.words}>
              <WordsInstruction />
              <div className={styles['list-container']}>
                <ul className={styles['words-list']}>
                  {wordsData.map(({ id, word_text }) => (
                    <li key={id}>
                      <button onClick={() => openWordModal(word_text)}>
                        {word_text}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <QuestionBoard
            question={question}
            inputMode={inputMode}
            setInputMode={setInputMode}
            answerText={answerText}
            setAnswerText={setAnswerText}
            answerDrawing={answerDrawing}
            setAnswerDrawing={
              setAnswerDrawing as QuestionBoardProps['setAnswerDrawing']
            }
            submitAnswer={submitAnswer}
            editQuestion={openQuestionModal}
            isTeacher={isTeacher}
          />
        </div>
        <BarChartModal
          isOpen={showStampBarChartModal}
          onClose={() => setShowStampBarChartModal(false)}
          data={stampChartData}
          myStamps={myStamps}
          submitDeleteStamp={submitDeleteStamps}
          classes={classes}
          classIndex={classIndex}
          setClassIndex={setClassIndex}
        />
      </Layout>
      <WordModal wordHtml={word} onClose={closeWordModal} />
      <QuestionEditorModal
        isOpen={showQuestionModal}
        onClose={closeQuestionModal}
        submit={saveQuestion}
        questionsByClass={questionByClass}
        defaultQuestion={defaultQuestion}
      />
    </>
  );
};

const MAX_LENGTH = 150;
type QuestionBoardProps = {
  question: string;
  inputMode: undefined | 'keyboard' | 'touch';
  setInputMode: (mode: undefined | 'keyboard' | 'touch') => void;
  answerText: string;
  setAnswerText: (answerText: string) => void;
  answerDrawing: PlotEventType[];
  setAnswerDrawing: (drawing: PlotEventType[]) => void;
  submitAnswer: (data: {
    mode: 'keyboard' | 'touch';
    text: string;
    drawing: PlotEventType[];
  }) => void;
  isTeacher: boolean;
  editQuestion: () => void;
};
const QuestionBoard = ({
  question,
  inputMode,
  setInputMode,
  answerText,
  setAnswerText,
  answerDrawing,
  setAnswerDrawing,
  submitAnswer,
  isTeacher,
  editQuestion,
}: QuestionBoardProps) => {
  const canvasHandler = useRef<CanvasOperation | undefined>();

  const submit = async () => {
    if (!inputMode) return;
    await submitAnswer({
      mode: inputMode,
      text: answerText,
      drawing: answerDrawing,
    });
    setInputMode(undefined);
  };

  return (
    <>
      <div
        className={clsx(
          styles.question,
          inputMode === 'touch' && styles['active-touch'],
        )}
      >
        <div className={clsx(styles.container)}>
          <ToiBoxInstruction
            question={question}
            isTeacher={isTeacher}
            editQuestion={editQuestion}
          />
          <div className={clsx(styles.form, inputMode && styles.inputting)}>
            {inputMode === 'touch' || answerDrawing?.length ? (
              <Canvas
                onEndDraw={setAnswerDrawing}
                width={1440}
                height={408}
                top={0}
                left={0}
                phase={0}
                functionListener={(handler) =>
                  (canvasHandler.current = handler)
                }
                plotEvents={answerDrawing || []}
              />
            ) : (
              <textarea
                placeholder="「問いボックスにかいとうする」のボタンをおして、書いてみよう。"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                maxLength={MAX_LENGTH}
                disabled={!inputMode}
              />
            )}
            {!inputMode &&
              (answerText || answerDrawing?.length ? (
                <button
                  className={styles.rewrite}
                  onClick={() =>
                    setInputMode(answerDrawing ? 'touch' : 'keyboard')
                  }
                >
                  <PenWhite />
                  かきなおす
                </button>
              ) : (
                <button
                  className={styles.large}
                  onClick={() => setInputMode('keyboard')}
                >
                  <Pen />
                  <ruby>
                    問<rt>と</rt>
                  </ruby>
                  いボックスにかいとうする
                </button>
              ))}
            {inputMode && (
              <div className={styles['submit-control']}>
                {inputMode === 'keyboard' ? (
                  <>
                    <div className={styles.counter}>
                      {answerText.length}
                      <ruby>
                        字<rt>じ</rt>
                      </ruby>
                      ／{MAX_LENGTH}
                      <ruby>
                        字<rt>じ</rt>
                      </ruby>
                    </div>
                    <button onClick={submit}>
                      <ruby>
                        決<rt>けっ</rt>定<rt>てい</rt>
                      </ruby>
                    </button>
                  </>
                ) : (
                  <button onClick={submit}>けってい</button>
                )}
              </div>
            )}
          </div>
        </div>
        {inputMode && (
          <div
            className={clsx(
              styles['input-control'],
              inputMode === 'keyboard' && styles['active-keyboard'],
              inputMode === 'touch' && styles['active-touch'],
            )}
          >
            <div
              className={clsx(
                styles['button-container'],
                inputMode === 'keyboard' && styles.active,
              )}
            >
              <button onClick={() => setInputMode('keyboard')}>
                <Keyboard />
                キーボード
              </button>
            </div>
            <div
              className={clsx(
                styles['button-container'],
                inputMode === 'touch' && styles.active,
              )}
            >
              <button onClick={() => setInputMode('touch')}>
                <PenAlt />
                <ruby>
                  手<rt>て</rt>書<rt>が</rt>
                </ruby>
                き
              </button>
            </div>
          </div>
        )}
        {inputMode === 'touch' && (
          <div className={styles['touch-control']}>
            <button
              onClick={() => {
                canvasHandler.current?.clear();
              }}
            >
              <EraserAll />
              ぜんぶけす
            </button>
            <button
              onClick={() => {
                canvasHandler.current?.back();
              }}
            >
              <Eraser />
              ひとつけす
            </button>
          </div>
        )}
      </div>
      {inputMode && (
        // TODO きろくする と けってい/決定 の違いはなにか？
        <button className={styles.save} onClick={submit}>
          <Camera />
          きろくする
        </button>
      )}
    </>
  );
};

type StampProps = {
  label: string;
  Icon: ReactNode;
  onClick?: () => void;
  count?: number;
  disabled?: boolean;
  submitting?: boolean;
};
const Stamp = ({
  label,
  Icon,
  count = 0,
  onClick,
  disabled,
  submitting,
}: StampProps) => {
  return (
    <div className={styles.stamp}>
      <button
        className={clsx(submitting && styles.submitting)}
        onClick={onClick}
        disabled={disabled}
      >
        {label}
        {Icon}
      </button>
      <div className={styles.stars}>
        {Array.from({ length: 3 }, (_, i) => (
          <Star key={i} className={clsx(count > i && styles.active)} />
        ))}
      </div>
    </div>
  );
};

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

const ToiBoxInstruction = ({
  question,
  isTeacher,
  editQuestion,
}: {
  question: string;
  isTeacher: boolean;
  editQuestion: () => void;
}) => (
  <div className={styles.instruction}>
    <div>
      <ToiBox />
      <div>
        <ruby>
          問<rt>と</rt>
        </ruby>
        いボックス
      </div>
    </div>
    <p>{question}</p>
    {isTeacher && (
      <button className={styles['edit-question']} onClick={editQuestion}>
        <div>教師用</div>
        <div>{`問いを\n編集する`}</div>
      </button>
    )}
  </div>
);
