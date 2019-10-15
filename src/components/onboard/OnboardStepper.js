import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import { Redirect } from 'react-router-dom';
import Slide from '@material-ui/core/Slide';

import OnboardIntro from './steps/OnboardIntro';
import OnboardContacts from './steps/OnboardContacts';
import OnboardWings from './steps/OnboardWings';
import SlackService from '../../services/slack.service';
import LoaderFeedback from '../utils/buttons/LoaderFeedback';

import { FormattedMessage } from "react-intl";
import classNames from 'classnames';
import undefsafe from 'undefsafe';
import { getBaseUrl } from '../../services/utils.service.js';
import {styles} from './OnboardStepper.css';

let timeoutArray = [];

class OnboardStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      canNext: true,
      steps: [],
      slideDirection: 'left',
      slideState: false
    };
  }

  componentWillMount() {
    this.makeSteps(this.props.wantedStep);
  }
  componentWillUnmount() {
    this.isUnmount = true;
  }

  makeSteps = async (stepLabel) => {
    let org = this.props.orgStore.currentOrganisation;
    let steps;

    if (undefsafe(org, 'onboardSteps.length') > 0) {
      steps = org.onboardSteps;
    } else {
      steps = ['intro', 'contacts'];
      if (undefsafe(org, 'featuredWingsFamily.length') > 0)
        org.featuredWingsFamily.forEach(fwf => {
          if (!steps.find(elt => elt === fwf.tag) && fwf.tag)
            steps.push(fwf.tag);
        });
      steps.push('wings');
    }
    this.setState({ steps: steps, activeStep: (stepLabel ? steps.indexOf(stepLabel.replace('%23', '#')) : 0), slideState: true });

  }

  handleNext = () => {
    if ((this.state.activeStep === (this.state.steps.length - 1))) {
      // click on finish

      if (this.props.edit) {
          return this.setState({ redirectTo: getBaseUrl(this.props) + '/' + this.props.commonStore.url.params.recordTag });
      }

      let user = this.props.userStore.currentUser;
      try {
        if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_NOLOGS)
          SlackService.notify('#alerts', `We have a new User! ${undefsafe(user, 'email.value') || undefsafe(user, 'google.email') || user._id}` +
            ' in ' + this.props.orgStore.currentOrganisation.tag);
      } catch (e) { }

      this.props.userStore.welcomeCurrentUser(this.props.orgStore.currentOrganisation._id)
      .then(() => {
        this.setState({ redirectTo: getBaseUrl(this.props) + '/congrats' });
      });
    } else {
      this.slide(this.state.activeStep + 1, 'left', 'right')
    }
  };

  handleBack = () => {
    if (this.props.edit && this.state.activeStep === 0) {
      return this.setState({ redirectTo: getBaseUrl(this.props) + '/' + this.props.commonStore.url.params.recordTag });
    }

    this.slide(this.state.activeStep - 1, 'right', 'left');
  };

  slide = (nextActiveStep, enterDirection, exitDirection) => {
    this.setState({ slideDirection: exitDirection, slideState: false }, () => {
      setTimeout(() => {
        this.setState({ slideDirection: enterDirection, activeStep: nextActiveStep, slideState: true });
      }, 320);
    });
  }

  getStepComponent(steps, activeStep) {
    switch (steps[activeStep]) {
      case 'intro': return OnboardIntro;
      case 'contacts': return OnboardContacts;
      default: return OnboardWings;
    }
  }

  handleSave = async (arrayOfLabels) => {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    return await this.props.recordStore.updateRecord(record._id, arrayOfLabels, record).then((record) => {
      timeoutArray.forEach(tm => { clearTimeout(tm) });
      timeoutArray = [];
      if(!this.isUnmount) {
        this.setState({ showFeedback: true }, () => {
          timeoutArray.push(setTimeout(() => { if(!this.isUnmount) this.setState({ showFeedback: false }) }, 2000));
        })
      }
    }).catch((e) => {
      console.error(e);
    });
  }

  getNextButtonText = () => {
    if (this.state.activeStep === (this.state.steps.length - 1)) return <FormattedMessage id={'onboard.stepperFinish'} />
    else return <FormattedMessage id={'onboard.stepperNext'} />
  }

  shouldNextBeHighlighted = (activeStepLabel) => {
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    switch (activeStepLabel) {
      case 'intro':
        return (record.intro && record.intro.length > 1 && record.name && record.name.length > 1);
      case 'contacts':
        return (record.links && record.links.length > 0);
      case 'wings':
        return (record.hashtags && record.hashtags.length > 9);
      default:
        return false;
    }
  }

  render() {
    const { theme, classes, edit } = this.props;
    const { recordTag } = this.props.commonStore.url.params;
    const { activeStep, steps, canNext, showFeedback, redirectTo, slideDirection, slideState } = this.state;
    let StepComponent = this.getStepComponent(steps, activeStep);
    let wantedUrl = getBaseUrl(this.props) + '/onboard/' + (steps[activeStep] ? steps[activeStep].replace('#', '%23') : '') + (edit ? '/edit': '') + (recordTag ? '/' + recordTag : '');
    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect push to={redirectTo} />);

    return (
      <Slide direction={slideDirection} in={slideState} mountOnEnter unmountOnExit timeout={300}>

        <Grid item xs={12} sm={8} md={6} lg={6} className={classes.container} >
          {window.location.pathname !== wantedUrl && (<Redirect push to={wantedUrl} />)}
          <Grid item xs={12}>
            <MobileStepper
              variant="dots"
              steps={steps.length}
              position="static"
              activeStep={Math.min(activeStep, steps.length - 1)}
              className={classes.root}
              nextButton={
                <Button size="small" onClick={this.handleNext} disabled={!canNext}
                  className={classNames(classes.stepperButton, (this.shouldNextBeHighlighted(steps[activeStep]) ? classes.stepperButtonHighlighted : null))} >
                  {this.getNextButtonText()}
                  {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </Button>
              }
              backButton={
                <Button size="small" onClick={this.handleBack} disabled={activeStep === 0 && !edit} className={classes.stepperButton} >
                  {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                  <FormattedMessage id={'onboard.stepperBack'} />
                </Button>
              }
            />
          </Grid>

          <div className={classes.stepComponentContainer}>
            <StepComponent handleSave={this.handleSave} activeStep={activeStep} activeStepLabel={steps[activeStep]}
              SuggestionsController={this.props.SuggestionsController} edit={edit} />
          </div>

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
      </Slide>
    );
  }
}

export default inject('commonStore', 'recordStore', 'orgStore', 'userStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardStepper)
  )
);
