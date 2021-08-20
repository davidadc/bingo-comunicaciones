import { useEffect, useState } from 'react';

// Components
import Header from './layout/header';

// Styles
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cardsOptions = (data) => {
      setCards(data);
    };

    if (socket) {
      socket.on('cards:options', cardsOptions);
      return () => socket.off('cards:options', cardsOptions);
    }
  }, [socket]);

  return (
    <div className="App">
      <Header socket={socket} setSocket={setSocket} />
    </div>
  );
}

export default App;
