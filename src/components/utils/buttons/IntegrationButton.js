import React from 'react';
import { withStyles, Button } from '@material-ui/core';
import {inject, observer} from 'mobx-react';

import GoogleLogo from '../../../resources/images/g.svg';
import LinkedinLogo from '../../../resources/images/linkedin.png';

const styles = theme => ({
  logo: {
    width: '25px', 
    height: '25px', 
    marginRight: 16,
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
    let {currentOrganisation} = this.props.orgStore;
    if (currentOrganisation) state.orgTag = currentOrganisation.tag;
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
      <Button className={classes.root} onClick={this.props.onClick || this.redirectToAuth}>
        <img src={this.getIntegrationLogo(integrationTag)} className={classes.logo} alt={labelId} /> {integrationTag}
      </Button>
    );
  }
}

export default inject('authStore', 'orgStore', 'commonStore')(
    withStyles(styles)(
      observer((IntegrationButton))
    )
);