import { useEffect, useState } from 'react';

// Components
import Header from './layout/header';

// Styles
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const boards = (data) => {
      console.log(data);
    };

    if (socket) {
      socket.on('boards:options', boards);
      return () => socket.off('boards:options', boards);
    }
  }, [socket]);

  return (
    <div className="App">
      <Header socket={socket} setSocket={setSocket} />
    </div>
  );
}

export default App;
