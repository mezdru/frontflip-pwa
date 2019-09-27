import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import Logo from '../utils/logo/Logo';
import moment from 'moment';
import Applause from '../../resources/icons/Applause';
import { FormattedMessage } from 'react-intl';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';

var MomentConfigs = require('../configs/moment.conf');
MomentConfigs.setMomentFr();

const styles = theme => ({
  rootLink: {
    textDecoration: 'none',
  },
  root: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0px 4px 4px 4px',
    marginTop: 16,
    padding: 8,
    cursor: "pointer",
    [theme.breakpoints.down('md')]: {
      maxWidth: 350,
    }
  },
  textContainer: {
    position: 'relative',
  },
  date: {
    position: 'absolute',
    right: 0,
    top: 0
  },
  logo: {
    width: 'calc(100% - 8px)',
    height: 'auto'
  },
  author: {
    maxWidth: '55%'
  },
  applauseIcon: {
    width: 20,
    height: 20,
    transform: 'translateY(5px)'
  }
})

const ActivityCard = React.memo(withProfileManagement(withStyles(styles)(({ picture, authorName, authorTag, message, created, hashtag, classes, locale, given, profileContext }) => {
  moment.locale(locale);
  let hashtagDisplayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name);
  return (
    <Grid container className={classes.root} onClick={(e) => {profileContext.handleDisplayProfile(e, {tag: authorTag}, true)}}>
      <Grid item xs={2}>
        <Logo src={picture} type='person' className={classes.logo} />
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12} className={classes.textContainer}>
          <Typography variant="body1" className={classes.author} >
            {authorName}
          </Typography>
          <Typography variant="body2" className={classes.date} >
            {moment(created).fromNow()}
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2">
            {'+' + given + ' '}
            <Applause className={classes.applauseIcon} />
            {' '}<FormattedMessage id="profile.activity.for" />{' '}
            {hashtagDisplayedName}
          </Typography>
        </Grid>

      </Grid>
    </Grid>
  );
})));

export default (ActivityCard);