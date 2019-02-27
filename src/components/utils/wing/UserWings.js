import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import Wings from './Wing';
import ProfileService from '../../../services/profile.service';
import defaultHashtagPicture from '../../../resources/images/placeholder_hashtag.png';
import {Droppable, Draggable} from 'react-beautiful-dnd';

const styles = {
  suggestionList: {
    padding: 0,
    listStyleType: 'none',
    gridAutoFlow: 'row dense',
    '& li ': {
      display: 'inline-block',
      marginLeft: 16
    }
  },
};

class UserWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    observe(this.props.recordStore.values, 'record', (change) => {
      this.forceUpdate();
    });
  }

  render() {
    const {record} = this.props.recordStore.values;
    const {classes} = this.props; 

    return (
      <div>
        <Typography variant="h3" style={{textAlign: 'center'}} >Your {record.hashtags.length} Wings</Typography>
        <Droppable
          droppableId={'userwings-1'}
          type="WING"
          direction="horizontal"
        >
          {(provided, snapshot) => (
            <ul 
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classes.suggestionList}
            >
              {record.hashtags && record.hashtags.map((hashtag, i) => {
                let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
                return (
                  <Draggable draggableId={hashtag._id} index={i} key={i}>
                  {(provided, snapshot) => (
                    <li 
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps} >
                        <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture} key={i}
                        label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                        className={(hashtag.class ? hashtag.class : 'notHighlighted')}
                        onDelete={(e) => this.props.handleRemoveWing(e, hashtag.tag)} 
                        />
                    </li>

                  )}
                  </Draggable>
                )
              })}
            </ul>

          )}
        


        </Droppable>

      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(styles)(UserWings)
  )
);
