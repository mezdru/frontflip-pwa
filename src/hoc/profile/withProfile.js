import * as React from "react";
import { ProfileContext } from "./Profile.context";

export function withProfile(Component) {
  return function ProfileComponent(props) {
    return (
      <ProfileContext.Consumer>
        {contexts => <Component {...props} {...contexts} />}
      </ProfileContext.Consumer>
    );
  };
}
