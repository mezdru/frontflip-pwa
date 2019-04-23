import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';

const MainRouteOrganisation = React.lazy(() => import('./MainRouteOrganisation'));

console.debug('Load MainRoute.');

class MainRoute extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      renderComponent: !this.props.authStore.isAuth()
    }

    // Remove for the moment, this cookie will be usefull to persist filters if needed
    this.props.commonStore.removeCookie('searchFilters');
  }

  WaitingComponent(Component, additionnalProps) {
    return props => (
      <React.Suspense fallback={<CircularProgress color='secondary' />}>
        <Component {...props} {...additionnalProps} />
      </React.Suspense>
    );
  }

  componentDidMount() {
    this.getUser();
  }

  async getUser() {
    if (this.props.authStore.isAuth()) {
      await this.props.userStore.getCurrentUser().catch(() => { return; });
      if (!this.state.renderComponent) this.setState({ renderComponent: true });
    }
  }

  render() {
    const { renderComponent, locale } = this.state;
    const endUrl = window.location.pathname + window.location.search;
    const { currentUser } = this.props.userStore.values;
    if (!currentUser && this.props.authStore.isAuth()) this.getUser();

    if (renderComponent) {
      return (
        <div>
          <Switch>
            <Route path="/:locale(en|fr|en-UK)" component={this.WaitingComponent(MainRouteOrganisation)} />
            <Redirect from="*" to={"/" + (locale ? locale : 'en') + endUrl} />
          </Switch>
        </div>
      );
    } else {
      return (
        <div>
          <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', textAlign: 'center', width: '100%' }}>
            <CircularProgress color='secondary' />
          </div>
        </div>
      );
    }
  }
}

export default inject('authStore', 'userStore', 'commonStore')(
  withRouter(observer(
    MainRoute
  ))
);
