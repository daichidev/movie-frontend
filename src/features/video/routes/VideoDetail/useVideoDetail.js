import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { KanjiText } from '../../../../components/Elements/CustomText';
import {
  setVideoBestCount,
  setVideoGoodCount,
  setVideoNormalCount,
} from '../../../../stores/store';
import '../../../../styles/video/detail/index.scss';
import {
  useCreateStampMutation,
  useGetWordsQuery,
} from '../../../api/api-slice';

export const useVideoDetail = () => {
  const dispatch = useDispatch();

  const { videoId, gradeId } = useParams();
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [word, setWord] = useState('');
  const [chpList, setChpList] = useState(false);
  const [stmpList, setStmpList] = useState(false);
  const [stmpClear, setStmpClear] = useState(false);
  const [inputSel, setInputSel] = useState(false);
  const [stmpGraph, setStmpGraph] = useState(false);
  const [stampHeaderStr, setStampHeaderStr] = useState(null);
  const [videoURL, setVideoURL] = useState('');
  const [wordId, setWordId] = useState('');

  const [normalCount, setNormalCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [bestCount, setBestCount] = useState(0);

  const [normalStamps, setNormalStamps] = useState([]);
  const [goodStamps, setGoodStamps] = useState([]);
  const [bestStamps, setBestStamps] = useState([]);

  const videoState = useSelector((state) => state.videos[videoId]);

  const { data: wordsData, isLoading } = useGetWordsQuery(wordId);
  console.log('wordsData', wordsData);

  const [createStamp, { isLoading: stampLoading, isError }] =
    useCreateStampMutation();

  useEffect(() => {
    if (videoState) {
      setNormalCount(videoState.normalCount);
      setGoodCount(videoState.goodCount);
      setBestCount(videoState.bestCount);

      setNormalStamps(videoState.normalStamps);
      setGoodStamps(videoState.goodStamps);
      setBestStamps(videoState.bestStamps);
    }
    let params = {
      grade_id: gradeId,
      unit_id: videoId,
      category_id: 2,
    };
    const url =
      'http://video-streaming-api.mastercode.jp:8000/videos/get_video';
    const queryParams = new URLSearchParams(params);
    const endpoint = `${url}?${queryParams}`;
    fetch(endpoint)
      .then((response) => {
        if (response.ok) {
          console.log('response', response);
          return response.json();
        }
        throw new Error('Network response was not ok');
      })
      .then((data) => {
        console.log('Get Video successful:', data);
        setVideoURL(data.video_url);
        setWordId(data.video_id);
      })
      .catch((error) => {
        console.error('Get Video error:', error);
      });
  }, []);

  // useEffect(() => {
  //   saveStamps()
  // }, [videoState])

  const saveStamps = async () => {
    const formData = new FormData();

    if (videoState.question !== undefined) {
      formData.append('question', videoState.question);
    }
    if (videoState.normalStamps !== undefined) {
      videoState.normalStamps.forEach((stamp, index) => {
        formData.append('normal_stamps', stamp);
      });
    }
    if (videoState.goodStamps !== undefined) {
      videoState.goodStamps.forEach((stamp, index) => {
        formData.append('good_stamps', stamp);
      });
    }
    if (videoState.bestStamps !== undefined) {
      videoState.bestStamps.forEach((stamp, index) => {
        formData.append('best_stamps', stamp);
      });
    }
    console.log('formData', formData, 'videoState', videoState);
    const result = await createStamp(formData);
  };

  const textRef = useRef(null);
  const chapterRef = useRef(null);
  const videoRef = useRef(null);

  const openQuestionModal = () => {
    setShowQuestionModal(true);
  };

  const closeQuestionModal = () => {
    setShowQuestionModal(false);
  };

  const openWordModal = (word) => {
    setShowWordModal(true);
    getWordId(word);
    // setWord(word);
  };

  const closeWordModal = () => {
    setShowWordModal(false);
    setWord('');
  };

  const closeStmpClearModal = () => {
    setStmpClear(false);
  };

  const clearStmpModal = () => {
    dispatch(setVideoNormalCount({ videoId: videoId, count: 0, stamps: [] }));
    dispatch(setVideoGoodCount({ videoId: videoId, count: 0, stamps: [] }));
    dispatch(setVideoBestCount({ videoId: videoId, count: 0, stamps: [] }));

    setNormalCount(0);
    setGoodCount(0);
    setBestCount(0);

    setNormalStamps([]);
    setGoodStamps([]);
    setBestStamps([]);
  };

  const closeInputSelModal = () => {
    setInputSel(false);
  };

  const handleStamps = (self) => {
    setChpList(false);
    self ? setStmpList(true) : setStmpGraph(true);
    let headerStr = self ? (
      <>
        <span>
          <KanjiText title={'自'} pronun={'じ'} />
          <KanjiText title={'分'} pronun={'ぶん'} />
          がスタンプをおした
          <KanjiText title={'時'} pronun={'じ'} />
          <KanjiText title={'間'} pronun={'かん'} />
        </span>
      </>
    ) : (
      <>
        <span>
          クラスのみんながスタンブをおした
          <KanjiText title={'時'} pronun={'じ'} />
          <KanjiText title={'間'} pronun={'かん'} />
        </span>
      </>
    );
    setStampHeaderStr(headerStr);
  };

  const handleNormalClick = () => {
    if (normalCount < 3) {
      let payload = normalCount + 1;
      setNormalCount(payload);
      const currentTIme = getCurrentTime();
      console.log('currentTime', currentTIme);
      setNormalStamps([...normalStamps, currentTIme]);
      console.log('normalStamps', normalStamps);
      dispatch(
        setVideoNormalCount({
          videoId: videoId,
          count: payload,
          stamps: [...normalStamps, currentTIme],
        }),
      );
    }
  };

  const handleGoodClick = () => {
    if (goodCount < 3) {
      let payload = goodCount + 1;
      setGoodCount(payload);
      const currentTIme = getCurrentTime();
      setGoodStamps([...goodStamps, currentTIme]);
      dispatch(
        setVideoGoodCount({
          videoId: videoId,
          count: payload,
          stamps: [...goodStamps, currentTIme],
        }),
      );
    }
  };

  const handleBestClick = () => {
    if (bestCount < 3) {
      let payload = bestCount + 1;

      setBestCount(payload);
      const currentTIme = getCurrentTime();
      setBestStamps([...bestStamps, currentTIme]);
      dispatch(
        setVideoBestCount({
          videoId: videoId,
          count: payload,
          stamps: [...bestStamps, currentTIme],
        }),
      );
    }
  };

  const getCurrentTime = () => {
    const time = videoRef.current.getCurrentTime();
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    return `${hours.toString().padStart(2, 0)}:${minutes
      .toString()
      .padStart(2, 0)}:${seconds.toString().padStart(2, 0)}`;
  };

  const getWordId = (text) => {
    fetch(
      `https://mastercode.jp/apps/api/dictionary/search/?mode=esjp&search_word=${text}&search_mode=exact`,
      {
        method: 'GET',
      },
    )
      .then((response) => {
        if (response.ok) {
          console.log('getWordId', response);
          return response.json();
        }
        console.log('what is getWordId: ', response);

        throw new Error('getWordId response was not ok');
      })
      .then((data) => {
        console.log('getWordId successful:', data);

        let pattern = /showDetailUNI_(\d+)_search/;

        let matches = pattern.exec(data);

        if (matches) {
          let extractedNumber = matches[1];
          console.log(extractedNumber);
          getWordContent(extractedNumber);
        } else {
          console.log('No match found.');
        }
      })
      .catch((error) => {
        console.error('getWordId error:', error);
      });
  };

  const getWordContent = (id) => {
    fetch(
      `https://mastercode.jp/apps/api/dictionary/show_detail/?useruuid=AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH&mode=esjp&id=${id}&referrer=1&invoker=spread&discard_zoom=discard`,
      {
        method: 'GET',
      },
    )
      .then((response) => {
        if (response.ok) {
          console.log('getWordContent', response);
          return response.json();
        }
        console.log('what is getWordContent: ', response);

        throw new Error('getWordContent response was not ok');
      })
      .then((data) => {
        console.log('getWordContent successful:', data);
        let temp = data.arg1;
        setWord(temp);
      })
      .catch((error) => {
        console.error('getWordContent error:', error);
        setWord(error);
      });
  };

  return {
    videoRef,
    videoURL,

    normalCount,
    handleNormalClick,
    goodCount,
    handleGoodClick,
    bestCount,
    handleBestClick,
    // TODO
    wordsData,
    openWordModal,
    closeWordModal,
    word,

    inputSel,
    setInputSel,
  };
};
