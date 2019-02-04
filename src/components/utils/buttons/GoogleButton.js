import React from 'react';
import { Button, Typography, withStyles } from '@material-ui/core';
import googleLogo from '../../../resources/images/g.svg';
import { FormattedMessage } from 'react-intl';

const styles = {
  root: {
    '&:not(:hover)': {
      backgroundColor: "white"
    },
  }
};

const GoogleButton = ({ ...props }) =>
  <Button {...props} className={props.classes.root}>
    <img src={googleLogo} style={{ width: '25px', height: '25px', position: 'absolute', left: '13px' }} alt="google" />
    <FormattedMessage id="connect with Google" />
  </Button>;

export default withStyles(styles)(GoogleButton);
