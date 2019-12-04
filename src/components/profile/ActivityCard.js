import React from 'react';
import { withStyles, Grid, Typography } from '@material-ui/core';
import Logo from '../utils/logo/Logo';
import moment from 'moment';
import { Link } from 'react-router-dom';
import Applause from '../../resources/icons/Applause';
import { FormattedMessage } from 'react-intl';
import ProfileService from '../../services/profile.service';

const styles = theme => ({
  rootLink: {
    textDecoration: 'none',
  },
  root: {
    background: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '0px 4px 4px 4px',
    marginTop: 16,
    padding: 8,
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
    maxWidth: '55%',
    fontSize: '1rem'
  },
  applauseIcon: {
    width: 20,
    height: 20,
    transform: 'translateY(5px)'
  }
})

const ActivityCard = React.memo(withStyles(styles)(({ picture, authorName, link, message, created, hashtag, classes, locale, given }) => {
  moment.locale(locale);
  if(!hashtag) return null;
  let hashtagDisplayedName = (hashtag.name_translated ? (hashtag.name_translated[locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name);
  return (
    <Link to={link} className={classes.rootLink}>
    <Grid container className={classes.root} >
      <Grid item xs={2}>
        <Logo src={picture} type='person' className={classes.logo} />
      </Grid>
      <Grid container item xs={10}>
        <Grid item xs={12} className={classes.textContainer}>
          <Typography variant="h1" className={classes.author} >
            {ProfileService.htmlDecode(authorName)}
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
            {ProfileService.htmlDecode(hashtagDisplayedName)}
          </Typography>
        </Grid>

      </Grid>
    </Grid>
    </Link>
  );
}));

export default ActivityCard;