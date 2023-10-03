export const dummyVideoData = [
  {
    id: 1,
    title: "はるの おとずれと フキノトウ",
    content:
      "はるの おとずれを かんじさせる しょくぶつ、フキノトウと タケノコを しょうかいします。",
    useStamp: true,
    useQuestion: false,
  },
  {
    id: 2,
    title: "たんぽぽの ひみつ",
    content:
      "たんぽぽが 花を さかせてから たねになるまでの ようすを しょうかいします。",
    useStamp: true,
    useQuestion: true,
  },
  {
    id: 3,
    title: "どうぶつ園の じゅういの しごと",
    content:
      "どうぶつ園の じゅういさんは、 まいにち どうぶつと むきあって、 どのようなしごとをしているのでしょうか。 {甲*こう*}{府*ふ*}{市*し*}の {遊*ゆう*}{亀*き*}{公*こう*}{園*えん*}{付*ふ*}{属*ぞく*}どうぶつ園の {秋*あき*}{山*やま*}さんの しごとを しょうかいします。",
    useStamp: false,
    useQuestion: false,
  },
  {
    id: 4,
    title: "はるの おとずれと フキノトウ",
    content:
      "はるの おとずれを かんじさせる しょくぶつ、フキノトウと タケノコを しょうかいします。",
    useStamp: false,
    useQuestion: false,
  },
  {
    id: 5,
    title: "はるの おとずれと フキノトウ",
    content:
      "はるの おとずれを かんじさせる しょくぶつ、フキノトウと タケノコを しょうかいします。",
    useStamp: false,
    useQuestion: false,
  },
];

export const dummyVideoDataForClassic = [
  {
    id: 1,
    title: "万葉集",
    content:
      "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    useStamp: true,
    useQuestion: false,
    isClassic: true,
    classicType: "和歌",
  },
  {
    id: 2,
    title: "古今和哥集",
    content:
      "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    useStamp: true,
    useQuestion: true,
    isClassic: true,
    classicType: "和歌",
  },
  {
    id: 3,
    title: "江戸俳句",
    content:
      "••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    useStamp: false,
    useQuestion: false,
    isClassic: true,
    classicType: "俳句",
  },
  {
    id: 4,
    title: "万葉集",
    content:
      "•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    useStamp: false,
    useQuestion: false,
    isClassic: true,
    classicType: "和歌",
  },
  {
    id: 5,
    title: "万葉集",
    content:
      "•••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    useStamp: false,
    useQuestion: false,
    isClassic: true,
    classicType: "和歌",
  },
];
export const dummyWordData = [
  "ちえ",
  "しぼむ",
  "やがて",
  "ちえ",
  "しぼむ",
  "やがて",
  "ちえ",
  "しぼむ",
  "やがて",
  "ちえ",
  "しぼむ",
  "やがて",
  "ちえ",
  "しぼむ",
  "やがて",
  "ちえ",
  "しぼむ",
  "やがて",
];
export const dummyClassData = [
  "1年 1組",
  "1年 2組",
  "2年 1組",
  "2年 2組",
  "3年 1組",
  "3年 2組",
  "4年 1組",
  "4年 2組",
  "5年 1組",
  "5年 2組",
  "6年 1s組",
  "6年 2組",
];
export const isNumber = (value) => {
  return typeof value === "number" && !isNaN(value);
};
export const isKanji = (char) => {
  const code = char.charCodeAt(0);
  return code >= 0x4c00 && code <= 0x9faf;
};

const _tagProcessor = (values) => {
  let processed = "";
  for (const value of values) {
    const splitted = value.split("《");
    if (splitted.length === 1) {
      processed += splitted[0];
    } else {
      const kanji = splitted[0];
      const rubyChunk = splitted[1];
      const evened = rubyChunk.replaceAll(" ", "　");
      const rubies = evened.split("　");
      if (kanji.length === rubies.length) {
        const qty = rubies.length;
        for (let index = 0; index < qty; index++) {
          processed += `<ruby>${kanji[index]}<rt class="optional">${rubies[index]}</rtstyle=></ruby>`;
        }
      } else {
        processed += `<ruby>${kanji}<rt class="optional">${rubies.join()}</rt></ruby>`;
      }
    }
  }
  return processed;
};

export const convertRuby = (val) => {
  const boxes = [];
  const splitted = val.split("〓");
  for (const element of splitted) {
    const twoStaged = element.split("》");
    for (const element of twoStaged) {
      boxes.push(element);
    }
  }
  return _tagProcessor(boxes);
};
