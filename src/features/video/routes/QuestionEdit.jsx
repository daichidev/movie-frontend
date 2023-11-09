import { useParams } from "react-router-dom";
import { Header } from "../../../components/Header/Header";
import { MainLayout } from "../../../components/Layout";
import "../../../styles/video/question/index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { createRef, useEffect, useState } from "react";
import { useScreenshot, createFileName } from "use-react-screenshot";
import { Modal } from "react-bootstrap";
import { ModalButton } from "../../../components/Elements/ModalButton";
import { KanjiText } from "../../../components/Elements/CustomText";
import ReactPlayer from "react-player";
import VTTFILE from "../../../assets/1.vtt";
import { setVideoQuestion } from "../../../stores/store";
import { useDispatch, useSelector } from "react-redux";
import { get2byteLength } from "../../../config";

export const QuestionEdit = () => {
  const dispatch = useDispatch();
  const { videoId, isTyping } = useParams();
  const ref = createRef(null);

  const [saveModal, setSaveModal] = useState(false);
  const [text, setText] = useState("");
  const [letterCnt, setLetterCnt] = useState(0);
  const [image, takeScreenShot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  let questionText = "";
  let videoState = useSelector((state) => state.videos[videoId]);
  if (videoState) {
    if ("question" in videoState) {
      questionText = videoState.question;
    }
  }
  useEffect(() => {
    setText(questionText);
  }, [questionText]);

  const download = (
    image,
    { name = `${new Date().toISOString()}`, extension = "jpg" } = {}
  ) => {
    const element = document.createElement("a");
    element.href = image;
    element.download = createFileName(extension, name);
    element.click();
  };
  const downloadScreenshot = () => takeScreenShot(ref.current).then(download);

  const closeModal = () => {
    setSaveModal(false);
  };

  const confirmModal = () => {
    dispatch(
      setVideoQuestion({
        videoId: videoId,
        question: text,
      })
    );
    setSaveModal(false);
  };
  const onChangeTextArea = (event) => {
    if (event.target.value.length > 150) return;
    setText(event.target.value);
    let cnt = get2byteLength(event.target.value);
    setLetterCnt(cnt);
  };
  return (
    <MainLayout>
      <Header />
      <div className="question-detail">
        <div className="video">
          <div className="row">
            <div className="video-box">
              <video controls>
                <source
                  src="https://s3.ap-northeast-1.amazonaws.com/mastercode.jp-movie-react/input/123.mov"
                  type="video/mp4"
                />
                <track default src={VTTFILE}></track>
              </video>
            </div>
          </div>
        </div>
        <div className="question">
          <div className="row">
            <div className="col-12 question-title">
              <div className="col-10 left">
                <button>
                  <KanjiText title={"問"} pronun={"と"} />
                  い
                  <br />
                  ボックス
                </button>
                <span>
                  しりょうを見て どんなことを 思いましたか。書いてみましょう。
                </span>
              </div>
              <div className="col-2 right">
                <div>
                  <span>教師用</span>
                  <button>
                    問いを
                    <br />
                    編集する
                  </button>
                </div>
              </div>
            </div>
            <div className="col-12 question-content">
              <div className="text-button">
                <button onClick={() => setSaveModal(true)}>
                  <span>ボックスを</span>
                  <br />
                  <span>とじる</span>
                </button>
              </div>
              <div className="text-body">
                <textarea
                  ref={ref}
                  placeholder={
                    JSON.parse(isTyping)
                      ? "入力してください。"
                      : "ここに書いてください。"
                  }
                  onChange={onChangeTextArea}
                  value={text}
                ></textarea>
                <div className="limit-letter">
                  <span>
                    {letterCnt.toString().padStart(1, "0")}
                    <KanjiText title={"字"} pronun={"じ"} />
                    ／150
                    <KanjiText title={"字"} pronun={"じ"} />
                  </span>
                </div>
              </div>
              <div className="text-screenshot">
                <div onClick={downloadScreenshot}>
                  <FontAwesomeIcon icon={faCamera} />
                  <span>きろくする</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal-save">
        <Modal
          show={saveModal}
          dialogClassName="modal-save"
          size="lg"
          centered
          onHide={closeModal}
        >
          <Modal.Header>
            <span>
              {text.length !== 0 ? "書いた　ないようを　ほぞんしますか。" : ""}
            </span>
          </Modal.Header>
          <Modal.Body>
            <ModalButton
              isConfirm={true}
              children={"ほぞんする"}
              onClick={confirmModal}
            />
            <ModalButton
              isConfirm={false}
              children={"ほぞんしない"}
              onClick={closeModal}
            />
          </Modal.Body>
        </Modal>
      </div>
    </MainLayout>
  );
};
