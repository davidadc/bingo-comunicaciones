import { Button, Grid, makeStyles } from '@material-ui/core';

import BingoCard from '../BingoCard';
import { encryptData } from './../../utils/crypto-data';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
  margin: {
    marginTop: '20px',
  },
  item: {
    textAlign: 'center',
  },
}));

const SelectBingoCards = ({ cards, setMyCard, socket, userId }) => {
  const classes = useStyles();

  const onClick = (card) => {
    if (card[2][2] === 0) {
      card[2].splice(2, 1);
    }

    const data = encryptData({ userId, card });

    socket.emit('card:selected', data);
    setMyCard(card);
  };

  return (
    <Grid container justifyContent={'space-between'}>
      {cards.map((card, index) => (
        <Grid key={index} item xs={12} md={4} lg={3} className={classes.item}>
          <BingoCard card={card} />
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => onClick(card)}
          >
            Seleccionar
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default SelectBingoCards;
