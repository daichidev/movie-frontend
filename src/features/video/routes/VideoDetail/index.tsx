import clsx from 'clsx';
import { ReactNode, useRef } from 'react';
import ReactPlayer from 'react-player';
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
import { Layout } from '../../../../components/Layout/Layout';
import { WordModal } from '../../component/WordModal';
import Canvas, { CanvasOperation, PlotEventType } from './canvas';
import styles from './styles.module.scss';
import { useVideoDetail } from './useVideoDetail';

export const VideoDetail = () => {
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

    ...values
  } = useVideoDetail();
  const wordsData = (values.wordsData || []) as {
    id: string;
    word_text: string;
  }[];
  const inputMode = values.inputMode as QuestionBoardProps['inputMode'];
  const setInputMode =
    values.setInputMode as QuestionBoardProps['setInputMode'];
  return (
    <>
      <Layout className={styles.main}>
        <div className={clsx(styles.body, inputMode && styles.inputting)}>
          <div className={styles.video}>
            <div className={styles['player-container']}>
              <p>どうがを みて、かんじた きもちの ボタンを おしましょう。</p>
              <div className={styles.row}>
                <div className={styles.player}>
                  {/* TODO　操作部のスタイル */}
                  <ReactPlayer
                    ref={videoRef}
                    url={videoURL}
                    id="MainPlay"
                    loop
                    controls={true}
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
                  {/* TODO 処理実装 */}
                  <div className={styles.timer}>
                    <Timer />
                    <div>{`スタンプを\nおした じかん`}</div>
                  </div>
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
            inputMode={inputMode}
            setInputMode={setInputMode}
            answerText={answerText}
            setAnswerText={setAnswerText}
            answerDrawing={answerDrawing}
            setAnswerDrawing={
              setAnswerDrawing as QuestionBoardProps['setAnswerDrawing']
            }
          />
        </div>
      </Layout>
      <WordModal wordHtml={word} onClose={closeWordModal} />
    </>
  );
};

const MAX_LENGTH = 150;
type QuestionBoardProps = {
  inputMode: undefined | 'keyboard' | 'touch';
  setInputMode: (mode: undefined | 'keyboard' | 'touch') => void;
  answerText: string;
  setAnswerText: (answerText: string) => void;
  answerDrawing: PlotEventType[];
  setAnswerDrawing: (drawing: PlotEventType[]) => void;
};
const QuestionBoard = ({
  inputMode,
  setInputMode,
  answerText,
  setAnswerText,
  answerDrawing,
  setAnswerDrawing,
}: QuestionBoardProps) => {
  const canvasHandler = useRef<CanvasOperation | undefined>();

  const submit = () => {
    // TODO
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
          <ToiBoxInstruction />
          <div className={clsx(styles.form, inputMode && styles.inputting)}>
            {inputMode === 'touch' || answerDrawing?.length ? (
              <Canvas
                onEndDraw={setAnswerDrawing}
                width={1440}
                height={398}
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
            {/* TODO onClick */}
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
        {/* TODO onClick */}
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
        // TODO onClick
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

const ToiBoxInstruction = () => (
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
    <p>
      どうがを
      <ruby>
        見<rt>み</rt>
      </ruby>
      て、どんなことを{' '}
      <ruby>
        思<rt>おも</rt>
      </ruby>
      いましたか。
      <br />
      <ruby>
        書<rt>か</rt>
      </ruby>
      いてみましょう。
    </p>
  </div>
);
