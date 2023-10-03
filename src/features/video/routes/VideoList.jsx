import { useParams } from "react-router-dom";
import { Header } from "../../../components/Header/Header";
import { MainLayout, SubLayout } from "../../../components/Layout";
import { Title } from "../../../components/Elements/Title";
import "../../../styles/video/list/index.scss";
import { VideoCard } from "../component/VideoCard";
import { dummyVideoData, dummyVideoDataForClassic } from "../../../config";
import { isNumber } from "../../../config";

export const VideoList = () => {
  const { level } = useParams();

  let dummyData = [];
  if (isNumber(parseInt(level))) {
    console.log("here is inte");
    dummyData = dummyVideoData;
  } else {
    dummyData = dummyVideoDataForClassic;
  }

  return (
    <MainLayout>
      <Header />
      <SubLayout>
        <Title title={level} />
        <div className="mt-3 video-list">
          {dummyData.length ? (
            dummyData.map((element) => (
              <VideoCard
                title={element.title}
                content={element.content}
                useStamp={element.useStamp}
                useQuestion={element.useQuestion}
                videoId={element.id}
                isClassic={element.isClassic}
                classicType={element.classicType}
              />
            ))
          ) : (
            <div>データなし</div>
          )}
        </div>
      </SubLayout>
    </MainLayout>
  );
};
