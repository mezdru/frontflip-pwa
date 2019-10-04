import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import ReactGA from 'react-ga';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

import UrlService from '../services/url.service';
// import PasswordForgot from "../pages/auth/PasswordForgot";
// import PasswordReset from "../pages/auth/PasswordReset";
import EmailService from '../services/email.service';
import SearchPage from "../pages/SearchPage";
import SlackService from '../services/slack.service';
import AuthPage from '../pages/auth/AuthPage';
import PasswordReset from '../pages/auth/PasswordReset';
import OnboardPage from '../pages/OnboardPage';
import ProfileProvider from "../hoc/profile/Profile.provider";

const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
// const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class MainRouteOrganisationRedirect extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      redirectTo: null,
      renderComponent: false,
    };

    // if there is a wings to add, we should save it
    if (this.props.hashtagsFilter && this.props.match.params && this.props.match.params.action && (this.props.match.params.action === 'add' || this.props.match.params.action === 'filter')) {
      this.persistWingToAdd((this.props.match.params.action));
    }

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);
  }

  WaitingComponent(Component, additionnalProps) {
    return props => (
      <React.Suspense fallback={<CircularProgress color='secondary' />}>
        <Component {...props} {...additionnalProps} />
      </React.Suspense>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (JSON.stringify(nextState) !== JSON.stringify(this.state)) return true;
    return false;
  }

  componentWillReceiveProps(props) {

    if (props.history.action === 'POP' && props.location.pathname === this.props.location.pathname) return;

    //@todo Remake this statement...
    if (
        props.history.action === 'PUSH' &&
        ((props.match.params && props.match.params.organisationTag !== this.props.organisationStore.values.orgTag) ||
        (!this.props.organisationStore.values.fullOrgFetch) ||
        (props.match.params && props.match.params.profileTag)) ||
        (props.history.action === 'POP' && props.location.pathname !== this.props.location.pathname)
    ) {
      this.setState({ renderComponent: false }, () => {
        this.manageAccessRight().then(() => {
          this.setState({ renderComponent: true }, () => { this.forceUpdate() });
        }).catch((err) => {
          console.log('err: ', err)
          ReactGA.event({ category: 'Error', action: 'Redirect to error layout', value: 500 });
          SlackService.notifyError(err, '32', 'quentin', 'MainRouteOrganisationRedirect.js');
          this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/500/routes' });
        });
      });
    }
  }

  persistWingToAdd = (isAction) => {
    try {
      let hashtags = this.props.match.params.hashtags;
      if (hashtags && hashtags.charAt(0) !== '@') this.props.commonStore.setCookie('hashtagsFilter', hashtags);
      if (isAction) this.props.commonStore.setCookie('actionInQueue', this.props.match.params.action);
    } catch (e) {
      // error
    }
  }

  persistWantedPath = async () => {
    try{
      if(!await this.props.commonStore.getCookie('wantedPath') && !this.props.authStore.isAuth())
        this.props.commonStore.setCookie('wantedPath', window.location.pathname, (new Date( (new Date).getTime() + 10*60000))); // expires in 10 minutes
    } catch(e) {
      console.error("Can't persists the wanted path.", e);
    }
  }

  componentDidMount() {
    this.persistWantedPath();
    this.manageAccessRight().then(() => {
      this.setState({ renderComponent: true }, () => { this.forceUpdate() });
    }).catch((err) => {
      console.log('err: ', err);
      ReactGA.event({ category: 'Error', action: 'Redirect to error layout', value: 500 });
      SlackService.notifyError(err, '42', 'quentin', 'MainRouteOrganisationRedirect.js');
      this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/500/routes' });
    });
  }

  /**
   * @description Perform the authorization process to access the organisation or not
   * @param {Organisation} organisation 
   */
  canUserAccessOrganisation = (organisation) => {
    if (!organisation) return false;
    if (organisation.public) {
      return true;
    } else {
      if (!this.props.authStore.isAuth()) return false;
      if (!this.props.userStore.values.currentUser) return false;
      if (!this.props.userStore.values.currentUser._id) return false;
      if (this.props.userStore.values.currentUser.superadmin) return true;
      if (this.props.userStore.values.currentUser.orgsAndRecords.length === 0 || !this.props.userStore.values.currentUser.orgsAndRecords) return false;
      return (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) !== undefined);
    }
  }

  componentDidUpdate() {
    if (this.state.redirectTo === window.location.pathname) {
      this.setState({ redirectTo: null });
    }
  }

  /**
   * @description Redirect user who is auth but hasn't access to current organisation
   */
  async redirectUserAuthWithoutAccess() {
    if (this.props.userStore.values.currentUser.orgsAndRecords && this.props.userStore.values.currentUser.orgsAndRecords.length > 0) {
      let orgId = this.props.userStore.values.currentUser.orgsAndRecords[0].organisation;
      if (orgId) {
        this.props.organisationStore.setOrgId(orgId);
        await this.props.organisationStore.getOrganisation()
          .then(organisation => {
            this.redirectUserAuthWithAccess(organisation, true);
          }).catch((err) => {
            if (err.status === 403 && err.response.body.message === 'Email not validated') {
              EmailService.confirmLoginEmail(null);
              this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/' + err.status + '/email' });
            } else {
              console.log('err: ', err);
              ReactGA.event({ category: 'Error', action: 'Redirect to error layout', value: 500 });
              SlackService.notifyError(err, '32', 'quentin', 'MainRouteOrganisationRedirect.js');
              this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/500/routes' });
            }
          })
      } else {
        this.redirectToValidateMailOrNewWingzy();
      }
    } else {
      this.redirectToValidateMailOrNewWingzy();
    }
  }

  redirectToValidateMailOrNewWingzy = async () => {
    if (this.props.userStore.values.currentUser.email &&
      this.props.userStore.values.currentUser.email.value &&
      !this.props.userStore.values.currentUser.email.validated) {

      EmailService.confirmLoginEmail(null);
      this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/403/email' });
    } else {
      /**
       * User email validated
       * User has no organisation
       */
      this.setState({redirectTo: '/' + this.props.commonStore.locale + '/welcome'});
      // window.location.href = UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/new/presentation', undefined);
      // await this.wait(3000);
    }
  }

  /**
   * @description Redirect user who is auth and has access to organisation provided
   * @param {Organisation} organisation 
   * @param {Boolean} isNewOrg 
   */
  async redirectUserAuthWithAccess(organisation, isNewOrg) {
    let currentOrgAndRecord = this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id);
    if ((!currentOrgAndRecord && !this.props.userStore.values.currentUser.superadmin) || (currentOrgAndRecord && !currentOrgAndRecord.welcomed)) {
      // user need to onboard in organisation
      let onboardStep = (this.props.match.params && this.props.match.params.step ? '/' + this.props.match.params.step : '');
      this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + organisation.tag + '/onboard' + onboardStep });
    } else if (currentOrgAndRecord) {
      this.props.recordStore.setRecordId(currentOrgAndRecord.record);
      await this.props.recordStore.getRecord()
        .then(() => {
          if (isNewOrg) this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + organisation.tag });
        }).catch(() => {
          this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + organisation.tag + '/onboard' });
        });
    }
  }

  /**
   * @description Manage access right of the user and redirect him if needed.
   */
  manageAccessRight = async () => {
    if (this.props.match && this.props.match.params && this.props.match.params.organisationTag) {
      let organisation = this.props.organisationStore.values.organisation;
      if (this.props.organisationStore.values.orgTag !== this.props.match.params.organisationTag) {
        this.props.organisationStore.setOrgTag(this.props.match.params.organisationTag);
        organisation = await this.props.organisationStore.getOrganisationForPublic()
          .catch((err) => {
            SlackService.notifyError('Someone try to access : ' + this.props.match.params.organisationTag + ' and got 404.',
              '110', 'quentin', 'MainRouteOrganisationRedirect.js');
            ReactGA.event({ category: 'Error', action: 'Redirect to error layout', value: 404 });
            this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/404/organisation' });
          });
      }

      if (this.props.authStore.isAuth() && this.props.match.params && this.props.match.params.invitationCode) {
        // try to register the User in wanted org
        this.props.authStore.setInvitationCode(this.props.match.params.invitationCode);
        await this.props.authStore.registerToOrg().then().catch(e => console.log(e));
      }

      if (!this.canUserAccessOrganisation(organisation) && this.props.authStore.isAuth()) {
        await this.redirectUserAuthWithoutAccess();
      } else if (this.props.authStore.isAuth()) {
        this.props.organisationStore.setOrgId(organisation._id);
        organisation = await this.props.organisationStore.getOrganisation()
          .catch((err) => {
            if (err.status === 403 && err.response.body.message === 'Email not validated') {
              EmailService.confirmLoginEmail(organisation.tag);
              this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/error/' + err.status + '/email' });
            }
            return;
          });
        await this.redirectUserAuthWithAccess(organisation, false).catch(() => { return; });
      } else {
        // no auth
      }
    } else if (this.props.authStore.isAuth()) {
      await this.redirectUserAuthWithoutAccess();
    }
  }

  async wait(ms) {
    return new Promise((r, j) => setTimeout(r, ms));
  }

  render() {
    const { redirectTo, renderComponent } = this.state;
    const { locale } = this.props.commonStore;
    const { orgTag, organisation } = this.props.organisationStore.values;
    let isAuth = this.props.authStore.isAuth();

    if (redirectTo && window.location.pathname !== redirectTo) {
      return (<Redirect to={redirectTo} />);
    }

    if (renderComponent && isAuth) {
      return (
        <ProfileProvider>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={(PasswordReset)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={(PasswordReset)} />
            {/* <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/google/callback" component={AuthPage} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={(props) => { return <AuthPage initialTab={1} {...props} /> }} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} /> */}

            {/* Main route with orgTag */}
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step?" component={(OnboardPage)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit" component={(props => { return <OnboardPage edit={true} {...props} /> })} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit/:recordId" component={(props => { return <OnboardPage edit={true} {...props} /> })} />

            <Route path="/:locale(en|fr|en-UK)/:organisationTag/:profileTag?" component={SearchPage} />

            {/* useless route ? */}
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/:action?" component={SearchPage} />
          </Switch>
        </ProfileProvider>
      );
    } else if (renderComponent) {
      return (
        <ProfileProvider>
          <Switch>
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/reset/:token/:hash" component={(PasswordReset)} />
            <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/password/create/:token/:hash/:email" component={(PasswordReset)} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/google/callback" component={AuthPage} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode?" component={(props) => { return <AuthPage initialTab={1} {...props} /> }} />
            <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode?" component={AuthPage} />

            {/* Main route with orgTag */}
            {organisation && organisation.public && (
              <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/:profileTag" component={SearchPage} />
            )}
            {organisation && organisation.public && (
              <Route exact path="/:locale(en|fr|en-UK)/:organisationTag" component={SearchPage} />
            )}
            <Redirect to={'/' + locale + (orgTag ? '/' + orgTag : '') + '/signin' + window.location.search} />
          </Switch>
        </ProfileProvider>
      );
    } else {
      return (
        <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%' }}>
          <CircularProgress color='secondary' />
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
