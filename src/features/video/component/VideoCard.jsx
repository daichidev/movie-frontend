import { useNavigate } from "react-router-dom";
import React from "react";
import { ExtendedKanjiText } from "../../../components/Elements/CustomText";

export const VideoCard = ({
  title,
  content,
  useStamp,
  useQuestion,
  videoId,
  isClassic,
  classicType,
}) => {
  const navigate = useNavigate();
  const goDetail = () => {
    navigate(`/videos/detail/${videoId}`);
  };

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
          <span>{useQuestion ? <>問い</> : ""}</span>
        </div>
      </div>
    </div>
  );
};
