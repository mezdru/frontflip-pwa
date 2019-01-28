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

        this.manageAccessRight = this.manageAccessRight.bind(this);
        this.dismiss = this.dismiss.bind(this);

        this.manageAccessRight();
    }

    canUserAccessOrganisation(organisation) {
        if(organisation.public) {
            return true;
        } else {
            if(!this.state.isAuth) return false;
            return (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) !== undefined);
        }
    }

    redirectUserAuthWithoutAccess() {
        if(this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {
            this.props.organisationStore.setOrgId(this.props.userStore.values.currentUser.orgsAndRecords[0].organisation);
            this.props.organisationStore.getOrganisation()
            .then(organisation => {
                this.setState({redirectTo: '/' + this.state.locale + '/' + organisation.tag});
                this.setState({renderComponent: true});
            });
        } else {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
        }
    }

    redirectUserAuthWithAccess(organisation) {
        let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
        this.props.recordStore.setRecordId(currentOrgAndRecord.record);
        this.props.recordStore.getRecord()
        .then(() => {
            this.setState({renderComponent: true});
        }).catch((error) => {
            window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/welcome', organisation.tag);
        });
    }

    async manageAccessRight() {
        console.log('manage access right');
        if(this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
            let organisation;     
            if(!(this.props.organisationStore.values.orgTag === this.props.match.params.organisationTag)) {
                console.log('need refetch organisation : mobx : ' + this.props.organisationStore.values.orgTag + ' url : ' + this.props.match.params.organisationTag);
                this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
                organisation = await this.props.organisationStore.getOrganisationForPublic();
            }

            if(!this.canUserAccessOrganisation(organisation) && this.state.isAuth) {
                console.log('user auth but cant access');
                this.redirectUserAuthWithoutAccess();
            } else if(!this.canUserAccessOrganisation(organisation)) {
                console.log('user cant access because no auth');
                this.setState({redirectTo: '/' + this.state.locale + '/signin'});
                this.setState({renderComponent: true});
            } else {
                console.log('user can access');
                this.props.organisationStore.setOrgId(organisation._id);
                organisation = await this.props.organisationStore.getOrganisation();
                this.redirectUserAuthWithAccess(organisation);
            }
        } else {
            console.log('no org tag provided');
            this.redirectUserAuthWithoutAccess();
        }
    }

    refreshState() {
        this.setState({redirectTo: null, renderComponent: true});
    }

    dismiss() {
        this.props.unmountMe();
    } 
    
    render() {
        const {redirectTo, renderComponent} = this.state;

        console.log('render router 3');
        
            if(redirectTo){
                if(window.location.pathname !== redirectTo) {
                    return (<Redirect to={redirectTo} />);
                }else {
                    this.refreshState();
                }
            }
            if(renderComponent) {
                return (
                    <div>
                        <Switch>
                            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot}/>
                            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset}/>
                            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => {return <AuthPage initialTab={1} />}} />
                            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />

                            {/* Main route with orgTag */}
                            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search/profile/:profileTag" component={Search} />
                            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/search" component={Search} />
                            <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={Search} />
                        </Switch>
                    </div>
                );
            }
         else {
            return (<div></div>);
        }
    }
}

export default inject('commonStore', 'authStore', 'organisationStore', 'userStore', 'recordStore')(
    withRouter(observer(
        MainRouteOrganisationRedirect
    ))
);