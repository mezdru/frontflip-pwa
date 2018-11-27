import React, { Component } from 'react';
import './App.css';
import Routes from './Routes';
import NavBar from './components/header/NavBar';
import { Route, Switch, BrowserRouter } from 'react-router-dom';


class App extends Component {
  render() {
    return (
      
      <BrowserRouter>
      <div className="App">
      <NavBar/>
      <Routes/>
      </div>
      </BrowserRouter>
        
      
    );
  }
}

export default App;
