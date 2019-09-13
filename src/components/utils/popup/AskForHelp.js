import React from 'react';
import { inject, observer } from "mobx-react";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';
import { withStyles, Typography } from '@material-ui/core';
import { FormattedMessage } from 'react-intl';

const styles = {

}

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class AskForHelp extends React.Component {

  state = {

  }

  render() {
    const {classes, isOpen} = this.props;

    return (
      <React.Fragment>
        <Dialog
          open={isOpen}
          TransitionComponent={Transition}
          keepMounted
          fullWidth
          maxWidth={'sm'}
          onClose={this.handleOnboardEnd}
          className={classes.root}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent style={{ overflow: 'hidden' }} >
            <Typography variant="h1" className={classes.title}>
              <FormattedMessage id="askForHelp.popup.title" />
            </Typography>
            <DialogContentText id="alert-dialog-slide-description">
              <Typography variant="h6" className={classes.text}>
                <FormattedMessage id="onboard.end.text" values={{ organisationName: 't' }} />
              </Typography>
            </DialogContentText>
          </DialogContent>
          <DialogActions className={classes.actions}>
            <Button onClick={this.handleOnboardEnd} color="secondary">
              <FormattedMessage id="askForHelp.popup.send" />
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'helpRequestStore')(
  observer(
    withStyles(styles, { withTheme: true })(
      AskForHelp
    )
  )
);
