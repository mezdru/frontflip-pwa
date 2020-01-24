import React, { Suspense } from "react";
import { Redirect } from "react-router-dom";
import { inject, observer } from "mobx-react";
import { observe } from "mobx";
import ReactGA from "react-ga";

import "../components/profile/ContactsColors.css";
import SearchPage from "./SearchPage";
import { withProfile } from "../hoc/profile/withProfile";
import { getBaseUrl } from "../services/utils.service";

const ProfileLayout = React.lazy(() =>
  import("../components/profile/ProfileLayout")
);
const Popups = React.lazy(() => import("./Popups"));

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectTo: null,
      visible: false,
    };
    this.props.commonStore.setUrlParams(this.props.match);
  }

  componentWillUnmount() {
    if (this.unsubscribeRecordTag) this.unsubscribeRecordTag();
  }

  componentDidMount() {
    if (this.props.commonStore.url.params.recordTag) {
      this.handleDisplayProfile(
        null,
        this.props.commonStore.url.params.recordTag
      );
    }

    this.unsubscribeRecordTag = observe(
      this.props.commonStore.url,
      "params",
      change => {
        if (
          change.oldValue.recordTag !== change.newValue.recordTag &&
          change.newValue.recordTag
        ) {
          this.handleDisplayProfile(null, change.newValue.recordTag);
        }
        if (!change.newValue.recordTag && change.oldValue.recordTag)
          this.handleCloseProfile();
      }
    );
  }

  handleDisplayProfile = (e, recordTag) => {
    ReactGA.event({ category: "User", action: "Display profile" });
    this.props.profileContext.setProfileData(recordTag);
    let pathNameExploded = window.location.pathname.split("/");
    let redirectTo =
      pathNameExploded.some(elt => elt === recordTag) &&
      this.props.commonStore.url.params.action
        ? null
        : getBaseUrl(this.props) +
          "/" +
          recordTag +
          this.props.searchStore.encodeFilters();
    this.setState({ visible: true, redirectTo: redirectTo });
  };

  handleCloseProfile = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.props.profileContext.reset();
      this.setState({
        redirectTo:
          getBaseUrl(this.props) + this.props.searchStore.encodeFilters()
      });
    }, (this.state.transitionDuration / 2) * 0.9);
  };

  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }

  componentDidUpdate() {
    if (this.state.redirectTo && this.state.redirectTo === window.location.pathname) {
      this.setState({ redirectTo: null });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(JSON.stringify(nextState) !== JSON.stringify(this.state) && !(!nextState.redirectTo && this.state.redirectTo)) return true;
    return false;
  }

  render() {
    const { redirectTo, visible } = this.state;

    return (
      <>
        {redirectTo && window.location.pathname !== redirectTo && (
          <Redirect push to={redirectTo} />
        )}

        <SearchPage />

        <Suspense fallback={<></>}>
          <ProfileLayout
            visible={visible}
            handleClose={this.handleCloseProfile}
            transitionDuration={600}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <Popups />
        </Suspense>
      </>
    );
  }
}

export default inject(
  "commonStore",
  "orgStore",
  "searchStore"
)(observer(withProfile(MainPage)));
