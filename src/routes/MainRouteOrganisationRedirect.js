import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import UrlService from '../services/url.service';
import AuthPage from '../pages/auth/AuthPage';
import Search from "../pages/Search";
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import {inject, observer} from 'mobx-react';

class MainRouteOrganisationRedirect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            isAuth: this.props.authStore.isAuth(),
            renderComponent: false
        };

        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            // set orgTag params
            this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
            this.props.organisationStore.getOrganisationForPublic()
            .then((organisation) => {
                console.log('get org tag ok')
                if(organisation.public) {
                    console.log('org public')
                    // ok
                    this.setState({renderComponent: true});
                } else if(this.state.isAuth) {
                    console.log('org private but user auth')
                    // org isn't public
                    this.props.organisationStore.getOrganisation()
                    .then((organisation) => {
                        console.log('get org ok ')
                        // ok : try to get record
                        this.props.recordStore.setOrgId(organisation._id);
                        this.props.recordStore.getRecord()
                        .then(() => {
                            // ALL OK : user can access
                            this.setState({renderComponent: true});
                        }).catch(() => {
                            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
                        });
                    }).catch((error) => {
                        this.controlAccessWithoutOrgTag();
                    });
                } else {
                    console.log('user no auth and org private')
                    // not ok : redirect to signin in this org, user may has forgot to login
                    this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag + '/signin'});
                    this.setState({renderComponent: true});
                }
            }).catch(() => {
                // 404 organisation not found
                this.controlAccessWithoutOrgTag();
            });
        } else {
            // no orgTag provided
            this.controlAccessWithoutOrgTag();
        }
    }

    controlAccessWithoutOrgTag() {
        if(this.state.isAuth && this.props.userStore.values.currentUser) {
            console.log('auth and no org, current url : ' + window.location.href)
            // user is auth
            if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0 ) {
                console.log('user has orgsandrecords')
                // user has org
                this.props.organisationStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
                this.props.organisationStore.getOrganisation()
                .then(organisation => {
                    console.log('get org ok 2, current url : ' + window.location.href)
                    if(organisation) {
                        console.log('will redirect to search in org : ' + organisation.tag + ' | current urkl : ' +window.location.href)
                        this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag + '/search'});
                        this.setState({renderComponent: true})
                    }
                }).catch(()=>{
                    // can't get org so authorization problem.
                    window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
                });
            } else {
                // user hasn't org
                window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
            }
        } else {
            this.setState({redirectTo: '/' + this.state.locale + '/signin'});
            this.setState({renderComponent: true});
        }
    }
    
    render() {
        const {redirectTo, renderComponent} = this.state;
        console.log('redirectTo value : ' + redirectTo + ' | current location : ' + window.location.href)
        if(redirectTo){
            this.setState({redirectTo: null});
            return (<Redirect to={redirectTo} />);
        } 
        if(renderComponent) {
            return (
                <div>
                    <Switch>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/>
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => {return <AuthPage initialTab={1} />}} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />
                        
                        {/* Route which will need organisationTag | should not be possible to access */}
                        <Route exact path="/:locale(en|fr|en-UK)/search" component={null} />

                        {/* Main route with orgTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search" component={Search} />
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search/profile/:profileTag" component={Search} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={Search} />
                    </Switch>
                </div>
            );
        } else {
            return (<div></div>);
        }
    }
}

export default inject('commonStore', 'authStore', 'organisationStore', 'userStore', 'recordStore')(
    withRouter(observer(
        MainRouteOrganisationRedirect
    ))
);