import React, { Suspense } from "react";
import { withStyles, Grid, Slide, CircularProgress } from "@material-ui/core";
import { inject, observer } from "mobx-react";

import ProfileThumbnail from "./ProfileThumbnail";
import BannerResizable from "../utils/banner/BannerResizable";
import ProfileWings from "./ProfileWings";
import ProfileActions from "./ProfileActions";
import { styles } from "./ProfileLayout.css";
import SkillsPropositionFab from "../utils/buttons/SkillsPropositionFab";
import { observe } from "mobx";
import ErrorBoundary from "../utils/errors/ErrorBoundary";

const ProfileClapHistory = React.lazy(() => import("./ProfileClapHistory"));
const AcceptSkills = React.lazy(() =>
  import("../utils/popup/SkillsProposition/AcceptSkills")
);
const ProposeSkills = React.lazy(() =>
  import("../utils/popup/SkillsProposition/ProposeSkills")
);

class ProfileLayout extends React.Component {
  static whyDidYouRender = true;

  state = {
    showProposeSkills: false,
    showManageProposedSkills: false
  };

  handleShowProposeSkills = () => {
    this.setState({ showProposeSkills: true });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
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

  render() {
    const { classes, visible, transitionDuration } = this.props;
    const { showProposeSkills } = this.state;
    const { url } = this.props.commonStore;

    return (
      <Slide
        direction="up"
        in={visible}
        // unmountOnExit
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

              <Grid item xs={12} lg={4} className={classes.clapHistory}>
                {visible && (
                  <Suspense fallback={<CircularProgress color="secondary" />}>
                    <ProfileClapHistory />
                  </Suspense>
                )}
              </Grid>
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
  "recordStore"
)(observer(withStyles(styles, { withTheme: true })(ProfileLayout)));
