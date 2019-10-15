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
    maxHeight: 200,
    [theme.breakpoints.down('xs')]: {
      maxHeight: 'unset',
    },
    overflowY: 'auto'
  },
  search: {
    padding: '0px 32px',
    [theme.breakpoints.down('xs')]:{
      padding: '0px 16px',
    }
  },
  title: {
    padding: 24, 
    paddingBottom: 8,
    [theme.breakpoints.down('xs')]:{
      padding: 8,
    }
  }
});

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStepOne: this.props.activeStep,
      scrollableClass: Math.floor(Math.random() * 99999),
      boardHeight: 0
    };
  }

  scrollUserWingsToBottom = () => {
    try {
      var elt = document.getElementById(this.state.scrollableClass);
      elt.scrollTop = elt.scrollHeight;
    } catch (e) {}
  }

  componentDidMount() {
    setTimeout(() => 
    {
      let elt = document.getElementById('onboard-wings-board');
      this.setState({boardHeight: (elt ? elt.clientHeight : 0) + 72 });
    }, 120);

  }

  addAndSave = (hashtagRecord) => {
    if(!hashtagRecord) return;
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    record.hashtags = record.hashtags.concat([hashtagRecord]);
    this.props.handleSave(['hashtags']);
  }

  handleAddWing =async (element) => {
    if(!element) return Promise.resolve();
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    if (record.hashtags.find(elt => elt.tag === element.tag)) return Promise.resolve();

    let hashtagRecord = await this.props.recordStore.fetchByTag(element.tag, this.props.orgStore.currentOrganisation._id).catch(e => {return null});

    if(hashtagRecord) this.addAndSave(hashtagRecord);
    else if(element.tag) {
      let newRecord = {
        tag: element.tag,
        name: element.name || (element.tag).substr(1),
        organisation: this.props.orgStore.currentOrganisation._id
      };
      this.addAndSave(await this.props.recordStore.postRecord(newRecord));
    }
  }

  handleCreateWing = async (wing) => {
    let newWing = {name: wing.name, type: 'hashtag', organisation: this.props.orgStore.currentOrganisation._id};
    if(this.isFeaturedWings()) newWing.hashtags = [this.getFeaturedWings()];
    let newWingSaved = await this.props.recordStore.postRecord(newWing);
    this.handleAddWing(newWingSaved);
  }

  handleRemoveWing = (e, tag) => {
    e.preventDefault();
    // should clone record ?
    let record = (this.props.edit ? this.props.recordStore.currentUrlRecord : this.props.recordStore.currentUserRecord);
    record.hashtags = record.hashtags.filter(hashtag => hashtag.tag !== tag);
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
  getFeaturedWings = () => {
    try{
      return this.props.orgStore.currentOrganisation.featuredWingsFamily.filter(fam => fam.tag === this.props.activeStepLabel)[0];
    }catch(e) {
      return null;
    }
  }

  render() {
    const { classes } = this.props;
    const { boardHeight } = this.state;

    return (
      <Grid container direction="column" style={{background: 'white', overflow: 'hidden' }}>
        <Grid item style={{
          background: this.props.theme.palette.primary.main, maxWidth: '100%', position: 'relative', zIndex: 2,
          boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 8px 0px, rgba(0, 0, 0, 0.14) 0px 3px 4px 0px, rgba(0, 0, 0, 0.12) 0px 3px 3px -2px',
        }}
          justify="center" direction="row" container id="onboard-wings-board" >
          <Grid container item xs={12} >

            <Grid item xs={12} className={classes.title}>
              {this.renderTitleByStep()}
            </Grid>

            <Grid item xs={12} className={classes.search}>
              <Search mode="onboard" edit={this.props.edit} onSelect={this.handleAddWing} max={10} wingsFamily={this.getFeaturedWings()} handleCreateWing={this.handleCreateWing} />
            </Grid>

          </Grid>
        </Grid>

        <Grid item justify="center" direction="row" container style={{height: `calc(100vh - ${boardHeight}px)`}} className={classes.userWingsPosition} id={this.state.scrollableClass}>
          <Grid container item xs={12}>
            <Grid item xs={12} >
              <UserWings handleRemoveWing={this.handleRemoveWing} wingsFamily={this.isFeaturedWings() ? this.getFeaturedWings() : null}
                scrollUserWingsToBottom={this.scrollUserWingsToBottom} edit={this.props.edit} />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default inject('commonStore', 'recordStore', 'orgStore')(
  observer(
    withStyles(styles, { withTheme: true })(OnboardWings)
  )
);
