import { useParams } from "react-router-dom";
import { Header } from "../../../components/Header/Header";
import { MainLayout, SubLayout } from "../../../components/Layout";
import { Title } from "../../../components/Elements/Title";
import "../../../styles/video/list/index.scss";
import { VideoCard } from "../component/VideoCard";
import { dummyVideoData, dummyVideoDataForClassic } from "../../../config";
import { isNumber } from "../../../config";
import { useGetUnitsQuery } from "../../api/api-slice";
import { CustomSpinner } from "../../upload/component/spinner";

export const VideoList = () => {
  const { level } = useParams();
  let c_level = 4;

  let params = {
    level: level + "年",
    category_id: 2,
  };
  const url = "http://video-streaming-api.mastercode.jp:8000/grades/get_grade_id";
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
          console.log("Upload successful:", data);
          c_level = data.grade_id;
        })  
        .catch((error) => {
          console.error("Upload error:", error);
        });

  const { data: unitsData, isLoading } = useGetUnitsQuery(c_level);

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
        {!isLoading ? 
        <div className="mt-3 video-list">
        {dummyData.length ? (
          dummyData.map((element) => {
            return (
              <VideoCard
                title={element.name}
                gradeId={c_level}
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
      </div> : <CustomSpinner></CustomSpinner>}
      </SubLayout>
    </MainLayout>
  );
};
