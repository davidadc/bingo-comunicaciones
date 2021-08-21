import { Card, Grid, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: '20px',
  },
  numbersContainer: {
    display: 'flex',
  },
  numbersRow: {
    flexDirection: 'column',
    textAlign: 'center',
  },
  cell: {
    border: '1px solid #000',
    textAlign: 'center',
    margin: '2.5px',
  },
}));

const BingoCard = ({ card }) => {
  const classes = useStyles();
  const bingo = ['B', 'I', 'N', 'G', 'O'];

  const newCard = [...card];
  if (newCard[2][2] !== 0) {
    newCard[2].splice(2, 0, 0);
  }

  const transposeCard = Object.keys(newCard[0]).map((colNumber) =>
    newCard.map((rowNumber) => rowNumber[colNumber]),
  );

  return (
    <Card variant="outlined" className={classes.root}>
      <Grid container>
        <Grid item xs={12}>
          <Grid container justifyContent={'center'}>
            {bingo.map((value, index) => (
              <Grid key={index} item xs={2} className={classes.cell}>
                {value}
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          {transposeCard.map((column) => {
            return (
              <Grid container justifyContent={'center'}>
                {column.map((value, index) => (
                  <Grid key={index} item xs={2} className={classes.cell}>
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
