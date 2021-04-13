import { BrowserRouter } from 'react-router-dom';
import './App.css';
import Routes from './routes/Routes';
import SocketContextProvider from './store/SocketContext';

const App = () => {
  return (
    <div className="app">
      <SocketContextProvider>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </SocketContextProvider>
    </div>
  );
};

export default App;
