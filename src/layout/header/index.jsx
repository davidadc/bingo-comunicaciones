import { useEffect, useState } from 'react';
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { io } from 'socket.io-client';

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

const Header = ({ socket, setSocket }) => {
  const classes = useStyles();
  const [players, setPlayers] = useState(0);

  useEffect(() => {
    const playersListener = (data) => {
      setPlayers(data);
    };

    if (socket) {
      socket.on('players:count', playersListener);

      return () => {
        socket.off('players:count', playersListener);
      };
    }
  }, [socket]);

  const onClick = () => {
    const newSocket = io(process.env.REACT_APP_WS_ENDPOINT);
    setSocket(newSocket);
  };

  return (
    <AppBar position="fixed" color="default">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Bingo
        </Typography>

        {!socket && (
          <Button variant="outlined" onClick={onClick}>
            Unirse al juego
          </Button>
        )}

        {socket && (
          <Typography variant="h6">
            Cantidad de jugadores en línea: {players}
          </Typography>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
