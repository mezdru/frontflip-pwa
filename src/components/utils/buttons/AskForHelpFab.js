import React from 'react';
import { Fab } from '@material-ui/core';
import { Send } from '@material-ui/icons';
import classNames from 'classnames';

class AskForHelpFab extends React.Component {

  render() {
    return(
      <Fab color="secondary" aria-label="Ask for Help" className={classNames(this.props.className)} onClick={this.props.onClick} >
        <Send />
      </Fab>
    );
  }
}


export default AskForHelpFab;