import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import UrlService from '../services/url.service';
import AuthPage from '../pages/auth/AuthPage';
import Search from "../pages/Search";
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import Profile from '../pages/Profile';
import {inject, observer} from 'mobx-react';

class MainRouteOrganisationRedirect extends React.Component {

    constructor(props) {
        super(props);

        console.log('route3');

        this.state = {
            redirectTo: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            isAuth: this.props.authStore.isAuth(),
            renderComponent: false
        };

        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            // set orgTag params and let the user go where he wants to
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic()
            .then(() => {this.setState({renderComponent: true})})
            .catch(() => {this.setState({renderComponent: true})});
            // next, if user is auth and can access the org, it's ok
            // if user isn't auth and org is public, it's ok
            // if user isn't auth and org isn't public, it's not ok
        } else {
            // no orgTag provided
            if(this.state.isAuth && this.props.userStore.values.currentUser) {
                // user is auth
                if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0 ) {
                    // user has org
                    this.props.organisationStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
                    this.props.organisationStore.getOrganisation()
                    .then(organisation => {
                        if(organisation) {
                            console.log('auth & org found');
                            this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag + '/search'});
                            this.setState({renderComponent: true});
                        }
                    }).catch(()=>{this.setState({renderComponent: true})});
                    // get org by id & set orgTag url parameter (redirect)
                    // search page will next decide if the user should create his profile or not
                } else {
                    // user hasn't org
                    window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
                }
            } else {
                this.setState({redirectTo: '/' + this.state.locale + '/signin'});
            }
        }
    }
    
    render() {
        const endUrl = window.location.pathname + window.location.search;
        const {redirectTo, renderComponent} = this.state;

        console.log(renderComponent);
        if(redirectTo) return (<Redirect to={redirectTo} />);

        if(renderComponent) {
            return (
                <div>
                    <Switch>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/>
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => {return <AuthPage initialTab={1} />}} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />
                        
                        {/* Route which will need organisationTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/search" component={null} />

                        {/* Main route with orgTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search" component={Search} />
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search/profile/:profileTag" component={Profile} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={Search} />
                    </Switch>
                </div>
            );
        } else {
            return (<div></div>);
        }


    }
}

export default inject('commonStore', 'authStore', 'organisationStore', 'userStore')(
    withRouter(observer(
        MainRouteOrganisationRedirect
    ))
);