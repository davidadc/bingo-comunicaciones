import { useEffect, useState } from 'react';
import { Container } from '@material-ui/core';

// Components
import Header from './layout/header';
import SelectBingoCards from './components/SelectBingoCards';

// Styles
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const cardsOptions = (data) => {
      setCards(data);
    };

    const listedNumbers = (data) => {
      console.log(data);
    };

    if (socket) {
      socket.on('cards:options', cardsOptions);
      socket.on('bingo:callNumber', listedNumbers);

      return () => {
        socket.off('cards:options', cardsOptions);
        socket.off('bingo:callNumber', listedNumbers);
      };
    }
  }, [socket]);

  return (
    <Container className="App">
      <Header socket={socket} setSocket={setSocket} />

      {cards.length === 3 && <SelectBingoCards cards={cards} />}
    </Container>
  );
}

export default App;
