import { Grid } from '@material-ui/core';

import { useStyles } from './styles';

const ListBingoNumbers = ({ bingoNumbers }) => {
  const classes = useStyles();

  return (
    <Grid container>
      <Grid item xs={12} className={classes.root}>
        Números cantados:
      </Grid>

      {bingoNumbers.map((value) => (
        <Grid item xs={2} className={classes.root}>
          <span>{value}</span>
        </Grid>
      ))}
    </Grid>
  );
};

export default ListBingoNumbers;
