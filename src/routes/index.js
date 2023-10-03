import { useRoutes } from "react-router-dom";
import { Home } from "../features/dashboard";
import { VideoRoutes } from "../features/video/routes";
import { NotFound } from "../components/Form/NotFound";
import { UploadRoutes } from "../features/upload/routes";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/videos/*", element: <VideoRoutes /> },
  { path: "/upload/*", element: <UploadRoutes /> },
  { path: "*", element: <NotFound /> },
];

export const AppRoutes = () => {
  const renderRoutes = useRoutes(routes);
  return renderRoutes;
};
