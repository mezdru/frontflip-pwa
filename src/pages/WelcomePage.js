import React from 'react'
import { Grid, withStyles, Typography, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import ProfileService from '../services/profile.service';
import UrlService from '../services/url.service';
import ReactGA from 'react-ga';
import SlackService from '../services/slack.service';

console.debug('Loading WelcomePage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({
  layout: {
    height: '100vh',
    left:0,
    right:0,
    margin: 'auto',
    [theme.breakpoints.down('xs')]: {
      height: 'unset',
      marginTop: 72
    },
  },
  item: {
    padding: 16,
  },
  itemActions: {
    position: 'absolute',
    bottom: 0,
    padding: 8
  },
  title: {
    textAlign: 'center',
  },
  button: {
    margin: 8
  },
  subtitle: {
    // marginTop: 27,
    textAlign: 'center',
    '& a': {
      color: theme.palette.secondary.dark
    }
  },
  subLayout: {
    height: 'auto'
  }
});

class WelcomePage extends React.Component {

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    SlackService.notify('#alert')
  }

  render() {
    const { classes } = this.props;
    const { currentUser } = this.props.userStore.values;
    const { orgTag } = this.props.organisationStore.values;

    return (
      <div>
        <Header />
        <main>
          <Grid container item className={classes.layout} alignItems={'center'} justify={'center'} direction="column" xs={12} md={6} >
            <Grid item className={classes.item}>
              <img className={classes.bigPicture} src={ProfileService.getEmojiUrl('😀')} alt="bigPicture" />
            </Grid>
            <Grid item className={classes.item} >
              <Typography variant={'h1'} className={classes.title}>
                <FormattedHTMLMessage id="welcome.page.title" />
              </Typography>
            </Grid>
            <Grid item className={classes.item} >
              <Typography variant={'body1'} className={classes.subtitle}>
                <FormattedHTMLMessage id="welcome.page.subtitle" />
              </Typography>
            </Grid>
            <Grid container item xs={12} md={6} justify="space-around" className={classes.itemActions}>
              <Grid item className={classes.button}>
                <Button color="secondary" >
                  <FormattedMessage id="menu.drawer.homepage" />
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button>
                  <FormattedMessage id="menu.drawer.terms" />
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button>
                  <FormattedMessage id="menu.drawer.protectingYourData" />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(WelcomePage)
  )
);
