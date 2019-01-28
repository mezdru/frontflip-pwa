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
            renderComponent: false,
            shouldManageAccessRight: false
        };
        this.manageAccessRight = this.manageAccessRight.bind(this);
    }

    componentDidMount() {
        this.manageAccessRight().then(() => {
            this.setState({renderComponent: true});
        })
    }

    canUserAccessOrganisation(organisation) {
        if(organisation.public) {
            return true;
        } else {
            if(!this.state.isAuth) return false;
            if(this.props.userStore.values.currentUser.superadmin) return true;
            return (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) !== undefined);
        }
    }

    redirectUserAuthWithoutAccess() {
        if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {
            this.props.organisationStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
            this.props.organisationStore.getOrganisation()
            .then(organisation => {
                console.log('orgAndRecord found');
                this.redirectUserAuthWithAccess(organisation, true);
            });
        } else {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
        }
    }

    redirectUserAuthWithAccess(organisation, isNewOrg) {
        let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
        console.log(currentOrgAndRecord);
        
        if(!currentOrgAndRecord && !this.props.userStore.values.currentUser.superadmin) {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
        } else if(currentOrgAndRecord) {
            this.props.recordStore.setRecordId(currentOrgAndRecord.record);
            this.props.recordStore.getRecord()
            .then(() => {
                if(isNewOrg) this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag});
            }).catch((error) => {
                console.log(error);
                window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
            });
        }

    }

    async manageAccessRight() {
        console.log('manage access right');
        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            console.log('will perform manage access right');
            let organisation = this.props.organisationStore.values.organisation;     
            if(!(this.props.organisationStore.values.orgTag === this.props.match.params.organisationTag)) {
                console.log('need refetch organisation : mobx : ' + this.props.organisationStore.values.orgTag + ' url : ' + this.props.match.params.organisationTag);
                this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
                organisation = await this.props.organisationStore.getOrganisationForPublic();
            }

            console.log('will control access for organisation : ' + organisation.tag);
            if(!this.canUserAccessOrganisation(organisation) && this.state.isAuth) {
                console.log('user auth but cant access');
                await this.redirectUserAuthWithoutAccess();
            } else if(!this.canUserAccessOrganisation(organisation)) {
                console.log('user cant access because no auth');
            } else {
                console.log('user can access');
                this.props.organisationStore.setOrgId(organisation._id);
                console.log('orgId set.')
                organisation = await this.props.organisationStore.getOrganisation();
                console.log('organisation fetched.')
                await this.redirectUserAuthWithAccess(organisation);
                console.log('end of treatment');
            }
        } else {
            console.log('no org tag provided');
            if(this.state.isAuth) await this.redirectUserAuthWithoutAccess();
            else this.setState({redirectTo: '/' + this.state.locale + '/signin'});
        }
    }

    refreshState() {
        //this.setState({redirectTo: null, renderComponent: false});
    }
    
    render() {
        const {redirectTo, renderComponent, shouldManageAccessRight} = this.state;
        const {locale} = this.props.commonStore;
        const {orgTag, organisation} = this.props.organisationStore.values;
        let isAuth = this.props.authStore.isAuth();

        console.log('render router 3');
        
        if(redirectTo){
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
                        <Redirect to={'/' + locale + (orgTag ? '/' + orgTag : '') + '/signin'} />
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