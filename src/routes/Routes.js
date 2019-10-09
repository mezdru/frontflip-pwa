import React, { Suspense } from "react";
import { Route, Switch, withRouter, Link, Redirect } from 'react-router-dom';
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

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React, { hotReloadBufferMs: 1500 });
}

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
    }

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
    this.getUserAndOrgs();
  }

  async getUserAndOrgs() {
    if (this.props.authStore.isAuth()) {
      let cUser = await this.props.userStore.fetchCurrentUser();
      await asyncForEach(cUser.orgsAndRecords, async (orgAndRecord) => {
        await this.props.orgStore.fetchOrganisation(orgAndRecord.organisation);
        await this.props.recordStore.fetchRecord(orgAndRecord.record);
      });
      await this.updateAuthorizations();
    }
  }

  hasAccessToOrg = (user, org) => {
    if (!org) return false;
    if (org.public) return true;
    if (!user) return false;
    return (user.superadmin || this.props.userStore.currentOrgAndRecord != null);
  }

  updateAuthorizations = async () => {
    let params = window.location.pathname.split('/');
    let orgTag = params[2];
    this.props.commonStore.url.params.orgTag = orgTag;
    let state = this.state;

    state.isAuth = this.props.authStore.isAuth();
    state.render = true;
    state.authorizations.hasEmailValidated = undefsafe(this.props.userStore.currentUser, 'email.validated') || false;

    try {
      state.fallbackOrgTag = this.props.orgStore.getOrganisation(this.props.userStore.currentUser.orgsAndRecords[0].organisation).tag;
    } catch (e) { }

    if (orgTag) {
      try {
        await this.props.orgStore.getOrFetchOrganisation(null, orgTag).catch(e => { state.orgNotFound = true });

        if (!state.orgNotFound) {
          state.authorizations.canAccessOrg = this.hasAccessToOrg(this.props.userStore.currentUser, this.props.orgStore.currentOrganisation);
          state.authorizations.belongsToOrg = (this.props.userStore.currentOrgAndRecord != null);
          state.authorizations.isOnboarded = (this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.welcomed) != null;
          state.lastCheckedOrgTag = this.props.orgStore.currentOrganisation.tag;
        }
      } catch (e) {
        console.error(e);
        state.authorizations.canAccessOrg = false;
        state.authorizations.belongsToOrg = false;
        state.authorizations.isOnboarded = false;
        state.lastCheckedOrgTag = null;
      }
    }
    this.setState(state);
  }

  render() {
    const { render, isAuth, orgNotFound, authorizations, lastCheckedOrgTag } = this.state;
    const endUrl = window.location.pathname + window.location.search;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if (defaultLocale === 'en-UK') defaultLocale = 'en';
    let baseUrl = '/' + locale + '/' + lastCheckedOrgTag;

    // don't forget redirections !
    console.table(this.state);  
    console.log(baseUrl)

    if (!render) return null;

    if (orgNotFound) return <Redirect to={'/' + locale + '/error/404/organisation'} />;
    if (isAuth && !authorizations.hasEmailValidated) return <Redirect to={'/' + locale + '/error/403/email'} />;
    if (isAuth && lastCheckedOrgTag && !authorizations.canAccessOrg) return <Redirect to={'/' + locale + '/error/403/organisation'} />;
    if (isAuth && authorizations.belongsToOrg && !authorizations.isOnboarded) return <Redirect to={baseUrl + '/onboard'} />;

    return (
      <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
        <ProfileProvider>
          <Suspense fallback={<></>}>
            <Switch>

              {/* DONT FORGET failRedirect param on each custom route */}

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
                failRedirect={'/'}
                path="/:locale(en|fr|en-UK)/:orgTag/:recordTag?" 
                component={SearchPage} 
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
