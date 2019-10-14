import React from 'react';
import {observer, inject} from 'mobx-react';
import {Switch} from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';

class RoutesWithLocale extends React.Component {

  state = {
    render: false
  }

  componentDidMount() {
    if(this.props.authStore.isAuth()) {
      this.props.userStore.fetchCurrentUser()
      .then(()=> {this.setState({render: true})})
      .catch(()=> {this.setState({render: true})})
    }else {
      this.setState({render: true});
    }
    this.props.commonStore.setUrlParams(this.props.match);
  }

  render() {
    const {routes, match} = this.props;
    const { render } = this.state;
    if(!render) return null;

    return (
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} locale={match.params.locale} />
        ))}
      </Switch>
    )
  }
}

export default (inject('authStore', 'userStore', 'commonStore', 'orgStore', 'recordStore')(
  (observer(
    RoutesWithLocale
  )))
);