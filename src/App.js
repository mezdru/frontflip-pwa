import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar2 from './components/header/NavBar2';
import { BrowserRouter } from 'react-router-dom';
import { MuiThemeProvider } from '@material-ui/core/styles';
import theme from './theme';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <MuiThemeProvider theme={theme}>
            <NavBar2/>
            {/* <Routes/> */}
          </MuiThemeProvider>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
