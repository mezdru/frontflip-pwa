import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Slide from "@material-ui/core/Slide";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, DialogTitle, withWidth } from "@material-ui/core";
import { Close } from "@material-ui/icons";

const styles = theme => ({
  content: {
    overflow: "auto",
    textAlign: "center"
  },
  actions: {
    justifyContent: "center"
  },
  closeButton: {
    position: "absolute",
    right: 0,
    marginRight: 8,
    top: 8
  }
});

const Transition = (props) => {
  return <Slide direction="up" {...props} />;
}

class PopupLayout extends React.Component {
  render() {
    const { classes, width } = this.props;

    return (
      <Dialog
        open={this.props.isOpen}
        TransitionComponent={Transition}
        keepMounted
        fullWidth
        maxWidth={"sm"}
        onClose={this.props.onClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        style={this.props.style}
        fullScreen={width === "xs"}
        PaperProps={this.props.PaperProps}
      >
        <DialogTitle
          children={
            <>
              {this.props.title}
              <IconButton
                className={classes.closeButton}
                onClick={this.props.onClose}
              >
                <Close />
              </IconButton>
            </>
          }
          disableTypography
        />
        <DialogContent className={classes.content}>
          {this.props.children}
        </DialogContent>
        <DialogActions className={classes.actions}>
          {this.props.actions}
        </DialogActions>
      </Dialog>
    );
  }
}

export default withWidth()(withStyles(styles)(PopupLayout));
