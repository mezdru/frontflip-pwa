import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { CssBaseline, Menu, MenuItem, Button } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';
import { Link, Redirect } from "react-router-dom";
import './header.css';
import { styles } from './Header.css.js'
import HeaderAppBar from './HeaderAppBar';
import HeaderDrawer from './HeaderDrawer';
import UrlService from '../../services/url.service';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
      successLogout: false,
      open: false,
      auth: this.props.authStore.isAuth()
    };
  }

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };


  handleProfileMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = () => {
    this.setState({ anchorEl: null });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  handleLogout = () => {
    this.props.authStore.logout()
      .then(this.setState({ successLogout: true }));
  };

  render() {
    const { anchorEl, mobileMoreAnchorEl, open, successLogout, auth } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { classes } = this.props;
    const { locale } = this.props.commonStore;

    if (successLogout) return <Redirect to='/' />;


    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}><Link to='/profile' className={classes.menuLink}>Profile</Link></MenuItem>
        <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem>
          <Button variant={"text"} color="inherit" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '', undefined)} className={classes.menuLink}>
            <FormattedMessage id="Why Wingzy ?" />
          </Button>
          {/* <IconButton color="inherit">
                        <AccountCircle/>
                    </IconButton>
                    <Link to='/profile' className={classes.menuLink}>Profile</Link> */}
        </MenuItem>
        <MenuItem>
          <Button variant={"text"} color="inherit" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/pricing', undefined)} className={classes.menuLink}>
            <FormattedMessage id="Pricing" />
          </Button>
        </MenuItem>
        <MenuItem>
          <Button variant={"text"} color="inherit" to={"/" + locale} component={Link} className={classes.menuLink}>
            <FormattedMessage id="Sign In" />
          </Button>
        </MenuItem>
      </Menu>
    );

    return (
      <div className={classes.root}>
        <CssBaseline />
        <HeaderAppBar handleDrawerOpen={this.handleDrawerOpen}
          open={open} auth={auth} anchorEl={anchorEl}
          handleMobileMenuOpen={this.handleMobileMenuOpen}
          handleProfileMenuOpen={this.handleProfileMenuOpen} />
        {renderMenu}
        {renderMobileMenu}
        <HeaderDrawer handlerDrawerOpen={this.handleDrawerOpen}
          handleDrawerClose={this.handleDrawerClose}
          handleProfileMenuOpen={this.handleProfileMenuOpen}
          open={open} auth={auth} anchorEl={anchorEl} />

        <div className={classes.drawerHeader} />
        {/* <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: open,
                        })}
                    >
                    </main> */}
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
