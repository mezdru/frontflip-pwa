import React, { Component, Suspense } from "react";
import { withStyles, Hidden } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import { Fab } from "@material-ui/core";
import { Redirect } from "react-router-dom";
import "./header.css";
import { styles } from "./Header.css.js";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import undefsafe from "undefsafe";
import classNames from "classnames";
import ErrorBoundary from "../utils/errors/ErrorBoundary";

const Button = React.lazy(() => import("@material-ui/core/Button"));
const HeaderDrawer = React.lazy(() => import("./HeaderDrawer"));
const Logo = React.lazy(() => import("../utils/logo/Logo"));

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      successLogout: false,
      open: false,
      auth: this.props.authStore.isAuth(),
      isSigninOrSignupPage: this.isSigninOrSignup()
    };
  }

  isSigninOrSignup = () => {
    return (
      window.location.pathname.indexOf("signin") !== -1 ||
      window.location.pathname.indexOf("signup") !== -1
    );
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    this.props.authStore.logout().then(this.setState({ successLogout: true }));
  };

  handleDisplayProfile = (e, record) => {
    this.handleDrawerClose();
    this.props.handleDisplayProfile(e, record);
  };

  componentDidMount() {
    var headerButton = document.getElementById("header-button");
    headerButton.dataset.position = "INITIAL";
  }

  render() {
    const { open, successLogout, auth, isSigninOrSignupPage } = this.state;
    const { classes } = this.props;
    const { locale } = this.props.commonStore;
    const orgTag = undefsafe(this.props.orgStore.currentOrganisation, "tag");

    if (successLogout) return <Redirect to="/" />;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <Fab
            variant="extended"
            className={classes.menuButton}
            onClick={this.handleDrawerOpen}
            children={
              <Suspense fallback={<></>}>
                <Logo type={"organisation"} />
              </Suspense>
            }
            id="header-button"
          />
          {!auth && !isSigninOrSignupPage && (
            <Suspense fallback={<></>}>
              <Button
                variant="text"
                to={"/" + locale + (orgTag ? "/" + orgTag : "") + "/signin"}
                component={Link}
                className={classes.menuLink}
              >
                <FormattedMessage id="Sign In" />
              </Button>
            </Suspense>
          )}

          <Suspense fallback={<></>}>
            <HeaderDrawer
              handleDrawerOpen={this.handleDrawerOpen}
              handleDrawerClose={this.handleDrawerClose}
              open={open}
              auth={auth}
            />
          </Suspense>

          {this.props.withProfileLogo &&
            this.props.authStore.isAuth() &&
            this.props.userStore.currentOrgAndRecord &&
            this.props.userStore.currentOrgAndRecord.record && (
              <Hidden xsDown>
                <Fab
                  variant="extended"
                  className={classNames(classes.menuButton, classes.right)}
                  component={Link}
                  to={
                    "/" +
                    locale +
                    "/" +
                    orgTag +
                    "/" +
                    undefsafe(this.props.recordStore.currentUserRecord, "tag")
                  }
                  children={
                    <Suspense fallback={<></>}>
                      <Logo
                        type={"person"}
                        src={
                          undefsafe(
                            this.props.recordStore.currentUserRecord,
                            "picture.url"
                          ) || null
                        }
                      />
                    </Suspense>
                  }
                />
              </Hidden>
            )}

          <div className={classes.drawerHeader} />
        </div>
      </ErrorBoundary>
    );
  }
}

export default inject(
  "commonStore",
  "userStore",
  "authStore",
  "orgStore",
  "recordStore"
)(observer(withStyles(styles)(App)));
