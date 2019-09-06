import * as React from "react";
import { ProfileContext } from "./Profile.context";

export function withProfileManagement(Component) {
  return function ProfileComponent(props) {
    return (
      <ProfileContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </ProfileContext.Consumer>
    );
  };
}
