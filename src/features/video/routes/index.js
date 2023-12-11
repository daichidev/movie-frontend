import { Route, Routes } from 'react-router-dom';
import { VideoDetail } from './VideoDetail';
import { VideoList } from './VideoList';

export const VideoRoutes = () => {
  return (
    <Routes>
      <Route path="/:level" element={<VideoList />} />
      <Route path="/detail/:videoId/:gradeId" element={<VideoDetail />} />
    </Routes>
  );
};
