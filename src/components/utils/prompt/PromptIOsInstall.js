import React, {Component} from 'react';
import { inject, observer } from "mobx-react";
import { withStyles } from '@material-ui/core';
import AddToHomescreenIOs from '../../../resources/icons/addToHomescreenIOs.png'
import { FormattedMessage } from 'react-intl';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

const styles = theme => ({
  popupContainer: {
    position: 'fixed',
    left:8,
    right:8,
    margin: 'auto',
    marginBottom: 24,
    maxWidth: 'calc(100% - 16px)',
    backgroundColor: 'white',
    zIndex: 999999,
    padding: 16,
    bottom: 0,
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    textAlign: 'center',
  },
  triangle : {
      position: 'absolute',
      left:0,
      right:0,
      margin: 'auto',
      top: '100%',
      width: 0,
      height: 0,
      borderLeft: '20px solid transparent',
      borderRight: '20px solid transparent',
      borderTop: '20px solid white',
      clear: 'both'
  },
  shareIcon: {
    height: 23,
    marginBottom: -5
  }
});

class PromptIOsInstall extends Component {

  constructor() {
    super();
    this.state = {
      canDisplayPopup: false
    };
  }

  componentDidMount() {
    if(this.isIOs() && !this.isInStandaloneMode()) {
      setTimeout(() => { this.setState({canDisplayPopup: true})}, 10000);
    }
  }


  isIOs = () => {
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test( userAgent );
  }

  isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);

  handleClickAway = () => {
    this.setState({canDisplayPopup: false});
  }

  render() {
    const {canDisplayPopup} = this.state;
    const {classes} = this.props;

    if(!canDisplayPopup) return null;

    return (
      <ClickAwayListener onClickAway={this.handleClickAway}>
        <div className={classes.popupContainer}>
          <FormattedMessage id="pwa.install.ios" values={{img: <img className={classes.shareIcon} src={AddToHomescreenIOs} alt='Share button' />}} />
          <div className={classes.triangle}></div>
        </div>
      </ClickAwayListener>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(styles, { withTheme: true })(PromptIOsInstall)
  )
);