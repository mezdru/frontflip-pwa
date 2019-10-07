import React from 'react';
import { Avatar } from '@material-ui/core';
import { observe } from 'mobx';
import { inject, observer } from "mobx-react";
import defaultPicture from '../../../resources/images/placeholder_person.png';
import undefsafe from 'undefsafe';
const defaultLogo = 'https://pbs.twimg.com/profile_images/981455890342694912/fXaclV2Y_400x400.jpg';

class Logo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: this.props.type || 'organisation',
      source: null,
      observer: ()=>{},
    }
  }

  componentDidMount() {
    if (this.state.type === 'organisation') {
      this.setState({
        source: undefsafe(this.props.orgStore.currentOrganisation, 'logo.url') || defaultLogo
      });

      this.setState({observer: observe(this.props.orgStore, 'currentOrganisation', (change) => {
        this.setState({
          source: undefsafe(this.props.orgStore.currentOrganisation, 'logo.url') || defaultLogo
        });
      })});
    } else if(this.state.type === 'wingzy') {
      this.setState({source: defaultLogo});
    }
  }

  componentWillUnmount() {
    this.state.observer();
  }

  render() {
    const { source } = this.state;

    return (
      <Avatar src={source || this.props.src || defaultPicture} alt="org-logo" className={this.props.className} style={{backgroundColor:'white'}} onClick={this.props.onClick} />
    )
  }
}

export default inject('orgStore')(
  observer(
    Logo
  )
);
