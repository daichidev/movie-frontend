import { useParams } from "react-router-dom";
import { Header } from "../../../components/Header/Header";
import { MainLayout } from "../../../components/Layout";
import "../../../styles/video/detail/index.scss";
import StampNormalImg from "../../../assets/stamp1.png";
import StampGoodImg from "../../../assets/stamp2.png";
import StampBestImg from "../../../assets/stamp3.png";
import BookImg from "../../../assets/book.png";
import { StampButton } from "../component/StampButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNavicon } from "@fortawesome/free-solid-svg-icons";
import { CustomSpinner } from "../../upload/component/spinner";
import { dummyWordData } from "../../../config";
import { WordCard } from "../component/WordCard";
import { useEffect, useRef, useState } from "react";
import { QuestionModal } from "../../../components/Elements/QuestionModal";
import { WordModal } from "../../../components/Elements/WordModal";
import { Overlay } from "react-bootstrap";
import { ChapterButton } from "../component/ChapterButton";
import { StampCard } from "../component/StampCard";
import { StampModal } from "../../../components/Elements/StampModal";
import { InputSelectionModal } from "../../../components/Elements/InputSelectionModal";
import { BarChart } from "../component/BarChart";
import { KanjiText } from "../../../components/Elements/CustomText";
import ReactPlayer from "react-player";
import { default as JsxParser } from "html-react-parser";
import { useDispatch, useSelector } from "react-redux";
import { useGetWordsQuery } from "../../api/api-slice";
import { useCreateStampMutation } from "../../api/api-slice";
import {
  setVideoNormalCount,
  setVideoGoodCount,
  setVideoBestCount,
} from "../../../stores/store";

