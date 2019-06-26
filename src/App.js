import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import MainRoute from './routes/MainRoute';
import './components/header/header.css';
import { SnackbarProvider } from 'notistack';

import { version } from '../package.json'
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import { disableBodyScroll } from 'body-scroll-lock';


if(process.env.NODE_ENV !== 'development' && process.env.REACT_APP_LOGROCKET) {
  LogRocket.init(process.env.REACT_APP_LOGROCKET, {
    release: version,
  });
  setupLogRocketReact(LogRocket);
}

// disable body scroll
disableBodyScroll(window.document.body);

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <SnackbarProvider maxSnack={3}>
          <MainRoute />
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default App;
