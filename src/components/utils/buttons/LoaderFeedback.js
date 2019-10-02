import React from 'react';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import Fab from '@material-ui/core/Fab';
import CheckIcon from '@material-ui/icons/Check';
import SaveIcon from '@material-ui/icons/Save';
import green from '@material-ui/core/colors/green';

const styles = {
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonSuccess: {
    backgroundColor: green[500],
    color: 'white',
    '&:hover': {
      backgroundColor: green[500],
    }
  },
};

class LoaderFeedback extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      success: false,
      loading: false,
    };
  }

  componentDidMount() {
    this.feedback();
  }

  componentWillUnmount() {
    this.isUnmount = true;
  }

  feedback = async () => {
    this.setState({loading: true}, () => {
      setTimeout(() => {if(!this.isUnmount) this.setState({loading: false, success: true})}, 750);
    })
  }

  render() {

    const {success, loading} = this.state;
    const {classes} = this.props;

    const buttonClassname = classNames({
      [classes.buttonSuccess]: success,
    });

    return (
      <div {...this.props}>
        <Fab color="inherit" className={buttonClassname}>
          {success ? <CheckIcon /> : <SaveIcon />}
        </Fab>
        {loading && <CircularProgress size={68} className={classes.fabProgress} />}
      </div>
    );
  }
}

export default withStyles(styles)(LoaderFeedback);
