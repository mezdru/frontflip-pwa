import React, { Suspense } from "react";
import { Switch, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { routes } from "./routes.config";
import RouteWithSubRoutes from './RouteWithSubRoutes';

class Routes extends React.Component {
  constructor(props) {
    super(props);

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
    try { document.getElementById('errorMessage').remove(); } catch (e) { };
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

export default withRouter(inject('userStore', 'commonStore')(
  (observer(
    Routes
  )))
);
