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
      this.props.handleSave();
    }).catch(() => {});
  }

  handleRemoveWing = (e, tag) => {
    e.preventDefault();
    let record = this.props.recordStore.values.record;
    let newHashtags = record.hashtags.filter(hashtag => hashtag.tag !== tag);
    record.hashtags = newHashtags;
    this.props.recordStore.setRecord(record);
    this.props.handleSave();
  }

  renderByStep = () => {
    if (this.state.activeStepOne === this.props.activeStep) {
      return (
        <Grid container >
          <Grid item xs={12}>
            <OnboardFirstWings handleAddWing={this.handleAddWing} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container >
          <Grid item xs={12} >
            <SearchField hashtagOnly handleAddWing={this.handleAddWing} />
          </Grid>
          <Grid item xs={12} >
            <WingsSuggestion handleAddWing={this.handleAddWing} handleSave={this.props.handleSave} />
          </Grid>
        </Grid>
      );
    }
  }

  render() {
    const {activeStepOne} = this.state;
    const {activeStep} = this.props;

    return (
        <Grid container direction="column" style={{minHeight: 'calc(100% - 72px)', background: 'white'}}>
          <Grid item style={{background: '#f2f2f2', maxWidth: '100%'}}> 
                <Typography variant="h3" >Choose your Wings !</Typography>
                  {this.renderByStep()}
          </Grid>

          <Grid item>
            <Grid container>
              <Grid item xs={12} style={{padding:16}}>
                <UserWings handleRemoveWing={this.handleRemoveWing} />
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
