import { useParams } from "react-router-dom";
import { Header } from "../../../components/Header/Header";
import { MainLayout, SubLayout } from "../../../components/Layout";
import { Title } from "../../../components/Elements/Title";
import "../../../styles/video/list/index.scss";
import { VideoCard } from "../component/VideoCard";
import { dummyVideoData, dummyVideoDataForClassic } from "../../../config";
import { isNumber } from "../../../config";
import { useGetUnitsQuery } from "../../api/api-slice";

export const VideoList = () => {
  const { level } = useParams();

  const { data: unitsData } = useGetUnitsQuery(level);
  console.log(unitsData, "unitsData", level);

  let dummyData = [];
  if (unitsData) {
    let tempData = [...unitsData];
    tempData.sort((a, b) => a.order - b.order);
    dummyData = tempData;
  }
  // if (isNumber(parseInt(level))) {
  //   console.log("here is inte");
  //   dummyData = dummyVideoData;
  // } else {
  //   dummyData = dummyVideoDataForClassic;
  // }
  return (
    <MainLayout>
      <Header />
      <SubLayout>
        <Title title={level} />
        <div className="mt-3 video-list">
          {dummyData.length ? (
            dummyData.map((element) => {
              return (
                <VideoCard
                  title={element.name}
                  content={element.content}
                  videoId={element.id}
                  isClassic={element.isClassic}
                  classicType={element.classicType}
                />
              );
            })
          ) : (
            <div>データなし</div>
          )}
        </div>
      </SubLayout>
    </MainLayout>
  );
};
