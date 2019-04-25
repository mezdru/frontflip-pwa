import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

import MainRouteOrganisationRedirect from './MainRouteOrganisationRedirect';
import AuthPage from '../pages/auth/AuthPage';

// const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));

class MainRouteOrganisation extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isAuth: this.props.authStore.isAuth()
    };

    // set locale
    if (this.props.match && this.props.match.params && this.props.match.params.locale) {
      this.props.commonStore.locale = this.props.match.params.locale;
      this.props.commonStore.populateLocale();
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

    return (
      <div>
        <Switch>
          {/* All routes without orgTag */}
          <Route exact path="/:locale(en|fr|en-UK)/password/forgot" component={this.WaitingComponent(PasswordForgot)} />
          <Route exact path="/:locale(en|fr|en-UK)/password/reset/:token/:hash" component={this.WaitingComponent(PasswordReset)} />
          <Route exact path="/:locale(en|fr|en-UK)/password/create/:token/:hash/:email" component={this.WaitingComponent(PasswordReset)} />
          <Route path="/:locale(en|fr|en-UK)/signup" component={(props) => {return <AuthPage initialTab={1} {...props}/>}} />
          <Route path="/:locale(en|fr|en-UK)/signin" component={AuthPage} />
          <Route exact path="/:locale(en|fr|en-UK)/error/:errorCode/:errorType" component={this.WaitingComponent(ErrorPage)} />

          {/* Route which will need organisationTag */}

          {/* Main route with orgTag */}
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit/:recordId" component={MainRouteOrganisationRedirect} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit" component={MainRouteOrganisationRedirect} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step?" component={MainRouteOrganisationRedirect} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signin" component={MainRouteOrganisationRedirect} />
          <Route path="/:locale(en|fr|en-UK)/:organisationTag/signup" component={MainRouteOrganisationRedirect} />
          <Route path="/:locale(en|fr|en-UK)/:organisationTag/:hashtags/:action" component={(props) => <MainRouteOrganisationRedirect hashtagsFilter={true} {...props} />} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={MainRouteOrganisationRedirect} />
          <Route path="/:locale(en|fr|en-UK)" component={MainRouteOrganisationRedirect} />
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

export default inject('commonStore', 'authStore')(
  withRouter(observer(
    MainRouteOrganisation
  ))
);
