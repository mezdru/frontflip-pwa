import {withStyles} from "@material-ui/core";
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './header.css';
import {styles} from './App.css.js'

class HeaderLinks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null
        };
    }



    render() {
        const {classes, theme} = this.props;

        return(
            <div>
                <div className={classes.grow}/>
                <div className={classes.sectionDesktop}>
                    {/* <Button variant={"text"} color="inherit">Why Wingzy ?</Button>
                    <Button variant={"text"} color="inherit">Pricing</Button>
                    {auth && (
                        <IconButton
                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={this.handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    )}
                    {!auth && (
                        <Button variant={"text"} color="inherit">Login</Button>
                    )} */}
                
                </div>
                <div className={classes.sectionMobile}>
                    {/* <IconButton aria-haspopup="true" onClick={this.handleMobileMenuOpen} color="inherit" style={{padding: 0}}>
                        <MoreIcon/>
                    </IconButton> */}
                </div>
            </div>

        )
    }
}

HeaderLinks.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default 
        withStyles(styles, {withTheme: true})(
            HeaderLinks
        );