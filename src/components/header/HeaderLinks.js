import { withStyles, Button, IconButton } from "@material-ui/core";
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { styles } from './Header.css.js';
import './header.css';
import {AccountCircle, MoreVert as MoreIcon} from '@material-ui/icons';
import {FormattedMessage} from 'react-intl';
import UrlService from '../../services/url.service';
import {inject, observer} from "mobx-react";
import {Link} from 'react-router-dom';

class HeaderLinks extends Component {
    render() {
        const {auth, anchorEl, classes, handleMobileMenuOpen, handleProfileMenuOpen} = this.props;
        const isMenuOpen = Boolean(anchorEl);
        const {locale} = this.props.commonStore;


        return(
            <div className={classes.fixToRight}>
                <div className={classes.grow}/>
                <div className={classes.sectionDesktop}>
                    <Button variant={"text"} color="inherit" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '', undefined)} className={classes.menuLink}>
                        <FormattedMessage id="Why Wingzy ?" />
                    </Button>
                    <Button variant={"text"} color="inherit" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/pricing', undefined)} className={classes.menuLink}>
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
                        <Button variant={"text"} color="inherit" to={"/" + locale} component={ Link }><FormattedMessage id="Sign In"/></Button>
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

export default inject('commonStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            HeaderLinks
        )
    )
);
        