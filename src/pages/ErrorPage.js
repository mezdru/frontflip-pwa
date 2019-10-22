import React from 'react'
import { Grid, withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { FormattedHTMLMessage } from 'react-intl';
import ProfileService from '../services/profile.service';
import EmailService from'../services/email.service';
import UrlService from '../services/url.service';
import ReactGA from 'react-ga';
import undefsafe from 'undefsafe';
import SlackService from '../services/slack.service';
console.debug('Loading ErrorPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = theme => ({
  layout: {
    height: 'calc(100vh - 72px)',
    flexGrow: 1
  },
  title: {
    fontSize: '4rem',
  },
  titleEmail: {
    fontSize: '3rem',
    textAlign: 'center',
  },
  subtitleEmail: {
    textAlign: 'center'
  },
  subLayout: {
    height: 'auto'
  }
});

class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorCode: null,
      errorType: null,
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    if (this.props.match && this.props.match.params) {
      this.setState({ errorCode: this.props.match.params.errorCode, errorType: this.props.match.params.errorType }, () => {
        if(this.state.errorCode == 403 && this.state.errorType === 'email' && this.props.authStore.isAuth() ) {
          EmailService.confirmLoginEmail();
        }
      });
    }

    try {
      SlackService.notifyError(` ${this.props.match.params.errorCode} (${this.props.match.params.errorType}) (userId:${undefsafe(this.props.userStore.currentUser, '_id')})`, 51, 'quentin', 'ErrorPage.js')
    }catch(e) {}

  }

  render() {
    const { classes } = this.props;
    const { errorCode, errorType } = this.state;
    const { currentUser } = this.props.userStore;
    const { currentOrganisation } = this.props.orgStore;
    return (
      <div>
        <Header />
        <main>
          <Grid container className={classes.layout} alignItems={'center'} justify={'center'}>
            <Grid item xs={12} md={6}>
              <Grid
                container
                spacing={16}
                className={classes.subLayout}
                alignItems={'center'}
                direction={'column'}
                justify={'center'}
              >
                <Grid item>
                  {errorType === 'email' && (
                    <img className={classes.bigPicture} src={ProfileService.getEmojiUrl('📧')} alt="bigPicture" />
                  )}
                  {errorType !== 'email' && (
                    <img className={classes.bigPicture} src={ProfileService.getEmojiUrl('🧰')} alt="bigPicture" />
                  )}
                </Grid>
                <Grid item>
                  {errorType === 'email' && (
                    <Typography variant={'h1'} className={classes.titleEmail}>
                      <FormattedHTMLMessage id="errorPage.emailNotValidated.title" />
                    </Typography>
                  )}
                  {errorType !== 'email' && (
                    <Typography variant={'h1'} className={classes.title}>{errorCode} Oops</Typography>
                  )}
                </Grid>
                <Grid item>
                  {errorType === 'email' && (
                    <Typography variant={'subheading'} className={classes.subtitleEmail}>
                      <FormattedHTMLMessage id="errorPage.emailNotValidated" values={{ email: currentUser.email.value }} />
                    </Typography>
                  )}
                  {(errorType === 'organisation' && errorCode === '404') && (
                    <Typography variant={'subheading'}>
                      <FormattedHTMLMessage id="errorPage.organisationNotFound" values={{ newOrgLink: UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', null, null), orgTag: undefsafe(currentOrganisation, 'tag') }} />
                    </Typography>
                  )}
                  {(errorType === 'organisation' && errorCode === '403') && (
                    <Typography variant="subheading">
                      <FormattedHTMLMessage id="errorPage.organisationForbidden" />
                    </Typography>
                  )}
                  {(errorCode === '500' && errorType === 'routes') && (
                    <Typography variant={'subheading'}>
                      <FormattedHTMLMessage id="errorPage.unhandledError" />
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'orgStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(ErrorPage)
  )
);