export const VideoDetail = () => {
  const dispatch = useDispatch();

  const { videoId, gradeId } = useParams();
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showWordModal, setShowWordModal] = useState(false);
  const [word, setWord] = useState("");
  const [chpList, setChpList] = useState(false);
  const [stmpList, setStmpList] = useState(false);
  const [stmpClear, setStmpClear] = useState(false);
  const [inputSel, setInputSel] = useState(false);
  const [stmpGraph, setStmpGraph] = useState(false);
  const [stampHeaderStr, setStampHeaderStr] = useState(null);
  const [videoURL, setVideoURL] = useState("");
  const [wordId, setWordId] = useState("");

  const [normalCount, setNormalCount] = useState(0);
  const [goodCount, setGoodCount] = useState(0);
  const [bestCount, setBestCount] = useState(0);

  const [normalStamps, setNormalStamps] = useState([]);
  const [goodStamps, setGoodStamps] = useState([]);
  const [bestStamps, setBestStamps] = useState([]);

  const videoState = useSelector((state) => state.videos[videoId]);

  const { data: wordsData, isLoading } = useGetWordsQuery(wordId);
  console.log("wordsData", wordsData);

  const [createStamp, { isLoading: stampLoading, isError }] = useCreateStampMutation();

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
    const url = "http://video-streaming-api.mastercode.jp:8000/videos/get_video";
    const queryParams = new URLSearchParams(params);
    const endpoint = `${url}?${queryParams}`;
    fetch(endpoint)
          .then((response) => {
            if (response.ok) {
              console.log("response", response);
              return response.json();
            }
            throw new Error("Network response was not ok");
          })
          .then((data) => {
            console.log("Get Video successful:", data);
            setVideoURL(data.video_url);
            setWordId(data.video_id);
          })  
          .catch((error) => {
            console.error("Get Video error:", error);
          });
  }, []);

  // useEffect(() => {
  //   saveStamps()
  // }, [videoState])

  const saveStamps = async () => {
    const formData = new FormData();
    
    if (videoState.question !== undefined) {
      formData.append("question", videoState.question);
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
    console.log("formData", formData, "videoState", videoState)
    const result = await createStamp(formData);
  }

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
    setWord("")
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
          <KanjiText title={"自"} pronun={"じ"} />
          <KanjiText title={"分"} pronun={"ぶん"} />
          がスタンプをおした
          <KanjiText title={"時"} pronun={"じ"} />
          <KanjiText title={"間"} pronun={"かん"} />
        </span>
      </>
    ) : (
      <>
        <span>
          クラスのみんながスタンブをおした
          <KanjiText title={"時"} pronun={"じ"} />
          <KanjiText title={"間"} pronun={"かん"} />
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
      console.log("currentTime", currentTIme);
      setNormalStamps([...normalStamps, currentTIme]);
      console.log("normalStamps", normalStamps);
      dispatch(
        setVideoNormalCount({
          videoId: videoId,
          count: payload,
          stamps: [...normalStamps, currentTIme],
        })
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
        })
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
        })
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
        method: "GET",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("getWordId", response);
          return response.json();
        }
        console.log("what is getWordId: ", response);

        throw new Error("getWordId response was not ok");
      })
      .then((data) => {
        console.log("getWordId successful:", data);

        let pattern = /showDetailUNI_(\d+)_search/;

        let matches = pattern.exec(data);

        if (matches) {
          let extractedNumber = matches[1];
          console.log(extractedNumber);
          getWordContent(extractedNumber);
        } else {
          console.log("No match found.");
        }
      })
      .catch((error) => {
        console.error("getWordId error:", error);
      });
  }

  const getWordContent = (id) => {
    fetch(
      `https://mastercode.jp/apps/api/dictionary/show_detail/?useruuid=AAAABBBBCCCCDDDDEEEEFFFFGGGGHHHH&mode=esjp&id=${id}&referrer=1&invoker=spread&discard_zoom=discard`,
      {
        method: "GET",
      }
    )
      .then((response) => {
        if (response.ok) {
          console.log("getWordContent", response);
          return response.json();
        }
        console.log("what is getWordContent: ", response);

        throw new Error("getWordContent response was not ok");
      })
      .then((data) => {
        console.log("getWordContent successful:", data);
        let temp = data.arg1
        setWord(temp)
      })
      .catch((error) => {
        console.error("getWordContent error:", error);
        setWord(error)
      });
  }

  return (
    <MainLayout>
      <Header />
      <div className="container video-detail">
        <div className="stamp">
          <div className="row">
            <div className="col-6">
              <StampButton
                StampImg={StampNormalImg}
                count={normalCount}
                onClick={handleNormalClick}
              ></StampButton>
              <StampButton
                StampImg={StampGoodImg}
                count={goodCount}
                onClick={handleGoodClick}
              ></StampButton>
              <StampButton
                StampImg={StampBestImg}
                count={bestCount}
                onClick={handleBestClick}
              ></StampButton>
              <div
                className="chapter"
                ref={chapterRef}
                onClick={() => {
                  setChpList(!chpList);
                  setStmpList(false);
                  setStmpGraph(false);
                }}
              >
                <FontAwesomeIcon icon={faNavicon}></FontAwesomeIcon>
              </div>
              <div className="overlay-list">
                <Overlay
                  show={chpList}
                  placement="right"
                  target={chapterRef.current}
                >
                  <div className="chapter-list">
                    <div className="chapter-header">
                      <span>スタンプをおした時間</span>
                    </div>
                    <div className="chapter-body">
                      <ChapterButton
                        children={
                          <span>
                            <KanjiText title={"自"} pronun={"じ"} />
                            <KanjiText title={"分"} pronun={"ぶん"} />
                            がスタンプをおした
                            <KanjiText title={"時"} pronun={"じ"} />
                            <KanjiText title={"間"} pronun={"かん"} />
                          </span>
                        }
                        onClick={() => handleStamps(true)}
                      />
                      <ChapterButton
                        children={
                          <>
                            <span>クラスのみんなが</span>
                            <br />
                            <span>
                              スタンブをおした
                              <KanjiText title={"時"} pronun={"じ"} />
                              <KanjiText title={"間"} pronun={"かん"} />
                            </span>
                          </>
                        }
                        onClick={() => handleStamps(false)}
                      />
                    </div>
                  </div>
                </Overlay>
                <Overlay
                  show={stmpList}
                  placement="right"
                  target={chapterRef.current}
                >
                  <div className="stamp-list">
                    <div className="stamp-header">
                      <span>{stampHeaderStr}</span>
                    </div>
                    <div className="stamp-body">
                      <div className="stampcard-list">
                        <StampCard
                          stampImg={StampNormalImg}
                          stampCount={normalCount}
                          stamps={normalStamps}
                        />
                        <StampCard
                          stampImg={StampGoodImg}
                          stampCount={goodCount}
                          stamps={goodStamps}
                        />
                        <StampCard
                          stampImg={StampBestImg}
                          stampCount={bestCount}
                          stamps={bestStamps}
                        />
                      </div>
                      <div
                        className="btn-clear"
                        onClick={() => setStmpClear(true)}
                      >
                        <span>
                          <KanjiText title={"時"} pronun={"じ"} />
                          <KanjiText title={"間"} pronun={"かん"} />
                          を
                          <KanjiText title={"消"} pronun={"け"} />す
                        </span>
                      </div>
                    </div>
                  </div>
                </Overlay>
                <Overlay
                  show={stmpGraph}
                  placement="right"
                  target={chapterRef.current}
                >
                  <div className="stamp-graph">
                    <BarChart />
                  </div>
                </Overlay>
              </div>
            </div>
          </div>
        </div>
        {/* https://s3.ap-northeast-1.amazonaws.com/mastercode.jp-movie-react/output/test/123123modifier.m3u8 */}
        <div className="video">
          <div className="row">
            <div className="col-6 video-box">
              <ReactPlayer
                ref={videoRef}
                url={
                  videoURL
                }
                id="MainPlay"
                loop
                controls={true}
                width="100%"
                height="100%"
              />
            </div>
            <div className="col-6 word-box">
              <div className="wave">
                <div className="row">
                  <div className="col-5">
                    <div className="col-12">
                      <span>
                        どうがに　
                        <>
                          <KanjiText title={"出"} pronun={"で"} />
                        </>
                        てくる
                      </span>
                    </div>
                    <div className="col-12 span-bold">
                      <span>ことば</span>
                      <img src={BookImg} alt="book icon"></img>
                    </div>
                  </div>
                  <div className="col-7">
                    <span>
                      <>
                        <KanjiText title={"下"} pronun={"した"} />
                      </>
                      の ことばを おすと、いみを たしかめることが できるよ。
                    </span>
                  </div>
                </div>
              </div>
              {
                isLoading ? <div
                style={{
                  width: "100%",
                  height: "30vh",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomSpinner></CustomSpinner>
              </div> : <div className="word-list">
                {wordsData && wordsData.map((element) => (
                  <WordCard
                    key={element.id}
                    text={element.word_text}
                    onClick={() => openWordModal(element.word_text)}
                  ></WordCard>
                ))}
              </div>
              }
            </div>
          </div>
        </div>
        <div className="question">
          <div className="row">
            <div className="col-12 question-title">
              <div className="col-11 left">
                <button>
                  <>
                    <KanjiText title={"問"} pronun={"と"} />
                  </>
                  い
                  <br />
                  ボックス
                </button>
                {/* <div> */}
                <span>
                  どうがを見て どんなことを思いましたか。書いてみましょう。
                </span>
                {/* </div> */}
              </div>
              <div className="col-1 right">
                <div>
                  <span>教師用</span>
                  <button onClick={openQuestionModal}>
                    問いを
                    <br />
                    編集する
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 question-content">
              <div>
                <textarea placeholder="「ボックスを ひらく」のボタンをおして、書いてみよう。"></textarea>
              </div>
              <button onClick={() => setInputSel(true)}>
                <span>ボックスを</span>
                <br />
                <span>ひらく</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-question">
        <QuestionModal
          showModal={showQuestionModal}
          onClose={closeQuestionModal}
          text={""}
        />
      </div>
      <div className="modal-word">
        <WordModal
          showModal={showWordModal}
          onClose={closeWordModal}
          text={JsxParser(word)}
        />
      </div>
      <div className="modal-stamp">
        <StampModal
          showModal={stmpClear}
          onClose={closeStmpClearModal}
          onClear={clearStmpModal}
        />
      </div>
      <div className="modal-input-sel">
        <InputSelectionModal
          showModal={inputSel}
          onClose={closeInputSelModal}
          videoId={videoId}
        />
      </div>
    </MainLayout>
  );
};
