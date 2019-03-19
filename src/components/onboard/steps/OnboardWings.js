import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import SearchField from '../../algolia/SearchField';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';
import Typography from '@material-ui/core/Typography';
import OnboardFirstWings from './OnboardFirstWings';
import {FormattedMessage} from "react-intl";


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
        <Typography variant="h4" style={{textAlign: 'center', padding: 8}} >
          <FormattedMessage id={'onboard.chooseYourFirstWings'}/>
        </Typography>
      );
    } else if (this.isFeaturedWings()) {
      return (
        <Typography variant="h4" style={{textAlign: 'center', padding: 8}} >{this.getFeaturedWings() ? this.getFeaturedWings().intro :<FormattedMessage id={'onboard.chooseYourWings'}/>}</Typography>
      );
    } else {
      return (
        <Typography variant="h4" style={{textAlign: 'center', padding: 8}} ><FormattedMessage id={'onboard.chooseYourWings'}/></Typography>
      );
    }
  }

  renderByStep = () => {
    if (this.isFirstWings()) {
      return (
        <Grid container item xs={12} sm={8} md={6} lg={4} >
          <Grid item xs={12} style={{padding: 8}}>
            {this.renderTitleByStep()}
          </Grid>
          <Grid item xs={12}>
            <OnboardFirstWings handleAddWing={this.handleAddWing} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container item xs={12} sm={8} md={6} lg={4} >
          <Grid item xs={12} style={{padding: 8}}>
            {this.renderTitleByStep()}
          </Grid>
          <Grid item xs={12} style={{padding: 16, paddingBottom: 0, paddingTop:0}}>
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
  getFeaturedWings = () => this.props.organisationStore.values.organisation.featuredWingsFamily.filter(fam => fam.tag === this.props.activeStepLabel)[0];

  render() {
    const {activeStepLabel} = this.props;

    return (
        <Grid container direction="column" style={{height: 'calc(100vh - 73px)', background: 'white', overflow: 'hidden'}}>
          <Grid item style={{background: '#f2f2f2', maxWidth: '100%', minHeight: '285px',
            boxShadow: '0px 2px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12)' }} 
            justify="center" direction="row" container> 
            {this.renderByStep()}
          </Grid>

          <Grid item justify="center" direction="row" container style={{paddingTop: 16, height: 'calc(100% - 320px)', overflowY: 'auto'}}>
            <Grid container  item xs={12} sm={8} md={6} lg={4}>
              <Grid item xs={12} >
                <UserWings handleRemoveWing={this.handleRemoveWing} wingsFamily={this.isFeaturedWings() ? this.getFeaturedWings() : null} />
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
