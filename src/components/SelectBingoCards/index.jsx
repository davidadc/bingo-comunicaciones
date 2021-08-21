import { Button, Grid, makeStyles, Typography } from '@material-ui/core';

import BingoCard from '../BingoCard';

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

const SelectBingoCards = ({ cards, setMyCard, socket }) => {
  const classes = useStyles();

  const onClick = (card) => {
    if (card[2][2] === 0) {
      card[2].splice(2, 1);
    }

    socket.emit('card:selected', { userId: '123', card });
    setMyCard(card);
  };

  return (
    <Grid container justifyContent={'space-between'}>
      {cards.map((card) => (
        <Grid item xs={12} md={4} lg={3} className={classes.item}>
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
