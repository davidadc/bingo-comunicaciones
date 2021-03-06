import { useEffect, useState } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import Swal from 'sweetalert2';
import { decryptData } from './utils/crypto-data';

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
    marginTop: '64px',
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
  const [gameStarted, setGameStarted] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const cardsOptions = (data) => {
      data = decryptData(data);
      setCards(data);
    };

    const listedNumbers = (data) => {
      data = decryptData(data);
      setBingoNumbers((prevState) => [...prevState, data]);
    };

    const gameTime = (data) => {
      data = decryptData(data);
      if (data === 10) {
        setShowCountdown(true);
      }

      if (data === 1) {
        setGameStarted(true);
        setShowCountdown(false);
      }

      setCountdown(data);
    };

    const youWon = async (text) => {
      text = decryptData(text);
      await Swal.fire({
        title: 'Ganaste',
        type: 'success',
        text,
      });
    };

    const someoneWon = async (text) => {
      text = decryptData(text);
      await Swal.fire({
        title: 'Ya hay un ganador',
        type: 'success',
        text,
      });
    };

    const waitModal = async (waitStatus) => {
      waitStatus = decryptData(waitStatus);
      if (waitStatus) {
        await Swal.fire({
          title: 'Juego en curso',
          type: 'success',
          text: 'No puedes unirte a esta partida',
        });
      }
    };

    const gameOver = (data) => {
      data = decryptData(data);
      if (data) {
        Swal.fire({
          title: 'Juego finalizado',
          type: 'success',
          text: 'El juego ha finalizado sin ning??n ganador',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    };

    const setDisconnectionStatus = () => {
      setSocket(null);
    };

    if (socket) {
      socket.on('cards:options', cardsOptions);
      socket.on('bingo:callNumber', listedNumbers);
      socket.on('game:time', gameTime);
      socket.on('player:winner', youWon);
      socket.on('players:winner', someoneWon);
      socket.on('game:wait', waitModal);
      socket.on('disconnect', setDisconnectionStatus);
      socket.on('game:over', gameOver);

      return () => {
        socket.off('cards:options', cardsOptions);
        socket.off('bingo:callNumber', listedNumbers);
        socket.off('game:time', gameTime);
        socket.off('player:winner', youWon);
        socket.off('players:winner', someoneWon);
        socket.off('game:wait', waitModal);
        socket.off('disconnect', setDisconnectionStatus);
        socket.off('game:over', gameOver);
      };
    }
  }, [socket]);

  return (
    <Container className="App" maxWidth={'xl'}>
      <Header
        socket={socket}
        setSocket={setSocket}
        gameStarted={gameStarted}
        selectedNumbers={selectedNumbers}
        myCard={myCard}
        userId={userId}
        setUserId={setUserId}
        setShowCountdown={setShowCountdown}
      />

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
                El juego comenzar?? en {countdown}
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
                userId={userId}
              />
            )}

            {myCard && (
              <>
                <Grid item xs={4} className={classes.onlyRow}>
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
