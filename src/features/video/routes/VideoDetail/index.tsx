import clsx from 'clsx';
import { ReactNode } from 'react';
import ReactPlayer from 'react-player';
import { ReactComponent as Dictionary } from '../../../../assets/svgs/dictionary.svg';
import { ReactComponent as Pen } from '../../../../assets/svgs/pen.svg';
import { ReactComponent as StampNormal } from '../../../../assets/svgs/stamp1.svg';
import { ReactComponent as StampGood } from '../../../../assets/svgs/stamp2.svg';
import { ReactComponent as StampBest } from '../../../../assets/svgs/stamp3.svg';
import { ReactComponent as Star } from '../../../../assets/svgs/star.svg';
import { ReactComponent as Timer } from '../../../../assets/svgs/timer.svg';
import { ReactComponent as ToiBox } from '../../../../assets/svgs/toi_box.svg';
import { Layout } from '../../../../components/Layout/Layout';
import styles from './styles.module.scss';
import { useVideoDetail } from './useVideoDetail';

export const VideoDetail = () => {
  const {
    videoRef,
    videoURL,
    openWordModal,
    normalCount,
    goodCount,
    bestCount,
    handleNormalClick,
    handleGoodClick,
    handleBestClick,
    inputSel,
    setInputSel,
    ...values
  } = useVideoDetail();
  const wordsData = (values?.wordsData || []) as {
    id: string;
    word_text: string;
  }[];
  return (
    <Layout className={styles.main}>
      <div className={styles.body}>
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
        <div className={styles.question}>
          <div className={styles.container}>
            <ToiBoxInstruction />
            {/* TODO　処理実装 */}
            <div className={styles.form}>
              <textarea
                disabled={!inputSel}
                placeholder="「問いボックスにかいとうする」のボタンをおして、書いてみよう。"
              />
              {!inputSel && (
                <button onClick={() => setInputSel(true)}>
                  <Pen />
                  <ruby>
                    問<rt>と</rt>
                  </ruby>
                  いボックスにかいとうする
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
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
