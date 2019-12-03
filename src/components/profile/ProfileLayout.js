import React, { Suspense } from "react";
import { withStyles, Grid, Slide, CircularProgress } from "@material-ui/core";
import { inject, observer } from "mobx-react";

import ProfileThumbnail from "./ProfileThumbnail";
import BannerResizable from "../utils/banner/BannerResizable";
import ProfileWings from "./ProfileWings";
import ProfileActions from "./ProfileActions";
import { styles } from "./ProfileLayout.css";
import { withProfileManagement } from "../../hoc/profile/withProfileManagement";
import SkillsPropositionFab from "../utils/buttons/SkillsPropositionFab";

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
    this.setState({ showProposeSkills: true });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.setState({
        showProposeSkills: false
      });
    }
  }

  render() {
    const { classes, visible, transitionDuration } = this.props;
    const { showProposeSkills } = this.state;
    const { url } = this.props.commonStore;

    console.log("", this.state);

    return (
      <Slide
        direction="up"
        in={visible}
        mountOnEnter
        unmountOnExit
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

          <SkillsPropositionFab
            className={classes.skillsPropositionFab}
            onClick={this.handleShowProposeSkills}
          />

          {showProposeSkills && (
            <Suspense fallback={<></>}>
              <ProposeSkills
                isOpen={showProposeSkills}
                style={{ zIndex: 99999 }}
              />
            </Suspense>
          )}

          {url.params.action === "skillsProposition" && url.params.actionId && (
            <Suspense fallback={<></>}>
              <AcceptSkills
                skillsPropositionId={url.params.actionId}
                isOpen={true}
                style={{ zIndex: 99999 }}
              />
            </Suspense>
          )}
        </Grid>
      </Slide>
    );
  }
}

export default inject(
  "commonStore",
  "orgStore",
  "authStore",
  "recordStore",
  "userStore"
)(observer(withStyles(styles)(withProfileManagement(ProfileLayout))));
