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
import SlackService from '../../services/slack.service';

import { withSnackbar } from 'notistack';
import LoaderFeedback from '../utils/buttons/LoaderFeedback';

import { FormattedMessage } from "react-intl";
import classNames from 'classnames';
import undefsafe from 'undefsafe';
import {getBaseUrl} from '../../services/utils.service.js';

let timeoutArray = [];

const styles = theme => ({
  root: {
    background: theme.palette.primary.dark
  },
  stepperButton: {
    background: 'none',
    boxShadow: 'none',
    padding: '8px 16px',
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.12)',
    },
    '&:first-child()': {
      width: 40,
    },
    '&:disabled': {
      color: theme.palette.primary.hover + '!important'
    }
  },
  stepperButtonHighlighted: {
    background: theme.palette.secondary.main,
    '&:hover': {
      background: theme.palette.secondary.dark,
    },
  }
});

class OnboardStepper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      canNext: true,
      steps: []
    };
  }

  componentDidMount() {
    this.makeSteps(this.props.wantedStep);
  }


  makeSteps = async (stepLabel) => {
    let org = this.props.organisationStore.values.organisation;
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
    this.setState({ steps: steps, activeStep: stepLabel ? steps.indexOf(stepLabel.replace('%23', '#')) : 0 });

  }

  handleNext = () => {
    // if (this.props.edit) {
    //   this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    //   this.props.recordStore.getRecordByUser().then().catch();
    //   return this.setState({redirectTo: getBaseUrl(this.props) + '/' + this.props.recordStore.values.record.tag});
    // }

    if ((this.state.activeStep === (this.state.steps.length - 1))) {
      // click on finish

      if (this.props.edit) {
        this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
        this.props.recordStore.getRecordByUser().then().catch();
        return this.setState({redirectTo: getBaseUrl(this.props) + '/' + this.props.recordStore.values.record.tag});
      }

      let user = this.props.userStore.values.currentUser;
      try {
        if (process.env.NODE_ENV === 'production' && !process.env.REACT_APP_NOLOGS)
          SlackService.notify('#alerts', `We have a new User! ${undefsafe(user, 'email.value') || undefsafe(user, 'google.email') || user._id}` +
            ' in ' + this.props.organisationStore.values.organisation.tag);
      } catch (e) {}

      this.props.userStore.welcomeCurrentUser(this.props.organisationStore.values.organisation._id);
      this.setState({ redirectTo: getBaseUrl(this.props) + '/congrats' });
    } else {
      this.setState({activeStep: this.state.activeStep + 1});
    }
  };

  handleBack = () => {
    // if (this.props.edit) 
    //   return this.setState({redirectTo: getBaseUrl(this.props) + '/' + this.props.recordStore.values.record.tag});

    this.setState({activeStep: this.state.activeStep - 1});
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

  handleSave = async (arrayOfLabels) => {
    this.props.recordStore.setRecordId(this.props.recordStore.values.record._id);
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    return await this.props.recordStore.updateRecord(arrayOfLabels).then((record) => {
      timeoutArray.forEach(tm => { clearTimeout(tm) });
      timeoutArray = [];
      this.setState({ showFeedback: true }, () => {
        timeoutArray.push(setTimeout(() => { this.setState({ showFeedback: false }) }, 2000));
      })
    }).catch((e) => {
      console.error(e);
      this.props.enqueueSnackbar('Your data can\'t be saved, please contact us at contact@wingzy.com.', { variant: 'warning' });
    });
  }

  getNextButtonText = () => {
    // if (this.props.edit) return <FormattedMessage id={'onboard.edit.save'} />
    if (this.state.activeStep === (this.state.steps.length - 1)) return <FormattedMessage id={'onboard.stepperFinish'} />
    else return <FormattedMessage id={'onboard.stepperNext'} />
  }

  shouldNextBeHighlighted = (activeStepLabel) => {
    let record = this.props.recordStore.values.record;
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
    const { organisation, orgTag } = this.props.organisationStore.values;
    const { locale } = this.props.commonStore;
    const { activeStep, steps, canNext, showFeedback, redirectTo } = this.state;
    let StepComponent = this.getStepComponent(steps, activeStep);

    let wantedUrl = '/' + locale + '/' + (organisation.tag || orgTag) + '/onboard/' + (steps[activeStep] ? steps[activeStep].replace('#', '%23') : '');

    if (redirectTo && window.location.pathname !== redirectTo) return (<Redirect push to={redirectTo} />);

    return (
      <Grid item>
        {((window.location.pathname !== wantedUrl) && (window.location.pathname !== wantedUrl + '/edit') && !edit) && (
          <Redirect push to={wantedUrl} />
        )}
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
              <Button size="small" onClick={this.handleBack} disabled={activeStep === 0} className={classes.stepperButton} >
                {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                <FormattedMessage id={'onboard.stepperBack'} />
              </Button>
            }
          />
        </Grid>

        <StepComponent handleSave={this.handleSave} activeStep={activeStep} activeStepLabel={steps[activeStep]}
          SuggestionsController={this.props.SuggestionsController} />

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

export default inject('commonStore', 'recordStore', 'organisationStore', 'userStore')(
  observer(
    withSnackbar(
      withStyles(styles, { withTheme: true })(OnboardStepper)
    )
  )
);
