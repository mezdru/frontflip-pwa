import React from 'react';
import { FormattedMessage, injectIntl, FormattedHTMLMessage } from 'react-intl';
import { inject, observer } from 'mobx-react';
import { Redirect } from 'react-router-dom';

import { Button, CircularProgress, Grid, TextField, Typography } from "@material-ui/core";
import SnackbarCustom from '../../utils/snackbars/SnackbarCustom';
import ReactGA from 'react-ga';
import LogRocket from 'logrocket';
import IntegrationButton from '../../utils/buttons/IntegrationButton';
import { getBaseUrl } from '../../../services/utils.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      registerErrors: null,
      registerSuccess: false,
      registerSuccessMessage: '',
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
    this.props.authStore.register()
      .then(() => {

        ReactGA.event({ category: 'User', action: 'Register with password' });
        LogRocket.info('User register with password.');

        if (this.props.commonStore.url.params.orgTag) {

          this.props.authStore.registerToOrg()
            .then((data) => {

              ReactGA.event({ category: 'User', action: 'Register to Organisation' });

              let cUser = this.props.userStore.currentUser;

              if (cUser && cUser.email && cUser.email.validated) {
                // User already validated, redirect to onboard.
                this.setState({ redirectTo: getBaseUrl(this.props) });
              } else {
                // New User, shows success message.
                this.setState(
                  {
                    registerSuccess: true,
                    registerSuccessMessage: this.props.intl.formatMessage({ id: 'signup.success' })
                  },
                );
              }

            }).catch((err) => {

              this.setState({ registerSuccess: true });
              this.setState({ registerSuccessMessage: this.props.intl.formatMessage({ id: 'signup.warning.forbiddenOrg' }, { orgName: this.props.orgStore.currentOrganisation.name }) });

            });
        } else {

          this.setState({ registerSuccessMessage: this.props.intl.formatMessage({ id: 'signup.success' }) });
          this.setState({ registerSuccess: true });

        }

      }).catch((err) => {

        let errorMessage;

        if (err.status === 422) {

          err.response.body.errors.forEach(error => {

            if (error.param === 'password') {

              if (error.type === 'dumb') {

                // (frequency over 100 000 passwords, 3 000 000 000 people use internet, 30 000 = 3 000 000 000 / 100 000)
                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({ id: 'signup.error.dumbPassword' }, { dumbCount: (parseInt(error.msg) * 30000).toLocaleString() });

              } else {

                errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({ id: 'signup.error.shortPassword' });
              }

            } else if (error.param === 'email') {

              errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({ id: 'signup.error.wrongEmail' });

            }
          });

        } else if (err.status === 400 && err.response.body.message === 'User already exists.') {

          errorMessage = this.props.intl.formatMessage({ id: 'signup.error.userExists' }, { forgotPasswordLink: '/' + this.props.commonStore.locale + '/password/forgot' });

        }

        if (!errorMessage) errorMessage = this.props.intl.formatMessage({ id: 'signup.error.generic' });
        this.setState({ registerErrors: errorMessage });

      });
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    let { registerErrors, registerSuccess, registerSuccessMessage, redirectTo } = this.state;
    let intl = this.props.intl;

    console.debug('%c Render Register.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');

    if (redirectTo) return <Redirect push to={redirectTo} />;

    if (registerSuccess) {
      return (
        <Grid container item direction='column' spacing={16}>
          <Grid item>
            <SnackbarCustom variant="success" message={registerSuccessMessage} />
          </Grid>
        </Grid>
      )
    } else {
      return (
        <form onSubmit={this.handleSubmitForm} id="form-register">
          <Grid container item direction='column' spacing={16}>
            {registerErrors && (
              <Grid item>
                <SnackbarCustom variant="warning" message={registerErrors} />
              </Grid>
            )}
            <Grid item container justify='center'>
              <Typography variant="h1" style={{ textAlign: 'center' }}>
                <FormattedHTMLMessage id="signup.title.org" />
              </Typography>
            </Grid>
            <Grid item container justify='center'>
              <Button variant="text" onClick={() => this.props.handleChangeIndex(0)} >
                <FormattedHTMLMessage id="signup.or.signin" />
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
                  <Button fullWidth={true} type="submit" color="secondary"><FormattedMessage id="Sign Up" /></Button>
                )
              }
            </Grid>
            <Grid item>
              <Typography style={{
                fontSize: '1rem',
                color: '#7c7c7c',
                textAlign: 'center'
              }}><FormattedHTMLMessage id="signup.or.integration" /></Typography>
            </Grid>
            <Grid container item direction="row" justify="center" spacing={16} >
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="google" /></Grid>
              <Grid item><IntegrationButton labelId={"Sign in with Google"} integrationTag="linkedin" /></Grid>
            </Grid>
          </Grid>
        </form>
      )
    }
  };
}

export default inject('authStore', 'userStore', 'orgStore', 'commonStore')(
  injectIntl(observer(
    Register
  ))
);
