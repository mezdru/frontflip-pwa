import React from 'react';
import { withStyles } from '@material-ui/core';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';

const styles = theme => ({
  contactIcon: {
    marginRight: 8,
    position: 'relative',
    textAlign: 'center',
    width: 48,
    fontSize: 32,
    display: 'inline-block',
  },
});

class ProfileWings extends React.PureComponent {

  componentWillReceiveProps(nextProps) {
    this.getClapsCount(nextProps.recordId);
  }

  getClapsCount = (recordId) => {
    this.props.clapStore.setCurrentRecordId(recordId);
    this.props.clapStore.getClapCountByProfile()
      .then(clapsCount => {
        this.forceUpdate();
      }).catch(e => {return;});
  }

  getClaps = (hashtags_claps, hashtagId) => {
    if(!hashtags_claps) return null;
    var clapEntry = hashtags_claps.find(elt => elt.hashtag === hashtagId);
    return clapEntry ? clapEntry.claps : null;
  }

  render() {
    const {classes, wings, recordId, clapDictionnary} = this.props;
    const {locale} = this.props.commonStore;

    return (
      <div className={classes.root} >
        {wings && wings.length > 0 && wings.map((wing, index) => {
          let displayedName = (wing.name_translated ? (wing.name_translated[locale] || wing.name_translated['en-UK']) || wing.name || wing.tag : wing.name || "...")
          return (
            <Wings src={ProfileService.getPicturePath(wing.picture)}
              label={ProfileService.htmlDecode(displayedName)} key={wing._id  }
              recordId={recordId} hashtagId={wing._id} mode={(wing.class ? 'highlight' : 'profile')}
              enableClap={true} claps={this.getClaps(clapDictionnary, wing._id)}
            />
          )
        })}
      </div>
    );
  }

}

export default inject('commonStore', 'clapStore')(
  observer(
    withStyles(styles)(ProfileWings)
  )
);