import { ProfileContext } from "./Profile.context";
import * as React from "react";
import ProfileService from "../../services/profile.service";
import { inject, observer } from "mobx-react";
import { injectIntl } from "react-intl";
import undefsafe from "undefsafe";

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
      buildWingsByFamilies: this.buildWingsByFamilies,
      getProp: this.getProp,
      getBaseUrl: this.getBaseUrl,
      wingsByFamilies: [],
      reset: this.reset
    };
  }

  getProp = propName => {
    var propValue = this.state.wingzyRecord
      ? this.state.wingzyRecord[propName]
      : null;
    if (!propValue)
      propValue = this.state.algoliaRecord
        ? this.state.algoliaRecord[propName]
        : null;
    if (!propValue && propName === "_id") return this.getProp("objectID");
    return propValue;
  };

  reset = () => {
    this.setState({
      algoliaRecord: null,
      wingzyRecord: null,
      filteredWings: null,
      wingsByFamilies: []
    });
    this.props.clapStore.reset();
  };

  setProfileData = recordTag => {
    let algoliaRecord = JSON.parse(
      JSON.stringify(
        this.props.recordStore.getRecord(null, recordTag) || { tag: recordTag }
      )
    );
    this.setState(
      { algoliaRecord: algoliaRecord, filteredWings: null },
      this.setWingzyRecord
    );
  };

  setWingzyRecord = () => {
    this.buildWingsByFamilies();
    if (!this.props.authStore.isAuth()) {
      this.props.keenStore.recordEvent("view", {
        page: "profile",
        recordEmitter: null,
        recordTarget:
          this.state.algoliaRecord.objectID || this.state.algoliaRecord.tag
      });
      // return;
    }
    this.props.recordStore
      .fetchByTag(
        this.state.algoliaRecord.tag,
        this.props.orgStore.currentOrganisation._id
      )
      .then(record => {
        if (this.props.authStore.isAuth())
          this.props.keenStore.recordEvent("view", {
            page: "profile",
            recordEmitter: undefsafe(
              this.props.recordStore.currentUserRecord,
              "_id"
            ),
            recordTarget: record._id
          });

        record.objectID = record._id;

        ProfileService.transformLinks(record);
        ProfileService.makeHightlighted(record);
        ProfileService.orderHashtags(record);

        this.setState(
          { wingzyRecord: record, isEditable: this.canEdit(record) },
          this.buildWingsByFamilies
        );
      })
      .catch(e => {
        console.error(e);
        return;
      });
  };

  canEdit = workingRecord => {
    const { currentUser, currentOrgAndRecord } = this.props.userStore;
    if (!(currentUser && currentUser._id)) return false;
    if (currentUser.superadmin) return true;
    else if (
      currentUser.orgsAndRecords.find(
        oar =>
          oar.record &&
          (oar.record._id || oar.record) === workingRecord.objectID
      )
    )
      return true;
    else if (
      currentUser.orgsAndRecords.find(
        oar =>
          (oar.organisation._id || oar.organisation) ===
            workingRecord.organisation && oar.admin
      )
    )
      return true;
    else if (
      currentOrgAndRecord.secondaryRecords &&
      currentOrgAndRecord.secondaryRecords.find(
        sr => (sr._id || sr) === workingRecord._id
      )
    )
      return true;
    else return false;
  };

  //@todo Nothing to do here, it's a common method
  getBaseUrl = () => {
    return (
      "/" +
      this.props.commonStore.locale +
      "/" +
      this.props.orgStore.currentOrganisation.tag
    );
  };

  /**
   * @description Create an array of link between : Family and Profile Wings
   */
  buildWingsByFamilies = hashtags => {
    let organisation = this.props.orgStore.currentOrganisation;
    let wingsByFamilies = [],
      otherWings = [],
      allWings = [];

    try {
      if (!hashtags) {
        otherWings = Array.from(this.getProp("hashtags"));
        allWings = Array.from(this.getProp("hashtags"));
      } else {
        otherWings = hashtags;
        allWings = hashtags;
      }
    } catch (e) {
      return;
    }

    if (undefsafe(organisation, 'settings.wings.families.length'))
      organisation.settings.wings.families.forEach(family => {
        let familyWings = [];

        for (var index = 0; index < allWings.length; index++) {
          var wing = allWings[index];
          if (
            wing &&
            wing.hashtags &&
            wing.hashtags.find(
              hashtag => (hashtag._id || hashtag) === family._id
            )
          ) {
            familyWings.push(wing);
            otherWings = otherWings.filter(
              otherWing => otherWing._id !== wing._id
            );
          }
        }

        if (familyWings.length > 0)
          wingsByFamilies.push({ family: family, wings: familyWings });
      });

    wingsByFamilies.push({
      family: {
        intro: this.props.intl.formatMessage({ id: "profile.others" })
      },
      wings: otherWings
    });

    this.setState({ wingsByFamilies: wingsByFamilies });
  };

  isWingsDisplayed = wingsId => {
    if (!this.state.filteredWings) return true;
    if (this.state.filteredWings.length === 0 || !wingsId) return false;

    let res = false;

    this.state.filteredWings.forEach(wing => {
      if (JSON.stringify(wing._id) === JSON.stringify(wingsId)) {
        res = true;
      }
    });
    return res;
  };

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

export default inject(
  "orgStore",
  "recordStore",
  "userStore",
  "commonStore",
  "authStore",
  "clapStore",
  "keenStore"
)(observer(injectIntl(ProfileProvider)));
