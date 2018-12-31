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

class HeaderToolBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileMoreAnchorEl: null,
            open: false
        };
    }

    render() {
        const {classes} = this.props;
        const {open} = this.state;

        return(
            <Toolbar>
                <IconButton style={{padding: 0}}
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={this.handleDrawerOpen}
                            className={classNames(classes.menuButton, open && classes.hide)}
                            disabled
                >
                    <MenuIcon/>
                </IconButton>
                <Typography className={classes.title} variant="h6" color="inherit" noWrap>
                    <a href={(process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + process.env.REACT_APP_HOST_BACKFLIP}>
                        <img src={logoWingzy} height="70px" alt="Logo of Wingzy"/>
                    </a>
                </Typography>
                
            {/* import links */}
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