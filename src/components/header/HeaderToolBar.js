import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { IconButton, Toolbar, Typography } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import './header.css';
import { styles } from './Header.css.js'
import HeaderLinks from './HeaderLinks';
import Logo from '../utils/logo/Logo';
import logoNoAuth from '../../resources/images/wingzy_line_256.png';

class HeaderToolBar extends Component {
  render() {
    const { classes, open, auth, anchorEl, handleMobileMenuOpen, handleProfileMenuOpen } = this.props;

    return (
      <Toolbar className={classes.toolbar}>
        {auth && (
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={this.props.handleDrawerOpen}
            className={classNames(classes.menuButton, open && classes.hide)}
          >
            <MenuIcon className={classes.menuButton} />
          </IconButton>
        )}

        <Typography className={classes.title} variant="h6" color="inherit" noWrap style={{ paddding: 0 }}>
          <a href={(process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + process.env.REACT_APP_HOST_BACKFLIP}>
            {auth && (
              <Logo />
            )}
            {!auth && (
              <img src={logoNoAuth} alt={"Wingzy"} height="40px" />
            )}
          </a>
        </Typography>

        {!auth && (
          <HeaderLinks auth={auth} anchorEl={anchorEl}
            handleMobileMenuOpen={handleMobileMenuOpen}
            handleProfileMenuOpen={handleProfileMenuOpen} />
        )}

      </Toolbar>
    )
  }
}

HeaderToolBar.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      HeaderToolBar
    )
  )
);
