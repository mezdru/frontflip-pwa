import React from "react";
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from '../pages/Home';
import Search  from '../pages/Search';
import Profile from '../components/profile/ProfileBox';
import OnboardWingzy from '../pages/OnboardWingzy';
import OnboardProfile from '../pages/OnboardProfile';
import RedirectUser from "../pages/RedirectUser";
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import RoutesWithLocale from "./RoutesWithLocale";
import RoutesWithOrgTag from "./RoutesWithOrgTag";

export default class Routes extends React.Component {
    
    render() {

        const endUrl = window.location.pathname + window.location.search;

        return (
                
                <div>
                    <Switch>
                        <Route path="/redirect" component={RedirectUser} />                    
                        <Route path="/:locale(en|fr|en-UK)" component={RoutesWithLocale} />    
                        <Redirect to={"/en" + endUrl}/>
                    </Switch>
                </div>

        );
    }
}
