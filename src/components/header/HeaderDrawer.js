import React, { Component } from 'react';
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { Divider, SwipeableDrawer, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar } from '@material-ui/core';
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';
import './header.css';
import AvailabilityToggle from '../availabilityToggle/AvailabilityToggle';
import { styles } from './Header.css.js'
import Logo from '../utils/logo/Logo';
import { injectIntl } from 'react-intl';
import undefsafe from 'undefsafe';
import defaultPicture from '../../resources/images/placeholder_person.png';
import UrlService from '../../services/url.service';
import { Link, withRouter } from 'react-router-dom';
import OrganisationsList from '../utils/orgsList/OrganisationsList';
import InvitationDialog from '../utils/popup/Invitation';
import LocaleSelector from '../utils/fields/LocaleSelector';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

class HeaderDrawer extends Component {

  getPicturePath(picture) {
    if (picture && picture.path) return null;
    else if (picture && picture.url) return picture.url;
    else if (picture && picture.uri) return picture.uri;
    else return null;
  }

  handleLogout = (e) => {
    e.preventDefault();
    this.props.handleDrawerClose();
    this.props.authStore.logout().then(() => {
      window.location.href = UrlService.createUrl(window.location.host, this.props.orgStore.currentOrganisation ? '/' + this.props.orgStore.currentOrganisation.tag : '', null);
    });
  }

  handleTestPushNotification = () => {
    Notification.requestPermission(function (status) {
      console.log('Notification permission status:', status);
      if (status === 'granted') {
        navigator.serviceWorker.getRegistration().then(function (reg) {
          if (reg)
            reg.showNotification('Hello world! This is a notification from Wingzy PWA!');
          else
            console.warn("Can't use notification in this APP");
        });
      }
    });
  }

  handleLocaleChange = (e) => {
    let { currentOrganisation } = this.props.orgStore;
    window.location.pathname = '/' + e.target.value + '/' + (currentOrganisation ? currentOrganisation.tag : '');
  }

