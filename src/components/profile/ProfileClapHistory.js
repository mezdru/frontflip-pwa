import React from 'react';
import { Typography, withStyles, Grid } from '@material-ui/core';

const styles = {
  activity: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0px 4px 4px 4px',
    marginTop: 16,
    padding: 8
  }
};

class ProfileClapHistory extends React.Component {
  state = {

  }

  render() {
    const { classes } = this.props;

    return(
      <div>
        <Typography variant="h3" style={{textTransform: 'uppercase', color: 'rgba(255, 255, 255, 0.85)'}}>
          Activity History
        </Typography>

        <Grid item container xs={12} className={classes.activity} >
          Here will appears the history of the activities link to your profile.
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProfileClapHistory);