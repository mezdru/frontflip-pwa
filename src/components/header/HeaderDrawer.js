import React, {Component} from 'react';
import {withStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import PropTypes from 'prop-types';
import {Divider, Drawer, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar} from '@material-ui/core';
import {ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon} from '@material-ui/icons';
import './header.css';
import AvailabilityToggle from '../availabilityToggle/AvailabilityToggle';
import {styles} from './Header.css.js'
import Logo from '../utils/logo/Logo';
import { injectIntl } from 'react-intl';
import defaultPicture from '../../resources/images/placeholder_person.png';
import UrlService from '../../services/url.service';
import {Link} from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
        }

        this.handleLogout = this.handleLogout.bind(this);
    }

    getPicturePath(picture) {
        if(picture && picture.path) return null;
        else if (picture && picture.url) return picture.url;
        else if (picture && picture.uri) return picture.uri;
        else return null;
    }

    handleLogout(e) {
        e.preventDefault();
        this.props.handleDrawerClose();
        this.props.authStore.logout().then(() => {
            window.location.href = UrlService.createUrl(window.location.host, '/' + this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag, null);
        });
    }

    render() {
        const {classes, theme, auth, open, intl} = this.props;
        const {record} = this.props.recordStore.values;
        const {organisation} = this.props.organisationStore.values;
        const {currentUser} = this.props.userStore.values;
        const {locale} = this.state;
        const currentOrgAndRecord = ((currentUser && currentUser.orgsAndRecords) ? 
                                    currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) : null);

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
                
                <div className={'leftMenu'}>

                        {(auth && organisation._id) && (
                            <div>
                                {record._id && (
                                    <div>
                                        <List className={'leftSubmenu'}>
                                            <ListItem>
                                                <ListItemAvatar>
                                                    <Logo type={'person'} src={this.getPicturePath(record.picture) || defaultPicture} alt={record.name || record.tag} />
                                                </ListItemAvatar>
                                                <ListItemText   primary={record.name || record.tag} 
                                                                primaryTypographyProps={{variant:'button', noWrap: true, style: {fontWeight: 'bold'}}} />
                                            </ListItem>

                                            <ListItem button component={Link} to={'/' +locale + '/' + organisation.tag + '/search/profile/' + record.tag} >
                                                <ListItemText primary={intl.formatMessage({id: 'menu.drawer.profile'})} />
                                            </ListItem>

                                            <ListItem>
                                                <ListItemText primary={intl.formatMessage({id: 'menu.drawer.availability'})} />
                                                <ListItemSecondaryAction>
                                                    <AvailabilityToggle/>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                        </List>
                                        <Divider/>
                                    </div>
                                )}

                                <List className={'leftSubmenu'}>
                                    <ListItem>
                                        <ListItemAvatar>
                                            <Logo type={'organisation'} alt={organisation.name} />
                                        </ListItemAvatar>
                                        <ListItemText   primary={organisation.name || organisation.tag} 
                                                        primaryTypographyProps={{variant:'button', noWrap: true, style: {fontWeight: 'bold'}}} />
                                    </ListItem>
                                    {(currentUser.superadmin || (currentOrgAndRecord &&  currentOrgAndRecord.admin)) && (
                                        <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/organisation', organisation.tag)}>
                                            <ListItemText primary={intl.formatMessage({id: 'menu.drawer.organisationAdmin'})} />
                                        </ListItem>
                                    )}
                                    

                                    <ListItem>
                                        <ListItemText primary={
                                            (organisation.premium ? intl.formatMessage({id: 'menu.drawer.organisationInfoPremium'}) : intl.formatMessage({id: 'menu.drawer.organisationInfo'}))
                                        } />
                                    </ListItem>

                                    <ListItem button>
                                        <ListItemText primary={
                                            (organisation.premium ? intl.formatMessage({id: 'menu.drawer.contactUsPremium'}) : intl.formatMessage({id: 'menu.drawer.contactUs'}))
                                        } />
                                    </ListItem>

                                </List>
                                <Divider/>
                            </div>
                        )}
                            <List className={'leftSubmenu'}>
                            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/', undefined)}>
                                    <ListItemText primary={intl.formatMessage({id: 'menu.drawer.whyWingzy'})} />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/pricing', undefined)}>
                                    <ListItemText primary={intl.formatMessage({id: 'menu.drawer.pricing'})} />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)}>
                                    <ListItemText primary={intl.formatMessage({id: 'menu.drawer.terms'})} />
                                </ListItem>

                                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', undefined)}>
                                    <ListItemText primary={intl.formatMessage({id: 'menu.drawer.protectingYourData'})} />
                                </ListItem>
                            </List>
                            <Divider/>
                        {auth && (
                            <List className={'leftSubmenu'}>
                                <ListItem button onClick={this.handleLogout} >
                                    <ListItemText primary={intl.formatMessage({id: 'menu.drawer.logout'})} />
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

export default inject('authStore', 'organisationStore', 'recordStore', 'commonStore', 'userStore')(
    injectIntl(observer(
        withStyles(styles, {withTheme: true})(
            App
        )
    ))
);