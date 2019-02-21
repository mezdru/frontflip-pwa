import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import OnboardIntro from './steps/OnboardIntro';
import OnboardContacts from './steps/OnboardContacts';
import OnboardWings from './steps/OnboardWings';

class OnboardStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      steps: ['intro','contacts','wings'],
      canNext: true
    };
  }

  handleNext = () => {
    this.setState(state => ({
      activeStep: state.activeStep + 1,
    }));
  };

  handleBack = () => {
    this.setState(state => ({
      activeStep: state.activeStep - 1,
    }));
  };

  getStepComponent(steps, activeStep) {
    switch (steps[activeStep]) {
      case 'intro':
        return OnboardIntro;
      case 'contacts':
        return OnboardContacts;
      default:
        return OnboardWings;
    }
  }

  handleSave = () => {
    this.props.recordStore.setRecordId(this.props.recordStore.values.record._id);
    this.props.recordStore.updateRecord();
  }

  render() {
    const {theme, classes} = this.props;
    const {activeStep, steps, canNext} = this.state;
    let StepComponent = this.getStepComponent(steps, activeStep);

    return (
      <div>
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={this.state.activeStep}
          className={classes.root}
          nextButton={
            <Button size="small" onClick={this.handleNext} disabled={(activeStep === (steps.length - 1)) || !canNext}>
              Next
              {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
            </Button>
          }
          backButton={
            <Button size="small" onClick={this.handleBack} disabled={activeStep === 0}>
              {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
              Back
            </Button>
          }
        />
        <Typography variant="h1">{steps[activeStep]}</Typography>
        <StepComponent handleSave={this.handleSave} />
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null, {withTheme: true})(OnboardStepper)
  )
);
