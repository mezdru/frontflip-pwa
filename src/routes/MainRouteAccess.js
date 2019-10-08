import React from 'react';
import { CircularProgress } from '@material-ui/core';
import undefsafe from 'undefsafe';
import { withRouter, Switch, Route, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import { getBaseUrl } from '../services/utils.service';
import ProfileProvider from "../hoc/profile/Profile.provider";

const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));
const OnboardPage = React.lazy(() => import('../pages/OnboardPage'));
const SearchPage = React.lazy(() => import('../pages/SearchPage'));
const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));

class MainRouteAccess extends React.PureComponent {

  state = {
    isAuth: false,
    hasAccessToOrg: false,
    lastCheckedOrgTag: null,
    isRelativeToOrg: false,
    isOnboarded: false,
    render: false,
    isEmailValidated: false,
    orgNotFound: false,
    fallbackOrgTag: null,
  }

  hasAccessToOrg = (user, org) => {
    if (!org) return false;
    if (org.public) return true;
    if (!user) return false;
    return (user.superadmin || this.props.userStore.currentOrgAndRecord != null);
  }

  setUrlParams = (props) => {
    this.props.commonStore.url.params = {
      orgTag: undefsafe(props.match, 'params.organisationTag') || null,
      recordTag: undefsafe(props.match, 'params.recordTag') || null,
      hashtags: undefsafe(props.match, 'params.hashtags') || null,
      action: undefsafe(props.match, 'params.action') || null,
      invitationCode: undefsafe(props.match, 'params.invitationCode') || null,
      onboardMode: undefsafe(props.match, 'params.mode') || null
    };
  }

  updateState = async (orgTag) => {
    let state = {
      isAuth: this.props.authStore.isAuth(),
      render: true,
      isEmailValidated: undefsafe(this.props.userStore.currentUser, 'email.validated')
    };

    try {
      state.fallbackOrgTag = this.props.orgStore.getOrganisation(this.props.userStore.currentUser.orgsAndRecords[0].organisation).tag;
    } catch (e) { }

    if (orgTag) {
      try {
        await this.props.orgStore.getOrFetchOrganisation(null, orgTag).catch(e => { state.orgNotFound = true });

        if (!state.orgNotFound) {
          state = {
            hasAccessToOrg: this.hasAccessToOrg(this.props.userStore.currentUser, this.props.orgStore.currentOrganisation),
            isRelativeToOrg: (this.props.userStore.currentOrgAndRecord != null),
            isOnboarded: (this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.welcomed) != null,
            lastCheckedOrgTag: this.props.orgStore.currentOrganisation.tag,
            orgNotFound: false,
            ...state
          }
        }
      } catch (e) {
        console.error(e);
        state = { hasAccessToOrg: false, isRelativeToOrg: false, isOnboarded: false, lastCheckedOrgTag: null };
      }
    }
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    this.setUrlParams(nextProps);
    let orgTag = undefsafe(nextProps.match, 'params.organisationTag');
    if (orgTag !== undefsafe(this.props.match, 'params.organisationTag'))
      this.updateState(orgTag);
  }

  componentWillMount() {
    this.setUrlParams(this.props);
    this.updateState(undefsafe(this.props.match, 'params.organisationTag'));
  }

  WaitingComponent(Component, additionnalProps) {
    return props => (
      <React.Suspense fallback={<CircularProgress color='secondary' />}>
        <Component {...props} {...additionnalProps} />
      </React.Suspense>
    );
  }

  render() {
    const { render, isOnboarded, isRelativeToOrg, isAuth, hasAccessToOrg, isEmailValidated, orgNotFound, lastCheckedOrgTag, fallbackOrgTag } = this.state;
    const { locale } = this.props.commonStore;
    if (!render) return (<div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%' }}><CircularProgress color='secondary' /></div>);
    console.log('organisation: ' + this.props.commonStore.url.params.orgTag);
    console.log('record: ' + this.props.commonStore.url.params.recordTag);
    console.log('%c' + this.props.match.path, "color:red");

    let baseUrl = getBaseUrl(this.props);

    if (orgNotFound) return <Redirect to={'/' + locale + '/error/404/organisation'} />;
    if (isAuth && !isEmailValidated) return <Redirect to={'/' + locale + '/error/403/email'} />;
    if (isAuth && lastCheckedOrgTag && !hasAccessToOrg) return <Redirect to={'/' + locale + '/error/403/organisation'} />;
    if (isAuth && isRelativeToOrg && !isOnboarded) return <Redirect to={baseUrl + '/onboard'} />;

    if (isAuth && isRelativeToOrg) {
      return (
        <ProfileProvider>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step?" component={this.WaitingComponent(OnboardPage)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/:mode" component={this.WaitingComponent(OnboardPage)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/:mode/:recordTag" component={this.WaitingComponent(OnboardPage)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/:recordTag?" component={this.WaitingComponent(SearchPage)} />
            <Route path="/" render={() => <Redirect to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag + '' : '') + window.location.search} />} />
          </Switch>
        </ProfileProvider>
      )
    } else if (isAuth) {
      return (
        <ProfileProvider>
          <Switch>
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/:recordTag?" component={this.WaitingComponent(SearchPage)} />
            <Route path="/" render={() => <Redirect to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag + '/' : '') + window.location.search} />} />
          </Switch>
        </ProfileProvider>
      )
    } else if (hasAccessToOrg) {
      return (
        <ProfileProvider>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={this.WaitingComponent(PasswordReset)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={this.WaitingComponent(PasswordReset)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/google/callback" component={this.WaitingComponent(AuthPage)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/:invitationCode?" component={this.WaitingComponent(AuthPage)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/:recordTag?" component={this.WaitingComponent(SearchPage)} />
            <Redirect to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag : '') + '/signin' + window.location.search} />
          </Switch>
        </ProfileProvider>
      )
    } else {
      return (
        <ProfileProvider>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={this.WaitingComponent(PasswordReset)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={this.WaitingComponent(PasswordReset)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/google/callback" component={this.WaitingComponent(AuthPage)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/:invitationCode?" component={this.WaitingComponent(AuthPage)} />
            <Redirect to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag : '') + '/signin' + window.location.search} />
          </Switch>
        </ProfileProvider>
      )
    }
  }
}

export default withRouter(inject('commonStore', 'authStore', 'orgStore', 'userStore', 'recordStore')(
  observer(
    (MainRouteAccess)
  ))
);