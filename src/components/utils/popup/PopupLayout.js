import React from 'react';
import { inject, observer } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles } from '@material-ui/core/styles';
import { FormattedMessage } from 'react-intl';
import { observe } from 'mobx';
import Wings from '../wing/Wings';
import profileService from '../../../services/profile.service';

const styles = theme => {
  console.log(theme); 
  return {
  root: {
    overflow: 'hidden',
    padding: theme.spacing.unit*4
  },
  picture: {
    width: '60%',
    height: 'auto',
    marginBottom: 40,
  },
  text: {
    margin: 0,
    padding: 0,
    paddingTop: 16,
    textAlign: 'left'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    justifyContent: 'center',
    margin: 0,
    padding: 24,
  },
  textarea: {
    marginTop: 16,
  }
}};

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
        className={classes.root}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogContent className={classes.root} >
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
