import React from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import SearchField from '../../algolia/SearchField';
import UserWings from '../../utils/wing/UserWings';
import WingsSuggestion from '../../algolia/WingsSuggestion';

import Typography from '@material-ui/core/Typography';

import '../style.css';
import Muuri from 'muuri';
require('hammerjs');

let columnGrids = [];

class OnboardWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastSelection: null,
      userWings: this.props.recordStore.values.record.hashtags,
    };
    columnGrids = [];
  }

  initMuuri = async () => {
    // console.log('init muuri')
    let columnGrids = [];

    var itemContainers = [].slice.call(
      document.querySelectorAll(".board-column-content")
    );

    // Define the column grids so we can drag those
    // items around.
    itemContainers.forEach((container) => {
      // Instantiate column grid.
      var grid = new Muuri(container, {
        items: ".board-item",
        layoutDuration: 400,
        layoutEasing: "ease",
        dragEnabled: true,
        dragSort: function(item) {
          return columnGrids;
        },
        dragSortInterval: 0,
        dragSortPredicate: true,
        dragContainer: document.getElementById('root'),
        dragReleaseDuration: 400,
        dragReleaseEasing: "ease"
      })
        .on("dragStart",(item) => {
          // Let's set fixed widht/height to the dragged item
          // so that it does not stretch unwillingly when
          // it's appended to the document body for the
          // duration of the drag.
          item.getElement().style.width = item.getWidth() + "px";
          item.getElement().style.height = item.getHeight() + "px";
        })
        .on("dragReleaseEnd", (item) => {
          grid.synchronize();
          // grid.refreshItems().layout();
          grid.refreshSortData();
          // grid.layout(function(items) {
          //   console.log(items);
          // });


          // console.log(item.getElement().getAttribute("data-id"));

          let order = grid
          .getItems()
          .map(item => item.getElement().getAttribute("data-id"));

        let gridId = grid.getElement().getAttribute("data-id");
        let elementId;

        if (gridId === 'userwings') {
          
          this.asyncForEach(order, async (orderId, i, array) => {
            if (orderId && orderId.charAt(0) === '#') {

              // update element to replace tag by record id
              this.props.recordStore.setRecordTag(orderId);
              await this.props.recordStore.getRecordByTag()
              .then((record => {
                order[i] = record._id;
                elementId = i;
              })).catch(() => {
                order = order.filter(elt => elt.charAt(0) !== '#');
              });

              // in that case, user drag and drop a suggestion from suggestions to his Wings
              // we should add some suggestions

            }
          }).then(() => {
            let record = this.props.recordStore.values.record;
            record.hashtags = order;
            this.props.recordStore.setRecord(record);
            this.props.handleSave()
            .then((recordUpdated)=> {
              // grid.synchronize();
              // grid.refreshItems();
              // grid.refreshSortData();
              //grid.refreshItems().layout()
            }).catch();
          });
        }
          // Let's remove the fixed width/height from the
          // dragged item now that it is back in a grid
          // column and can freely adjust to it's
          // surroundings.
          item.getElement().style.width = "";
          item.getElement().style.height = "";
          // Just in case, let's refresh the dimensions of all items
          // in case dragging the item caused some other items to
          // be different size.
          // columnGrids.forEach(function(grid) {
          //   grid.refreshItems();
          // });
        });

        if(! columnGrids.some(grd => grd.getElement().getAttribute("data-id")  === grid.getElement().getAttribute("data-id")))
          columnGrids.push(grid);
        else {
          // console.log('this is grid : ');
          // console.log(grid);
          grid.destroy(true);
        }
    });
    // console.log('column grids : ');
    // console.log(columnGrids);
  }

  asyncForEach = async (array, callback) => {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  handleAddWing = (e, element) => {
    e.preventDefault();
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

  render() {
    const {record} = this.props.recordStore.values;
    const {userWings} = this.state;

    return (
        <Grid container direction="column" style={{minHeight: 'calc(100% - 72px)', background: 'white'}}>
          <Grid item style={{background: '#f2f2f2'}}> 
                <Typography variant="h3" >Choose your Wings !</Typography>
                <Grid container >
                {/* Here search part or first wings part */}
                  <Grid item xs={12} >
                    <SearchField/>
                  </Grid>
                  <Grid item xs={12} >
                    <WingsSuggestion handleAddWing={this.handleAddWing} initMuuri={this.initMuuri} />
                  </Grid>
                </Grid>
          </Grid>

          <Grid item>
            <Grid container>
              <Grid item xs={12} style={{padding:16}}>
                <UserWings handleRemoveWing={this.handleRemoveWing} initMuuri={this.initMuuri} />
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
