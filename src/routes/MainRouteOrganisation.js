import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';
import { inject, observer } from 'mobx-react';

const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));
const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const AuthPage = React.lazy(() => import('../pages/auth/AuthPage'));
const ErrorPage = React.lazy(() => import('../pages/ErrorPage'));
const MainRouteOrganisationRedirect = React.lazy(() => import('./MainRouteOrganisationRedirect'));

console.debug('Load MainRouteOrganisation.');

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
          <Route path="/:locale(en|fr|en-UK)/signup" component={this.WaitingComponent(AuthPage, {initialTab: 1})} />
          <Route path="/:locale(en|fr|en-UK)/signin" component={this.WaitingComponent(AuthPage)} />
          <Route exact path="/:locale(en|fr|en-UK)/error/:errorCode/:errorType" component={this.WaitingComponent(ErrorPage)} />

          {/* Route which will need organisationTag */}

          {/* Main route with orgTag */}
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit/:recordId" component={this.WaitingComponent(MainRouteOrganisationRedirect)} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step/edit" component={this.WaitingComponent(MainRouteOrganisationRedirect)} />
          <Route exact path="/:locale(en|fr|en-UK)/:organisationTag/onboard/:step?" component={this.WaitingComponent(MainRouteOrganisationRedirect)} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag/:hashtags/:action/:invitationCode" component={this.WaitingComponent(MainRouteOrganisationRedirect, {hashtagsFilter: true})} />
          <Route path="/:locale(en|fr|en-UK)/:organisationTag/:hashtags/:action" component={this.WaitingComponent(MainRouteOrganisationRedirect, {hashtagsFilter: true})} />

          <Route path="/:locale(en|fr|en-UK)/:organisationTag" component={this.WaitingComponent(MainRouteOrganisationRedirect)} />
          <Route path="/:locale(en|fr|en-UK)" component={this.WaitingComponent(MainRouteOrganisationRedirect)} />

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
