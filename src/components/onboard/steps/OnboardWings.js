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

import '../style.css';
import Muuri from 'muuri';
require('hammerjs');

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSelection: null,
    };
  }

  componentDidMount() {    
    var itemContainers = [].slice.call(
      document.querySelectorAll(".board-column-content")
    );
    var columnGrids = [];
    var boardGrid;

    // Define the column grids so we can drag those
    // items around.
    itemContainers.forEach(function(container) {
      // Instantiate column grid.
      var grid = new Muuri(container, {
        items: ".board-item",
        layoutDuration: 400,
        layoutEasing: "ease",
        dragEnabled: true,
        dragSort: function() {
          return columnGrids;
        },
        dragSortInterval: 0,
        dragContainer: document.body,
        dragReleaseDuration: 400,
        dragReleaseEasing: "ease"
      })
        .on("dragStart", function(item) {
          // Let's set fixed widht/height to the dragged item
          // so that it does not stretch unwillingly when
          // it's appended to the document body for the
          // duration of the drag.
          item.getElement().style.width = item.getWidth() + "px";
          item.getElement().style.height = item.getHeight() + "px";
        })
        .on("dragReleaseEnd", function(item) {
          // Let's remove the fixed width/height from the
          // dragged item now that it is back in a grid
          // column and can freely adjust to it's
          // surroundings.
          item.getElement().style.width = "";
          item.getElement().style.height = "";
          // Just in case, let's refresh the dimensions of all items
          // in case dragging the item caused some other items to
          // be different size.
          columnGrids.forEach(function(grid) {
            grid.refreshItems();
          });
        })
        .on("layoutStart", function() {
          console.log("start");
          var order = grid
            .getItems()
            .map(item => item.getElement().getAttribute("data-id"));
          console.log(order);
          // Let's keep the board grid up to date with the
          // dimensions changes of column grids.
          boardGrid.refreshItems().layout();
        });

      // Add the column grid reference to the column grids
      // array, so we can access it later on.
      columnGrids.push(grid);
    });

    console.log(
      columnGrids[0]._id +
        " | " +
        columnGrids[0].getElement().getAttribute("data-id")
    );
    console.log(
      columnGrids[1]._id +
        " | " +
        columnGrids[1].getElement().getAttribute("data-id")
    );

    boardGrid = new Muuri(".board", {
      layoutDuration: 400,
      layoutEasing: "ease",
      dragEnabled: false,
      dragSortInterval: 0,
      dragStartPredicate: {
        handle: ".board-column-header"
      },
      dragReleaseDuration: 400,
      dragReleaseEasing: "ease"
    });
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

          <div>
        <div className="board">
          <div className="board-column todo">
            <div className="board-column-header">To do</div>
            <div className="board-column-content" data-id="suggestions">
              <div className="board-item" data-id="1">
                <div className="board-item-content">
                  <span>Item #</span>1
                </div>
              </div>
              <div className="board-item" data-id="2">
                <div className="board-item-content">
                  <span>Item Item#</span>2
                </div>
              </div>
              <div className="board-item" data-id="3">
                <div className="board-item-content">
                  <span>Item Item Item#</span>3
                </div>
              </div>
              <div className="board-item" data-id="4">
                <div className="board-item-content">
                  <span>Item #</span>4
                </div>
              </div>
              <div className="board-item" data-id="5">
                <div className="board-item-content">
                  <span>Item #</span>5
                </div>
              </div>
            </div>
          </div>
          <div className="board-column working">
            <div className="board-column-header">Working</div>
            <div className="board-column-content" data-id="userwings">
              <div className="board-item" data-id="6">
                <div className="board-item-content">
                  <span>Item #</span>6
                </div>
              </div>
              <div className="board-item" data-id="7">
                <div className="board-item-content">
                  <span>Item #</span>7
                </div>
              </div>
              <div className="board-item" data-id="8">
                <div className="board-item-content">
                  <span>Item #</span>8
                </div>
              </div>
              <div className="board-item" data-id="9">
                <div className="board-item-content">
                  <span>Item #</span>9
                </div>
              </div>
              <div className="board-item" data-id="10">
                <div className="board-item-content">
                  <span>Item #</span>10
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        </Grid>

        



    );
  }
}

export default inject('commonStore', 'recordStore', 'organisationStore')(
  observer(
    withStyles(null)(OnboardWings)
  )
);
