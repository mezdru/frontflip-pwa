import React, { Component } from "react";
import {observer, inject} from 'mobx-react';
import {Redirect} from 'react-router-dom';
import { getBaseUrl } from "../services/utils.service";

const COMPONENTS = ['onboard', 'search'];
const withAuthorizationManagement = (ComponentToWrap, componentName) => {
  if(!COMPONENTS.find(elt => elt === componentName)) throw new Error('Component name must be in ' + COMPONENTS);
  class AuthorizationManagement extends Component {

    hasAccessToOrg = () => {
      let org = this.props.orgStore.currentOrganisation;
      let user = this.props.userStore.currentUser;

      if (!org) return false;
      if (org.public) return true;
      if (!user) return false;
      return (user.superadmin || this.props.userStore.currentOrgAndRecord != null);
    }

    belongsToOrg = () => (this.props.userStore.currentOrgAndRecord != null);
    needOnboarding = () => !(this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.welcomed);
    hasValidatedEmail = () => (this.props.userStore.currentUser.email.validated || false);

    render() {
      const {locale} = this.props.commonStore;
      const baseUrl = getBaseUrl(this.props);
      if(!this.hasValidatedEmail()) return <Redirect push to={'/' + locale + '/error/403/email'} />;
      if(!this.hasAccessToOrg()) return <Redirect push to={'/' + locale + '/error/403/organisation'} />;
      if(componentName === COMPONENTS[1] && this.needOnboarding()) return <Redirect push to={baseUrl + '/onboard'} />;
      if(componentName === COMPONENTS[0] && !this.belongsToOrg()) return <Redirect push to={baseUrl} />;

      return <ComponentToWrap {...this.props} />;
    }
  }

  AuthorizationManagement = inject('orgStore', 'userStore', 'authStore')(observer(AuthorizationManagement));
  return AuthorizationManagement;
}
export default withAuthorizationManagement;