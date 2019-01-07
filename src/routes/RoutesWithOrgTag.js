import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import Search from '../pages/Search';

class RoutesWithOrgTag extends Component {
    
    render() {
        return (
                <div>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash" component={PasswordReset}/> 
                    <Route exact path="/:locale(en|fr|en-UK)/:organisationTag" component={Home}/>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/search" component={Search}/>
                </div>

        );
    }
}

export default RoutesWithOrgTag;