import React from 'react'
import { withStyles, Button } from '@material-ui/core';
import { inject, observer } from "mobx-react";

class OnboardWelcome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const {organisation} = this.props.organisationStore.values;

    return (
      <div>
        Welcome to the Wingzy of {organisation.name}!<br/>
        <Button onClick={this.props.handleEnterToOnboard} color="primary" >Onboard !</Button>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWelcome)
  )
);
