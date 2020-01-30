import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import './components/header/header.css';
import { version } from '../package.json'
import LogRocket from 'logrocket';
import setupLogRocketReact from 'logrocket-react';
import Routes from './routes/Routes';

if (process.env.NODE_ENV !== 'development' && process.env.REACT_APP_LOGROCKET) {
  LogRocket.init(process.env.REACT_APP_LOGROCKET, {
    release: version,
    network: {
      requestSanitizer: request => {
        if(request.url.indexOf('https://auth') !== -1){
          request.body = "Auth request: body isn't recovered for security reasons.";
        }
        return request;
      }
    }
  });
  setupLogRocketReact(LogRocket);
}

class App extends Component {

  render() {
    console.debug('Render APP');
    return (
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    );
  }
}

export default App;
