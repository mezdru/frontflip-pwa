import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MainRouteOrganisation from './MainRouteOrganisation';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "../translations/fr.json";
import messages_en from "../translations/en.json";
import {asyncForEach} from '../services/utils.service';

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

if (process.env.NODE_ENV !== 'production') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js');
  whyDidYouRender(React, { hotReloadBufferMs: 1500 });
}

class MainRoute extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      renderAuth: !this.props.authStore.isAuth()
    }

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
  }

  componentWillMount() {
    this.getUserAndOrgs();
  }

  async getUserAndOrgs() {
    if (this.props.authStore.isAuth()) {
      let cUser = await this.props.userStore.fetchCurrentUser();
      await asyncForEach(cUser.orgsAndRecords, async (orgAndRecord) => {
        await this.props.orgStore.fetchOrganisation(orgAndRecord.organisation);
        await this.props.recordStore.fetchRecord(orgAndRecord.record);
      });
      if (!this.state.renderAuth) this.setState({ renderAuth: true });
    }
  }

  render() {
    const { renderAuth } = this.state;
    const endUrl = window.location.pathname + window.location.search;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    if (!currentUser && this.props.authStore.isAuth() && renderAuth) this.getUserAndOrgs();
    
    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if(defaultLocale === 'en-UK') defaultLocale = 'en';

    if (renderAuth) {
      return (
        <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
          <Switch>
            <Route path="/:locale(en|fr|en-UK)" component={MainRouteOrganisation} />
            <Redirect from="*" to={"/" + defaultLocale + endUrl} />
          </Switch>
        </IntlProvider>
      );
    } else {
      return (
        <IntlProvider locale={defaultLocale} messages={messages[defaultLocale]}>
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%' }}>
            <CircularProgress color='secondary' />
          </div>
        </IntlProvider>
      );
    }
  }
}

export default withRouter(inject('authStore', 'userStore', 'commonStore', 'orgStore', 'recordStore')(
  (observer(
    MainRoute
  )))
);
