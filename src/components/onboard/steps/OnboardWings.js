import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import SearchField from '../../algolia/SearchField';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';
import Typography from '@material-ui/core/Typography';
import OnboardFirstWings from './OnboardFirstWings';
import {FormattedMessage} from "react-intl";

const styles = theme => ({
  userWingsPosition: {
    paddingTop: 16, 
    height: 'calc(100% - 320px)', 
    [theme.breakpoints.down('sm')]: {
      height: 'calc(100% - 280px)',
    },
    overflowY: 'auto'
  }
});

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStepOne: this.props.activeStep,
      scrollableClass: Math.floor(Math.random() * 99999)
    };
  }

  scrollUserWingsToBottom = () => {
    try{
    var elt = document.getElementById(this.state.scrollableClass);
    elt.scrollTop = elt.scrollHeight;    
    }catch(e) {
      // log
    }
  }

  handleAddWing = (e, element) => {
    if  (e) e.preventDefault();
    this.props.recordStore.setRecordTag(element.tag);
    if(this.props.recordStore.values.record.hashtags.find(elt => elt.tag === element.tag)) return Promise.resolve();
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
        <Typography variant="h4" style={{textAlign: 'center', padding: 8, color:this.props.theme.palette.primary.dark}} >
          <FormattedMessage id={'onboard.chooseYourFirstWings'}/>
        </Typography>
      );
    } else if (this.isFeaturedWings()) {
      return (
        <Typography variant="h4" style={{textAlign: 'center', padding: 8, color:this.props.theme.palette.primary.dark}} >{this.getFeaturedWings() ? this.getFeaturedWings().intro :<FormattedMessage id={'onboard.chooseYourWings'}/>}</Typography>
      );
    } else {
      return (
        <Typography variant="h4" style={{textAlign: 'center', padding: 8, color:this.props.theme.palette.primary.dark}} ><FormattedMessage id={'onboard.chooseYourWings'}/></Typography>
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
                              wingsFamily={this.isFeaturedWings() ? this.props.activeStepLabel : null} 
                              SuggestionsController={this.props.SuggestionsController} stepLabel={this.props.activeStepLabel} />
          </Grid>
        </Grid>
      );
    }
  }

  isFirstWings = () => (this.props.activeStepLabel === 'firstWings');
  isFeaturedWings = () => (this.props.activeStepLabel && this.props.activeStepLabel.charAt(0) === '#');
  getFeaturedWings = () => this.props.organisationStore.values.organisation.featuredWingsFamily.filter(fam => fam.tag === this.props.activeStepLabel)[0];

  render() {
    const {activeStepLabel, theme, classes} = this.props;
    return (
        <Grid container direction="column" style={{height: 'calc(100vh - 73px)', background: 'white', overflow: 'hidden'}}>
          <Grid item style={{background: this.props.theme.palette.primary.main, maxWidth: '100%', position: 'relative', zIndex: 2,
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
            }} 
            justify="center" direction="row" container > 
            {this.renderByStep()}
          </Grid>

          <Grid item justify="center" direction="row" container className={classes.userWingsPosition} id={this.state.scrollableClass}>
            <Grid container  item xs={12} sm={8} md={6} lg={4}>
              <Grid item xs={12} >
                <UserWings handleRemoveWing={this.handleRemoveWing} wingsFamily={this.isFeaturedWings() ? this.getFeaturedWings() : null}
                            scrollUserWingsToBottom={this.scrollUserWingsToBottom} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(styles, {withTheme: true})(OnboardWings)
  )
);
