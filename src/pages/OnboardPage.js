import React from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles } from '@material-ui/core';

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
      observer: ()=>{},
      stepNumber: 0,
    };

    // clear wings bank
    this.props.commonStore.setLocalStorage('wingsBank', [], true);
  }

  componentDidMount() {
    this.setState({observer: observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
    })});
    this.getRecordForUser().then().catch(err => console.log(err));
    if (this.props.match && this.props.match.params && this.props.match.params.step) {
      this.populateStep(this.props.match.params.step);
    }
  }

  componentWillUnmount() {
    this.state.observer();
  }

  populateStep = (stepLabel) => {
    switch (stepLabel) {
      case 'intro':
        this.setState({inOnboarding: true});
        break;
      case 'contacts':
        this.setState({stepNumber: 1, inOnboarding: true});
        break;
      case 'firstWings':
        this.setState({stepNumber: 2, inOnboarding: true});
        break;
      case 'wings':
        this.setState({stepNumber: 3, inOnboarding: true});
        break;
      default:
        // default step
        break;
    }
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
    const {inOnboarding, stepNumber} = this.state;
    const {classes} = this.props;

    if(!inOnboarding) {
      return (
        <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
      );
    } else {
      return (
        <div>
          <main>
            <OnboardStepper initStep={stepNumber} />
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
