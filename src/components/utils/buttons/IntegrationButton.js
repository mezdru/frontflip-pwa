import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import {inject, observer} from 'mobx-react';

import GoogleLogo from '../../../resources/images/g.svg';
import LinkedinLogo from '../../../resources/images/linkedin.png';

const styles = theme => ({
  logo: {
    width: '25px', 
    height: '25px', 
    position: 'absolute', 
    left: 0,
    right: 0,
    margin: 'auto'
  },
  root: {
    '&:not(:hover)': {
      backgroundColor: "white"
    },
    '&:hover': {
      backgroundColor: '#d5d5d5',
      color: 'black',
    },
    minWidth: 0,
    width: 56,
    borderRadius: 100
  }
});

class IntegrationButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  getAuthState = () => {
    let state = {};
    if (this.props.organisationStore.values.orgTag) state.orgTag = this.props.organisationStore.values.orgTag;
    if (this.props.organisationStore.values.organisation.tag) state.orgTag = this.props.organisationStore.values.organisation.tag;
    if (this.props.authStore.values.invitationCode) state.invitationCode = this.props.authStore.values.invitationCode;
    if (this.props.authStore.values.temporaryToken) state.integrationToken = this.props.authStore.values.temporaryToken;
    if (this.props.currentAction) state.action = this.props.currentAction;
    return state;
  }

  redirectToAuth = () => {
    window.location.href =  (process.env.NODE_ENV === 'development' ? 'http://' : 'https://') + 
                            process.env.REACT_APP_API_ROOT_AUTH + 
                            '/' + this.props.integrationTag + '?state=' + JSON.stringify(this.getAuthState());
  }

  getIntegrationLogo(integrationTag) {
    switch(integrationTag) {
      case 'google':
        return GoogleLogo;
      case 'linkedin':
        return LinkedinLogo;
      default:
        return null;
    }
  }


  render() {
    const {classes, labelId, integrationTag} = this.props;

    return (
      <Button {...this.props} className={classes.root} onClick={this.props.onClick || this.redirectToAuth}>
        <img src={this.getIntegrationLogo(integrationTag)} className={classes.logo} alt={labelId} />
      </Button>
    );
  }
}

export default inject('authStore', 'organisationStore', 'commonStore')(
    withStyles(styles)(
      observer((IntegrationButton))
    )
);