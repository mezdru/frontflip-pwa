import React from 'react';
import { CircularProgress } from '@material-ui/core';
import { Link, Redirect } from 'react-router-dom';
import undefsafe from 'undefsafe';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import {getBaseUrl} from '../services/utils.service';

const PasswordForgot = React.lazy(() => import('../pages/auth/PasswordForgot'));
const PasswordReset = React.lazy(() => import('../pages/auth/PasswordReset'));
const OnboardPage = React.lazy(() => import('../pages/OnboardPage'));

class MainRouteAccess extends React.PureComponent {

  state = {
    isAuth: false,
    hasAccessToOrg: false,
    lastCheckedOrgTag: null,
    isRelativeToOrg: false,
    isOnboarded: false,
    render: false,
    isEmailValidated: false,
    orgNotFound: false,
  }

  hasAccessToOrg = (user, org) => {
    if (!org) return false;
    if (org.public) return true;
    if (!user) return false;
    return (user.superadmin || this.props.userStore.currentOrgAndRecord != null);
  }

  updateState = async (orgTag) => {
    let state = {
      isAuth: this.props.authStore.isAuth(),
      render: true,
      isEmailValidated: undefsafe(this.props.userStore.currentUser, 'email.validated')
    };

    if (orgTag) {
      this.props.commonStore.url.params.orgTag = orgTag;
      await this.props.orgStore.fetchForPublic(orgTag)
      .catch(e => {
        state.orgNotFound = true;
      });

      if(!state.orgNotFound) {
        state = {
          hasAccessToOrg: this.hasAccessToOrg(this.props.userStore.currentUser, this.props.orgStore.currentOrganisation),
          isRelativeToOrg: (this.props.userStore.currentOrgAndRecord != null),
          isOnboarded: (this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.welcomed) != null,
          lastCheckedOrgTag: this.props.orgStore.currentOrganisation.tag,
          orgNotFound: false,
          ...state
        }
      }

    }
    this.setState(state);
  }

  componentWillReceiveProps(nextProps) {
    let orgTag = undefsafe(nextProps.match, 'params.organisationTag');
    if(orgTag !== undefsafe(this.props.match, 'params.organisationTag'))
      this.updateState(orgTag);
  }

  componentWillMount() {
    this.updateState(undefsafe(this.props.match, 'params.organisationTag'));
  }

  WaitingComponent(Component, additionnalProps) {
    return props => (
      <React.Suspense fallback={<CircularProgress color='secondary' />}>
        <Component {...props} {...additionnalProps} />
      </React.Suspense>
    );
  }

  render() {
    const { render, isOnboarded, isRelativeToOrg, isAuth, hasAccessToOrg, isEmailValidated, orgNotFound } = this.state;
    const { locale } = this.props.commonStore;
    if(!render) return null;
    console.log('render')

    let baseUrl = getBaseUrl(this.props);

    if(orgNotFound) return <Redirect to={'/' + locale + '/error/404/organisation'} />;
    if(!isAuth && !hasAccessToOrg) return <Redirect to={baseUrl + '/signin'} />;
    if(isAuth && !isEmailValidated) return <Redirect to={'/' + locale + '/error/403/email'} />;
    if(isAuth && isRelativeToOrg && !isOnboarded) return <Redirect to={baseUrl + '/onboard'} />;
    if(isAuth && !hasAccessToOrg) return <Redirect to={'/' + locale + '/error/403/organisation'} />;


    return (
      <>
        <Link to="/en/gmail1" >
          {JSON.stringify(this.state)} gmail1
      </Link><br /><br />
        <Link to="/en/ccc" >
          ccc :   {this.state.lastCheckedOrgTag}
          </Link>
      </>
    );
  }
}

export default inject('commonStore', 'authStore', 'orgStore', 'userStore', 'recordStore')(
  withRouter(observer(
    MainRouteAccess
  ))
);