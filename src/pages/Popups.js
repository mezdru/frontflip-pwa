import React, { Suspense } from "react";
import AskForHelpFab from "../components/utils/buttons/AskForHelpFab";
import undefsafe from "undefsafe";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";

const Intercom = React.lazy(() => import("react-intercom"));
const NotifyLatestAuth = React.lazy(() =>
  import("../components/utils/popup/NotifyLatestAuth")
);
const OnboardCongratulation = React.lazy(() =>
  import("../components/utils/popup/OnboardCongratulation")
);
const PromptIOsInstall = React.lazy(() =>
  import("../components/utils/popup/PromptIOsInstall")
);
const AskForHelp = React.lazy(() =>
  import("../components/utils/popup/AskForHelp")
);
const AddWingPopup = React.lazy(() =>
  import("../components/utils/popup/AddWingPopup")
);

const styles = theme => ({
  fab: {
    position: "fixed",
    bottom: 32,
    right: 32,
    zIndex: 1000,
    width: 64,
    height: 64,
    [theme.breakpoints.down("xs")]: {
      bottom: 16,
      right: 16,
      width: 56,
      height: 56
    }
  }
});

class Popups extends React.Component {
  state = {
    showAddWings: false,
    showAskForHelp: false
  };

  isCongrats = () => window.location.pathname.search("congrats") > -1;

  handleDisplayAskForHelp = () => {
    this.setState({ showAskForHelp: false }, () => {
      this.setState({ showAskForHelp: true });
    });
  };

  render() {
    const { currentOrganisation } = this.props.orgStore;
    const { filters } = this.props.searchStore.values;
    const { searchResultsCount } = this.props.commonStore;
    const { showAskForHelp } = this.state;
    const { classes } = this.props;

    let latestConnectionClosed = this.props.commonStore.getCookie(
      "latestConnectionClosed"
    );

    return (
      <>
        <Suspense fallback={<></>}>
          <PromptIOsInstall />
        </Suspense>

        {!latestConnectionClosed && (
          <Suspense fallback={<></>}>
            <NotifyLatestAuth />
          </Suspense>
        )}

        {this.isCongrats() && (
          <Suspense fallback={<></>}>
            <OnboardCongratulation isOpen={true} />
          </Suspense>
        )}

        <Suspense fallback={<></>}>
          <AskForHelp isOpen={showAskForHelp} />
        </Suspense>

        {this.props.authStore.isAuth() &&
          currentOrganisation &&
          currentOrganisation.tag !== "demo" && (
            <AskForHelpFab
              className={classes.fab}
              onClick={this.handleDisplayAskForHelp}
              highlighted={
                filters && filters.length > 0 && searchResultsCount <= 10
              }
            />
          )}

        {currentOrganisation && !this.props.authStore.isAuth() && (
          <Suspense fallback={<></>}>
            <Intercom appID={"k7gprnv3"} />
          </Suspense>
        )}
        {currentOrganisation &&
          currentOrganisation.tag === "demo" &&
          this.props.authStore.isAuth() && (
            <Suspense fallback={<></>}>
              <Intercom
                appID={"k7gprnv3"}
                user_id={undefsafe(this.props.userStore.currentUser, "_id")}
                name={undefsafe(
                  this.props.recordStore.currentUserRecord,
                  "name"
                )}
                email={
                  undefsafe(this.props.userStore.currentUser, "email.value") ||
                  undefsafe(this.props.userStore.currentUser, "google.email")
                }
              />
            </Suspense>
          )}
      </>
    );
  }
}

export default inject(
  "authStore",
  "commonStore",
  "orgStore",
  "recordStore",
  "userStore",
  "searchStore"
)(observer(withStyles(styles)(Popups)));
