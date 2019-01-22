import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MainRouteOrganisationRedirect from './MainRouteOrganisationRedirect';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import {inject, observer} from 'mobx-react';
import AuthPage from "../pages/auth/AuthPage";

class MainRouteOrganisation extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isAuth: this.props.authStore.isAuth()
        };

        // set locale
        if(this.props.match && this.props.match.params && this.props.match.params.locale) {
            this.props.commonStore.locale = this.props.match.params.locale;
            this.props.commonStore.setCookie('locale', this.props.match.params.locale);
        }
    }
    
    render() {
        const {isAuth} = this.state;
        const {locale} = this.props.match.params;
        const endUrl = window.location.pathname + window.location.search;

        return (
                <div>
                    <Switch>
                        {/* All routes without orgTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/password/reset/:token/:hash" component={PasswordReset}/> 
                        <Route  path="/:locale(en|fr|en-UK)/signup" component={() => {return <AuthPage initialTab={1} />}} />
                        <Route  path="/:locale(en|fr|en-UK)/signin" component={AuthPage} />

                        {/* Route which will need organisationTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/search" component={MainRouteOrganisationRedirect} />
                        <Route exact path="/:locale(en|fr|en-UK)/search/profile" component={MainRouteOrganisationRedirect} />
                        <Route  path="/:locale(en|fr|en-UK)/search/profile/:profileTag" component={MainRouteOrganisationRedirect} />

                        {/* Main route with orgTag */}
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={MainRouteOrganisationRedirect} />

                        {isAuth && (
                            <Redirect to={"/" + locale + "/search"} />
                        )}
                        {!isAuth && (
                            <Redirect to={"/" + locale + "/signin"} />
                        )}
                    </Switch>
                </div>
        );
    }
}

export default inject('commonStore', 'authStore')(
    withRouter(observer(
        MainRouteOrganisation
    ))
);
