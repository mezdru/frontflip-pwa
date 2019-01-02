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
                    <Route exact path="/password/forgot" component={PasswordForgot}/>
                    <Route exact path="/password/reset/:token/:hash" component={PasswordReset}/> 
                    <Route exact path="/" component={Home}/>
                    <Route path="/search" component={Search}/>
                    <Route path="*" status={404} component={Home}/>                        
                </div>

        );
    }
}

export default RoutesWithOrgTag;