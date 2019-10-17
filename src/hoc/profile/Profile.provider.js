import { ProfileContext } from "./Profile.context";
import * as React from "react";
import ProfileService from '../../services/profile.service';
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";

class ProfileProvider extends React.Component {
  constructor() {
    super();
    this.state = {
      algoliaRecord: null,
      wingzyRecord: null,
      isEditable: false,
      filteredWings: null,
      filterProfile: this.filterProfile,
      setProfileData: this.setProfileData,
      isWingsDisplayed: this.isWingsDisplayed,
      getProp: this.getProp,
      getBaseUrl: this.getBaseUrl,
      wingsByFamilies: [],
      reset: this.reset
    };
  }

  getProp = (propName) => {
    var propValue = (this.state.wingzyRecord ? this.state.wingzyRecord[propName] : null );
    if(!propValue) propValue = (this.state.algoliaRecord ? this.state.algoliaRecord[propName] : null );
    if(!propValue && propName === '_id') return this.getProp('objectID');
    return propValue;
  }

  reset = () => {
    this.setState({
      algoliaRecord: null,
      wingzyRecord: null,
      filteredWings: null,
      wingsByFamilies: []
    });
    this.props.clapStore.reset();
  }

  setProfileData = (recordTag) => {
    let algoliaRecord = JSON.parse(JSON.stringify(this.props.recordStore.getRecord(null, recordTag) || {tag: recordTag}));
    this.setState({algoliaRecord: algoliaRecord, filteredWings: null}, this.setWingzyRecord);
  }

  setWingzyRecord = () => {
    this.buildWingsByFamilies();
    if(!this.props.authStore.isAuth()) return;
    this.props.recordStore.fetchByTag(this.state.algoliaRecord.tag, this.props.orgStore.currentOrganisation._id)
      .then((record) => {
        record.objectID = record._id;

        ProfileService.transformLinks(record);
        ProfileService.makeHightlighted(record);
        ProfileService.orderHashtags(record);

        this.setState({ wingzyRecord: record, isEditable: this.canEdit(record) }, this.buildWingsByFamilies) ;
      }).catch((e) => {
        return;
      });
  }

  canEdit = (workingRecord) => {
    if (!(this.props.userStore.currentUser && this.props.userStore.currentUser._id)) return false;
    if (this.props.userStore.currentUser.superadmin) return true;
    else if (this.props.userStore.currentUser.orgsAndRecords.find(orgAndRecord => (orgAndRecord.record._id || orgAndRecord.record) === workingRecord.objectID)) return true;
    else if (this.props.userStore.currentUser.orgsAndRecords.find(orgAndRecord => (orgAndRecord.organisation._id || orgAndRecord.organisation) === workingRecord.organisation && orgAndRecord.admin)) return true;
    else return false;
  }

  //@todo Nothing to do here, it's a common method
  getBaseUrl = () => {
    return '/' + this.props.commonStore.locale + '/' + this.props.orgStore.currentOrganisation.tag;
  }

  /**
   * @description Create an array of link between : Family and Profile Wings
   */
  buildWingsByFamilies = () => {
    let organisation = this.props.orgStore.currentOrganisation;
    let wingsByFamilies = [], otherWings = [], allWings = [];

    try {
      otherWings = Array.from(this.getProp('hashtags'));
      allWings = Array.from(this.getProp('hashtags'));
    }catch(e) {
      return;
    }

  if(organisation.featuredWingsFamily) organisation.featuredWingsFamily.forEach(family => {
      let familyWings = [];

      for(var index = 0; index < allWings.length; index++) {
        var wing = allWings[index];
        if(wing && wing.hashtags && wing.hashtags.find(hashtag => (hashtag._id || hashtag) === family._id)) {
          familyWings.push(wing);
          otherWings = otherWings.filter(otherWing => otherWing._id !== wing._id);
        }
      }

      if(familyWings.length > 0) wingsByFamilies.push({family: family, wings: familyWings});
    });

    wingsByFamilies.push({family: {intro: this.props.intl.formatMessage({id: 'profile.others'})}, wings: otherWings});

    this.setState({wingsByFamilies: wingsByFamilies});
  }

  isWingsDisplayed = (wingsId) => {
    if(!this.state.filteredWings) return true;
    if(this.state.filteredWings.length === 0 ) return false;

    let res = false;

    this.state.filteredWings.forEach(wing => {
      if( JSON.stringify(wing._id) === JSON.stringify(wingsId)) {
        res = true;
      }
    });
    return res;
  }

  render() {
    return (
      <ProfileContext.Provider
        value={{
          profileContext: {
            ...this.state
          }
        }}
      >
        {this.props.children}
      </ProfileContext.Provider>
    );
  }
}

export default inject('orgStore', 'recordStore', 'userStore', 'commonStore', 'authStore', 'clapStore')(
  observer(injectIntl(ProfileProvider))
  );
