import React, {Component} from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Home from '../pages/Home';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import RoutesWithOrgTag from './RoutesWithOrgTag';

class RoutesWithLocale extends Component {
    render() {
        return (
                <div>
                    <Switch>
                        <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/password/reset/:token/:hash" component={PasswordReset}/> 
                        <Route exact path="/:locale(en|fr|en-UK)" component={Home}/>
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={RoutesWithOrgTag}/>
                    </Switch>
                    
                </div>

        );
    }
}

export default RoutesWithLocale;