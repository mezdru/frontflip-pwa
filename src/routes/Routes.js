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

  // SEARch profile sync issues/ load take too much time : component await data load before display him ?
  // ClapHistory component data load very weird : timeout needed. because sync issue
  // REDIRECTIONS doesn't work.

  getAuthorizations = async (orgTag) => {
    let state = {isAuth: this.props.authStore.isAuth(), render: true, authorizations: {
      hasEmailValidated: (undefsafe(this.props.userStore.currentUser, 'email.validated') || false)
    }};

    try { state.fallbackOrgTag = (await this.props.orgStore.getOrFetchOrganisation(this.props.userStore.currentUser.orgsAndRecords[0].organisation)).tag } catch (e) { };

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
      } catch (e) { }
    }
    return state;
  }

  getRedirectTo = (state, locale) => {
    const { isAuth, orgNotFound, authorizations, lastCheckedOrgTag, fallbackOrgTag } = state;
    let redirect = null;
    let shouldPush = false;
    let localeUrl = '/' + (locale || this.props.commonStore.locale) + '/';
    let baseUrl = localeUrl + lastCheckedOrgTag;

    if (!lastCheckedOrgTag && isAuth && !fallbackOrgTag) redirect = localeUrl + 'welcome';
    else if (fallbackOrgTag) { redirect = localeUrl + fallbackOrgTag; shouldPush = true; }
    if (orgNotFound && lastCheckedOrgTag) redirect = localeUrl + 'error/404/organisation';
    if (isAuth && !authorizations.hasEmailValidated) redirect = localeUrl + 'error/403/email';
    if (isAuth && lastCheckedOrgTag && !authorizations.canAccessOrg) redirect = localeUrl + 'error/403/organisation';
    if (isAuth && authorizations.belongsToOrg && !authorizations.isOnboarded) { redirect = baseUrl + '/onboard'; shouldPush = true; }

    return [redirect, shouldPush];
  }

  handleRouter = async (orgTag, locale) => {
    let state = await this.getAuthorizations(orgTag);
    [state.redirectTo, state.shouldPushRedirectTo] = this.getRedirectTo(state, locale);
    this.setState(state, () => {console.log(this.state)});
  }


  componentDidMount() {
    try { document.getElementById('errorMessage').remove(); } catch (e) { };
    let path = this.props.history.location.pathname;
    let [emptyParam, locale, orgTag] = path.split('/');
    this.getUserAndOrgs()
    .then(() => this.handleRouter(orgTag, locale));
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) return true;

    let path = nextProps.history.location.pathname;
    let [emptyParam, locale, orgTag] = path.split('/');
    if(orgTag !== this.state.lastCheckedOrgTag)
      this.handleRouter(orgTag, locale);

    return false;
  }

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
          <Suspense fallback={<div style={{ position: 'fixed', top: '45%', width: '100%', textAlign: 'center' }}><CircularProgress color="secondary" /></div>}>
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
                () => <Redirect push to={'/' + locale + (fallbackOrgTag ? '/' + fallbackOrgTag + '' : '') + window.location.search} />
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
