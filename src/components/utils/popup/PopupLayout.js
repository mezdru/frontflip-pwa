import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  content: {
    overflow: 'hidden',
    padding: theme.spacing.unit*2 + 'px !important'
  },
  actions: {
    justifyContent: 'center',
    margin: 0,
    padding: theme.spacing.unit*2,
  }
});

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class PopupLayout extends React.Component {

  render() {
    const { classes } = this.props;

    return (
      <Dialog
        open={this.props.isOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth={'sm'}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className={classes.content} >
          {this.props.title}
          <DialogContentText id="alert-dialog-slide-description">
            {this.props.children}
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.actions}>
          {this.props.actions}
        </DialogActions>
      </Dialog>
    );
  }
}

export default
  withStyles(styles, { withTheme: true })(
    PopupLayout
  );
