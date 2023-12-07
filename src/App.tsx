import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import { store } from './stores/store';
import ScalingProvider from './utils/ScalingHelper';

document.documentElement.lang = 'ja';

function App() {
  return (
    <ScalingProvider>
      <Provider store={store}>
        <BrowserRouter basename="movie">
          <AppRoutes></AppRoutes>
        </BrowserRouter>
      </Provider>
    </ScalingProvider>
  );
}

export default App;
