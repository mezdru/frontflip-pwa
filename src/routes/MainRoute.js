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

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

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
    this.getUser();
  }

  async getUser() {
    if (this.props.authStore.isAuth()) {
      await this.props.userStore.fetchCurrentUser();
      if (!this.state.renderAuth) this.setState({ renderAuth: true });
    }
  }

  render() {
    const { renderAuth } = this.state;
    const endUrl = window.location.pathname + window.location.search;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;


    if (!currentUser && this.props.authStore.isAuth()) this.getUser();
    
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

export default inject('authStore', 'userStore', 'commonStore')(
  withRouter(observer(
    MainRoute
  ))
);
