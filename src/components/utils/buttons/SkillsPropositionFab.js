import React from 'react';
import { Fab, withStyles } from '@material-ui/core';
import { LibraryAdd } from '@material-ui/icons';
import classNames from 'classnames';

class SkillsPropositionFab extends React.Component {

  render() {
    return(
      <Fab color="secondary" aria-label="Propose Skills" className={classNames(this.props.className)} onClick={this.props.onClick} >
        <LibraryAdd fontSize="large" />
      </Fab>
    );
  }
}


export default withStyles(null, {withTheme: true})(SkillsPropositionFab);