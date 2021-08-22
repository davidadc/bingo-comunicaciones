import { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { io } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const Header = ({
  socket,
  setSocket,
  gameStarted,
  selectedNumbers,
  myCard,
  setUserId,
  userId,
  setShowCountdown,
}) => {
  const classes = useStyles();
  const [players, setPlayers] = useState(0);
  const neededPlayers = parseInt(process.env.REACT_APP_NEEDED_PLAYERS);

  useEffect(() => {
    const playersListener = (data) => {
      setPlayers(data);

      setShowCountdown(false);
    };

    if (socket) {
      socket.on('players:count', playersListener);

      return () => {
        socket.off('players:count', playersListener);
      };
    }
  }, [socket]);

  const onClick = () => {
    const newUserId = uuidv4();
    const newSocket = io(process.env.REACT_APP_WS_ENDPOINT, {
      query: { userId: newUserId },
    });
    setSocket(newSocket);
    setUserId(newUserId);
  };

  const callBingo = () => {
    if (myCard[2][2] === 0) {
      myCard[2].splice(2, 1);
    }

    socket.emit('bingo:callBingo', {
      userId,
      selected: selectedNumbers,
    });
  };

  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Bingo
          {socket && <span> | User Id: {userId}</span>}
        </Typography>

        {!socket && (
          <Button variant="outlined" onClick={onClick}>
            Unirse al juego
          </Button>
        )}

        {socket && (
          <Typography variant="h6">
            {players < neededPlayers ? (
              <span>
                Jugadores necesarios para empezar el juego:{' '}
                {neededPlayers - players}
              </span>
            ) : (
              <>
                {gameStarted ? (
                  <Button variant="outlined" onClick={callBingo}>
                    Cantar BINGO
                  </Button>
                ) : (
                  <span>
                    El juego comenzará cuando todos tengan sus cartones
                  </span>
                )}
              </>
            )}{' '}
            | Cantidad de jugadores en línea: {players}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
