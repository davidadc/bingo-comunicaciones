import { useEffect, useState } from 'react';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';

// Components
import Header from './layout/header';
import SelectBingoCards from './components/SelectBingoCards';

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
    <Container className="App" maxWidth={'xl'}>
      <Header socket={socket} setSocket={setSocket} />

      <div>
        <Grid
          container
          alignItems={'center'}
          alignContent={'center'}
          className={classes.root}
        >
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
                  <BingoCard card={myCard} />
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </div>
    </Container>
  );
}

export default App;
