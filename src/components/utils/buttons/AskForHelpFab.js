import React from 'react';
import { Fab } from '@material-ui/core';
import { Email } from '@material-ui/icons';
import classNames from 'classnames';

class AskForHelpFab extends React.Component {

  render() {
    const { highlighted } = this.props;
    
    return(
      <Fab color={highlighted ? "secondary" : "default"} aria-label="Ask for Help" variant="extended" className={classNames(this.props.className)} onClick={this.props.onClick} >
        <Email style={{marginRight: 8}} />
        Ask For Help
      </Fab>
    );
  }
}


export default AskForHelpFab;