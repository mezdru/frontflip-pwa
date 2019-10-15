import React from 'react';
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';

import {Button, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import ReactGA from 'react-ga';
import AuthLayout from '../../components/auth/AuthLayout';

console.debug('Loading PasswordForgot');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = (theme) => ({
  container: {
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    },
  },
  intro: {
    textAlign: 'center',
    [theme.breakpoints.down(400)]: {
      padding: 5,
    }
  },
  form: {
    width: '100%',
  },
  offset: {
    position: 'relative',
    height: 64
  }
});

class PasswordForgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successPasswordReset: false,
      emailError: null,
      email: this.props.authStore.values.email
    }
    this.props.commonStore.setUrlParams(this.props.match);
  }

  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }
  
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    if (this.props.commonStore.url.params.orgTag) {
      this.props.orgStore.fetchForPublic(this.props.commonStore.url.params.orgTag);
    }
  }
  
  handleEmailChange = (e) => {
    // this.props.authStore.setEmail(e.target.value);
    // this.forceUpdate();
    this.setState({email: e.target.value});
  };
  
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.setEmail(this.state.email);
    this.props.authStore.passwordForgot()
      .then(response => {
        this.setState({successPasswordReset: true});
      }).catch(err => {
      this.setState({emailError: this.props.intl.formatMessage({id: 'signin.error.unknown'})});
      this.setState({successPasswordReset: false});
    });
  };
  
  render() {
    const {successPasswordReset, emailError, email} = this.state;
    const {classes, intl} = this.props;

    return (
      <AuthLayout>
        <Grid container item justify={"center"} className={classes.container}>
          {successPasswordReset && (
            <Grid container item spacing={16}>
              <Grid item container>
              <div className={classes.offset}></div>
                <SnackbarCustom variant="success" message={intl.formatMessage({id: 'password.forgot.success'})} />
              </Grid>
            </Grid>
          )}
          {!successPasswordReset && (
            <form onSubmit={this.handleSubmitForm} className={classes.form} id="form-password-forgot">
              <div className={classes.offset}></div>
              <Grid item container direction={'column'} spacing={16}>
                <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.forgot.intro"/></Typography>
                {emailError && (
                  <Grid item>
                    <SnackbarCustom variant="warning" message={emailError} />
                  </Grid>
                )}
                <Grid item style={{width: '100%'}}>
                  <TextField  label="Email"
                              type="email"
                              autoComplete="email"
                              variant={"outlined"}
                              fullWidth={true}
                              onChange={this.handleEmailChange}
                              value={email}
                              required
                  />
                </Grid>
                <Grid item>
                  <Button fullWidth={true} type="submit" color="secondary"><FormattedMessage id="password.forgot.send"/></Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Grid>
      </AuthLayout>
    );
  }
}

export default inject('authStore', 'orgStore', 'commonStore')(
  injectIntl(observer(withStyles(styles)(PasswordForgot)))
);
