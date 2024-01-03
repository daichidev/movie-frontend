import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetUnitsQuery } from '../../../api/api-slice';

export const useVideoList = () => {
  const { level } = useParams();
  const [c_level, setCLevel] = useState(0);
  const [c_loading, setCLoading] = useState(true);

  let params = {
    level: level + '年',
    category_id: 4,
  };
  const url =
    'http://video-streaming-api.mastercode.jp:8000/grades/get_grade_id';
  const queryParams = new URLSearchParams(params);
  const endpoint = `${url}?${queryParams}`;
  fetch(endpoint)
    .then((response) => {
      setCLoading(false);
      if (response.ok) {
        console.log('response', response);
        return response.json();
      }
      throw new Error('Network response was not ok');
    })
    .then((data) => {
      console.log('Upload successful:', data);
      setCLevel(data.grade_id);
    })
    .catch((error) => {
      console.error('Upload error:', error);
    });

  const { data: unitsData, isLoading, refetch } = useGetUnitsQuery(c_level);

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
    genre: level,
    // TODO　学年以外の場合のID値は？
    gradeId: c_level,
    isLoading: c_loading ? c_loading : isLoading,
  };
};
