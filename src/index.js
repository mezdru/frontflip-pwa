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
import statisticsStore from './stores/statistics.store';
import organisationStore from './stores/organisation.store';
import clapStore from './stores/clap.store';
import suggestionsController from './services/suggestionsController.service';
import HttpsRedirect from 'react-https-redirect';
import { MuiThemeProvider } from "@material-ui/core";
import theme from "./theme";

const stores = {
  authStore,
  userStore,
  recordStore,
  commonStore,
  organisationStore,
  suggestionsController,
  statisticsStore,
  clapStore
};

ReactDOM.render(
  <HttpsRedirect>
    <Provider {...stores}>
      <MuiThemeProvider theme={theme}>
        <App />
      </MuiThemeProvider>
    </Provider>
  </HttpsRedirect>
  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
