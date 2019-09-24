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
      window.location.href = UrlService.createUrl(window.location.host, '/' + this.props.organisationStore.values.organisation.tag, null);
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
    let { organisation } = this.props.organisationStore.values;
    window.location.pathname = '/' + e.target.value + '/' + (organisation ? organisation.tag : '');
  }

  render() {
    const { classes, auth, open, intl } = this.props;
    const { record } = this.props.recordStore.values;
    const { organisation } = this.props.organisationStore.values;
    const { currentUser } = this.props.userStore.values;
    const { locale } = this.props.commonStore;

    const currentOrgAndRecord = ((currentUser && currentUser.orgsAndRecords) ?
      currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) : null);

    record.name = entities.decode(record.name)
    organisation.name = entities.decode(organisation.name)

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
          onClick={this.handleDrawerClose}
          onKeyDown={this.handleDrawerClose}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.props.handleDrawerClose} className={classes.drawerIconButton} >
              <ChevronLeftIcon className={classes.drawerIcon} />
            </IconButton>
          </div>

          <div className={'leftMenu'}>
            {(auth && organisation._id) && (
              <React.Fragment>
                {record._id && (
                  <React.Fragment>
                    <List className={'leftSubmenu'}>
                      <ListItem >
                        <ListItemAvatar>
                          <Logo type={'person'} src={this.getPicturePath(record.picture) || defaultPicture} alt={record.name || record.tag} className={classes.logoBorder} />
                        </ListItemAvatar>
                        <ListItemText primary={record.name || record.tag}
                          primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                      </ListItem>
                      <ListItem button component={Link} to={'/' + locale + '/' + organisation.tag + '/' + record.tag} onClick={(e) => { this.props.handleDisplayProfile(e, { tag: record.tag }) }}>
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
                  <ListItem onClick={this.props.handleDrawerClose} component={Link} to={'/' + locale + '/' + organisation.tag}>
                    <ListItemAvatar>
                      <Logo type={'organisation'} alt={organisation.name} className={classes.logoBorder} />
                    </ListItemAvatar>
                    <ListItemText primary={organisation.name || organisation.tag}
                      primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                  </ListItem>

                  {(organisation.canInvite || currentUser.superadmin || (currentOrgAndRecord && currentOrgAndRecord.admin)) && (
                    <ListItem>
                      <InvitationDialog />
                    </ListItem>
                  )}
                  {(currentUser.superadmin || (currentOrgAndRecord && currentOrgAndRecord.admin)) && (
                    <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/admin/organisation', organisation.tag)} target="_blank">
                      <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.organisationAdmin' })} />
                    </ListItem>
                  )}
                  <ListItem>
                    <ListItemText primary={
                      (organisation.premium ? intl.formatMessage({ id: 'menu.drawer.organisationInfoPremium' }) : intl.formatMessage({ id: 'menu.drawer.organisationInfo' }))
                    } />
                  </ListItem>
                  <ListItem button component="a" href={'mailto:premium@wingzy.io'} target="_blank" >
                    <ListItemText primary={
                      (organisation.premium ? intl.formatMessage({ id: 'menu.drawer.contactUsPremium' }) : intl.formatMessage({ id: 'menu.drawer.contactUs' }))
                    } />
                  </ListItem>
                  {(currentUser.orgsAndRecords && (currentUser.orgsAndRecords.length > 1)) && (
                    <React.Fragment>
                      <Divider className={classes.divider} />
                      <ListItem>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listOrgTitle' })}
                          primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                      </ListItem>
                      <OrganisationsList />
                    </React.Fragment>
                  )}
                  {currentUser.superadmin && (
                    <React.Fragment>
                      <Divider className={classes.divider} />
                      <ListItem button component="a" href={'/' + locale + '/' + organisation.tag + '/onboard'}>
                        <ListItemText primary={"Onboard"} />
                      </ListItem>
                    </React.Fragment>
                  )}
                  {currentUser.superadmin && (
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
            <List className={'leftSubmenu'}>
              {!auth && (
                <React.Fragment>
                  <ListItem button component={Link} to={"/" + locale + (organisation.tag ? '/' + organisation.tag : '') + '/signin'}>
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
              {!organisation.premium && (
                <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/#pricing-a', undefined)} target="_blank">
                  <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.pricing' })} />
                </ListItem>
              )}
              <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)} target="_blank">
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.terms' })} />
              </ListItem>
              <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData',
                organisation.tag)} target="_blank">
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
  theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore', 'recordStore', 'commonStore', 'userStore')(
  injectIntl(withRouter(observer(
    withStyles(styles, { withTheme: true })(
      HeaderDrawer
    )
  )))
);
