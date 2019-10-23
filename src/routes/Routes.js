import React, { Suspense } from "react";
import { Switch, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { routes } from "./routes.config";
import RouteWithSubRoutes from './RouteWithSubRoutes';
import SlackService from "../services/slack.service";
import undefsafe from 'undefsafe';

class Routes extends React.Component {
  constructor(props) {
    super(props);

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
    try { document.getElementById('errorMessage').remove(); } catch (e) { };

    // get wanted path in case user is redirected to signin
    if(!this.props.commonStore.getCookie('wantedPath') && window.location.pathname.search('signin') === -1 && window.location.pathname.search('signup') === -1) {
      this.props.commonStore.setCookie("wantedPath", window.location.pathname, (new Date((new Date()).getTime() + 10*60000)));
    }

    // listen to install app event
    try {
      window.addEventListener('appinstalled', (evt) => { // deepscan-disable-line
        console.log('App installed.');
        SlackService.notify('#alerts', `Someone has installed the PWA (userId:${undefsafe(this.props.userStore.currentUser, '_id')}) (orgTag:${undefsafe(this.props.orgStore.currentOrganisation, 'tag')})`); 
      }); 
    }catch(e) {
      console.log(e);
    }

  }

  render() {
    const { currentUser } = this.props.userStore;
    const { locale } = this.props.commonStore;
    let defaultLocale = (currentUser ? currentUser.locale || locale : locale) || 'en';
    if (defaultLocale === 'en-UK') defaultLocale = 'en';

    return (
      <Suspense fallback={<div style={{ position: 'fixed', top: '45%', width: '100%', textAlign: 'center' }}><CircularProgress color="secondary" /></div>}>
        <Switch>
          {routes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} />
          ))}
        </Switch>
      </Suspense>
    )
  }
}

export default withRouter(inject('userStore', 'commonStore', 'orgStore')(
  (observer(
    Routes
  )))
);
