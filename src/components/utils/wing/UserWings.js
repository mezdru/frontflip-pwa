import React from 'react'
import { withStyles, Typography } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { observe } from 'mobx';
import Wings from './Wing';
import ProfileService from '../../../services/profile.service';
import defaultHashtagPicture from '../../../resources/images/placeholder_hashtag.png';

class UserWings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    // observe(this.props.recordStore.values, 'record', (change) => {
    //   this.forceUpdate(() => {this.props.initMuuri()});
    // });
  }

  render() {
    const {record} = this.props.recordStore.values;
    return (
      <div>
        <Typography variant="h3" style={{textAlign: 'center'}} >Your Wings</Typography>
        <div className="board-column-content" data-id="userwings">
          {record.hashtags && record.hashtags.map((hashtag, i) => {
            let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
            return (
                <div className="board-item" data-id={hashtag._id} key={i}>
                  <Wings  src={ProfileService.getPicturePath(hashtag.picture) || defaultHashtagPicture}
                    label={ProfileService.htmlDecode(displayedName)} key={hashtag.tag}
                    className={'board-item-content'} />
                </div>
            )
          })}
        </div>
      </div>
    );
  }
}

export default inject('commonStore', 'recordStore')(
  observer(
    withStyles(null)(UserWings)
  )
);
