import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import undefsafe from 'undefsafe';

import MainRouteAccess from './MainRouteAccess';
import AuthPage from '../pages/auth/AuthPage';
import PasswordReset from '../pages/auth/PasswordReset';

// const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const ConnectionsMap = React.lazy(() => import('../components/admin/ConnectionsMap'));
const WelcomePage = React.lazy(() => import('../pages/WelcomePage'));
// const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));

class MainRouteOrganisation extends React.PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      isAuth: this.props.authStore.isAuth()
    };

    // set locale
    if (this.props.match && this.props.match.params && this.props.match.params.locale) {
      this.props.commonStore.setLocale(this.props.match.params.locale);
      this.props.commonStore.populateLocale();
      this.updateUserLocale();
    }
  }

  updateUserLocale = () => {
    var currentUser = this.props.userStore.currentUser;
    if( this.props.commonStore.locale && currentUser && currentUser._id && this.props.commonStore.locale !== currentUser.locale) {
      currentUser.locale = this.props.commonStore.locale;
      this.props.userStore.updateCurrentUser(currentUser);
    }
  }

  WaitingComponent(Component, additionnalProps) {
    return props => (
      <React.Suspense fallback={<CircularProgress color='secondary' />}>
        <Component {...props} {...additionnalProps} />
      </React.Suspense>
    );
  }

  render() {
    const { isAuth } = this.state;
    const { locale } = this.props.match.params;

    if(isAuth && undefsafe(this.props.userStore.currentUser, 'orgsAndRecords.length') === 0 ) {
      return(
        <Switch>
          <Redirect to={'/' + locale + '/welcome'} />
        </Switch>
      )
    }

    return (
      <div>
        <Switch>
          <Route exact path="/:locale(en|fr|en-UK)/connections/map" component={this.WaitingComponent(ConnectionsMap)} />

          {/* All routes without orgTag */}
          <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
          <Route exact path="/:locale(en|fr|en-UK)/password/reset/:token/:hash" component={(PasswordReset)} />
          <Route exact path="/:locale(en|fr|en-UK)/password/create/:token/:hash/:email" component={(PasswordReset)} />
          <Route path="/:locale(en|fr|en-UK)/signup" component={(props) => {return <AuthPage initialTab={1} {...props}/>}} />
          <Route path="/:locale(en|fr|en-UK)/signin" component={AuthPage} />
          <Route exact path="/:locale(en|fr|en-UK)/error/:errorCode/:errorType" component={this.WaitingComponent(ErrorPage)} />
          <Route exact path="/:locale(en|fr|en-UK)/welcome" component={this.WaitingComponent(WelcomePage)} />

          {/* Route which will need organisationTag */}

          {/* Main route with orgTag */}
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/:mode/:recordTag" component={MainRouteAccess} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/:mode" component={MainRouteAccess} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step?" component={MainRouteAccess} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup/:invitationCode" component={MainRouteAccess} />
          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin/:invitationCode" component={MainRouteAccess} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin" component={MainRouteAccess} />
          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup" component={MainRouteAccess} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/:hashtags/:action" component={(props) => <MainRouteAccess hashtagsFilter={true} {...props} />} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/:recordTag?" component={MainRouteAccess} />
          <Route path="/:locale(en|fr|en-UK)" component={MainRouteAccess} />
          {isAuth && (
            <Redirect to={"/" + locale} />
          )}
          {!isAuth && (
            <Redirect to={"/" + locale + "/signin"} />
          )}
        </Switch>
      </div>
    );
  }
}

export default withRouter(inject('commonStore', 'authStore', 'userStore')(
  observer(MainRouteOrganisation))
);
