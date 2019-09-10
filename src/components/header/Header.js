import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { CssBaseline, Fab, Button} from '@material-ui/core';
import { Redirect } from "react-router-dom";
import './header.css';
import { styles } from './Header.css.js'
import HeaderDrawer from './HeaderDrawer';
import Logo from '../utils/logo/Logo';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

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
    return ( (window.location.pathname.indexOf('signin') !== -1) || (window.location.pathname.indexOf('signup') !== -1)  );
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
    const {open, successLogout, auth, isSigninOrSignupPage } = this.state;
    const { classes } = this.props;
    const { locale } = this.props.commonStore;
    const orgTag = this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag;

    if (successLogout) return <Redirect to='/' />;
    
    return (
      <div className={classes.root}>
        <CssBaseline />
        <Fab variant="extended" className={classes.menuButton}
                    onClick={this.handleDrawerOpen} 
                    children={<Logo type={'organisation'} />} id="header-button" />
        {!auth && !isSigninOrSignupPage && (
            <Button variant="text" to={"/" + locale + (orgTag ? '/' + orgTag : '') + '/signin'} component={Link} className={classes.menuLink}><FormattedMessage id="Sign In" /></Button>
        )}
        {/* <HeaderAppBar handleDrawerOpen={this.handleDrawerOpen}
          open={open} auth={auth}
        /> */}
        <HeaderDrawer handleDrawerOpen={this.handleDrawerOpen}
          handleDrawerClose={this.handleDrawerClose}
          open={open} auth={auth}
          handleDisplayProfile={this.handleDisplayProfile}
        />
        <div className={classes.drawerHeader}/>
      </div>
    );
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default inject('commonStore', 'userStore', 'authStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      App
    )
  )
);
