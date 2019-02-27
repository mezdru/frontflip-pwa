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

import {DragDropContext} from 'react-beautiful-dnd';

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSelection: null,
      droppableAreas: {
        'suggestions-1' : {
          id: 'suggestions-1',
          wingIds: []
        },
        'suggestions-2': {
          id: 'suggestions-2',
          wingIds: []
        },
        'userwings-1': {
          id: 'userwings-1',
          wingIds: []
        }
      }
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

  onDragEnd = result => {
    console.log('on drag end')
    const {destination, source, draggableId } = result;

    if (!destination) return

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return
    }

    if (
      destination.droppableId === 'suggestions-1' || 
      destination.droppableId === 'suggestions-2'
    ) {
      return
    }

    const start = this.state.droppableAreas[source.droppableId]
    const finish = this.state.droppableAreas[destination.droppableId]

    console.log('start : ' + JSON.stringify(start))
    console.log('end: ' + JSON.stringify(finish))
    let record = this.props.recordStore.values.record
    
    // Moving item inside same list
    if (start === finish) {
      
      record.hashtags.splice(source.index, 1)
      record.hashtags.splice(destination.index, 0, draggableId)

      const newDroppableArea = {
        ...start,
        wingIds: record.hashtags
      }

      const newState = {
        ...this.state,
        droppableAreas: {
          ...this.state.droppableAreas,
          [newDroppableArea.id]: newDroppableArea
        }
      }
      this.props.recordStore.setRecord(record)
      this.props.handleSave()
      this.setState(newState)
      return
    }

    // Moving item from on list to another
    this.props.recordStore.setRecordTag(draggableId.replace('#', '%23'));
    return this.props.recordStore.getRecordByTag()
    .then(hashtagRecord => {
      record.hashtags.splice(destination.index, 0, hashtagRecord._id)
      this.props.recordStore.setRecord(record)
      this.props.handleSave()
    })


    const startWingIds = Array.from(start.wingIds)
    startWingIds.splice(source.index, 1)
    const newStart = {
      ...start,
      wingIds: startWingIds
    }

    const finishWingIds = Array.from(finish.wingIds)
    finishWingIds.splice(destination.index, 0, draggableId)
    const newFinish = {
      ...finish,
      wingIds: finishWingIds
    }

    const newState = {
      ...this.state,
      droppableAreas: {
        ...this.state.droppableAreas,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    }
    this.setState(newState)

  }

  render() {
    const {record} = this.props.recordStore.values;

    return (

      <DragDropContext onDragEnd={this.onDragEnd}>
      
        <Grid container direction="column" style={{minHeight: 'calc(100% - 72px)', background: 'white'}}>

          <Grid item style={{background: '#f2f2f2'}}> 
            <ExpansionPanel style={{background: 'transparent'}}>
              <ExpansionPanelSummary expandIcon={<ExpandMoreIcon color="primary" />}>
                <Typography variant="h3" >Choose your Wings !</Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails>
                <Grid container>
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
        
      </DragDropContext>



    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWings)
  )
);
