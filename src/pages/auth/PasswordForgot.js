import React from 'react';
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';

import {Button, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import Banner from '../../components/utils/banner/Banner';
import Header from '../../components/header/Header';
import Logo from '../../components/utils/logo/Logo';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import ReactGA from 'react-ga';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);
ReactGA.pageview(window.location.pathname);

const styles = (theme) => ({
  logo: {
    width: 110,
    height: 110,
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: 60,
    zIndex: 2,
    marginBottom: -50,
    [theme.breakpoints.down('xs')]: {
      marginBottom: -56,
    }
  },
  container: {
    [theme.breakpoints.down('xs')]: {
      padding: 8,
    }
  },
  intro: {
    textAlign: 'center',
    [theme.breakpoints.down(400)]: {
      padding: 5,
    }
  },
  form: {
    width: '100%',
  }
});

class PasswordForgot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successPasswordReset: false,
      emailError: null
    }
  }
  
  componentDidMount() {
    if (this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
      this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
      this.props.organisationStore.getOrganisationForPublic();
    }
  }
  
  handleEmailChange = (e) => {
    this.props.authStore.setEmail(e.target.value);
  };
  
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.passwordForgot()
      .then(response => {
        this.setState({successPasswordReset: true});
      }).catch(err => {
      this.setState({emailError: this.props.intl.formatMessage({id: 'signin.error.unknown'})});
      this.setState({successPasswordReset: false});
    });
  };
  
  render() {
    let {successPasswordReset, emailError} = this.state;
    let {classes, intl} = this.props;
    
    return (
      <Grid container direction={"column"} justify={"space-around"}>
        <Grid container item >
          <Header />
        </Grid>
        <Grid container item alignItems={"stretch"}>
          <Banner />
        </Grid>
        <Grid container item justify={"center"}>
          <Logo type={"organisation"} alt="org-logo" className={classes.logo} />
        </Grid>
        <Grid container item justify={"center"} className={classes.container}>
          {successPasswordReset && (
            <Grid container item xs={12} sm={6} lg={4} spacing={16}>
              <Grid item container>
                <SnackbarCustom variant="success" message={intl.formatMessage({id: 'password.forgot.success'})} />
              </Grid>
            </Grid>
          )}
          {!successPasswordReset && (
            <form onSubmit={this.handleSubmitForm} className={classes.form}>
              <Grid item container direction={'column'} xs={12} sm={6} lg={4} spacing={16}>
                <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.forgot.intro"/></Typography>
                {emailError && (
                  <Grid item>
                    <SnackbarCustom variant="warning" message={emailError} />
                  </Grid>
                )}
                <Grid item>
                  <TextField label="Email"
                             type="email"
                             autoComplete="email"
                             variant={"outlined"}
                             fullWidth={true}
                             onChange={this.handleEmailChange}
                             required
                  />
                </Grid>
                <Grid item>
                  <Button fullWidth={true} type="submit" color="primary"><FormattedMessage id="password.forgot.send"/></Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Grid>
      </Grid>
    );
  }
}

export default inject('authStore', 'organisationStore')(
  injectIntl(observer(withStyles(styles)(PasswordForgot)))
);
