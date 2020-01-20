import React, { Component, Suspense } from 'react';
import { withStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import PropTypes from 'prop-types';
import { Divider, SwipeableDrawer, IconButton, List, ListItem, ListItemSecondaryAction, ListItemText, ListItemAvatar } from '@material-ui/core';
import { ChevronLeft as ChevronLeftIcon } from '@material-ui/icons';
import './header.css';
import { styles } from './Header.css.js'
import { injectIntl } from 'react-intl';
import undefsafe from 'undefsafe';
import defaultPicture from '../../resources/images/placeholder_person.png';
import UrlService from '../../services/url.service';
import { Link, withRouter } from 'react-router-dom';

const Entities = require('html-entities').XmlEntities;
const entities = new Entities();

const LocaleSelector = React.lazy(() => import('../utils/fields/LocaleSelector'));
const InvitationDialog = React.lazy(() => import('../utils/popup/Invitation'));
const ItemsList = React.lazy(() => import('../utils/itemsList/ItemsList'));
const Logo = React.lazy(() => import('../utils/logo/Logo'));

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

  handleLocaleChange = (e) => {
    let { currentOrganisation } = this.props.orgStore;
    window.location.pathname = '/' + e.target.value + '/' + (currentOrganisation ? currentOrganisation.tag : '');
  }

  useSecondaryProfile = () => {
    const { currentUser, currentOrgAndRecord } = this.props.userStore;
    const { currentOrganisation } = this.props.orgStore;

    return (currentUser && currentOrgAndRecord && (
      currentOrganisation.features.secondaryProfiles ||
      currentUser.superadmin));
  }

  render() {
    const { classes, auth, open, intl } = this.props;
    const { currentUserRecord } = this.props.recordStore;
    const { currentOrganisation } = this.props.orgStore;
    const { currentUser, currentOrgAndRecord } = this.props.userStore;
    const { locale } = this.props.commonStore;
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
          paper: classes.drawerPaper
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

          {open && (
            <div className={'leftMenu'}>
            {(auth && undefsafe(currentOrganisation, '_id')) && (
              <>
                {currentUserRecord && (
                  <>
                    <List className={'leftSubmenu'}>
                      <ListItem >
                        <ListItemAvatar>
                          <Suspense fallback={<></>}>
                            <Logo type={'person'} src={this.getPicturePath(currentUserRecord.picture) || defaultPicture} alt={currentUserRecord.name || currentUserRecord.tag} className={classes.logoBorder} />
                          </Suspense>
                        </ListItemAvatar>
                        <ListItemText primary={currentUserRecord.name || currentUserRecord.tag}
                          primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                      </ListItem>
                      <ListItem button component={Link} to={'/' + locale + '/' + currentOrganisation.tag + '/' + currentUserRecord.tag} onClick={this.props.handleDrawerClose}>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.profile' })} />
                      </ListItem>
                      {this.useSecondaryProfile() && (
                        <>
                          <Divider className={classes.divider} />
                          <ListItem>
                            <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listSecondaryRecordTitle' })}
                              primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                          </ListItem>
                          <Suspense fallback={<></>}>
                            <ItemsList onClick={this.props.handleDrawerClose} dataType={"record"}/>
                          </Suspense>
                        </>
                      )}
                    </List>
                    <Divider className={classes.divider} />
                  </>
                )}
                <List className={'leftSubmenu'}>
                  <ListItem onClick={this.props.handleDrawerClose} component={Link} to={'/' + locale + '/' + undefsafe(currentOrganisation, 'tag')}>
                    <ListItemAvatar>
                      <Suspense fallback={<></>}>
                        <Logo type={'organisation'} alt={undefsafe(currentOrganisation, 'name')} className={classes.logoBorder} />
                      </Suspense>
                    </ListItemAvatar>
                    <ListItemText primary={currentOrganisation && (currentOrganisation.name || currentOrganisation.tag)}
                      primaryTypographyProps={{ variant: 'button', noWrap: true, style: { fontWeight: 'bold', color: 'white', fontSize: '1rem' } }} />
                  </ListItem>

                  {(undefsafe(currentOrganisation, 'canInvite') || undefsafe(currentUser, 'superadmin') || (currentOrgAndRecord && currentOrgAndRecord.admin)) && (
                    <ListItem>
                      <Suspense fallback={<></>}>
                        <InvitationDialog />
                      </Suspense>
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
                    <>
                      <Divider className={classes.divider} />
                      <ListItem>
                        <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listOrgTitle' })}
                          primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                      </ListItem>
                      <Suspense fallback={<></>}>
                        <ItemsList onClick={this.props.handleDrawerClose} dataType={"organisation"}/>
                      </Suspense>
                    </>
                  )}
                  {undefsafe(currentUser, 'superadmin') && (
                    <>
                      <Divider className={classes.divider} />
                      <ListItem button component="a" href={'/' + locale + '/' + currentOrganisation.tag + '/onboard'}>
                        <ListItemText primary={"Onboard"} />
                      </ListItem>
                    </>
                  )}
                </List>
                <Divider className={classes.divider} />
              </>
            )}
            {(auth && !undefsafe(currentOrganisation, '_id')) && currentUser && currentUser.orgsAndRecords && (
              <>
                <Divider className={classes.divider} />
                <ListItem>
                  <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.listOrgTitle' })}
                    primaryTypographyProps={{ noWrap: true, style: { fontWeight: 'bold' } }} />
                </ListItem>
                <ItemsList onClick={this.props.handleDrawerClose} dataType={"organisation"} />
                <Divider className={classes.divider} />
              </>
            )}
            <List className={'leftSubmenu'}>
              {!auth && (
                <>
                  <ListItem button component={Link} to={"/" + locale + (currentOrganisation ? '/' + currentOrganisation.tag : '') + '/signin'}>
                    <ListItemText primary={intl.formatMessage({ id: 'Sign In' })} />
                  </ListItem>
                  <Divider className={classes.divider} />
                </>
              )}

              <ListItem>
                <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.locale' })} />
                <ListItemSecondaryAction>
                  <Suspense fallback={<></>}>
                    <LocaleSelector currentLocale={locale} handleChange={this.handleLocaleChange} />
                  </Suspense>
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
                <>
                  <Divider className={classes.divider} />
                  <ListItem button onClick={this.handleLogout} >
                    <ListItemText primary={intl.formatMessage({ id: 'menu.drawer.logout' })} />
                  </ListItem>
                </>
              )}
            </List>
          </div>
          )}

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
