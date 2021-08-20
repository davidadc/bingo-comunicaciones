import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

// Components
import BingoCard from './components/BingoCard';

// Styles
import './App.css';

const WS_ENDPOINT = 'http://127.0.0.1:3002';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(WS_ENDPOINT);
    setSocket(newSocket);
    console.log(newSocket);
    return () => newSocket.close();
  }, [setSocket]);

  return (
    <div className="App">
      <header className="App-header">
        <BingoCard />
      </header>
    </div>
  );
}

export default App;
