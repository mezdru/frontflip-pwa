import React from 'react';
import { Fab, withStyles } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import classNames from 'classnames';

class MyProfileFab extends React.Component {

  render() {
    return(
      <Fab color={"default"} aria-label="My profile" className={classNames(this.props.className)} onClick={this.props.onClick} >
        <Person fontSize="large" />
      </Fab>
    );
  }
}


export default withStyles(null, {withTheme: true})(MyProfileFab);