import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";

class OnboardFeaturedWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {

    return (
      <div>
      </div>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(null)(OnboardFeaturedWings)
  )
);
