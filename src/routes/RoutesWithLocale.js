import { inject, observer } from "mobx-react";
import React from "react";

import "@formatjs/intl-pluralrules/polyfill";
import "@formatjs/intl-pluralrules/dist/locale-data/en";
import "@formatjs/intl-pluralrules/dist/locale-data/fr";
import "@formatjs/intl-relativetimeformat/polyfill";
import "@formatjs/intl-relativetimeformat/dist/locale-data/fr";
import "@formatjs/intl-relativetimeformat/dist/locale-data/en";

import CircularProgress from "@material-ui/core/CircularProgress";
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from "react-intl/locale-data/en";
import locale_fr from "react-intl/locale-data/fr";
import { Switch } from "react-router-dom";
import undefsafe from "undefsafe";

import ProfileProvider from "../hoc/profile/Profile.provider.js";

import RouteWithSubRoutes from "./RouteWithSubRoutes";
import {
  isInStandaloneMode,
  UAParserInstance
} from "../services/utils.service.js";
import messages_en from "../translations/en.json";
import messages_fr from "../translations/fr.json";
import roissypole_message_en from "../translations/roissypole/en.json";
import roissypole_message_fr from "../translations/roissypole/fr.json";


let isRoissypole = function() {
  return (window.location.href.search('roissypole') !== -1);
}

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  fr: isRoissypole() ? Object.assign(messages_fr, roissypole_message_fr) : messages_fr,
  en: isRoissypole() ? Object.assign(messages_en, roissypole_message_en) : messages_en
};

var MomentConfigs = require("../components/configs/moment.conf");

class RoutesWithLocale extends React.Component {
  state = {
    render: false
  };

  componentDidMount() {
    this.props.commonStore.setUrlParams(this.props.match);

    if (this.props.authStore.isAuth()) {
      this.props.userStore
        .fetchCurrentUserAndData()
        .then(user => {
          // know if User use app in standalone mode (app installed)
          if (isInStandaloneMode()) {
            // update user & create keen event
            this.props.keenStore.recordEvent("pwa-usage", {
              browser: UAParserInstance.getResult()
            });
          }

          this.setState({ render: true });
          if (this.props.commonStore.locale !== user.locale) {
            this.props.userStore.updateCurrentUser({
              locale: this.props.commonStore.locale
            });
          }
        })
        .catch(() => {
          this.setState({ render: true });
        });
    } else {
      this.setState({ render: true });
    }

    if (this.props.match.params.locale === "fr") MomentConfigs.setMomentFr();
  }

  render() {
    const { routes, match } = this.props;
    const { render } = this.state;
    if (!render)
      return (
        <CircularProgress
          color="secondary"
          style={{
            position: "fixed",
            top: "45%",
            left: 0,
            right: 0,
            margin: "auto"
          }}
        />
      );

    let locale = match.params.locale.replace("-UK", "");

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
    );
  }
}

export default inject(
  "authStore",
  "userStore",
  "commonStore",
  "keenStore"
)(observer(RoutesWithLocale));
