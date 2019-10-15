import React from 'react'
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { inject, observer } from 'mobx-react';

import { Button, CircularProgress, Grid, TextField, Typography, withStyles } from "@material-ui/core";
import SnackbarCustom from '../../components/utils/snackbars/SnackbarCustom';
import UrlService from '../../services/url.service';
import { Redirect } from 'react-router-dom';
import ReactGA from 'react-ga';
import AuthLayout from '../../components/auth/AuthLayout';
import { getBaseUrl } from '../../services/utils.service';

console.debug('Loading PasswordReset');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const styles = (theme) => ({
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
    color: 'unset',
    paddingTop: 16,
    paddingBottom: 16,
    [theme.breakpoints.down(400)]: {
      padding: 5,
    }
  },
  form: {
    width: '100%',
  },
  term: {
    [theme.breakpoints.down('md')]: {
      justifyContent: 'end',
      padding: '8px 16px',
    }
  },
  protectingData: {
    [theme.breakpoints.down('md')]: {
      justifyContent: 'flex-end',
      padding: '8px 16px',
    }
  },
  offset: {
    position: 'relative',
    height: 64
  }
});

class PasswordReset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      passwordErrors: null,
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      userEmail: ((this.props.match.params && this.props.match.params.email) ? this.props.match.params.email : null),
      redirectTo: null
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

  handlePasswordChange = (e) => {
    this.props.authStore.setPassword(e.target.value)
  };

  handleSubmitForm = (e) => {
    e.preventDefault();
    this.props.authStore.updatePassword(this.props.match.params.token, this.props.match.params.hash)
      .then(response => {
        this.setState({ redirectTo: getBaseUrl(this.props) });
      }).catch(err => {
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
            }
          });
        }
        if (!errorMessage) this.props.intl.formatMessage({ id: 'signup.error.generic' });
        this.setState({ passwordErrors: errorMessage });
      });
  };

  render() {
    const { values, inProgress } = this.props.authStore;
    let { passwordErrors, userEmail, redirectTo } = this.state;
    let { classes, intl } = this.props;
    if (redirectTo) return <Redirect push to={redirectTo} />;

    return (
      <AuthLayout>
        <form onSubmit={this.handleSubmitForm} className={classes.form} id="form-password-reset">
          <div className={classes.offset}></div>
          <Grid item container direction={'column'} spacing={16}>
            {!userEmail && (
              <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.new.intro" values={{ userEmail: values.email }} /></Typography>
            )}
            {userEmail && (
              <div>
                <Grid item>
                  <Typography variant="h4" className={classes.title}>
                    {this.props.orgStore.currentOrganisation.tag ? (
                      <FormattedHTMLMessage id="password.create.title.orgTag" values={{ orgTag: this.props.orgStore.currentOrganisation.tag }} />
                    ) : (
                      <FormattedHTMLMessage id="password.create.title.noOrgTag" />
                    )}
                  </Typography>
                </Grid>
                <Typography variant="h6" className={classes.intro}><FormattedHTMLMessage id="password.create.intro" values={{ userEmail: values.email }} /></Typography>
              </div>
            )}
            {passwordErrors && (
              <Grid item>
                <SnackbarCustom variant='warning' message={passwordErrors} />
              </Grid>
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
                label={intl.formatMessage({ id: 'Password' })}
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
                  <CircularProgress color="secondary" />
                )
              }
              {!inProgress && (
                <Button fullWidth={true} type="submit" color="secondary">
                  {!userEmail && (
                    <FormattedMessage id="password.new.create" />
                  )}
                  {userEmail && (
                    <FormattedMessage id="password.create.next" />
                  )}
                </Button>
              )}
            </Grid>
            <Grid item container direction="row" justify={'space-between'}>
              <Grid item lg={6}>
                <Button className={classes.term} variant="text" fullWidth={true} component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                  <FormattedMessage id="menu.drawer.terms" />
                </Button>
              </Grid>
              <Grid item lg={6}>
                <Button className={classes.protectingData} variant="text" fullWidth={true} component="a" target="_blank" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                  <FormattedMessage id="menu.drawer.protectingYourData" style={{ justifyContent: 'flex-end!important' }} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </AuthLayout>
    );
  }
}

export default inject("authStore", "orgStore", "commonStore")(
  injectIntl(
    observer(
      withStyles(styles)(PasswordReset)
    )
  )
)
