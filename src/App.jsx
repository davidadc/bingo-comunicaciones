import { useEffect, useState } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';

// Components
import Header from './layout/header';
import SelectBingoCards from './components/SelectBingoCards';
import ListBingoNumbers from './components/ListBingoNumbers';

// Styles
import './App.css';
import BingoCard from './components/BingoCard';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  margin: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'center',
  },
}));

function App() {
  const classes = useStyles();

  const [socket, setSocket] = useState(null);
  const [cards, setCards] = useState([]);
  const [myCard, setMyCard] = useState(null);
  const [bingoNumbers, setBingoNumbers] = useState([]);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [selectedNumbers, setSelectedNumbers] = useState([]);

  useEffect(() => {
    const cardsOptions = (data) => {
      setCards(data);
    };

    const listedNumbers = (data) => {
      setBingoNumbers((prevState) => [...prevState, data]);
    };

    const gameTime = (data) => {
      if (data === 10) {
        setShowCountdown(true);
      }

      if (data === 0) {
        setShowCountdown(false);
      }

      setCountdown(data);
    };

    if (socket) {
      socket.on('cards:options', cardsOptions);
      socket.on('bingo:callNumber', listedNumbers);
      socket.on('game:time', gameTime);

      return () => {
        socket.off('cards:options', cardsOptions);
        socket.off('bingo:callNumber', listedNumbers);
        socket.off('game:time', gameTime);
      };
    }
  }, [socket]);

  return (
    <Container className="App" maxWidth={'xl'}>
      <Header socket={socket} setSocket={setSocket} />

      <div>
        <Grid
          container
          alignItems={'center'}
          alignContent={'center'}
          className={classes.root}
        >
          {showCountdown && (
            <Grid item xs={12}>
              <Typography variant="h4" align="center">
                El juego comenzará en {countdown}
              </Typography>
            </Grid>
          )}

          <Grid item xs={12}>
            <Typography variant="h3" align="center">
              Bingo
            </Typography>
          </Grid>

          <Grid item xs={12} className={classes.margin}>
            {!myCard && (
              <SelectBingoCards
                cards={cards}
                setMyCard={setMyCard}
                socket={socket}
              />
            )}

            {myCard && (
              <>
                <Grid
                  item
                  xs={4}
                  justifyContent={'center'}
                  className={classes.onlyRow}
                >
                  <BingoCard
                    card={myCard}
                    isSelected
                    setSelectedNumbers={setSelectedNumbers}
                    selectedNumbers={selectedNumbers}
                  />
                </Grid>
              </>
            )}
          </Grid>

          {myCard && (
            <Grid item xs={12}>
              <ListBingoNumbers bingoNumbers={bingoNumbers} />
            </Grid>
          )}
        </Grid>
      </div>
    </Container>
  );
}

export default App;
