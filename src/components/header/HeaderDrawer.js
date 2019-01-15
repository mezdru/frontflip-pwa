import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import {Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography} from '@material-ui/core';
import {AccountCircle, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Mail as MailIcon, MoveToInbox as InboxIcon} from '@material-ui/icons';
import './header.css';
import AvailabilityToggle from '../availabilityToggle/AvailabilityToggle';
import {styles} from './Header.css.js'
import Logo from '../utils/logo/Logo';
import { FormattedHTMLMessage } from 'react-intl';

class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {classes, theme, auth, anchorEl, open} = this.props;
        const isMenuOpen = Boolean(anchorEl);

        return(
            <Drawer
                className={classes.drawer}
                variant="persistent"
                anchor="left"
                open={open}
                classes={{
                    paper: classes.drawerPaper,
                }}
            >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={this.props.handleDrawerClose}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                    </IconButton>
                </div>
                <Divider/>
                {/* <Button>List of the orgs</Button>
                <Divider/> */}
                
                <div className={'leftMenu'}>
                    <Typography variant="h6" color="inherit" noWrap>
                        <FormattedHTMLMessage   id={'menu.organisation.welcome'} 
                                                values={{name: this.props.organisationStore.values.organisation.name}} />
                    </Typography>
                    <Divider/>
                    
                        {auth && (
                            <List className={'leftSubmenu'}>
                                <ListItem button >
                                    <ListItemText primary="Mon profil" />
                                </ListItem>

                                <ListItem>
                                    <ListItemText primary="Disponibilité"/>
                                    <ListItemSecondaryAction>
                                        <AvailabilityToggle/>
                                    </ListItemSecondaryAction>
                                </ListItem>

                                <ListItem button >
                                    <ListItemText primary="Déconnexion" />
                                </ListItem>

                                <Divider/>
                            </List>
                        )}
                            <List className={'leftSubmenu'}>
                                <ListItem button >
                                    <ListItemText primary="Pourquoi Wingzy ?" />
                                </ListItem>

                                <ListItem>
                                    <ListItemText primary="Nos tarifs"/>
                                </ListItem>

                                <ListItem button >
                                    <ListItemText primary="Conditions générales d'utilisation" />
                                </ListItem>

                                <Divider/>
                            </List>                        
                </div>
            </Drawer>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            App
        )
    )
);