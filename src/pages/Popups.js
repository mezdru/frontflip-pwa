import React, { Suspense } from "react";
import AskForHelpFab from "../components/utils/buttons/AskForHelpFab";
import undefsafe from "undefsafe";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core";
import classNames from "classnames";

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
    bottom: 16,
    right: 56 + 32,
    height: 56,
    borderRadius: 28,
    zIndex: 1000,
    [theme.breakpoints.down("xs")]: {
      display: "none", // temporary
      bottom: 16,
      left: 16
    }
  },
  fabAlone: {
    right: 16
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

        {this.props.authStore.isAuth() &&
          currentOrganisation &&
          undefsafe(currentOrganisation, "features.askForHelp") !== false && (
            <>
              <Suspense fallback={<></>}>
                <AskForHelp isOpen={showAskForHelp} />
              </Suspense>
              <AskForHelpFab
                className={classNames(
                  classes.fab,
                  undefsafe(currentOrganisation, "features.map")
                    ? null
                    : classes.fabAlone
                )}
                onClick={this.handleDisplayAskForHelp}
                highlighted={
                  filters && filters.length > 0 && searchResultsCount <= 10
                }
              />
            </>
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
