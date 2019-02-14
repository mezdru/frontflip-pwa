import React from 'react'
import {FormattedHTMLMessage, FormattedMessage, injectIntl} from 'react-intl';
import {inject, observer} from 'mobx-react';

import {Button, CircularProgress, Grid, TextField, Typography, withStyles} from "@material-ui/core";
import Banner from '../../components/utils/banner/Banner';
import Header from '../../components/header/Header';
import Logo from '../../components/utils/logo/Logo';
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import UrlService from '../../services/url.service';
import {Redirect} from 'react-router-dom';
import ReactGA from 'react-ga';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

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
  title: {
    textAlign: 'center',
    paddingTop: 16,
    paddingBottom:16,
    [theme.breakpoints.down(400)]: {
      padding: 5,
    } 
  },
  form: {
    width: '100%',
  }
});

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordErrors: null,
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      userEmail: ( (this.props.match.params && this.props.match.params.email) ? this.props.match.params.email : null ),
      redirectTo: null
    }
  }
  
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    if (this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
      this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
      this.props.organisationStore.getOrganisationForPublic();
    }
  }
  
  handlePasswordChange = (e) => {
    this.props.authStore.setPassword(e.target.value)
  };
  
  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.updatePassword(this.props.match.params.token, this.props.match.params.hash)
      .then(response => {
        this.setState({redirectTo: '/' + this.props.commonStore.locale + (this.props.organisationStore.values.orgTag ? '/'+this.props.organisationStore.values.orgTag : '')});
      }).catch(err => {
      let errorMessage;
      if (err.status === 422) {
        err.response.body.errors.forEach(error => {
          if (error.param === 'password') {
            if (error.type === 'dumb') {
              // (frequency over 100 000 passwords, 3 000 000 000 people use internet, 30 000 = 3 000 000 000 / 100 000)
              errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.dumbPassword'}, {dumbCount: (parseInt(error.msg) * 30000).toLocaleString()});
            } else {
              errorMessage = (errorMessage ? errorMessage + '<br/>' : '') + this.props.intl.formatMessage({id: 'signup.error.shortPassword'});
            }
          }
        });
      }
      if (!errorMessage) this.props.intl.formatMessage({id: 'signup.error.generic'});
      this.setState({passwordErrors: errorMessage});
    });
  };
  
  render() {
    const {values, inProgress} = this.props.authStore;
    let {passwordErrors, userEmail, redirectTo} = this.state;
    let {classes, intl} = this.props;

    if(redirectTo) return <Redirect push to={redirectTo}/>;
    
    return (
      <Grid container direction={"column"} justify={"space-around"}>
        <Grid container item>
          <Header/>
        </Grid>
        <Grid container item alignItems={"stretch"}>
          <Banner/>
        </Grid>
        <Grid container item justify={"center"}>
          <Logo type={"organisation"} alt="org-logo" className={classes.logo}/>
        </Grid>
        <Grid container item justify={"center"} className={classes.container}>
          <form onSubmit={this.handleSubmitForm} className={classes.form}>
            <Grid item container direction={'column'} xs={12} sm={6} lg={4} spacing={16}>
              {!userEmail && (
                <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.new.intro" values={{userEmail: values.email}}/></Typography>
              )}
              {userEmail && (
                <div>
                  <Grid item>
                    <Typography variant="h4" className={classes.title}>
                      {this.props.organisationStore.values.orgTag && (
                        <FormattedHTMLMessage id="password.create.title.orgTag" values={{orgTag: this.props.organisationStore.values.orgTag}} />
                      )}
                      {!this.props.organisationStore.values.orgTag && (
                        <FormattedHTMLMessage id="password.create.title.noOrgTag" />
                      )}
                    </Typography>
                  </Grid>
                  <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.create.intro" values={{userEmail: values.email}}/></Typography>
                </div>
               )}
              {passwordErrors && (
                <SnackbarCustom variant='warning' message={passwordErrors}/>
              )}
              {userEmail && (
                <Grid item>
                  <TextField
                    label="Email"
                    fullWidth
                    variant={"outlined"}
                    disabled
                    value={userEmail}
                  />
                </Grid>
              )}
              <Grid item>
                <TextField
                  label={intl.formatMessage({id: 'Password'})}
                  type="password"
                  fullWidth
                  variant={"outlined"}
                  onChange={this.handlePasswordChange}
                  required
                />
              </Grid>
              <Grid item>
                {
                  inProgress && (
                    <CircularProgress color="primary"/>
                  )
                }
                {!inProgress && (
                    <Button fullWidth={true} type="submit" color="primary">
                      {!userEmail && (
                        <FormattedMessage id="password.new.create"/>
                      )}
                      {userEmail && (
                        <FormattedMessage id="password.create.next"/>
                      )}
                    </Button>
                )}
              </Grid>
              <Grid item container direction="row" justify="space-around" alignItems="center">
                <Grid item>
                  <Button variant="text" component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                    <FormattedMessage id="menu.drawer.terms" />
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="text" component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                    <FormattedMessage id="menu.drawer.protectingYourData" />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default inject("authStore", "organisationStore", "commonStore")(
  injectIntl(
    observer(
      withStyles(styles)(PasswordReset)
    )
  )
)
