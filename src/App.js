import React, { Component } from 'react';
import { BrowserRouter } from "react-router-dom";
import MainRoute from './routes/MainRoute';
import './components/header/header.css';
import { SnackbarProvider } from 'notistack';

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <SnackbarProvider maxSnack={1}>
          <MainRoute />
        </SnackbarProvider>
      </BrowserRouter>
    );
  }
}

export default App;
