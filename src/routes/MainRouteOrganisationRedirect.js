import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import UrlService from '../services/url.service';
import AuthPage from '../pages/auth/AuthPage';
import PasswordForgot from "../pages/auth/PasswordForgot";
import PasswordReset from "../pages/auth/PasswordReset";
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import EmailService from '../services/email.service';
import SearchPage from "../pages/SearchPage";
import SlackService from '../services/slack.service';
import ReactGA from 'react-ga';
ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class MainRouteOrganisationRedirect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      renderComponent: false
    };
    this.manageAccessRight = this.manageAccessRight.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.history.action === 'PUSH' && ( (props.match.params.organisationTag !== this.props.organisationStore.values.orgTag) || (!this.props.organisationStore.values.fullOrgFetch) ) ) {
      this.setState({ renderComponent: false }, () => {
        this.manageAccessRight().then(() => {
          this.setState({ renderComponent: true });
        }).catch((err) => {
          ReactGA.event({category: 'Error',action: 'Redirect to error layout', value: 500});
          SlackService.notifyError(err, '32', 'quentin', 'MainRouteOrganisationRedirect.js');
          this.setState({redirectTo: '/' + this.state.locale + '/error/500/routes'});
        });
      });
    }
  }

  componentDidMount() {
    this.manageAccessRight().then(() => {
      this.setState({ renderComponent: true });
    }).catch((err) => {
      ReactGA.event({category: 'Error',action: 'Redirect to error layout', value: 500});
      SlackService.notifyError(err, '42', 'quentin', 'MainRouteOrganisationRedirect.js');
      this.setState({redirectTo: '/' + this.state.locale + '/error/500/routes'});
    });
  }

  /**
   * @description Perform the authorization process to access the organisation or not
   * @param {Organisation} organisation 
   */
  canUserAccessOrganisation(organisation) {
    if (!organisation) return false;
    if (organisation.public) {
      return true;
    } else {
      if (!this.props.authStore.isAuth()) return false;
      if(!this.props.userStore.values.currentUser._id) return false;
      if (this.props.userStore.values.currentUser.superadmin) return true;
      if(this.props.userStore.values.currentUser.orgsAndRecords.length === 0 || !this.props.userStore.values.currentUser.orgsAndRecords) return false;
      return (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) !== undefined);
    }
  }

  /**
   * @description Redirect user who is auth but hasn't access to current organisation
   */
  async redirectUserAuthWithoutAccess() {
    if (this.props.userStore.values.currentUser.orgsAndRecords && this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {
      let orgId = this.props.userStore.values.currentUser.orgsAndRecords[0].organisation;
      if(orgId) {
        this.props.organisationStore.setOrgId(orgId);
        await this.props.organisationStore.getOrganisation()
        .then(organisation => {
          this.redirectUserAuthWithAccess(organisation, true);
        }).catch(() => {return;})
      } else {
        window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
        await this.wait(3000);
      }
    } else {
      window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
      await this.wait(3000);
    }
  }

  /**
   * @description Redirect user who is auth and has access to organisation provided
   * @param {Organisation} organisation 
   * @param {Boolean} isNewOrg 
   */
  async redirectUserAuthWithAccess(organisation, isNewOrg) {
    let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
    if ( (!currentOrgAndRecord && !this.props.userStore.values.currentUser.superadmin) || (currentOrgAndRecord && !currentOrgAndRecord.welcomed)) {
      window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/intro', organisation.tag, 'first=true');
      await this.wait(3000);
    } else if (currentOrgAndRecord) {
      this.props.recordStore.setRecordId(currentOrgAndRecord.record);
      await this.props.recordStore.getRecord()
        .then(() => {
          if (isNewOrg) this.setState({ redirectTo: '/' + this.state.locale + '/' + organisation.tag });
        }).catch(() => {
          window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/onboard/intro', organisation.tag, 'first=true');
        });
    }
  }

  /**
   * @description Manage access right of the user and redirect him if needed.
   */
  async manageAccessRight() {
    if (this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
      let organisation = this.props.organisationStore.values.organisation;
      if (!(this.props.organisationStore.values.orgTag === this.props.match.params.organisationTag)) {
        this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
        organisation = await this.props.organisationStore.getOrganisationForPublic()
                      .catch((err) => {
                        SlackService.notifyError('Someone try to access : ' + this.props.match.params.organisationTag + ' and got 404.', 
                                                  '110', 'quentin', 'MainRouteOrganisationRedirect.js');
                        ReactGA.event({category: 'Error',action: 'Redirect to error layout', value: 404});
                        this.setState({redirectTo: '/' + this.state.locale + '/error/404/organisation'});
                      });
      }

      if (!this.canUserAccessOrganisation(organisation) && this.props.authStore.isAuth()) {
        await this.redirectUserAuthWithoutAccess();
      } else if (this.props.authStore.isAuth()) {
        this.props.organisationStore.setOrgId(organisation._id);
        organisation = await this.props.organisationStore.getOrganisation()
                      .catch((err) => {
                        if(err.status === 403 && err.response.body.message === 'Email not validated') {
                          EmailService.confirmLoginEmail(organisation.tag);
                          this.setState({redirectTo: '/' + this.state.locale + '/error/' + err.status + '/email'});
                        }
                        return;
                      });
        await this.redirectUserAuthWithAccess(organisation, false).catch(() => {return;});
      }
    } else if (this.props.authStore.isAuth()) {
      await this.redirectUserAuthWithoutAccess();
    }
  }

  async wait(ms) {
    return new Promise((r, j)=>setTimeout(r, ms));
  }

  resetRedirectTo() {
    this.setState({ redirectTo: null });
  }

  render() {
    const { redirectTo, renderComponent } = this.state;
    const { locale } = this.props.commonStore;
    const { orgTag } = this.props.organisationStore.values;
    let isAuth = this.props.authStore.isAuth();

    if (redirectTo) {
      this.resetRedirectTo();
      if (window.location.pathname !== redirectTo) {
        return (<Redirect to={redirectTo} />);
      }
    }

    if (renderComponent && isAuth) {
      return (
        <div>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={PasswordReset} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/google/callback" component={AuthPage} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => { return <AuthPage initialTab={1} /> }} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />

            {/* Main route with orgTag */}
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/:profileTag?" component={SearchPage} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={SearchPage} />
          </Switch>
        </div>
      );
    } else if (renderComponent) {
      return (
        <div>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={PasswordForgot} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={PasswordReset} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={PasswordReset} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/google/callback" component={AuthPage} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={() => { return <AuthPage initialTab={1} /> }} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />

            {/* Main route with orgTag */}
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/:profileTag" component={SearchPage} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag" component={SearchPage} />

            <Redirect to={'/' + locale + (orgTag ? '/' + orgTag : '') + '/signin' + window.location.search} />
          </Switch>
        </div>
      );
    } else {
      return (
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%' }}>
          <CircularProgress color='primary' />
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
