import 'core-js/es6/map';
import 'core-js/es6/set';
import 'core-js/fn/promise/finally';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'mobx-react';
import authStore from './stores/auth.store';
import userStore from './stores/user.store';
import recordStore from './stores/record.store';
import commonStore from './stores/common.store';
import organisationStore from './stores/organisation.store';
import HttpsRedirect from 'react-https-redirect';
import { MuiThemeProvider } from "@material-ui/core";
import theme from "./theme";
import { addLocaleData, IntlProvider } from "react-intl";
import locale_en from 'react-intl/locale-data/en';
import locale_fr from 'react-intl/locale-data/fr';
import messages_fr from "./translations/fr.json";
import messages_en from "./translations/en.json";

addLocaleData([...locale_en, ...locale_fr]);

const messages = {
  'fr': messages_fr,
  'en': messages_en
};

const stores = {
  authStore,
  userStore,
  recordStore,
  commonStore,
  organisationStore
};

let locale = commonStore.locale;
if (locale === 'en-UK') locale = 'en';

ReactDOM.render(
  <HttpsRedirect>
    <Provider {...stores}>
      <MuiThemeProvider theme={theme}>
        <IntlProvider locale={locale} messages={messages[locale]}>
          <App />
        </IntlProvider>
      </MuiThemeProvider>
    </Provider>
  </HttpsRedirect>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
