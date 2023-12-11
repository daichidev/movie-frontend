import clsx from 'clsx';
import { useRef } from 'react';
import { ReactComponent as Camera } from '../../../../assets/svgs/camera.svg';
import { ReactComponent as Eraser } from '../../../../assets/svgs/eraser.svg';
import { ReactComponent as EraserAll } from '../../../../assets/svgs/eraser_all.svg';
import { ReactComponent as Keyboard } from '../../../../assets/svgs/keyboard.svg';
import { ReactComponent as Pen } from '../../../../assets/svgs/pen.svg';
import { ReactComponent as PenAlt } from '../../../../assets/svgs/pen_alt.svg';
import { ReactComponent as PenWhite } from '../../../../assets/svgs/pen_white.svg';
import { ReactComponent as ToiBox } from '../../../../assets/svgs/toi_box.svg';
import Canvas, {
  CanvasOperation,
  PlotEventType,
} from '../../../../components/DrawingCanvas';
import { PrimaryButton } from '../../../../components/Elements/Button';
import styles from './styles.module.scss';

const ANSWER_MAX_LENGTH = 150;
export type InputMode = 'keyboard' | 'touch';
export type QuestionBoardProps = {
  question: string;
  inputMode: InputMode | undefined;
  setInputMode: (mode: InputMode | undefined) => void;
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
export const QuestionBoard = ({
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
                maxLength={ANSWER_MAX_LENGTH}
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
              <SubmitControl
                inputMode={inputMode}
                answerText={answerText}
                submit={submit}
              />
            )}
          </div>
        </div>
        {inputMode && (
          <InputControl inputMode={inputMode} setInputMode={setInputMode} />
        )}
        {inputMode === 'touch' && (
          <TouchControl handler={canvasHandler.current} />
        )}
      </div>
      {inputMode && (
        // TODO きろくする と けってい/決定 の違いはなにか？
        <PrimaryButton className={styles.save} onClick={submit}>
          <Camera />
          きろくする
        </PrimaryButton>
      )}
    </>
  );
};

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

const InputControl = ({
  inputMode,
  setInputMode,
}: {
  inputMode: InputMode;
  setInputMode: (inputMode: InputMode) => void;
}) => (
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
        styles.keyboard,
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
        styles.touch,
        inputMode === 'touch' && styles.active,
      )}
    >
      <PrimaryButton onClick={() => setInputMode('touch')}>
        <PenAlt />
        <ruby>
          手<rt>て</rt>書<rt>が</rt>
        </ruby>
        き
      </PrimaryButton>
    </div>
  </div>
);

const TouchControl = ({
  handler,
}: {
  handler: CanvasOperation | undefined;
}) => (
  <div className={styles['touch-control']}>
    <PrimaryButton onClick={() => handler?.clear()} disabled={!handler}>
      <EraserAll />
      ぜんぶけす
    </PrimaryButton>
    <PrimaryButton onClick={() => handler?.back()} disabled={!handler}>
      <Eraser />
      ひとつけす
    </PrimaryButton>
  </div>
);

const SubmitControl = ({
  inputMode,
  answerText,
  submit,
}: {
  inputMode: InputMode;
  answerText: string;
  submit: VoidFunction;
}) => (
  <div className={styles['submit-control']}>
    {inputMode === 'keyboard' ? (
      <>
        <div className={styles.counter}>
          {answerText.length}
          <ruby>
            字<rt>じ</rt>
          </ruby>
          ／{ANSWER_MAX_LENGTH}
          <ruby>
            字<rt>じ</rt>
          </ruby>
        </div>
        <PrimaryButton onClick={submit}>
          <ruby>
            決<rt>けっ</rt>定<rt>てい</rt>
          </ruby>
        </PrimaryButton>
      </>
    ) : (
      <PrimaryButton onClick={submit}>けってい</PrimaryButton>
    )}
  </div>
);
