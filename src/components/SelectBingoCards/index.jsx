import { Grid, makeStyles, Typography } from '@material-ui/core';

import BingoCard from '../BingoCard';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
  },
}));

const SelectBingoCards = ({ cards }) => {
  const classes = useStyles();

  return (
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

      <Grid item xs={12}>
        <Grid container justifyContent={'space-between'}>
          {cards.map((card) => (
            <Grid item xs={12} md={4} lg={3}>
              <BingoCard card={card} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectBingoCards;
