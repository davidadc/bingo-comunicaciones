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
  selected: {
    backgroundColor: 'rgb(0 58 245 / 51%)',
  },
}));

const BingoCard = ({
  card,
  isSelected,
  selectedNumbers,
  setSelectedNumbers,
}) => {
  const classes = useStyles();
  const bingo = ['B', 'I', 'N', 'G', 'O'];

  const newCard = [...card];
  if (newCard[2][2] !== 0) {
    newCard[2].splice(2, 0, 0);
  }

  const transposeCard = Object.keys(newCard[0]).map((colNumber) =>
    newCard.map((rowNumber) => rowNumber[colNumber]),
  );

  const onClick = (number) => {
    if (number === 0) {
      return;
    }

    if (isSelected) {
      setSelectedNumbers((prevState) => {
        if (prevState.indexOf(number) === -1) {
          return [...prevState, number];
        } else {
          return prevState.filter((value) => value !== number);
        }
      });
    }
  };

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
                  <Grid
                    key={index}
                    item
                    xs={2}
                    className={`${classes.cell} ${
                      isSelected
                        ? selectedNumbers.indexOf(value) !== -1
                          ? classes.selected
                          : ''
                        : ''
                    }`}
                    onClick={() => onClick(value)}
                  >
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
