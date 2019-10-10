import React, { Suspense } from "react";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "../translations/fr.json";
import messages_en from "../translations/en.json";
import { asyncForEach } from '../services/utils.service';
import { ConditionnalRoute } from "./ProtectedRoutes";
import undefsafe from 'undefsafe';
import ProfileProvider from "../hoc/profile/Profile.provider.js";

const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));
const OnboardPage = React.lazy(() => import('../pages/OnboardPage'));
const SearchPage = React.lazy(() => import('../pages/SearchPage'));
const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const WelcomePage = React.lazy(() => import('../pages/WelcomePage'));

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

const PROTECTED_TAG = ['signin', 'signup', 'welcome', 'error', 'password'];

class Routes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      authorizations: {
        canAccessOrg: false,
        belongsToOrg: false,
        isOnboarded: false,
        hasEmailValidated: false
      },
      isAuth: false,
      lastCheckedOrgTag: null,
      render: false,
      orgNotFound: false,
      fallbackOrgTag: null,
      redirectTo: null,
      shouldPushRedirectTo: false
    }

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
  }

  async componentDidMount() {
    try {document.getElementById('errorMessage').remove();}catch(e){};
    await this.getUserAndOrgs();
    await this.getNeededData();
  }
  componentWillReceiveProps(nextProps) {
    let path = nextProps.history.location.pathname;
    let params = path.split('/');
    if(this.state.lastCheckedOrgTag && params[2] === this.state.lastCheckedOrgTag) return;

    if(nextProps.history.action !== 'REPLACE')
      this.getNeededData();
  }

  async getUserAndOrgs() {
    if (this.props.authStore.isAuth()) {
      let cUser = await this.props.userStore.fetchCurrentUser();
      await asyncForEach(cUser.orgsAndRecords, async (orgAndRecord) => {
        await this.props.orgStore.fetchOrganisation(orgAndRecord.organisation);
        await this.props.recordStore.fetchRecord(orgAndRecord.record);
      });
    }
  }

  hasAccessToOrg = (user, org) => {
    if (!org) return false;
    if (org.public) return true;
    if (!user) return false;
    return (user.superadmin || this.props.userStore.currentOrgAndRecord != null);
  }

  getNeededData = async () => {
    let params = window.location.pathname.split('/');
    let orgTag = params[2] || null;
    let state = this.state;

    state.isAuth = this.props.authStore.isAuth();
    state.render = true;
    state.authorizations.hasEmailValidated = undefsafe(this.props.userStore.currentUser, 'email.validated') || false;
    state.authorizations.canAccessOrg = false;
    state.authorizations.belongsToOrg = false;
    state.authorizations.isOnboarded = false;
    state.lastCheckedOrgTag = null;


    try {
      state.fallbackOrgTag = (await this.props.orgStore.getOrFetchOrganisation(this.props.userStore.currentUser.orgsAndRecords[0].organisation)).tag;
    } catch (e) {}

    if (orgTag && !PROTECTED_TAG.find(t => t === orgTag)) { 
      try {
        await this.props.orgStore.getOrFetchOrganisation(null, orgTag).catch(e => { state.orgNotFound = true });
        if (!state.orgNotFound) {
          this.props.commonStore.url.params.orgTag = orgTag;
          state.authorizations.canAccessOrg = this.hasAccessToOrg(this.props.userStore.currentUser, this.props.orgStore.currentOrganisation);
          state.authorizations.belongsToOrg = (this.props.userStore.currentOrgAndRecord != null);
          state.authorizations.isOnboarded = (this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.welcomed) != null;
          state.lastCheckedOrgTag = this.props.orgStore.currentOrganisation.tag;
        }
      } catch (e) {}
    }
    [state.redirectTo, state.shouldPushRedirectTo] = this.getRedirectTo();
    this.setState(state);
  }

  // prepare state.redirectTo ?
  // redirection to /welcome doesn't display the page + sometimes infinity redirect loop
  getRedirectTo = () => {
    const { isAuth, orgNotFound, authorizations, lastCheckedOrgTag, fallbackOrgTag } = this.state;
    let redirect;
    let shouldPush = false;
    let localeUrl = '/' + this.props.commonStore.locale + '/';
    let baseUrl = localeUrl + lastCheckedOrgTag;

    if (!lastCheckedOrgTag && isAuth && !fallbackOrgTag) redirect = localeUrl + 'welcome';
    else if (fallbackOrgTag){redirect = localeUrl + fallbackOrgTag; shouldPush = true;}
    if (orgNotFound && lastCheckedOrgTag) redirect = localeUrl + 'error/404/organisation';
    if (isAuth && !authorizations.hasEmailValidated) redirect = localeUrl + 'error/403/email';
    if (isAuth && lastCheckedOrgTag && !authorizations.canAccessOrg) redirect = localeUrl + 'error/403/organisation';
    if (isAuth && authorizations.belongsToOrg && !authorizations.isOnboarded){redirect = baseUrl + '/onboard'; shouldPush=true;}

    return [redirect, shouldPush];
  }

  componentDidUpdate() {
    if(this.state.redirectTo)
      this.setState({redirectTo: null});
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  // SEARch profile sync issues/ load take too much time : component await data load before display him ?
  // ClapHistory component data load very weird : timeout needed. because sync issue
  // REDIRECTIONS doesn't work.
  render() {
    const { redirectTo, render, isAuth, orgNotFound, authorizations, lastCheckedOrgTag, fallbackOrgTag, shouldPushRedirectTo } = this.state;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if (defaultLocale === 'en-UK') defaultLocale = 'en';

    if (!render) return null;
    if (redirectTo && redirectTo !== window.location.pathname) return <Redirect to={redirectTo} push={shouldPushRedirectTo} />;
    return (
      <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
        <ProfileProvider>
          <Suspense fallback={<></>}>
            <Switch>

              {/* DONT FORGET failRedirect param on each custom route */}
              {/* TEST all routes  with user / user no auth / user admin / superadmin? */}

              <Route exact path="/:locale(en|fr|en-UK)/welcome" component={WelcomePage} />
              <Route exact path="/:locale(en|fr|en-UK)/error/:errorCode/:errorType" component={ErrorPage} />

              <Route
                exact
                path={[
                  "/:locale(en|fr|en-UK)/password/forgot",
                  "/:locale(en|fr|en-UK)/:orgTag/password/forgot"
                ]}
                component={(PasswordForgot)}
              />

              <Route
                exact
                path={[
                  "/:locale(en|fr|en-UK)/password/reset/:token/:hash",
                  "/:locale(en|fr|en-UK)/password/create/:token/:hash/:email",
                  "/:locale(en|fr|en-UK)/:orgTag/password/reset/:token/:hash",
                  "/:locale(en|fr|en-UK)/:orgTag/password/create/:token/:hash/:email"
                ]}
                component={(PasswordReset)}
              />

              <Route
                exact
                path={[
                  "/:locale(en|fr|en-UK)/(signin|signup)",
                  "/:locale(en|fr|en-UK)/:orgTag/(signup|signin)/google/callback",
                  "/:locale(en|fr|en-UK)/:orgTag/(signup|signin)/:invitationCode?"
                ]}
                component={(AuthPage)}
              />

              <ConditionnalRoute
                condition={isAuth && authorizations.belongsToOrg}
                failRedirect={'/'}
                exact
                path={[
                  "/:locale(en|fr|en-UK)/:orgTag/onboard/:step?",
                  "/:locale(en|fr|en-UK)/:orgTag/onboard/:step/edit/:recordTag"
                ]}
                component={(OnboardPage)}
              />

              <ConditionnalRoute
                condition={authorizations.canAccessOrg}
                failRedirect={'/failed'}
                path={[
                  "/:locale(en|fr|en-UK)/:orgTag/congrats",
                  "/:locale(en|fr|en-UK)/:orgTag/:hashtags/:action",
                  "/:locale(en|fr|en-UK)/:orgTag/:recordTag?"
                ]}
                component={SearchPage}
              />

              <Route path="/" render={
                () => <Redirect to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag + '' : '') + window.location.search} />
              }
              />

            </Switch>
          </Suspense>
        </ProfileProvider>
      </IntlProvider>
    )
  }
}

export default withRouter(inject('authStore', 'userStore', 'commonStore', 'orgStore', 'recordStore')(
  (observer(
    Routes
  )))
);
