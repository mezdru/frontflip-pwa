import React from 'react';
import { withStyles } from '@material-ui/core';
import Wings from '../utils/wing/Wings';
import ProfileService from '../../services/profile.service';
import { inject, observer } from 'mobx-react';
import { withProfileManagement } from '../../hoc/profile/withProfileManagement';
import { observe } from 'mobx';

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

  componentDidMount() {
    observe(this.props.recordStore.values, 'displayedRecord', (change) => {
      this.getClapsCount(change.newValue ? change.newValue._id : null);
    });
  }

  getClapsCount = (recordId) => {
    this.props.clapStore.setCurrentRecordId(recordId || (this.props.recordStore.values.displayedRecord ? this.props.recordStore.values.displayedRecord._id : null));
    this.props.clapStore.getClapCountByProfile()
      .then(clapsCount => {
        this.forceUpdate();
      }).catch(e => { console.log(e); return; });
  }

  getClaps = (hashtagId) => {
    var hashtags_claps = this.props.profileContext.getProp('hashtags_claps');
    if (!hashtags_claps) return null;
    var clapEntry = hashtags_claps.find(elt => elt.hashtag === hashtagId);
    return clapEntry ? clapEntry.claps : null;
  }

  render() {
    const { classes, profileContext } = this.props;
    const { locale } = this.props.commonStore;
    var wings = profileContext.getProp('hashtags');

    return (
      <div className={classes.root} >
        {wings && wings.length > 0 && wings.map((wing, index) => {
          let displayedName = ProfileService.getWingDisplayedName(wing, locale);
          return (
            <Wings src={ProfileService.getPicturePath(wing.picture)}
              label={ProfileService.htmlDecode(displayedName)} key={wing._id}
              recordId={profileContext.getProp('_id')} hashtagId={wing._id} mode={(wing.class ? 'highlight' : 'profile')}
              enableClap={true} claps={this.getClaps(wing._id)}
            />
          )
        })}
      </div>
    );
  }

}

export default inject('commonStore', 'clapStore', 'recordStore')(
  observer(
    withStyles(styles)(withProfileManagement(ProfileWings))
  )
);