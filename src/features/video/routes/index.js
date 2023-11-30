import { Route, Routes } from "react-router-dom";
import { VideoList } from "./VideoList";
import { VideoDetail } from "./VideoDetail";
import { QuestionEdit } from "./QuestionEdit";

export const VideoRoutes = () => {
  return (
    <Routes>
      <Route path="/:level" element={<VideoList />} />
      <Route path="/detail/:videoId/:gradeId" element={<VideoDetail />} />
      <Route
        path="/detail/:videoId/question/:isTyping"
        element={<QuestionEdit />}
      />
    </Routes>
  );
};
