import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {AppBar} from '@material-ui/core';
import './header.css';
import {styles} from './Header.css.js'
import HeaderToolBar from './HeaderToolBar';

class HeaderAppBar extends Component {
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
            <AppBar
                position="fixed"
                color="default"
                className={classNames(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
            {/*  import toolbar */}
            <HeaderToolBar/>
            </AppBar>
        )
    }
}

HeaderAppBar.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            HeaderAppBar
        )
    )
);