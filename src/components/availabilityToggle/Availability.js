import React from 'react';
import { withStyles} from '@material-ui/core';


const styles = {
  dispo: {
    width: 35,
    height: 35,
    border: '6px solid white',
    borderRadius: 30,
    backgroundColor: 'transparent',
    zIndex: 9000,
  }
};

class Availability extends React.Component {
  render() {
    const {classes} = this.props;
  
    return( <div className={classes.dispo}/> )
  }
}

export default withStyles(styles)(Availability);


