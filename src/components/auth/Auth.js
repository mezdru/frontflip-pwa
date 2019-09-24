import React from 'react';
import { injectIntl } from 'react-intl';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { Grid } from '@material-ui/core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import Login from './login/Login';
import Register from './register/Register';
import ReactGA from 'react-ga';
import emailService from '../../services/email.service';

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

const queryString = require('query-string');

const styles = (theme) => ({
  tabs: {
    marginTop: -8,
    [theme.breakpoints.down('xs')]: {
      padding: '8px 0 8px 0!important',
    }
  },
  leftTabs: {
    paddingLeft: 8,
    textAlign: 'left',
    [theme.breakpoints.down('xs')]: {
      paddingLeft: 16,
    },
  },
  rightTabs: {
    paddingRight: 8,
    textAlign: 'right',
    [theme.breakpoints.down('xs')]: {
      paddingRight: 16,
    },
  }
});

class Auth extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialTab,
      queryParams: queryString.parse(window.location.search),
      displayLoader: false,
      redirectTo: null,
      observer: () => { }
    };
    console.debug('Construct Auth.js')
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.initialTab) {
      this.setState({ value: nextProps.initialTab })
    }
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    if (this.props.authStore.values.invitationCode) this.setState({ value: 1 });

    // HANDLE INTEGRATION AUTH CALLBACK
    this.handleIntegrationCallback(this.state.queryParams)
      .then(() => {
        let integrationState = (this.state.queryParams.state ? JSON.parse(this.state.queryParams.state) : null);
        if (integrationState && integrationState.integrationState && (integrationState.integrationState.linkedin === 'true')) emailService.sendConfirmIntegrationEmail('LinkedIn').catch(e => console.error(e));
        this.props.userStore.getCurrentUser()
          .then((user) => {
            ReactGA.event({ category: 'User', action: 'Login with Google' });
            if (integrationState && integrationState.invitationCode) this.props.authStore.setInvitationCode(integrationState.invitationCode);
            if (user.superadmin) {
              this.setState({ redirectTo: this.getDefaultRedirectPath() });
              return;
            }
            this.props.authStore.registerToOrg()
              .then((data) => {
                let organisation = data.organisation;
                let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
                if (currentOrgAndRecord) this.props.recordStore.setRecordId(currentOrgAndRecord.record);

                this.props.recordStore.getRecord()
                  .then(() => this.signinSuccessRedirect())
                  .catch(() => this.setState({ redirectTo: this.getDefaultRedirectPath() + '/onboard' }));
              }).catch((err) => this.setState({ redirectTo: this.getDefaultRedirectPath() }));
          }).catch((err) => this.setState({ redirectTo: '/' + this.props.commonStore.locale }));
      }).catch((err) => { return; });
  }

  signinSuccessRedirect = () => {
    let defaultRedirect = this.getDefaultRedirectPath();
    let wantedRedirect = this.props.commonStore.getSessionStorage('signinSuccessRedirect');
    if (wantedRedirect) this.props.commonStore.removeSessionStorage('signinSuccessRedirect');
    this.setState({ redirectTo: wantedRedirect || defaultRedirect });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  handleIntegrationCallback = async (query) => {
    if (!query || !query.token) return Promise.reject('No token');
    this.props.authStore.setTemporaryToken(query.token);
    if (query.state.success === 'false') return Promise.reject('Auth failed');
    return this.props.authStore.googleCallbackLogin();
  }

  getDefaultRedirectPath = () => {
    let orgTag = this.props.organisationStore.values.orgTag;
    let organisation = this.props.organisationStore.values.organisation;
    return '/' + this.props.commonStore.locale + '/' + orgTag || (organisation ? organisation.tag : '');
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { redirectTo } = this.state;
    let authState = JSON.parse(this.state.queryParams.state || "{}");

    console.debug('%c Render Auth.js', 'background-color: grey; padding: 6px 12px; border-radius: 5px; color: white;');

    if (redirectTo) return (<Redirect push to={redirectTo} />);

    return (
      <Grid container>
        <Grid item xs={12}>
          {this.state.value === 0 && (
            <Login authState={authState} getDefaultRedirectPath={this.getDefaultRedirectPath} handleChangeIndex={this.handleChangeIndex} />
          )}
          {this.state.value === 1 && (
            <Register handleChangeIndex={this.handleChangeIndex} />
          )}
        </Grid>
      </Grid>
    );
  }
}

export default inject('authStore', 'organisationStore', 'commonStore', 'userStore', 'recordStore')(
  withTheme()(
    withStyles(styles, { withTheme: true })(
      injectIntl(observer((Auth)))
    )
  )
);
