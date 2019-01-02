import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import Search from '../pages/Search';

class RoutesWithLocale extends Component {
    render() {
        return (
                <div>
                    <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={PasswordForgot}/>
                    <Route exact path="/:locale(en|fr|en-UK)/password/reset/:token/:hash" component={PasswordReset}/> 
                    <Route exact path="/:locale(en|fr|en-UK)" component={Home}/>
                </div>

        );
    }
}

export default RoutesWithLocale;