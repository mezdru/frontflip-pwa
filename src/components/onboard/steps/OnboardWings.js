import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import SearchField from '../../algolia/SearchField';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';
import Typography from '@material-ui/core/Typography';
import OnboardFirstWings from './OnboardFirstWings';


class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStepOne: this.props.activeStep
    };
  }

  handleAddWing = (e, element) => {
    if  (e) e.preventDefault();
    this.props.recordStore.setRecordTag(element.tag);
    return this.props.recordStore.getRecordByTag()
    .then(hashtagRecord => {
      let record = this.props.recordStore.values.record;
      record.hashtags.push(hashtagRecord);
      this.props.recordStore.setRecord(record);
      this.props.handleSave(['hashtags']);
    }).catch(() => {});
  }

  handleRemoveWing = (e, tag) => {
    e.preventDefault();
    let record = this.props.recordStore.values.record;
    let newHashtags = record.hashtags.filter(hashtag => hashtag.tag !== tag);
    record.hashtags = newHashtags;
    this.props.recordStore.setRecord(record);
    this.props.handleSave(['hashtags']);
  }

  renderTitleByStep = () => {
    if (this.isFirstWings()) {
      return (
        <Typography variant="h4" style={{textAlign: 'center'}} >Choose your first Wings:</Typography>
      );
    } else if (this.isFeaturedWings()) {
      return (
        <Typography variant="h4" style={{textAlign: 'center'}} >Choose your Wings for the family {this.props.activeStepLabel}:</Typography>
      );
    } else {
      return (
        <Typography variant="h4" style={{textAlign: 'center'}} >Choose your Wings:</Typography>
      );
    }
  }

  renderByStep = () => {
    if (this.isFirstWings()) {
      return (
        <Grid container item xs={12} sm={8} md={6} lg={4} style={{height:280}} >
          <Grid item xs={12}>
            {this.renderTitleByStep()}
          </Grid>
          <Grid item xs={12}>
            <OnboardFirstWings handleAddWing={this.handleAddWing} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container item xs={12} sm={8} md={6} lg={4} style={{height: 280}}>
          <Grid item xs={12}>
            {this.renderTitleByStep()}
          </Grid>
          <Grid item xs={12} style={{padding: 16, paddingBottom: 0}}>
            <SearchField  hashtagOnly handleAddWing={this.handleAddWing} 
                          wingsFamily={this.isFeaturedWings() ? this.props.activeStepLabel : null} />
          </Grid>
          <Grid item xs={12} >
            <WingsSuggestion  handleAddWing={this.handleAddWing} handleSave={this.props.handleSave} 
                              wingsFamily={this.isFeaturedWings() ? this.props.activeStepLabel : null} />
          </Grid>
        </Grid>
      );
    }
  }

  isFirstWings = () => (this.props.activeStepLabel === 'firstWings');
  isFeaturedWings = () => (this.props.activeStepLabel && this.props.activeStepLabel.charAt(0) === '#');

  render() {
    const {activeStepOne} = this.state;
    const {activeStep, activeStepLabel} = this.props;

    return (
        <Grid container direction="column" style={{minHeight: 'calc(100% - 72px)', background: 'white'}}>
          <Grid item style={{background: '#f2f2f2', maxWidth: '100%'}} justify="center" direction="row" container> 
            {this.renderByStep()}
          </Grid>

          <Grid item justify="center" direction="row" container style={{marginTop: 16}}>
            <Grid container  item xs={12} sm={8} md={6} lg={4}>
              <Grid item xs={12}>
                <UserWings handleRemoveWing={this.handleRemoveWing} wingsFamily={this.isFeaturedWings() ? activeStepLabel : null} />
              </Grid>
            </Grid>
          </Grid>

        </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWings)
  )
);
