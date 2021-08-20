import { Card, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  numbersContainer: {
    display: 'flex',
  },
  numbersRow: {
    flexDirection: 'column',
    textAlign: 'center',
  },
  center: {
    textAlign: 'center',
  },
}));

const BingoCard = ({ card }) => {
  const classes = useStyles();
  const bingo = ['B', 'I', 'N', 'G', 'O'];

  const newCard = [...card];
  if (newCard[2][2] !== 0) {
    newCard[2].splice(2, 0, 0);
  }

  const transposeCard = Object.keys(card[0]).map((colNumber) =>
    card.map((rowNumber) => rowNumber[colNumber]),
  );

  return (
    <Card variant="outlined">
      <Grid container>
        <Grid item xs={12}>
          <Grid container>
            <Grid item xs={1} />
            {bingo.map((value, index) => (
              <Grid key={index} item xs={2} className={classes.center}>
                {value}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {transposeCard.map((column, columnIndex) => {
            return (
              <Grid container>
                <Grid item xs={1} />
                {column.map((value, index) => (
                  <Grid key={index} item xs={2} className={classes.center}>
                    {value === 0 ? <span>Free</span> : <span>{value}</span>}
                  </Grid>
                ))}
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Card>
  );
};

export default BingoCard;
