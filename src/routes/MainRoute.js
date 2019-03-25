import React from "react";
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import MainRouteOrganisation from './MainRouteOrganisation';
import { inject, observer } from 'mobx-react';
import CircularProgress from '@material-ui/core/CircularProgress';
import ReloadModal from '../components/utils/reloader/ReloadModal';
import PromptIOsInstall from "../components/utils/prompt/PromptIOsInstall";

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
          <ReloadModal />
          <PromptIOsInstall />
          <Switch>
            <Route path="/:locale(en|fr|en-UK)" component={MainRouteOrganisation} />
            <Redirect from="*" to={"/" + (locale ? locale : 'en') + endUrl} />
          </Switch>
        </div>
      );
    } else {
      return (
        <div>
          <ReloadModal/>
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
