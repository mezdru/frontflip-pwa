import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import Search from '../pages/Search';
import RoutesWithOrgTag from './RoutesWithOrgTag';

class RoutesWithLocale extends Component {
    render() {
        return (
                <div>
                    <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={PasswordForgot}/>
                    <Route exact path="/:locale(en|fr|en-UK)/password/create/:token/:hash" component={PasswordReset}/> 
                    <Route exact path="/:locale(en|fr|en-UK)" component={Home}/>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={RoutesWithOrgTag}/>
                </div>

        );
    }
}

export default RoutesWithLocale;