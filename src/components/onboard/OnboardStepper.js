import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Redirect } from 'react-router-dom';

import OnboardIntro from './steps/OnboardIntro';
import OnboardContacts from './steps/OnboardContacts';
import OnboardWings from './steps/OnboardWings';

import { withSnackbar } from 'notistack';


class OnboardStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 2,
      steps: ['intro','contacts', 'firstWings', 'wings', '#Php'],
      canNext: true
    };
  }

  handleNext = () => {
    if((this.state.activeStep === (this.state.steps.length - 1))) {
      // click on finish
      this.setState({redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag });
    } else {
      this.setState(state => ({
        activeStep: state.activeStep + 1,
      }));
    }
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
      // case 'firstWings':
      //   return OnboardFirstWings;
      default:
        return OnboardWings;
    }
  }

  getStepLabel(steps, activeStep) {
    switch (steps[activeStep]) {
      case 'intro':
        return 'Who are you ?';
      case 'contacts':
        return 'What are your contact info ?';
      // case 'firstWings':
      //   return 'Choose your first Wings:';
      default:
        return '';
    }
  }

  handleSave = async (arrayOfLabels) => {
    this.props.recordStore.setRecordId(this.props.recordStore.values.record._id);
    return await this.props.recordStore.updateRecord(arrayOfLabels).then((record) => {
      this.props.enqueueSnackbar('Your data has been saved successfully', {variant: 'success'});
    }).catch((e) => {
      this.props.enqueueSnackbar('Your data can\'t be saved, please check the errors', {variant: 'warning'});
    });
  }

  render() {
    const {theme, classes} = this.props;
    const {activeStep, steps, canNext, redirectTo} = this.state;
    let StepComponent = this.getStepComponent(steps, activeStep);

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect to={redirectTo} />);

    return (
      <Grid style={{height:'100vh'}} item>
      <div style={{width:'100%', background: '#f2f2f2'}}>
      <Grid item xs={12} sm={8} md={6} lg={4} style={{position: 'relative', left:0, right:0, margin:'auto'}} >
          <MobileStepper
            variant="dots"
            steps={3}
            position="static"
            activeStep={Math.min(activeStep, 2 )}
            style={{width: '100%'}}
            className={classes.root}
            nextButton={
              <Button size="small" onClick={this.handleNext} disabled={!canNext} style={{background: 'none', boxShadow: 'none'}} >
                {(activeStep === (steps.length - 1)) && ('Finish')}
                {!(activeStep === (steps.length - 1)) && ('Next')}
                {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
              </Button>
            }
            backButton={
              <Button size="small" onClick={this.handleBack} disabled={activeStep === 0} style={{background: 'none', boxShadow: 'none'}}>
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                Back
              </Button>
            }
          />
        </Grid>
      </div>

        <Grid item style={{height: 'calc(100vh - 72px)'}}>
        <StepComponent handleSave={this.handleSave} activeStep={activeStep} activeStepLabel={steps[activeStep]} />
        </Grid>
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withSnackbar(
      withStyles(null, {withTheme: true})(OnboardStepper)
    )
  )
);
