import React, { Suspense } from "react";
import { Route, Switch, withRouter, Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "../translations/fr.json";
import messages_en from "../translations/en.json";
import { asyncForEach } from '../services/utils.service';
import { RouteAuth, RouteWithOrgAccess, RouteAuthAndBelongsToOrg } from "./ProtectedRoutes";
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
      renderAuth: !this.props.authStore.isAuth()
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
      await this.getOrgInParam();

      if (!this.state.renderAuth) this.setState({ renderAuth: true });
    }
  }

  getOrgInParam = async () => {
    let params = window.location.pathname.split('/');
    let orgTag = params[2];
    this.props.commonStore.url.params.orgTag = orgTag;
    return await this.props.orgStore.getOrFetchOrganisation(null, orgTag);
  }

  render() {
    const { renderAuth } = this.state;
    const endUrl = window.location.pathname + window.location.search;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    if (!currentUser && this.props.authStore.isAuth() && renderAuth) this.getUserAndOrgs();

    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if (defaultLocale === 'en-UK') defaultLocale = 'en';

    if (!renderAuth) return null;

    return (
      <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
        <ProfileProvider>
          <Suspense fallback={<></>}>
            <Switch>

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
                  "/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/google/callback",
                  "/:locale(en|fr|en-UK)/:organisationTag/(signup|signin)/:invitationCode?"
                ]}
                component={(AuthPage)}
              />

              <RouteAuthAndBelongsToOrg
                exact
                path={[
                  "/:locale(en|fr|en-UK)/:orgTag/onboard/:step?",
                  "/:locale(en|fr|en-UK)/:orgTag/onboard/:step/edit/:recordTag"
                ]}
                component={(OnboardPage)}
              />

              <RouteWithOrgAccess path="/:locale(en|fr|en-UK)/:orgTag/:recordTag?" component={SearchPage} />
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
