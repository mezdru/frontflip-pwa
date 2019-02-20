import React from 'react'
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import OnboardWelcome from '../components/onboard/OnboardWelcome';
import OnboardStepper from '../components/onboard/OnboardStepper';
import { withStyles } from '@material-ui/core';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

class OnboardPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inOnboarding: false
    };
  }

  componentDidMount() {
    observe(this.props. recordStore.values, 'record', (change) => {
      this.forceUpdate();
    });
    this.getRecordForUser().then().catch(err => console.log(err));
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
    const {theme} = this.props;

    if(!inOnboarding) {
      return (
        <div>
          <MobileStepper
          variant="dots"
          steps={3}
          position="static"
          activeStep={null}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled >
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled >
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
          <main>
            <OnboardWelcome handleEnterToOnboard={this.handleEnterToOnboard} />
            This is your record : <br/>
            {JSON.stringify(record)}
          </main>
        </div>
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
    withStyles(null, {withTheme: true})(OnboardPage)
  )
);
