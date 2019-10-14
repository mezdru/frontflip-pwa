import React, { Suspense } from "react";
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "../translations/fr.json";
import messages_en from "../translations/en.json";
import ProfileProvider from "../hoc/profile/Profile.provider.js";
import { routes } from "./routes.config";
import RouteWithSubRoutes from './RouteWithSubRoutes';

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

class Routes extends React.Component {
  constructor(props) {
    super(props);

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
    try { document.getElementById('errorMessage').remove(); } catch (e) { };
  }

  render() {
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if (defaultLocale === 'en-UK') defaultLocale = 'en';

    return (
      <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
        <ProfileProvider>
          <Suspense fallback={<div style={{ position: 'fixed', top: '45%', width: '100%', textAlign: 'center' }}><CircularProgress color="secondary" /></div>}>
            <Switch>
              {routes.map((route, i) => (
                <RouteWithSubRoutes key={i} {...route} />
              ))}
            </Switch>
          </Suspense>
        </ProfileProvider>
      </IntlProvider>
    )
  }
}

export default withRouter(inject('userStore', 'commonStore')(
  (observer(
    Routes
  )))
);
