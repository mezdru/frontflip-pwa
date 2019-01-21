import React, {Component} from 'react';
import {inject, observer} from "mobx-react";
import {BrowserRouter, Link, Redirect} from "react-router-dom";
import MainRoute from './routes/MainRoute';

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
