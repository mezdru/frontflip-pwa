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
import LoaderFeedback from '../utils/buttons/LoaderFeedback';

import SwipeableViews from 'react-swipeable-views';
import {FormattedMessage} from "react-intl";

let timeoutArray = [];

const styles = theme => ({
  root: {
    background: theme.palette.primary.dark
  },
  stepperButton: {
    background: 'none',
    boxShadow: 'none',
    padding: '8px 16px',
    color:'white',
    '&:hover' : {
      background: 'rgba(0, 0, 0, 0.08)',
    },
    '&:first-child()': {
      width: 40,
    }
  }
});

class OnboardStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: this.props.initStep || 0,
      steps: this.makeSteps(),
      canNext: true
    };
  }

  /**
   * @description Make steps array thanks to organisation data
   */
  makeSteps = () => {
    var steps = ['intro', 'contacts', 'firstWings', 'wings'];
    if (this.props.organisationStore.values.organisation && this.props.organisationStore.values.organisation.featuredWingsFamily) {
      var familySteps = this.props.organisationStore.values.organisation.featuredWingsFamily.map(
        fam => fam.tag
      );
      steps = steps.concat(familySteps);
    }
    return steps;
  }

  handleNext = () => {
    if ((this.state.activeStep === (this.state.steps.length - 1))) {
      // click on finish
      this.setState({ redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.orgTag });
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

  handleSave = async (arrayOfLabels) => {
    this.props.recordStore.setRecordId(this.props.recordStore.values.record._id);
    return await this.props.recordStore.updateRecord(arrayOfLabels).then((record) => {
      //this.props.enqueueSnackbar('Your data has been saved successfully', {variant: 'success'});
      timeoutArray.forEach(tm => { clearTimeout(tm) });
      timeoutArray = [];
      this.setState({ showFeedback: true }, () => {
        timeoutArray.push(setTimeout(() => { this.setState({ showFeedback: false }) }, 2000));
      })
    }).catch((e) => {
      this.props.enqueueSnackbar('Your data can\'t be saved, please check the errors', { variant: 'warning' });
    });
  }

  handleStepChange = activeStep => {
    this.setState({ activeStep });
  };

  render() {
    const { theme, classes } = this.props;
    const { organisation, orgTag } = this.props.organisationStore.values;
    const {locale} = this.props.commonStore;
    const { activeStep, steps, canNext, showFeedback, redirectTo } = this.state;
    let StepComponent = this.getStepComponent(steps, activeStep);
    let wantedUrl = '/' + locale + '/' + (organisation.tag || orgTag) + '/onboard/' + steps[activeStep].replace('#', '%23');

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect to={redirectTo} />);
    return (
      <Grid style={{ height: '100vh' }} item>
        { (window.location.pathname !== wantedUrl) && (
          <Redirect to={wantedUrl} />
        )}
        <div style={{ width: '100%', background: '#2B2D3C', borderBottom: '1px solid rgba(0, 0, 0, 0.12)'}}>
          <Grid item xs={12} sm={8} md={6} lg={4} style={{ position: 'relative', left: 0, right: 0, margin: 'auto'}} >
            <MobileStepper
              variant="dots"
              steps={3}
              position="static"
              activeStep={Math.min(activeStep, 2)}
              style={{ maxWidth: '100%' }}
              className={classes.root}
              nextButton={
                <Button size="small" onClick={this.handleNext} disabled={!canNext} className={classes.stepperButton} >
                  {(activeStep === (steps.length - 1)) && (<FormattedMessage id={'onboard.stepperFinish'}/>)}
                  {!(activeStep === (steps.length - 1)) && (<FormattedMessage id={'onboard.stepperNext'}/>)}
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={this.handleBack} disabled={activeStep === 0} className={classes.stepperButton} >
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  <FormattedMessage id={'onboard.stepperBack'}/>
                </Button>
              }
            />
          </Grid>
        </div>

        <SwipeableViews
          index={activeStep}
          onChangeIndex={this.handleStepChange}
          style={{height: 'calc(100vh - 73px)'}}
          disabled={true}
        >

          {steps.length > 0 && steps.map((stepLabel, stepIndex) => {
            return (<Grid item style={{ height: '100%' }} key={stepIndex} >
              <StepComponent handleSave={this.handleSave} activeStep={activeStep} activeStepLabel={steps[activeStep]} 
                             SuggestionsService={this.props.SuggestionsService} />
            </Grid>)
          })}
        </SwipeableViews>

        {showFeedback && (
          <LoaderFeedback
            value={Date.now()}
            style={{
              position: 'fixed',
              bottom: 16,
              zIndex: 999,
              left: 0,
              right: 0,
              margin: 'auto',
              width: 60,
              textAlign: 'center',
            }} />
        )}

      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withSnackbar(
      withStyles(styles, { withTheme: true })(OnboardStepper)
    )
  )
);
