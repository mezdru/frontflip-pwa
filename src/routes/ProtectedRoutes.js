import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const ConditionnalRoute = function PrivateRoute({component: Component, condition, failRedirect, ...rest}) {
  return (
    <Route
      {...rest}
      render={props =>
        condition ? (
          <Component {...props} />
        ) : (
          <Redirect
            push
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