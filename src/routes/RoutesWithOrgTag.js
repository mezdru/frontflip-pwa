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
                    <Switch>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/> 
                    <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search" component={Search}/>
                    <Route path="/:locale(en|fr|en-UK)/:organisationTag/:invitationCode?" component={Home}/>
                    </Switch>
                    
                </div>

        );
    }
}

export default RoutesWithOrgTag;