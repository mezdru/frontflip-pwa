import React, { Suspense } from 'react'
import { Grid, withStyles, Typography, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { FormattedHTMLMessage, FormattedMessage } from 'react-intl';
import ProfileService from '../services/profile.service';
import UrlService from '../services/url.service';
import ReactGA from 'react-ga';
import SlackService from '../services/slack.service';
import { Redirect } from 'react-router-dom';
import Intercom from 'react-intercom';

console.debug('Loading WelcomePage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({
  layout: {
    height: '100vh',
    left: 0,
    right: 0,
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

  state = {
    redirectTo: null
  }

  componentWillMount() {
    if (!this.props.userStore.currentUser) return this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/signin' });
    let { email, _id } = this.props.userStore.currentUser;
    let { locale } = this.props.commonStore;

    ReactGA.pageview(window.location.pathname);
    SlackService.notify('#alerts',
      `An User is connected without organisation. (locale: ${locale} ) (email: ${email.value} ) (id: ${_id} )`);    
  }

  render() {
    const { classes } = this.props;
    const { currentUser } = this.props.userStore;

    if (this.state.redirectTo) return (<Redirect to={this.state.redirectTo} />);

    return (
      <div>
        <Header />
        <main>
          <Grid container item className={classes.layout} alignItems={'center'} justify={'center'} direction="column" xs={12} md={6} >
            <Grid item className={classes.item}>
              <img className={classes.bigPicture} src={ProfileService.getEmojiUrl('🤔')} alt="bigPicture" />
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
                <Button color="secondary" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/', undefined)} >
                  <FormattedMessage id="menu.drawer.whyWingzy" />
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)} >
                  <FormattedMessage id="menu.drawer.terms" />
                </Button>
              </Grid>
              <Grid item className={classes.button}>
                <Button href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                  <FormattedMessage id="menu.drawer.protectingYourData" />
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Suspense fallback={<></>}>
            <Intercom
              appID={"k7gprnv3"}
              user_id={currentUser._id}
              email={currentUser.email ? currentUser.email.value : (currentUser.google ? currentUser.google.email : null)}
            />
          </Suspense>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(WelcomePage)
  )
);
