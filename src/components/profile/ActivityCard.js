import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import Logo from '../utils/logo/Logo';
import moment from 'moment';

var MomentConfigs = require('../configs/moment.conf');
MomentConfigs.setMomentFr();

const styles = {
  root: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0px 4px 4px 4px',
    marginTop: 16,
    padding: 8
  },
  textContainer: {
    position: 'relative'
  },
  date: {
    position: 'absolute',
    right: 0
  },
  logo: {
    width: 'calc(100% - 8px)',
    height: 'auto'
  },
  author: {
    maxWidth: '55%'
  }
}

const ActivityCard = React.memo(withStyles(styles)(({ picture, authorName, message, created, hashtag, classes, locale }) => {
  moment.locale(locale);
  return (
    <Grid container className={classes.root} >
      <Grid item xs={2}>
      <Logo src={picture} type='person' className={classes.logo} />
      </Grid>
      <Grid container item xs={10} className={classes.textContainer}>
        <Typography variant="body1" className={classes.author} >
          {authorName}
        </Typography>
        <Typography variant="body2" className={classes.date} >
          {moment(created).fromNow()}
        </Typography>
      </Grid>
    </Grid>
  );
}));

export default ActivityCard;