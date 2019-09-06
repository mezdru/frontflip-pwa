import { ProfileContext } from "./Profile.context";
import * as React from "react";
import ProfileService from '../../services/profile.service';
import { inject, observer } from "mobx-react";

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
      getProp: this.getProp
    };
  }

  getProp = (propName) => {
    if(propName === 'hashtags' && this.state.filteredWings) return this.state.filteredWings;
    var propValue = (this.state.wingzyRecord ? this.state.wingzyRecord[propName] : null );
    if(!propValue) propValue = (this.state.algoliaRecord ? this.state.algoliaRecord[propName] : null );
    if(!propValue && propName === '_id') return this.getProp('objectID');
    return propValue;
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

  filterProfile = (wingsId) => {
    if(!wingsId) return this.setState({filteredWings: null});

    let hashtags = this.state.wingzyRecord.hashtags;
    let filteredWings = [];

    hashtags.forEach(wing => {
      if(wing.hashtags && wing.hashtags.find(familyWingId => familyWingId === wingsId)) filteredWings.push(wing);
    });

    this.setState({filteredWings: filteredWings});
  }

  setProfileData = async (algoliaRecord) => {
    algoliaRecord = JSON.parse(JSON.stringify(algoliaRecord));
    ProfileService.transformLinks(algoliaRecord);
    ProfileService.makeHightlighted(algoliaRecord);
    ProfileService.orderHashtags(algoliaRecord);
    await this.setState({algoliaRecord, filteredWings: null});
    await this.setWingzyRecord();
  }

  setWingzyRecord = async () => {
    this.props.recordStore.setRecordTag(this.state.algoliaRecord.tag);
    this.props.recordStore.setOrgId(this.props.organisationStore.values.organisation._id);
    await this.props.recordStore.getRecordByTag()
      .then((record) => {
        record.objectID = record._id;

        ProfileService.transformLinks(record);
        ProfileService.makeHightlighted(record);
        ProfileService.orderHashtags(record);

        this.setState({ wingzyRecord: record, isEditable: this.canEdit(record) });
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

export default inject('organisationStore', 'recordStore', 'userStore')(
  observer(ProfileProvider)
);
