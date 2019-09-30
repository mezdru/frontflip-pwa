import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Search from '../../search/Search';
import UserWings from '../../utils/wing/UserWings';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from "react-intl";

const styles = theme => ({
  userWingsPosition: {
    paddingTop: 16,
    height: 300,
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
    try {
      var elt = document.getElementById(this.state.scrollableClass);
      elt.scrollTop = elt.scrollHeight;
    } catch (e) {
      // log
    }
  }

  addAndSave = (hashtagRecord) => {
    let record = this.props.recordStore.values.record;
    record.hashtags.push(hashtagRecord);
    this.props.recordStore.setRecord(record);
    this.props.handleSave(['hashtags']);
  }

  handleAddWing = (element) => {
    this.props.recordStore.setRecordTag(element.tag);
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    if (this.props.recordStore.values.record.hashtags.find(elt => elt.tag === element.tag)) return Promise.resolve();
    return this.props.recordStore.getRecordByTag()
      .then(hashtagRecord => {
        this.addAndSave(hashtagRecord);
      }).catch(() => {
        let newRecord = {
          tag: element.tag,
          name: element.name || (element.tag).substr(1)
        };
        this.props.recordStore.postRecord(newRecord)
          .then((hashtagRecord) => {
            this.addAndSave(hashtagRecord);
          }).catch();
      });
  }

  handleCreateWing = async (wing) => {
    let newWing = {name: wing.name, type: 'hashtag'};
    if(this.isFeaturedWings()) newWing.hashtags = [this.getFeaturedWings()];
    let newWingSaved = await this.props.recordStore.postRecord(newWing);
    this.handleAddWing(newWingSaved);
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
    if (this.isFeaturedWings()) {
      return (
        <Typography variant="h4" style={{ textAlign: 'center', padding: 8, color: this.props.theme.palette.primary.dark }} >{this.getFeaturedWings() ? this.getFeaturedWings().intro : <FormattedMessage id={'onboard.chooseYourWings'} />}</Typography>
      );
    } else {
      return (
        <Typography variant="h4" style={{ textAlign: 'center', padding: 8, color: this.props.theme.palette.primary.dark }} ><FormattedMessage id={'onboard.chooseYourWings'} /></Typography>
      );
    }
  }

  isFeaturedWings = () => (this.props.activeStepLabel && this.props.activeStepLabel.charAt(0) === '#');
  getFeaturedWings = () => this.props.organisationStore.values.organisation.featuredWingsFamily.filter(fam => fam.tag === this.props.activeStepLabel)[0];

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction="column" style={{background: 'white', overflow: 'hidden' }}>
        <Grid item style={{
          background: this.props.theme.palette.primary.main, maxWidth: '100%', position: 'relative', zIndex: 2,
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
        }}
          justify="center" direction="row" container >
          <Grid container item xs={12} >

            <Grid item xs={12} style={{ padding: 8 }}>
              {this.renderTitleByStep()}
            </Grid>

            <Grid item xs={12} style={{padding: '0px 24px'}}>
              <Search mode="onboard" onSelect={this.handleAddWing} max={10} wingsFamily={this.getFeaturedWings()} handleCreateWing={this.handleCreateWing} />
            </Grid>

          </Grid>
        </Grid>

        <Grid item justify="center" direction="row" container className={classes.userWingsPosition} id={this.state.scrollableClass}>
          <Grid container item xs={12}>
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
    withStyles(styles, { withTheme: true })(OnboardWings)
  )
);
