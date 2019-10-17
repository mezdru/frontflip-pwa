import React, { Component } from 'react';
import { withStyles, Hidden } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { CssBaseline, Fab, Button } from '@material-ui/core';
import { Redirect } from "react-router-dom";
import './header.css';
import { styles } from './Header.css.js'
import HeaderDrawer from './HeaderDrawer';
import Logo from '../utils/logo/Logo';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import undefsafe from 'undefsafe';
import classNames from 'classnames';
import ErrorBoundary from '../utils/errors/ErrorBoundary';

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
    return ((window.location.pathname.indexOf('signin') !== -1) || (window.location.pathname.indexOf('signup') !== -1));
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    this.props.authStore.logout()
      .then(this.setState({ successLogout: true }));
  };

  handleDisplayProfile = (e, record) => {
    this.handleDrawerClose();
    this.props.handleDisplayProfile(e, record);
  }

  render() {
    const { open, successLogout, auth, isSigninOrSignupPage } = this.state;
    const { classes } = this.props;
    const { locale } = this.props.commonStore;
    const orgTag = undefsafe(this.props.orgStore.currentOrganisation, 'tag');

    if (successLogout) return <Redirect to='/' />;

    return (
      <ErrorBoundary>
        <div className={classes.root}>
          <CssBaseline />
          <Fab variant="extended" className={classes.menuButton}
            onClick={this.handleDrawerOpen}
            children={<Logo type={'organisation'} />} id="header-button" />
          {!auth && !isSigninOrSignupPage && (
            <Button variant="text" to={"/" + locale + (orgTag ? '/' + orgTag : '') + '/signin'} component={Link} className={classes.menuLink}><FormattedMessage id="Sign In" /></Button>
          )}
          <HeaderDrawer handleDrawerOpen={this.handleDrawerOpen}
            handleDrawerClose={this.handleDrawerClose}
            open={open} auth={auth}
          />

          {this.props.withProfileLogo && this.props.authStore.isAuth() && this.props.userStore.currentOrgAndRecord && this.props.userStore.currentOrgAndRecord.record && (
            <Hidden xsDown>
              <Fab variant="extended" className={classNames(classes.menuButton, classes.right)}
                component={Link}
                to={'/' + locale + '/' + orgTag + '/' + undefsafe(this.props.recordStore.currentUserRecord, 'tag')}
                children={<Logo type={'person'} src={undefsafe(this.props.recordStore.currentUserRecord, 'picture.url') || null} />} />
            </Hidden>
          )}

          <div className={classes.drawerHeader} />
        </div>
      </ErrorBoundary>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default inject('commonStore', 'userStore', 'authStore', 'orgStore', 'recordStore')(
  observer(
    withStyles(styles)(
      App
    )
  )
);
