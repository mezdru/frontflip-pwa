import React from 'react';
import { withStyles, Grid, Slide } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import ProfileThumbnail from './ProfileThumbnail';
import ProfileService from '../../services/profile.service';
import BannerResizable from '../utils/banner/BannerResizable';
import ProfileWings from './ProfileWings';
import ProfileClapHistory from './ProfileClapHistory';
import ProfileActions from './ProfileActions';
import {styles} from './ProfileLayout.css';

class ProfileLayout extends React.Component {

  state = {
    recordWingzy: {},
    recordAlgolia: {},
    canEdit: false,
    visible: true
  }

  componentDidMount() {
    if (!this.props.hit) return;
    if (!this.props.authStore.isAuth()) return;

    var algoliaHit = JSON.parse(JSON.stringify(this.props.hit));
    ProfileService.transformLinks(algoliaHit);
    ProfileService.makeHightlighted(algoliaHit);
    ProfileService.orderHashtags(algoliaHit);
    this.setState({ recordAlgolia: algoliaHit });

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
        return;
      });
  }

  canEdit = (workingRecord) => {
    if (!(this.props.userStore.values.currentUser && this.props.userStore.values.currentUser._id)) return false;
    if (this.props.userStore.values.currentUser.superadmin) return true;
    else if (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.record === workingRecord.objectID)) return true;
    else if (this.props.userStore.values.currentUser.orgsAndRecords.find(orgAndRecord => orgAndRecord.organisation === workingRecord.organisation && orgAndRecord.admin)) return true;
    else return false;
  }

  render() {
    const { classes, visible, transitionDuration } = this.props;
    const { recordWingzy, canEdit, recordAlgolia } = this.state;
    const rootUrl = '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.organisation.tag;

    return (
      <Slide direction="up" in={visible} mountOnEnter unmountOnExit timeout={{ enter: transitionDuration, exit: transitionDuration / 2 }}>

        <Grid container className={classes.root} alignContent="flex-start">

          {(window.location.pathname !== rootUrl + '/' + recordAlgolia.tag) && (
            <Redirect to={rootUrl + '/' + recordAlgolia.tag} />
          )}

          <BannerResizable
            type={'organisation'}
            initialHeight={100}
            style={styles.banner}
          />
          <div className={classes.blackFilter} ></div>

          <Grid container item xs={12} style={{ height: 116 }} alignContent="flex-start" justify="flex-end" className={classes.actions} >
            <ProfileActions canPropose canFilter canEdit={canEdit} recordId={recordWingzy.objectID || recordWingzy._id} handleClose={this.props.handleClose} />
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
      </Slide>
    )
  }
}

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles)(ProfileLayout)
  )
);
