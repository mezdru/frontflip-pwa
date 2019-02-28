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
      record: this.props.recordStore.values.record,
      wingsCount: this.props.recordStore.values.record.hashtags.length
    };
  }

  componentDidMount() {
    // observe(this.props.recordStore.values, 'record', (change) => {
    //   console.log('force update and init')
    //   console.log(JSON.stringify(change.oldValue.hashtags.length));
    //   console.log(JSON.stringify(change.newValue.hashtags.length));
    //   console.log(change.object)
    //   if(change.oldValue.hashtags.length !== change.newValue.hashtags.length)
    //     this.forceUpdate(() => this.props.initMuuri());
    // });
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log('updated')
    // console.log('prev state : ' + JSON.stringify(prevState.wingsCount));
    // console.log('current state : ' + JSON.stringify(this.state.wingsCount));
    // // if(prevState.wingsCount !== this.state.wingsCount) {

    // //   this.props.initMuuri();
    // // }
    // if(prevState.record.hashtags.length !== this.state.record.hashtags.length) {
    //   console.log('new record with different hashtags')
    // }
    // this.props.initMuuri();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const {wings} = this.props;

    if(!wings) return null;
    console.log('nb wings : ' + wings.length);
    

    return (
      <div>
        <Typography variant="h3" style={{textAlign: 'center'}} >Your {wings.length} Wings</Typography>
        <div className="board-column-content" data-id="userwings">
          {wings && wings.map((hashtag, i) => {
            if(!hashtag) return null;
            let displayedName = (hashtag.name_translated ? (hashtag.name_translated[this.state.locale] || hashtag.name_translated['en-UK']) || hashtag.name || hashtag.tag : hashtag.name)
            return (
                <div className="board-item" data-id={(hashtag ? hashtag._id : null)} key={i}>
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
