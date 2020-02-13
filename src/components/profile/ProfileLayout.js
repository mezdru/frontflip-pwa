import React, { Suspense } from "react";
import { withStyles, Grid, Slide, CircularProgress } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import undefsafe from "undefsafe";

import ProfileThumbnail from "./ProfileThumbnail";
import BannerResizable from "../utils/banner/BannerResizable";
import ProfileWings from "./ProfileWings";
import ProfileActions from "./ProfileActions";
import { styles } from "./ProfileLayout.css";
import SkillsPropositionFab from "../utils/buttons/SkillsPropositionFab";
import ErrorBoundary from "../utils/errors/ErrorBoundary";
import { withProfile } from "../../hoc/profile/withProfile";

const ProfileClapHistory = React.lazy(() => import("./ProfileClapHistory"));
const AcceptSkills = React.lazy(() =>
  import("../utils/popup/SkillsProposition/AcceptSkills")
);
const ProposeSkills = React.lazy(() =>
  import("../utils/popup/SkillsProposition/ProposeSkills")
);

class ProfileLayout extends React.Component {

  state = {
    showProposeSkills: false,
    showManageProposedSkills: false
  };

  handleShowProposeSkills = () => {
    this.props.keenStore.recordEvent("openProposeSkills", {
      recordEmitter: undefsafe(this.props.recordStore.currentUserRecord, "_id"),
      recordTarget: this.props.profileContext.getProp("_id")
    });
    this.setState({ showProposeSkills: true });
  };

  componentWillReceiveProps(nextProps) {
    if (
      this.props.visible !== nextProps.visible &&
      this.state.showProposeSkills
    ) {
      this.setState({
        showProposeSkills: false
      });
    }
  }

  isMyProfile = () => {
    return (
      this.props.recordStore.currentUserRecord &&
      this.props.commonStore.url.params.recordTag &&
      this.props.commonStore.url.params.recordTag ===
        this.props.recordStore.currentUserRecord.tag
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      nextProps.visible === this.props.visible &&
      JSON.stringify(nextState) === JSON.stringify(this.state)
    )
      return false;
    return true;
  }

  render() {
    const { classes, visible, transitionDuration } = this.props;
    const { showProposeSkills } = this.state;
    const { url } = this.props.commonStore;
    const { currentOrganisation } = this.props.orgStore;

    return (
      <Slide
        direction="up"
        in={visible}
        timeout={{ enter: transitionDuration, exit: transitionDuration / 2 }}
      >
        <Grid container className={classes.root} alignContent="flex-start">
          <BannerResizable
            type={"profile"}
            initialHeight={100}
            style={styles.banner}
          />
          <div className={classes.blackFilter}></div>

          <Grid
            container
            alignContent="flex-start"
            style={{ height: "100vh", overflowY: "auto", zIndex: 1 }}
          >
            <Grid
              container
              item
              xs={12}
              style={{ height: 116 }}
              alignContent="flex-start"
              justify="flex-start"
              className={classes.actions}
            >
              <ProfileActions
                canPropose
                canFilter
                handleClose={this.props.handleClose}
              />
            </Grid>
            <Grid item className={classes.thumbnail} xs={12} lg={3}>
              <ProfileThumbnail />
            </Grid>
            <Grid
              container
              item
              className={classes.content}
              xs={12}
              lg={9}
              alignContent="flex-start"
            >
              <Grid item xs={12} lg={8} className={classes.wings}>
                <ProfileWings />
              </Grid>

              {undefsafe(currentOrganisation, "features.claps") === true && (
                <Grid item xs={12} lg={4} className={classes.clapHistory}>
                  {visible && (
                    <Suspense fallback={<CircularProgress color="secondary" />}>
                      <ProfileClapHistory />
                    </Suspense>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>

          {this.props.authStore.isAuth() && !this.isMyProfile() && (
            <SkillsPropositionFab
              className={classes.skillsPropositionFab}
              onClick={this.handleShowProposeSkills}
            />
          )}

          {showProposeSkills && !this.isMyProfile() && (
            <ErrorBoundary>
              <Suspense fallback={<></>}>
                <ProposeSkills
                  isOpen={showProposeSkills}
                  style={{ zIndex: 99999 }}
                />
              </Suspense>
            </ErrorBoundary>
          )}

          {url.params.action === "skillsProposition" &&
            url.params.actionId &&
            this.isMyProfile() && (
              <ErrorBoundary>
                <Suspense fallback={<></>}>
                  <AcceptSkills
                    skillsPropositionId={url.params.actionId}
                    isOpen={true}
                    style={{ zIndex: 99999 }}
                  />
                </Suspense>
              </ErrorBoundary>
            )}
        </Grid>
      </Slide>
    );
  }
}

export default inject(
  "commonStore",
  "authStore",
  "recordStore",
  "orgStore",
  "keenStore"
)(
  observer(withStyles(styles, { withTheme: true })(withProfile(ProfileLayout)))
);
