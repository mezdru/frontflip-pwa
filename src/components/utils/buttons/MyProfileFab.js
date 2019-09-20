import React from 'react';
import { Fab } from '@material-ui/core';
import { Person } from '@material-ui/icons';
import classNames from 'classnames';

class MyProfileFab extends React.Component {

  render() {
    return(
      <Fab color="secondary" aria-label="My profile" className={classNames(this.props.className)} onClick={this.props.onClick} >
        <Person />
      </Fab>
    );
  }
}


export default MyProfileFab;