import { useSelector } from 'react-redux';

export const useVideoCard = ({ videoId, gradeId }) => {
  let useStamp = false;
  let useQuestion = false;
  const to = `/videos/detail/${videoId}/${gradeId}`;

  const videoState = useSelector((state) => state.videos[videoId]);
  console.log('videostate: ', videoState);

  let normalCount = 0;
  let goodCount = 0;
  let bestCount = 0;
  if (videoState === undefined || videoState === null) {
    normalCount = 0;
    goodCount = 0;
    bestCount = 0;
  } else {
    if ('normalCount' in videoState) {
      normalCount = videoState.normalCount && videoState.normalCount;
    }
    if ('goodCount' in videoState) {
      goodCount = videoState.goodCount && videoState.goodCount;
    }
    if ('bestCount' in videoState) {
      bestCount = videoState.bestCount && videoState.bestCount;
    }
    if ('question' in videoState) {
      videoState.question !== '' ? (useQuestion = true) : (useQuestion = false);
    }
  }

  let flag = normalCount + goodCount + bestCount;
  console.log('flag', flag);
  flag === 0 ? (useStamp = false) : (useStamp = true);

  // TODO 非活性の場合？ ref: https://www.figma.com/file/EmTH8Qq5a1eIYJaDzk4Boo/%E3%83%88%E3%83%A2%E3%83%97%E3%83%A9-%E2%91%A3%E6%98%A0%E5%83%8F%E8%B3%87%E6%96%99?node-id=2113%3A6338&mode=dev
  const disabled = false;
  return {
    to,
    useStamp,
    useQuestion,
    disabled,
  };
};
