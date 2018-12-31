import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {IconButton, Toolbar, Typography} from '@material-ui/core';
import {Menu as MenuIcon} from '@material-ui/icons';
import logoWingzy from '../../resources/images/wingzy_line_256.png';
import './header.css';
import {styles} from './Header.css.js'
import HeaderLinks from './HeaderLinks';

class HeaderToolBar extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes, open, auth, anchorEl, handleMobileMenuOpen, handleProfileMenuOpen} = this.props;

        return(
            <Toolbar>
                <IconButton 
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.props.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                            
                >
                    <MenuIcon/>
                </IconButton>
                <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                    <a href={(process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + process.env.REACT_APP_HOST_BACKFLIP}>
                        <img src={logoWingzy} height="70px" alt="Logo of Wingzy"/>
                    </a>
                </Typography>
                
            <HeaderLinks auth={auth} anchorEl={anchorEl} 
                        handleMobileMenuOpen={handleMobileMenuOpen}
                        handleProfileMenuOpen={handleProfileMenuOpen}/>
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
        withStyles(styles, {withTheme: true})(
            HeaderToolBar
        )
    )
);