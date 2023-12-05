import { useParams } from 'react-router-dom';
import { useGetUnitsQuery } from '../../../api/api-slice';

export const useVideoList = () => {
  const { level } = useParams();
  let c_level = 4;

  let params = {
    level: level + '年',
    category_id: 2,
  };
  const url =
    'http://video-streaming-api.mastercode.jp:8000/grades/get_grade_id';
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
      console.log('Upload successful:', data);
      c_level = data.grade_id;
    })
    .catch((error) => {
      console.error('Upload error:', error);
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
  return {
    videoList: dummyData,
    gradeId: c_level,
  };
};
