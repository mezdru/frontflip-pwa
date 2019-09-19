import React from 'react';
import { withStyles } from '@material-ui/core';
import SlackService from '../../../services/slack.service';

const styles = theme => ({
  errorBox: {
    textAlign: 'center',
    padding: 16,
    borderRadius: 5,
    backgroundColor: 'rgb(240,240,240)',
    width: '100%',
  }
});

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, info);
    console.error(error);
    console.info(info);
    SlackService.notifyError(error, 0, 'quentin');
  }

  render() {
    const {classes} = this.props;
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <p className={classes.errorBox} ><span role="img" aria-label="Red cross">❌</span> Something went wrong.</p>;
    }

    return this.props.children; 
  }
}

export default withStyles(styles)(ErrorBoundary);