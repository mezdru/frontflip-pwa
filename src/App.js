import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {BrowserRouter, Link, Redirect} from "react-router-dom";
import MainRoute from './routes/MainRoute';
import './components/header/header.css';
import {styles} from './components/header/Header.css.js'
import HeaderAppBar from './components/header/HeaderAppBar';
import HeaderDrawer from './components/header/HeaderDrawer';
import UrlService from './services/url.service';
import { observe } from 'mobx';

class App extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        
        return (
            <BrowserRouter>
                <MainRoute/>
            </BrowserRouter>
        );
    }
}

export default inject('commonStore', 'userStore', 'authStore', 'organisationStore')(
    observer(
            App
    )
);
