import React from 'react'
import { withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";

class OnboardContacts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {record} = this.props.recordStore.values;

    return (
      <div>
        This is contacts component
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(OnboardContacts)
  )
);
