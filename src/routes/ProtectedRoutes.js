import React from 'react';
import { inject, observer } from 'mobx-react';
import { Route, Redirect } from 'react-router-dom';

export const RouteAuth = inject('authStore', 'commonStore')(observer(
  function PrivateRoute({ component: Component, authStore, failRedirect, ...rest }) {

    return (
      <Route
        {...rest}
        render={props =>
          authStore.isAuth() ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: failRedirect,
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
));

export const RouteAuthAndBelongsToOrg = inject('authStore', 'userStore', 'orgStore', 'commonStore')(observer(
  function PrivateRoute({ component: Component, authStore, orgStore, userStore, failRedirect, commonStore, ...rest }) {

    let granted = orgStore.currentOrganisation && (authStore.isAuth() && userStore.currentUser.orgsAndRecords.find(oar => oar.organisation === orgStore.currentOrganisation._id ) )

    return (
      <Route
        {...rest}
        render={props =>
          granted ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: failRedirect,
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
));

export const RouteWithOrgAccess = inject('authStore', 'userStore', 'orgStore', 'commonStore')(observer(
  function PrivateRoute({ component: Component, authStore, orgStore, userStore, commonStore, failRedirect, ...rest }) {

    let granted = orgStore.currentOrganisation && (orgStore.currentOrganisation.public ||
                  (authStore.isAuth() && userStore.orgsAndRecords.find(oar => oar.organisation === orgStore.currentOrganisation._id )));

    return (
      <Route
        {...rest}
        render={props =>
          granted ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: failRedirect,
                state: { from: props.location }
              }}
            />
          )
        }
      />
    );
  }
));