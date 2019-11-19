import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import chat from '../../resources/images/chat.png';

const styles = theme => ({
  text: {
    textAlign: 'center',
    margin: 16,
    color: theme.palette.primary.dark,
    fontWeight: '600'
  },
  image: {
    width: '100%',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: '24rem',
      height: 'auto',
    },
  },
});

function SearchNoResults({ classes }) {
  return (
    <Grid container item justify={"center"} alignItems={'center'} direction={'column'}>
      <Grid item style={{left:0, right:0, margin: 'auto'}} xs={12} sm={8} md={6} lg={4}>
        <Typography variant="h4" className={classes.text} >
          <FormattedMessage id={"nobody.searchList"} />
        </Typography>
      </Grid>
      <Grid item style={{left:0, right:0, margin: 'auto'}} xs={12} sm={8} md={6} lg={4}>
        <img src={chat} alt={'chat'} className={classes.image} />
      </Grid>
    </Grid>
  );
}


export default withStyles(styles)(SearchNoResults)
