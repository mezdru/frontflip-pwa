import React from 'react';
import StoreObject from '../../../stores/store';
import { withStyles, Typography, Slide, ClickAwayListener, IconButton } from '@material-ui/core';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import { Close } from '@material-ui/icons';

let Store = new StoreObject('ConnectionLog');

const style = theme => ({
  root: {
    width: 350,
    position: 'fixed',
    bottom: 0,
    left: 0,
    margin: 16,
    maxWidth: 'calc(100% - 32px)',
    zIndex: 99999,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: '0 5px 5px 5px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  },
  title: {
    color: theme.palette.primary.dark,
    marginBottom: 16
  },
  closeButton: {
    float: 'right',
    position: 'relative',
    top: '-8px',
    right: '-8px'
  }
});

class NotifyLatestAuth extends React.Component {

  state = {
    coLog: null,
    error: null
  }

  componentDidMount() {
    if (this.props.authStore.isAuth()) {
      Store.customRequest('getLatestMe')
        .then((coLog => {
          this.setState({ coLog: coLog });
        })).catch(e => {
          this.setState({ error: e });
        });
    }
  }

  handleClose = () => {
    this.setState({ coLog: null });
    this.props.commonStore.setCookie("latestConnectionClosed", true, (new Date((new Date()).getTime() + 60 * 60000)));
  }

  render() {
    let { coLog } = this.state;
    let { classes } = this.props;

    return (
      <Slide direction="up" in={coLog} mountOnEnter unmountOnExit>
        <ClickAwayListener onClickAway={this.handleClose}>
          <div className={classes.root}>
            <IconButton onClick={this.handleClose} className={classes.closeButton} >
              <Close />
            </IconButton>
            <Typography variant="h3" className={classes.title} ><FormattedMessage id="popup.latestConnection.title" /></Typography>
            <Typography variant="body2">
              {coLog && (
                <FormattedMessage id="popup.latestConnection.text" values={{ os: coLog.os, browser: coLog.browser, date: moment(coLog.created).calendar(), city: coLog.location.city, region: coLog.location.region }} />
              )}
            </Typography>
          </div>
        </ClickAwayListener>
      </Slide>
    )
  }
}

export default inject('commonStore', 'authStore')(observer(
  withStyles(style)(NotifyLatestAuth)
));
