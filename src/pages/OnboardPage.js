import React from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles, Grid } from '@material-ui/core';
import Banner from '../components/utils/banner/Banner';
import Logo from '../components/utils/logo/Logo';

const styles = {
  logo: {
    width: '6.5rem',
    height: '6.5rem',
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: '3.6rem',
    marginBottom: '-7rem',
    zIndex: 2,
  }
};

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: false,
      observer: ()=>{}
    };
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
    })});
    this.getRecordForUser().then().catch(err => console.log(err));
  }

  componentWillUnmount() {
    this.state.observer();
  }

  getRecordForUser = () => {
    if(!this.props.recordStore.values.orgId) {
      this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    }
    return this.props.recordStore.getRecordByUser();
  }

  handleEnterToOnboard = () => {
    this.setState({inOnboarding: true});
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {inOnboarding} = this.state;
    const {classes} = this.props;

    if(!inOnboarding) {
      return (
        <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
      );
    } else {
      return (
        <div>
          <main>
            <OnboardStepper />
          </main>
        </div>
      );
    }
  }
}

export default inject('commonStore', 'organisationStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles, {withTheme: true})(OnboardPage)
  )
);
