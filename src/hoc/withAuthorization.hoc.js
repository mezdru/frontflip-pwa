import React, { Component } from "react";
import { observer, inject } from "mobx-react";
import { Redirect } from "react-router-dom";
import { getBaseUrl } from "../services/utils.service";
import undefsafe from "undefsafe";

const COMPONENTS = ["onboard", "search"];
const withAuthorization = (ComponentToWrap, componentName) => {
  if (!COMPONENTS.find(elt => elt === componentName))
    throw new Error("Component name must be in " + COMPONENTS);
  class AuthorizationManagement extends Component {
    hasAccessToOrg = () => {
      let org = this.props.orgStore.currentOrganisation;
      let user = this.props.userStore.currentUser;

      if (!org) return false;
      if (org.public) return true;
      if (!user) return false;
      return (
        user.superadmin || this.props.userStore.currentOrgAndRecord != null
      );
    };

    belongsToOrg = () =>
      this.props.userStore.currentOrgAndRecord != null ||
      (this.props.userStore.currentUser &&
        this.props.userStore.currentUser.superadmin);

    needOnboarding = () => {
      const { currentUser, currentOrgAndRecord } = this.props.userStore;

      return (
        currentUser &&
        !currentUser.superadmin &&
        currentOrgAndRecord &&
        !currentOrgAndRecord.welcomed &&
        (!currentOrgAndRecord.secondaryRecords ||
          currentOrgAndRecord.secondaryRecords.length === 0)
      );
    };

    hasValidatedEmail = () =>
      this.props.userStore.currentUser &&
      (this.props.userStore.currentUser.email.validated || false);

    render() {
      const { locale } = this.props.commonStore;
      const baseUrl = getBaseUrl(this.props);
      const isAuth = this.props.authStore.isAuth();
      if (
        isAuth &&
        !this.hasValidatedEmail() &&
        !this.props.userStore.currentUser.googleUser &&
        !this.props.userStore.currentUser.linkedinUser
      )
        return <Redirect push to={"/" + locale + "/error/403/email"} />;
      if (isAuth && !this.hasAccessToOrg())
        return <Redirect push to={"/" + locale + "/error/403/organisation"} />;
      if (!isAuth && !this.hasAccessToOrg())
        return <Redirect push to={baseUrl + "/signin"} />;

      if (
        isAuth &&
        this.belongsToOrg() &&
        !this.props.commonStore.getCookie("isAccessInLogged")
      ) {
        this.props.commonStore.setCookie(
          "isAccessInLogged",
          true,
          new Date(new Date().getTime() + 60 * 60000)
        ); // 1 hour
        this.props.keenStore.recordEvent("accessIn", {
          recordEmitter: undefsafe(
            this.props.recordStore.currentUserRecord,
            "_id"
          )
        });
      }

      if (isAuth && componentName === COMPONENTS[1] && this.needOnboarding())
        return <Redirect push to={baseUrl + "/onboard"} />;
      if (componentName === COMPONENTS[0] && !this.belongsToOrg())
        return <Redirect push to={baseUrl} />;

      return <ComponentToWrap {...this.props} />;
    }
  }

  AuthorizationManagement = inject(
    "orgStore",
    "userStore",
    "authStore",
    "commonStore",
    "keenStore",
    "recordStore"
  )(observer(AuthorizationManagement));
  return AuthorizationManagement;
};
export default withAuthorization;