  render() {
    const { classes, auth, open, intl } = this.props;
    const { currentUserRecord } = this.props.recordStore;
    const { currentOrganisation } = this.props.orgStore;
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    const currentOrgAndRecord = this.props.userStore.currentOrgAndRecord;
    if (currentUserRecord) currentUserRecord.name = entities.decode(currentUserRecord.name)
    if (currentOrganisation) currentOrganisation.name = entities.decode(currentOrganisation.name)
    return (
      <SwipeableDrawer
        className={classes.drawer}
        anchor="left"
        open={open}
        onOpen={this.props.handleDrawerOpen}
        onClose={this.props.handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div
          tabIndex={0}
          role="button"
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.props.handleDrawerClose} className={classes.drawerIconButton} >
              <ChevronLeftIcon className={classes.drawerIcon} />
            </IconButton>
          </div>

          <div className={'leftMenu'}>
            {(auth && undefsafe(currentOrganisation, '_id')) && (
              <React.Fragment>
                {currentUserRecord && (
                  <React.Fragment>
                    <List className={'leftSubmenu'}>
                      <ListItem >
                        <ListItemAvatar>
                          <Logo type={'person'} src={this.getPicturePath(currentUserRecord.picture) || defaultPicture} alt={currentUserRecord.name || currentUserRecord.tag} className={classes.logoBorder} />
                        </ListItemAvatar>
                        <ListItemText primary={currentUserRecord.name || currentUserRecord.tag}
                          primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                      </ListItem>
                      <ListItem button component={Link} to={'/' + locale + '/' + currentOrganisation.tag + '/' + currentUserRecord.tag} onClick={this.props.handleDrawerClose}>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.profile' })} />
                      </ListItem>
                      <ListItem>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.availability' })} />
                        <ListItemSecondaryAction>
                          <AvailabilityToggle />
                        </ListItemSecondaryAction>
                      </ListItem>
                    </List>
                    <Divider className={classes.divider} />
                  </React.Fragment>
                )}
                <List className={'leftSubmenu'}>
                  <ListItem onClick={this.props.handleDrawerClose} component={Link} to={'/' + locale + '/' + undefsafe(currentOrganisation, 'tag')}>
                    <ListItemAvatar>
                      <Logo type={'organisation'} alt={undefsafe(currentOrganisation, 'name')} className={classes.logoBorder} />
                    </ListItemAvatar>
                    <ListItemText primary={currentOrganisation && (currentOrganisation.name || currentOrganisation.tag)}
                      primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                  </ListItem>

                  {(undefsafe(currentOrganisation, 'canInvite') || undefsafe(currentUser, 'superadmin') || (currentOrgAndRecord && currentOrgAndRecord.admin)) && (
                    <ListItem>
                      <InvitationDialog />
                    </ListItem>
                  )}
                  {(undefsafe(currentUser, 'superadmin') || (currentOrgAndRecord && currentOrgAndRecord.admin)) && (
                    <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/organisation', currentOrganisation.tag)} target="_blank">
                      <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.organisationAdmin' })} />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText primary={
                      (undefsafe(currentOrganisation, 'premium') ? intl.formatMessage({ id: 'menu.drawer.organisationInfoPremium' }) : intl.formatMessage({ id: 'menu.drawer.organisationInfo' }))
                    } />
                  </ListItem>
                  <ListItem button component="a" href={'mailto:premium@wingzy.io'} target="_blank" >
                    <ListItemText primary={
                      (undefsafe(currentOrganisation, 'premium') ? intl.formatMessage({ id: 'menu.drawer.contactUsPremium' }) : intl.formatMessage({ id: 'menu.drawer.contactUs' }))
                    } />
                  </ListItem>
                  {(currentUser && currentUser.orgsAndRecords && (currentUser.orgsAndRecords.length > 1)) && (
                    <React.Fragment>
                      <Divider className={classes.divider} />
                      <ListItem>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listOrgTitle' })}
                          primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                      </ListItem>
                      <OrganisationsList onClick={this.props.handleDrawerClose} />
                    </React.Fragment>
                  )}
                  {undefsafe(currentUser, 'superadmin') && (
                    <React.Fragment>
                      <Divider className={classes.divider} />
                      <ListItem button component="a" href={'/' + locale + '/' + currentOrganisation.tag + '/onboard'}>
                        <ListItemText primary={"Onboard"} />
                      </ListItem>
                    </React.Fragment>
                  )}
                  {undefsafe(currentUser, 'superadmin') && (
                    <React.Fragment>
                      <Divider className={classes.divider} />
                      <ListItem button onClick={this.handleTestPushNotification}>
                        <ListItemText primary={"Test notification"} />
                      </ListItem>
                    </React.Fragment>
                  )}
                </List>
                <Divider className={classes.divider} />
              </React.Fragment>
            )}
            {(auth && !undefsafe(currentOrganisation, '_id')) && currentUser && currentUser.orgsAndRecords && (
              <React.Fragment>
                <Divider className={classes.divider} />
                <ListItem>
                  <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listOrgTitle' })}
                    primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                </ListItem>
                <OrganisationsList onClick={this.props.handleDrawerClose} />
                <Divider className={classes.divider} />
              </React.Fragment>
            )}
            <List className={'leftSubmenu'}>
              {!auth && (
                <React.Fragment>
                  <ListItem button component={Link} to={"/" + locale + (currentOrganisation ? '/' + currentOrganisation.tag : '') + '/signin'}>
                    <ListItemText primary={intl.formatMessage({ id: 'Sign In' })} />
                  </ListItem>
                  <Divider className={classes.divider} />
                </React.Fragment>
              )}

              <ListItem>
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.locale' })} />
                <ListItemSecondaryAction>
                  < LocaleSelector currentLocale={locale} handleChange={this.handleLocaleChange} />
                </ListItemSecondaryAction>
              </ListItem>

              <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/', undefined)} target="_blank">
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.whyWingzy' })} />
              </ListItem>
              {currentOrganisation && !currentOrganisation.premium && (
                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/#pricing-a', undefined)} target="_blank">
                  <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.pricing' })} />
                </ListItem>
              )}
              <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)} target="_blank">
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.terms' })} />
              </ListItem>
              <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData',
                undefsafe(currentOrganisation, 'tag'))} target="_blank">
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.protectingYourData' })} />
              </ListItem>
              {auth && (
                <React.Fragment>
                  <Divider className={classes.divider} />
                  <ListItem button onClick={this.handleLogout} >
                    <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.logout' })} />
                  </ListItem>
                </React.Fragment>
              )}
            </List>
          </div>
        </div>
      </SwipeableDrawer>
    )
  }
}

HeaderDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default inject('authStore', 'orgStore', 'recordStore', 'commonStore', 'userStore')(
  injectIntl(withRouter(observer(
    withStyles(styles)(
      HeaderDrawer
    )
  )))
);
