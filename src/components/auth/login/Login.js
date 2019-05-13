import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {Link, Redirect} from 'react-router-dom';
import {inject, observer} from 'mobx-react';

import {Button, CircularProgress, Grid, TextField, Typography} from '@material-ui/core';
import SnackbarCustom from '../../utils/snackbars/SnackbarCustom';
import ReactGA from 'react-ga';
import LogRocket from 'logrocket';
import IntegrationButton from '../../utils/buttons/IntegrationButton';

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

  handleEmailChange = (e) => {
    this.props.authStore.setEmail(e.target.value);
  };

  handlePasswordChange = (e) => {
    this.props.authStore.setPassword(e.target.value)
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.login()
      .then((response) => {
        if (response === 200) {
          ReactGA.event({category: 'User',action: 'Login with password'});
          LogRocket.info('User login with password.');
          this.setState({ redirectTo: '/' + this.props.commonStore.locale + (this.props.organisationStore.values.orgTag ? '/' + this.props.organisationStore.values.orgTag : '') });
        } else {
          this.setState({ loginErrors: this.props.intl.formatMessage({ id: 'signin.error.generic' }) });
        }
      }).catch((err) => {
        // Err can have 3 forms : User has no password. || Wrong password. || User does not exists.
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
        this.setState({ loginErrors: errorMessage });
      });
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    const { orgTag } = this.props.organisationStore.values;
    let { loginErrors, redirectTo, isAuth } = this.state;
    const {locale} = this.props.commonStore;
    let intl = this.props.intl;
    if (redirectTo){
      return <Redirect push to={redirectTo} />;
    }
    else if (isAuth) {
      return <Redirect push to={'/' + locale + (orgTag ? '/' + orgTag : '')} />;
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
            <Grid container item direction="row" justify="center"  spacing={16} >
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="google" /></Grid>
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="linkedin" /></Grid>            
            </Grid>
            <Grid item>
              <Typography style={{
                fontSize: '1rem',
                color: '#7c7c7c',
                textAlign: 'center'
              }}><FormattedMessage id="or" /></Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Email"
                type="email"
                autoComplete="email"
                fullWidth
                variant={"outlined"}
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
                variant={"outlined"}
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
            <Grid item>
              <Button component={Link}
                      to={"/" + locale + (orgTag ? '/' + orgTag : '') + "/password/forgot"}
                      variant="text"
                      fullWidth={true}
              >
                <FormattedMessage id="I don't have my password" />
              </Button>
            </Grid>
          </Grid>
        </form>
      )
    }
  };
}

export default inject('authStore', 'userStore', 'organisationStore', 'commonStore')(
  injectIntl(observer(
    (Login)
  ))
);
