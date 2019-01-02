import { withStyles, Button, IconButton } from "@material-ui/core";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { styles } from './Header.css.js';
import './header.css';
import {AccountCircle, MoreVert as MoreIcon} from '@material-ui/icons';
import {FormattedMessage} from 'react-intl';

class HeaderLinks extends Component {
    constructor(props) {
        super(props);
    }



    render() {
        const {auth, anchorEl, classes, theme, handleMobileMenuOpen, handleProfileMenuOpen} = this.props;
        const isMenuOpen = Boolean(anchorEl);


        return(
            <div className={classes.fixToRight}>
                <div className={classes.grow}/>
                <div className={classes.sectionDesktop}>
                    <Button variant={"text"} color="inherit" href={(process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + process.env.REACT_APP_HOST_BACKFLIP} className={classes.menuLink}>
                        <FormattedMessage id="Why Wingzy ?" />
                    </Button>
                    <Button variant={"text"} color="inherit" href={(process.env.NODE_ENV === 'production' ? 'https://' : 'http://') + process.env.REACT_APP_HOST_BACKFLIP + '/pricing'} className={classes.menuLink}>
                        <FormattedMessage id="Pricing"/>
                    </Button>
                    {auth && (
                        <IconButton
                            aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle/>
                        </IconButton>
                    )}
                    {!auth && (
                        <Button variant={"text"} color="inherit"><FormattedMessage id="Sign In"/></Button>
                    )}
                
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
                        <MoreIcon/>
                    </IconButton>
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