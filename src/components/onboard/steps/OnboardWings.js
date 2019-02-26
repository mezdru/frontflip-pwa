import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import SearchField from '../../algolia/SearchField';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSelection: null,
    };
  }

  handleAddWing = (e, element) => {
    e.preventDefault();
    this.props.recordStore.setRecordTag(element.tag.replace('#', '%23'));
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

  render() {
    const {record} = this.props.recordStore.values;

    return (
        <Grid container direction="column" style={{minHeight: 'calc(100% - 72px)', background: 'white'}}>
          <Grid item style={{background: '#f2f2f2'}}> 
            <ExpansionPanel style={{background: 'transparent'}}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                <Typography variant="h3" >Choose your Wings !</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container direction="column" justify="center" >
                {/* Here search part or first wings part */}
                  <Grid item xs={12} >
                    <SearchField/>
                  </Grid>
                  <Grid item xs={12} >
                    <WingsSuggestion handleAddWing={this.handleAddWing} />
                  </Grid>
                </Grid>
              </ExpansionPanelDetails>
            </ExpansionPanel>
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
