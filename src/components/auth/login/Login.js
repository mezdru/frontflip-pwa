import React from 'react';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { Link, Redirect, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { Button, CircularProgress, Grid, TextField, Typography } from '@material-ui/core';
import SnackbarCustom from '../../utils/snackbars/SnackbarCustom';
import ReactGA from 'react-ga';
import LogRocket from 'logrocket';
import IntegrationButton from '../../utils/buttons/IntegrationButton';
import {getBaseUrl} from '../../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      redirectTo: null,
      loginErrors: null,
      isAuth: this.props.authStore.isAuth()
    };
  }

  componentDidMount() {
    let authState = this.props.authState;

    // In this case, the user try to Sign In with an integration (LinkedIn, ...) and we do not already have an account for him.
    // We will ask him to Sign In with an other method, then, we will link the integration to his account.
    if (authState && authState.action === 'signin' && authState.success === 'false') {
      let integrationName = (authState.integration ? authState.integration.charAt(0).toUpperCase() + authState.integration.slice(1) : '');
      this.setState({
        loginErrors: this.props.intl.formatMessage(
          { id: 'signin.error.integration.notFound' },
          {
            integrationName: integrationName,
            signupLink: getBaseUrl(this.props) + '/signup'
          }
        )
      });
    }

  }

  handleEmailChange = (e) => {
    this.props.authStore.setEmail(e.target.value);
    this.forceUpdate();
  };

  handlePasswordChange = (e) => {
    this.props.authStore.setPassword(e.target.value);
    this.forceUpdate();
  };

  signinSuccessRedirect = () => {
    let defaultRedirect = getBaseUrl(this.props);
    let wantedRedirect = this.props.commonStore.getCookie('wantedPath');
    if (wantedRedirect) this.props.commonStore.removeCookie('wantedPath');
    this.setState({ redirectTo: wantedRedirect || defaultRedirect });
  }

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.login()
      .then((response) => {
        if (response === 200) {
          ReactGA.event({ category: 'User', action: 'Login with password' });
          LogRocket.info('User login with password.');
          this.signinSuccessRedirect();
        } else {
          this.setState({ loginErrors: this.props.intl.formatMessage({ id: 'signin.error.generic' }) });
        }
      }).catch((err) => {
        this.setState({ loginErrors: this.getSigninErrorMessage(err) });
      });
  };

  getSigninErrorMessage = (err) => {
    let errorMessage;
    if (err.status === 404) {
      errorMessage = this.props.intl.formatMessage({ id: 'signin.error.unknown' });
    } else if (err.status === 403) {
      if (err.response.body.error_description === 'Wrong password.') {
        errorMessage = this.props.intl.formatMessage({ id: 'signin.error.wrongPassword' }, { forgotPasswordLink: '/' + this.props.commonStore.locale + '/password/forgot' });
      } else if (err.response.body.error_description === 'User use Google Auth.') {
        errorMessage = this.props.intl.formatMessage({ id: 'signin.error.useGoogle' });
      } else {
        errorMessage = this.props.intl.formatMessage({ id: 'signin.error.noPassword' }, { forgotPasswordLink: '/' + this.props.commonStore.locale + '/password/forgot' });
      }
    }
    if (!errorMessage) errorMessage = this.props.intl.formatMessage({ id: 'signin.error.generic' });
    return errorMessage;
  }

  render() {
    const { values, inProgress } = this.props.authStore;
    const { currentOrganisation } = this.props.orgStore;
    let { loginErrors, redirectTo, isAuth } = this.state;
    const { locale } = this.props.commonStore;
    let intl = this.props.intl;

    console.debug('%c Render Login.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');

    if (redirectTo) {
      return <Redirect push to={redirectTo} />;
    }
    else if (isAuth) {
      return <Redirect push to={'/' + locale + (currentOrganisation ? '/' + currentOrganisation.tag : '')} />;
    }
    else {
      return (
        <form onSubmit={this.handleSubmitForm} id="form-login">
          <Grid container item direction='column' spacing={16}>
            {loginErrors && (
              <Grid item>
                <SnackbarCustom variant="warning" message={loginErrors} />
              </Grid>
            )}
            <Grid item container justify='center' style={{ textAlign: 'center' }}>
              <Typography variant="h1">
                <FormattedHTMLMessage id="signin.title.org" />
              </Typography>
            </Grid>
            <Grid item justify={'center'} container>
              <Button variant="text" onClick={() => this.props.handleChangeIndex(1)} >
                <FormattedHTMLMessage id="signin.or.create" />
              </Button>
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                fullWidth
                value={values.email}
                onChange={this.handleEmailChange}
                required
              />
            </Grid>
            <Grid item>
              <TextField
                label={intl.formatMessage({ id: 'Password' })}
                type="password"
                autoComplete="current-password"
                fullWidth
                value={values.password}
                onChange={this.handlePasswordChange}
                required
              />
            </Grid>
            <Grid item container justify={'center'}>
              {
                inProgress && (
                  <CircularProgress color="secondary" />
                )
              }
              {
                !inProgress && (
                  <Button fullWidth={true} color="secondary" type="submit"><FormattedMessage id="Sign In" /></Button>
                )
              }
            </Grid>
            <Grid item container justify="center">
              <Button component={Link}
                to={"/" + locale + (currentOrganisation ? '/' + currentOrganisation.tag : '') + "/password/forgot"}
                variant="text"
              >
                <FormattedMessage id="I don't have my password" />
              </Button>
            </Grid>
            <Grid item>
              <Typography style={{
                fontSize: '1rem',
                color: '#7c7c7c',
                textAlign: 'center'
              }}>
                <FormattedHTMLMessage id="signin.or.integration" />
              </Typography>
            </Grid>
            <Grid container item direction="row" justify="center" spacing={16} >
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="google" /></Grid>
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="linkedin" currentAction="signin" /></Grid>
            </Grid>
          </Grid>
        </form>
      )
    }
  };
}

export default inject('authStore', 'userStore', 'orgStore', 'commonStore')(
  injectIntl(observer(
    withRouter(Login)
  ))
);
