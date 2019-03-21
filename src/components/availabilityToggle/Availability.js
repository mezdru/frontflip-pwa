import React from 'react';
import { withStyles} from '@material-ui/core';


const styles = theme => ({
  dispo: {
    width: 35,
    height: 35,
    border: '6px solid white',
    borderRadius: 30,
    backgroundColor: '#C2CACF',
    zIndex: 9000,
    [theme.breakpoints.down('xs')]: {
      width: 30,
      height: 30,
    }
  }
});

class Availability extends React.Component {
  render() {
    const {classes} = this.props;
  
    return( <div className={`${classes.dispo} ${this.props.available}`}/> )
  }
}

export default withStyles(styles)(Availability);


