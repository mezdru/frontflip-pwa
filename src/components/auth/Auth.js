import React from 'react';
import {injectIntl} from 'react-intl';
import {Redirect} from 'react-router-dom';
import {observe} from 'mobx';
import {inject, observer} from 'mobx-react';

import {Grid, Tab, Tabs} from '@material-ui/core';
import {withTheme, withStyles} from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Login from './login/Login';
import Register from './register/Register';
import UrlService from '../../services/url.service';
import ReactGA from 'react-ga';
import OAuth from './OAuth';
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
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      observer: ()=> {}
    };
  };
  
  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    if (this.props.authStore.values.invitationCode) this.setState({ value: 1 });
    this.setState({observer: observe(this.props.authStore.values, 'invitationCode', (change) => {
      this.setState({ value: 1 });
    })});
  }

  componentWillUnmount() {
    this.state.observer();
  }

  performGoogleCallbackAuth = (token, googleState) => {
    if(this.state.performInProgress) return;
    else 
      this.setState({performInProgress: true}, () => {
        this.handleGoogleCallback(token)
        .then(() => {
          this.props.userStore.getCurrentUser()
            .then((user) => {
              ReactGA.event({category: 'User',action: 'Login with Google'});
              if (googleState && googleState.invitationCode) this.props.authStore.setInvitationCode(googleState.invitationCode);
              if(user.superadmin){
                this.setState({redirectTo: '/' + this.state.locale + (this.props.organisationStore.values.organisation.tag ? '/'+this.props.organisationStore.values.organisation.tag : '')});
                return;
              }
              this.props.authStore.registerToOrg()
              .then((data) => {
                let organisation = data.organisation;
                let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
                if (currentOrgAndRecord) this.props.recordStore.setRecordId(currentOrgAndRecord.record);
                this.props.recordStore.getRecord()
                  .then(() => this.setState({ redirectTo: '/' + this.state.locale + '/' + this.props.organisationStore.values.organisation.tag }))
                  .catch(() => window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag));
              }).catch((err) => this.setState({redirectTo: '/' + this.state.locale + '/' + this.props.organisationStore.values.organisation.tag}));
            }).catch((err) => this.setState({redirectTo: '/' + this.state.locale}));
        }).catch((err) => {return;});
      });
  }

  handleGoogleCallback = async (token) => {
    if(!token) return Promise.reject('No token');
    this.props.authStore.setTemporaryToken(token);
    return this.props.authStore.googleCallbackLogin();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const {classes, theme} = this.props;
    const {redirectTo} = this.state;
    let intl = this.props.intl;
    if (redirectTo) return (<Redirect push to={redirectTo} />);
    const OAuthComponent = ({...props}) => (<OAuth provider={['google']} manageGoogleCb={this.performGoogleCallbackAuth} />);

    return (
      <Grid container spacing={16}>
        <Grid item xs={12} className={classes.tabs}>
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant={'fullWidth'}
          >
            <Tab label={intl.formatMessage({id: 'Sign In'})} className={classes.leftTabs}/>
            <Tab label={intl.formatMessage({id: 'Sign Up'})} className={classes.rightTabs}/>
          </Tabs>
        </Grid>
        <Grid item xs={12}>
          <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <Login handleGoogleAuth={this.handleGoogleAuth}><OAuthComponent /></Login>
            <Register handleGoogleAuth={this.handleGoogleAuth}><OAuthComponent /></Register>
          </SwipeableViews>
        </Grid>
      </Grid>
    );
  }
}

export default inject('authStore', 'organisationStore', 'commonStore', 'userStore', 'recordStore')(
  withTheme()(
    withStyles(styles, {withTheme: true})(
      injectIntl(observer((Auth)))
    )
  )
);
