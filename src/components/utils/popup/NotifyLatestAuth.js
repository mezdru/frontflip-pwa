import React from 'react';
import StoreObject from '../../../stores/store';
import { withStyles, Typography, Slide, ClickAwayListener } from '@material-ui/core';
import moment from 'moment';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';

var MomentConfigs = require('../../configs/moment.conf');

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
  }
});

class NotifyLatestAuth extends React.Component {

  state = {
    coLog: null,
    error: null
  }

  componentDidMount() {

    if (this.props.commonStore.locale === 'fr') {
      MomentConfigs.setMomentFr();
    }

    Store.customRequest('getLatestMe')
      .then((coLog => {
        this.setState({ coLog: coLog });
      })).catch(e => {
        this.setState({ error: e });
      });
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
          <div className={classes.root} onClick={this.handleClose}>
            <Typography variant="h3"><FormattedMessage id="popup.latestConnection.title" /></Typography>
            <Typography variant="body2">
              {coLog && (
                <FormattedMessage id="popup.latestConnection.text" values={{ os: coLog.os, browser: coLog.browser, date: moment(coLog.created).calendar()}} />
              )}
            </Typography>
          </div>
        </ClickAwayListener>
      </Slide>
    )
  }
}

export default inject('commonStore')(observer(
  withStyles(style)(NotifyLatestAuth)
));
