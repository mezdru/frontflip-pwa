import React, {Component} from 'react';
import Routes from './Routes';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {CssBaseline, IconButton, Menu, MenuItem} from '@material-ui/core';
import {AccountCircle} from '@material-ui/icons';
import {BrowserRouter, Link, Redirect} from "react-router-dom";
import './components/header/header.css';
import {styles} from './components/header/Header.css.js'
import HeaderAppBar from './components/header/HeaderAppBar';
import HeaderDrawer from './components/header/HeaderDrawer';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null,
            successLogout: false,
            open: false
        };
    }

    handleDrawerOpen = () => {
        this.setState({open: true});
    };
    
    handleDrawerClose = () => {
        this.setState({open: false});
    };


    handleProfileMenuOpen = event => {
        this.setState({anchorEl: event.currentTarget});
    };
    
    handleMenuClose = () => {
        this.setState({anchorEl: null});
        this.handleMobileMenuClose();
    };
    
    handleMobileMenuOpen = event => {
        this.setState({mobileMoreAnchorEl: event.currentTarget});
    };
    
    handleMobileMenuClose = () => {
        this.setState({mobileMoreAnchorEl: null});
    };
    
    componentDidMount() {
        this.props.authStore.isAuth()
        .then(isAuth => {
            isAuth ? this.setState({auth: true}) : this.setState({auth: false});
            if(isAuth){
                if (process.env.NODE_ENV === 'production') {
                    window.location = 'https://' + (this.props.organisationStore.values.orgTag ? this.props.organisationStore.values.orgTag + '.' : '') + process.env.REACT_APP_HOST_BACKFLIP + '/search';
                } else {
                    window.location = 'http://' + process.env.REACT_APP_HOST_BACKFLIP + '/search' + (this.props.organisationStore.values.orgTag ? '?subdomains=' + this.props.organisationStore.values.orgTag : '');
                }
            }
        });
        if (!this.props.userStore.values.currentUser._id && this.state.auth) {
            this.props.userStore.getCurrentUser();
        }
    }
    
    
    
    
    handleLogout = () => {
        this.props.authStore.logout()
            .then(this.setState({successLogout: true}));
    };
    
    render() {
        const {anchorEl, mobileMoreAnchorEl, open, successLogout, auth} = this.state;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
        const {classes} = this.props;
        
        if (successLogout) return <Redirect to='/'/>;
        

        const renderMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={this.handleMenuClose}><Link to='/profile'>Profile</Link></MenuItem>
                <MenuItem onClick={this.handleLogout}>Logout</MenuItem>
            </Menu>
        );
        
        const renderMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle/>
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        );
        
        return (
            <BrowserRouter>
                <div className={classes.root}>
                    <CssBaseline/>
                    <HeaderAppBar   handleDrawerOpen={this.handleDrawerOpen} 
                                    open={open} auth={auth} anchorEl={anchorEl} 
                                    handleMobileMenuOpen={this.handleMobileMenuOpen}
                                    handleProfileMenuOpen={this.handleProfileMenuOpen}/>
                    {renderMenu}
                    {renderMobileMenu}
                    <HeaderDrawer   handlerDrawerOpen={this.handleDrawerOpen} 
                                    handleDrawerClose={this.handleDrawerClose}
                                    handleProfileMenuOpen={this.handleProfileMenuOpen} 
                                    open={open} auth={auth} anchorEl={anchorEl}/>
                    
                    <main
                        className={classNames(classes.content, {
                            [classes.contentShift]: open,
                        })}
                    >
                        <div className={classes.drawerHeader}/>
                        <Routes/>
                    </main>
                </div>
            </BrowserRouter>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default inject('commonStore', 'userStore', 'authStore', 'organisationStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            App
        )
    )
);
