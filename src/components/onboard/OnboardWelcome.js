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

    return (
      <div>
        Welcome !
        <Button onClick={this.props.handleEnterToOnboard} >onboard !</Button>
      </div>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(null)(OnboardWelcome)
  )
);
