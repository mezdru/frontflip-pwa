import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import {Button, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Typography, ListItemAvatar, Avatar} from '@material-ui/core';
import {AccountCircle, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Mail as MailIcon, MoveToInbox as InboxIcon} from '@material-ui/icons';
import './header.css';
import AvailabilityToggle from '../availabilityToggle/AvailabilityToggle';
import {styles} from './Header.css.js'
import Logo from '../utils/logo/Logo';
import { FormattedHTMLMessage } from 'react-intl';
import defaultPicture from '../../resources/images/placeholder_person.png';
import UrlService from '../../services/url.service';
import {Link} from "react-router-dom";

const defaultLogo = 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg';

class App extends Component {
    constructor(props) {
        super(props);


    }

    getPicturePath(picture) {
        if(picture && picture.path) return null;
        else if (picture && picture.url) return picture.url;
        else if (picture && picture.uri) return picture.uri;
        else return null;
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.authStore.logout();
        //redirect 
    }

    render() {
        const {classes, theme, auth, anchorEl, open} = this.props;
        const {record} = this.props.recordStore.values;
        const {organisation, orgTag} = this.props.organisationStore.values;
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
                {/* <Button>List of the orgs</Button>
                <Divider/> */}
                
                <div className={'leftMenu'}>
                    {/* <Typography variant="h6" color="inherit" noWrap>
                        <FormattedHTMLMessage   id={'menu.organisation.welcome'} 
                                                values={{name: this.props.organisationStore.values.organisation.name}} />
                    </Typography>
                    <Divider/>
                     */}
                        {auth && (
                            <div>
                                <List className={'leftSubmenu'}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Logo type={'person'} src={this.getPicturePath(record.picture) || defaultPicture} alt={record.name || record.tag} />
                                        </ListItemAvatar>
                                        <ListItemText   primary={record.name || record.tag + 'eeeeeeeeeeeeeee'} 
                                                        primaryTypographyProps={{variant:'button', noWrap: true, style: {fontWeight: 'bold'}}} />
                                    </ListItem>

                                    <ListItem button >
                                        <ListItemText primary="Mon profil" />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary="Disponibilité"/>
                                        <ListItemSecondaryAction>
                                            <AvailabilityToggle/>
                                        </ListItemSecondaryAction>
                                    </ListItem>

                                </List>
                                <Divider/>

                                <List className={'leftSubmenu'}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Logo type={'organisation'} alt={organisation.name} />
                                        </ListItemAvatar>
                                        <ListItemText   primary={organisation.name || organisation.tag} 
                                                        primaryTypographyProps={{variant:'button', noWrap: true, style: {fontWeight: 'bold'}}} />
                                    </ListItem>

                                    <ListItem>
                                        <ListItemText primary={"Vous utilisez actuellement un Wingzy gratuit limité à 1000 recherches par mois."} />
                                    </ListItem>

                                    <ListItem button>
                                        <ListItemText primary={"Contactez-nous pour passer premium !"} />
                                    </ListItem>

                                </List>
                                <Divider/>
                            </div>
                        )}
                            <List className={'leftSubmenu'}>
                            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/', undefined)}>
                                    <ListItemText primary="Pourquoi Wingzy ?" />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/pricing', undefined)}>
                                    <ListItemText primary="Nos tarifs" />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                                    <ListItemText primary="Conditions d'utilisation" />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                                    <ListItemText primary="Protection des données" />
                                </ListItem>
                            </List>
                            <Divider/>
                        {auth && (
                            <List className={'leftSubmenu'}>
                                <ListItem button onClick={this.handleLogout} >
                                    <ListItemText primary="Déconnexion" />
                                </ListItem>
                            </List>
                        )}    
                </div>
            </Drawer>
        )
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore', 'recordStore')(
    observer(
        withStyles(styles, {withTheme: true})(
            App
        )
    )
);