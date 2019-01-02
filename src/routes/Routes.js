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
                        <Route exact path="/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/password/reset/:token/:hash" component={PasswordReset}/> 
                        <Route path="/redirect" component={RedirectUser} />                    

                        <Route path="/:locale(en|fr)" component={RoutesWithLocale} />    
                        <Route path="/:locale(en|fr)/:organisationTag" component={RoutesWithOrgTag} />                    

                        <Redirect to={"/en" + endUrl}/>

                        {/* Onboard : new wingzy*/}
                        {/* <Route path="/onboard/wingzy" component={OnboardWingzy} /> */}

                        {/* Onboard : new profile */}
                        {/* <Route path="/onboard/profile" component={OnboardProfile} /> */}
                    </Switch>
                </div>

        );
    }
}
