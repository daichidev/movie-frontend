import { Route, Routes } from "react-router-dom";
import AddVideoScreen from "./AddVideo";
import UploadListScreen from "./UploadFile";
import KanjiToHira from "./KanjiToHira";

export const UploadRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<UploadListScreen />} />
      <Route path="/add_file" element={<AddVideoScreen />} />
      <Route path="/kanji_to_hira" element={<KanjiToHira />} />
    </Routes>
  );
};
