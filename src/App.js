import React, {Component} from 'react';
import {BrowserRouter} from "react-router-dom";
import MainRoute from './routes/MainRoute';
import './components/header/header.css';

class App extends Component {
    
    render() {
        return (
            <BrowserRouter>
                <MainRoute/>
            </BrowserRouter>
        );
    }
}

export default App;
