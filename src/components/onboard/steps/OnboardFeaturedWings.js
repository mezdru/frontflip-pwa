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
    const {record} = this.props.recordStore.values;

    return (
      <div>
        This is featured component
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardFeaturedWings)
  )
);
