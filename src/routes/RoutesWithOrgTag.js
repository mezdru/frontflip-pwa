import React from 'react';
import {Switch} from 'react-router-dom';
import RouteWithSubRoutes from './RouteWithSubRoutes';
import {inject, observer} from 'mobx-react';
import {Redirect} from 'react-router-dom';

class RoutesWithOrgTag extends React.Component {

  state = {
    render: false,
    redirect404: false
  }

  componentDidMount() {
    this.props.orgStore.getOrFetchOrganisation(null, this.props.match.params.orgTag)
    .then(() => {this.setState({render: true})})
    .catch(() => {this.setState({redirect404: true})})
    this.props.commonStore.setUrlParams(this.props.match);
  }
  
  render() {
    const {routes} = this.props;
    const {locale} = this.props.commonStore;
    const { redirect404, render} = this.state;

    if(redirect404) return <Redirect to={'/' + locale + '/error/404/organisation'} push/>
    if(!render) return null;

    return (
      <Switch>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route} />
        ))}
      </Switch>
    )
  }
}

export default (inject('authStore', 'userStore', 'commonStore', 'orgStore', 'recordStore')(
  (observer(
    RoutesWithOrgTag
  )))
);