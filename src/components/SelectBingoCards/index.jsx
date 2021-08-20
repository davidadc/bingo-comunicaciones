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
        <Grid container>
          {cards.map((card) => (
            <Grid item xs={4}>
              <BingoCard card={card} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SelectBingoCards;
