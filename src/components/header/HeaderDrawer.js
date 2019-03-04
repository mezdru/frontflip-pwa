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

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale
    }

    this.handleLogout = this.handleLogout.bind(this);
  }

  getPicturePath(picture) {
    if (picture && picture.path) return null;
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
    const { classes, auth, open, intl, theme } = this.props;
    const { record } = this.props.recordStore.values;
    const { organisation } = this.props.organisationStore.values;
    const { currentUser } = this.props.userStore.values;
    const { locale } = this.state;
    const currentOrgAndRecord = ((currentUser && currentUser.orgsAndRecords) ?
      currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === organisation._id) : null);

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

          {(auth && (organisation && organisation._id)) && (
            <div>
              {record && record._id && (
                <div>
                  <List className={'leftSubmenu'}>
                    <ListItem >
                      <ListItemAvatar>
                        <Logo type={'person'} src={this.getPicturePath(record.picture) || defaultPicture} alt={record.name || record.tag} />
                      </ListItemAvatar>
                      <ListItemText primary={record.name || record.tag}
                        primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold' } }} />
                    </ListItem>

                    <ListItem button component={Link} to={'/' + locale + '/' + organisation.tag + '/' + record.tag} onClick={(e) => {this.props.handleDisplayProfile(e, {tag: record.tag})}}>
                      <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.profile' })} />
                    </ListItem>

                    <ListItem>
                      <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.availability' })} />
                      <ListItemSecondaryAction>
                        <AvailabilityToggle />
                      </ListItemSecondaryAction>
                    </ListItem>

                  </List>
                  <Divider />
                </div>
              )}

              <List className={'leftSubmenu'}>
                <ListItem onClick={this.props.handleDrawerClose} component={Link} to={'/' + locale + '/' + organisation.tag}>
                  <ListItemAvatar>
                    <Logo type={'organisation'} alt={organisation.name} />
                  </ListItemAvatar>
                  <ListItemText primary={organisation.name || organisation.tag}
                    primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold' } }} />
                </ListItem>

                {(organisation.canInvite) && (
                  <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/invite', organisation.tag)} >
                    <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.invite'})} 
                                  primaryTypographyProps={{style: { fontWeight: 'bold', color: theme.palette.primary.main } }} />
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
                <Divider />
                {(currentUser.orgsAndRecords && (currentUser.orgsAndRecords.length > 1) ) && (
                  <div>
                    <ListItem>
                      <ListItemText primary={intl.formatMessage({id: 'menu.drawer.listOrgTitle'})}
                        primaryTypographyProps={{noWrap: true, style: { fontWeight: 'bold' } }} />
                    </ListItem>
                    <OrganisationsList />
                  </div>
                )}

                {currentUser.superadmin && (
                  <ListItem button component={Link} to={'/' + locale + '/' + organisation.tag + '/onboard/onboard/onboard'}>
                    <ListItemText primary={"Onboard"} />
                  </ListItem>
                )}
              </List>
              <Divider />
            </div>
          )}
          <List className={'leftSubmenu'}>
            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/', undefined)} target="_blank">
              <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.whyWingzy' })} />
            </ListItem>

            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/pricing', undefined)} target="_blank">
              <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.pricing' })} />
            </ListItem>

            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/terms', undefined)} target="_blank">
              <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.terms' })} />
            </ListItem>

            <ListItem button component="a" href={UrlService.createUrl(process.env.REACT_APP_HOST_BACKFLIP, '/protectingYourData', 
                                                                      ((organisation && organisation.tag) ? organisation.tag : undefined))} target="_blank">
              <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.protectingYourData' })} />
            </ListItem>
          </List>
          <Divider />
          {auth && (
            <div>
              <List className={'leftSubmenu'}>
                <ListItem button onClick={this.handleLogout} >
                  <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.logout' })} />
                </ListItem>
              </List>
            </div>
          )}
        </div>
        </div>
      </SwipeableDrawer>
    )
  }
}

App.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default inject('authStore', 'organisationStore', 'recordStore', 'commonStore', 'userStore')(
  injectIntl(withRouter(observer(
    withStyles(styles, { withTheme: true })(
      App
    )
  )))
);