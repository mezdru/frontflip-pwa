import React from 'react';
import ProfileThumbnail from './ProfileThumbnail';
import { withStyles, Grid, Button } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import ProfileService from '../../services/profile.service';
import Banner from '../utils/banner/Banner';
import BannerResizable from '../utils/banner/BannerResizable';
import ProfileWings from './ProfileWings';
import ProfileClapHistory from './ProfileClapHistory';
import { FilterList } from '@material-ui/icons';
import ProfileActions from './ProfileActions';

const styles = {
  root: {
    position: 'fixed',
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: 'white',
    zIndex: 99999,
    top: 0,
    left: 0,
    overflow: 'hidden'
  },
  thumbnail: {
    position: 'relative',
    padding: 32,
    paddingRight: 0,
    height: 'calc(100vh - 112px)',
  },
  content: {
    position: 'relative',
    padding: 32,
    paddingTop: 16,
    paddingLeft: 0,
  },
  clapHistory: {
    paddingLeft: 16,
    marginTop: -23 // Height of title
  },
  wings: {
    paddingRight: 16,
    paddingLeft: 24
  },
  actions: {
    padding: 32
  },
  blackFilter: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.35,
    overflow: 'hidden',
  },
  banner: {
    position: 'fixed',
    // WebkitFilter: 'blur(2px)',
    // MozFilter: 'blur(2px)',
    // OFilter: 'blur(2px)',
    // MsFilter: 'blur(2px)',
    // filter: 'blur(2px)',
  },
  button: {
    height: 'initial',
    marginLeft: 32
  }
}

class ProfileLayout extends React.Component {

  state = {
    recordWingzy: {},
    recordAlgolia: {},
    canEdit: false
  }

  componentDidMount() {
    if (!this.props.hit) return;
    if (!this.props.authStore.isAuth()) return;

    var algoliaHit = JSON.parse(JSON.stringify(this.props.hit));
    ProfileService.transformLinks(algoliaHit);
    ProfileService.makeHightlighted(algoliaHit);
    ProfileService.orderHashtags(algoliaHit);
    this.setState({recordAlgolia: algoliaHit});

    this.props.recordStore.setRecordTag(this.props.hit.tag);
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    this.props.recordStore.getRecordByTag()
      .then((record) => {
        record.objectID = record._id;

        ProfileService.transformLinks(record);
        ProfileService.makeHightlighted(record);
        ProfileService.orderHashtags(record);

        this.setState({ recordWingzy: record, canEdit: this.canEdit(record) });
      }).catch((e) => {
        console.log(e);
        return;
      })
  }

  canEdit = (workingRecord) => {
    if (!(this.props.userStore.values.currentUser && this.props.userStore.values.currentUser._id)) return false;
    if (this.props.userStore.values.currentUser.superadmin) return true;
    else if (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.record === workingRecord.objectID)) return true;
    else if (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === workingRecord.organisation && orgAndRecord.admin)) return true;
    else return false;
  }

  render() {
    const { classes } = this.props;
    const { recordWingzy, canEdit, recordAlgolia } = this.state;
    const { locale } = this.props.commonStore;

    // console.log('UPDATE')
    // console.log(recordAlgolia)
    // console.log(JSON.stringify(recordWingzy))
    // console.log(recordAlgolia.objectID || recordWingzy._id)

    return (
      <Grid container className={classes.root} alignContent="flex-start">
        <BannerResizable
          type={'organisation'}
          initialHeight={100}
          style={styles.banner}
        />
        <div className={classes.blackFilter} >

        </div>
        <Grid container item xs={12} style={{ height: 116 }} alignContent="flex-start" justify="flex-end" className={classes.actions} >
            <ProfileActions canPropose canFilter canEdit={canEdit} recordId={recordWingzy.objectID || recordWingzy._id} />
        </Grid>
        <Grid item className={classes.thumbnail} xs={12} lg={3}>
          <ProfileThumbnail record={recordWingzy} />
        </Grid>
        <Grid container item className={classes.content} xs={12} lg={9} alignContent="flex-start">
          <Grid item xs={12} lg={8} className={classes.wings} >
            <ProfileWings wings={recordWingzy.hashtags} recordId={recordWingzy.objectID || recordWingzy._id} clapDictionnary={recordAlgolia.hashtags_claps} />
          </Grid>
          <Grid item xs={12} lg={4} className={classes.clapHistory}>
            <ProfileClapHistory />
          </Grid>
        </Grid>
      </Grid>
    )
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'clapStore', 'userStore')(
  observer(
    withStyles(styles)(ProfileLayout)
  )
);
