import React from 'react';
import { observer, inject } from 'mobx-react';
import { Switch } from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "../translations/fr.json";
import messages_en from "../translations/en.json";
import { addLocaleData, IntlProvider } from "react-intl";
import ProfileProvider from "../hoc/profile/Profile.provider.js";

addLocaleData([...locale_en, ...locale_fr]);
const messages = {
  'fr': messages_fr,
  'en': messages_en
};

class RoutesWithLocale extends React.Component {

  state = {
    render: false
  }

  componentDidMount() {
    this.props.commonStore.setUrlParams(this.props.match);

    if (this.props.authStore.isAuth()) {
      this.props.userStore.fetchCurrentUserAndData()
        .then((user) => {
          this.setState({ render: true });
          if(this.props.commonStore.locale !== user.locale) {
            this.props.userStore.updateCurrentUser({locale: this.props.commonStore.locale});
          }
        })
        .catch(() => { this.setState({ render: true }) })
    } else {
      this.setState({ render: true });
    }
  }

  render() {
    const { routes, match } = this.props;
    const { render } = this.state;
    if (!render) return null;

    let locale = match.params.locale.replace('-UK', '');

    return (
      <IntlProvider locale={locale} messages={messages[locale]}>
        <ProfileProvider>

          <Switch>
            {routes.map((route, i) => (
              <RouteWithSubRoutes key={i} {...route} locale={locale} />
            ))}
          </Switch>
        </ProfileProvider>
      </IntlProvider>
    )
  }
}

export default (inject('authStore', 'userStore', 'commonStore')(
  (observer(
    RoutesWithLocale
  )))
);