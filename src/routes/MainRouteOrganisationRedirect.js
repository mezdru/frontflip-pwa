import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import UrlService from '../services/url.service';
import AuthPage from '../pages/auth/AuthPage';
import Search from "../pages/Search";
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import {inject, observer} from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

class MainRouteOrganisationRedirect extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: null,
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
            isAuth: this.props.authStore.isAuth(),
            renderComponent: false
        };
        this.manageAccessRight = this.manageAccessRight.bind(this);
    }

    componentDidMount() {
        this.manageAccessRight().then(() => {
            this.setState({renderComponent: true});
        })
    }

    /**
     * @description Perform the authorization process to access the organisation or not
     * @param {Organisation} organisation 
     */
    canUserAccessOrganisation(organisation) {
        if(!organisation) return false;
        if(organisation.public) {
            return true;
        } else {
            if(!this.state.isAuth) return false;
            if(this.props.userStore.values.currentUser.superadmin) return true;
            return (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) !== undefined);
        }
    }

    /**
     * @description Redirect user who is auth but hasn't access to current organisation
     */
    redirectUserAuthWithoutAccess() {
        if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {
            this.props.organisationStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
            this.props.organisationStore.getOrganisation()
            .then(organisation => {
                this.redirectUserAuthWithAccess(organisation, true);
            });
        } else {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
        }
    }

    /**
     * @description Redirect user who is auth and has access to organisation provided
     * @param {Organisation} organisation 
     * @param {Boolean} isNewOrg 
     */
    redirectUserAuthWithAccess(organisation, isNewOrg) {
        let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
        
        if(!currentOrgAndRecord && !this.props.userStore.values.currentUser.superadmin) {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
        } else if(currentOrgAndRecord) {
            this.props.recordStore.setRecordId(currentOrgAndRecord.record);
            this.props.recordStore.getRecord()
            .then(() => {
                if(isNewOrg) this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag});
            }).catch(() => {
                window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
            });
        }
    }

    /**
     * @description Manage access right of the user and redirect him if needed.
     */
    async manageAccessRight() {
        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            let organisation = this.props.organisationStore.values.organisation;     
            if(!(this.props.organisationStore.values.orgTag === this.props.match.params.organisationTag)) {
                this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
                organisation = await this.props.organisationStore.getOrganisationForPublic()
                                        .catch((err) => {return null});
            }

            if(!this.canUserAccessOrganisation(organisation) && this.state.isAuth) {
                await this.redirectUserAuthWithoutAccess();
            } else if(!this.canUserAccessOrganisation(organisation)) {
                //this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag + '/signin' + (window.location.search || '')});
            } else {
                this.props.organisationStore.setOrgId(organisation._id);
                organisation = await this.props.organisationStore.getOrganisation();
                await this.redirectUserAuthWithAccess(organisation);
            }
        } else {
            if(this.state.isAuth) await this.redirectUserAuthWithoutAccess();
            // else this.setState({redirectTo: '/' + this.state.locale + '/signin'});
        }
    }

    resetRedirectTo() {
        this.setState({redirectTo: null});
    }

    render() {
        const {redirectTo, renderComponent} = this.state;
        const {locale} = this.props.commonStore;
        const {orgTag, organisation} = this.props.organisationStore.values;
        const {record} = this.props.recordStore.values;
        let isAuth = this.props.authStore.isAuth();
        
        if(redirectTo){
            this.resetRedirectTo();
            if(window.location.pathname !== redirectTo) {
                return (<Redirect to={redirectTo} />);
            }
        }

        if(renderComponent && isAuth) {
            return (
                <div>
                    <Switch>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/>
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => {return <AuthPage initialTab={1} />}} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />
                        
                        {/* Main route with orgTag */}
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/:profileTag?" component={Search} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={Search} />
                    </Switch>
                </div>
            );
        } else if (renderComponent) {
            return (
                <div>
                    <Switch>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                        <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/>
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => {return <AuthPage initialTab={1} />}} />
                        <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />
                        <Redirect to={'/' + locale + (orgTag ? '/' + orgTag : '') + '/signin' + window.location.search} />
                    </Switch>
                </div>
            );
        } else {
            return (
                <div style={{position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%'}}>
                    <CircularProgress color='primary'/>
                </div>
            );
        }
    }
}

export default inject('commonStore', 'authStore', 'organisationStore', 'userStore', 'recordStore')(
    withRouter(observer(
        MainRouteOrganisationRedirect
    ))
);