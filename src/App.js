import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import MainRoute from './routes/MainRoute';
import './components/header/header.css';

import ReactGA from 'react-ga';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class App extends Component {
  constructor(props) {
    super(props);
    ReactGA.pageview(window.location.pathname);
  }

  render() {
    return (
      <BrowserRouter>
        <MainRoute />
      </BrowserRouter>
    );
  }
}

export default App;
