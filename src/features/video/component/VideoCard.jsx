import { useNavigate } from "react-router-dom";
import React from "react";
import { ExtendedKanjiText } from "../../../components/Elements/CustomText";
import { useSelector } from "react-redux";
import medal from "../../../assets/medal.gif";

export const VideoCard = ({
  title,
  content,
  videoId,
  isClassic,
  classicType,
}) => {
  let useStamp = false;
  let useQuestion = false;
  const navigate = useNavigate();
  const goDetail = () => {
    navigate(`/videos/detail/${videoId}`);
  };

  const videoState = useSelector((state) => state.videos[videoId]);
  console.log("videostate: ", videoState);

  let normalCount = 0;
  let goodCount = 0;
  let bestCount = 0;
  if (videoState === undefined || videoState === null) {
    normalCount = 0;
    goodCount = 0;
    bestCount = 0;
  } else {
    if ("normalCount" in videoState) {
      normalCount = videoState.normalCount && videoState.normalCount;
    }
    if ("goodCount" in videoState) {
      goodCount = videoState.goodCount && videoState.goodCount;
    }
    if ("bestCount" in videoState) {
      bestCount = videoState.bestCount && videoState.bestCount;
    }
    if ("question" in videoState) {
      videoState.question !== "" ? (useQuestion = true) : (useQuestion = false);
    }
  }

  let flag = normalCount + goodCount + bestCount;
  console.log("flag", flag);
  flag === 0 ? (useStamp = false) : (useStamp = true);

  return (
    <div
      className={
        useStamp || useQuestion ? "video-card video-used" : "video-card"
      }
      onClick={goDetail}
    >
      <div className="video-title">
        {isClassic ? <span className="classic-type">{classicType}</span> : ""}
        <span>{title}</span>
      </div>
      <div className="video-content">
        <span>
          <ExtendedKanjiText text={content} />
        </span>
      </div>
      <div className="btn-stamp">
        <div className={useStamp ? "stamp" : ""}>
          <span>{useStamp ? "スタンプ" : ""}</span>
        </div>
        <div className={useQuestion ? "question" : ""}>
          {useQuestion ? (
            <img src={medal} alt="medal-img" width="105%"></img>
          ) : (
            <span></span>
          )}
        </div>
      </div>
    </div>
  );
};
