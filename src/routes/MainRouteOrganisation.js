import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MainRouteOrganisationRedirect from './MainRouteOrganisationRedirect';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import {inject, observer} from 'mobx-react';

class MainRouteOrganisation extends React.Component {

    constructor(props) {
        super(props);
        console.log('route2');

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
                        <Route exact path="/:locale(en|fr|en-UK)/signup" />
                        <Route exact path="/:locale(en|fr|en-UK)/signin" />

                        {/* Route which will need organisationTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/search" component={MainRouteOrganisationRedirect} />
                        <Route exact path="/:locale(en|fr|en-UK)/search/profile" component={MainRouteOrganisationRedirect} />
                        <Route exact path="/:locale(en|fr|en-UK)/search/profile/:profileTag" component={MainRouteOrganisationRedirect} />

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