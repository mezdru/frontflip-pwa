import React, { Suspense, PureComponent } from "react";
import { withStyles, Grid } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import withWidth from "@material-ui/core/withWidth";
import ReactGA from "react-ga";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Redirect } from "react-router-dom";
import { observe } from "mobx";
import { animateScroll as scroll } from "react-scroll";
import undefsafe from "undefsafe";

import { styles } from "./SearchPage.css";
import ErrorBoundary from "../components/utils/errors/ErrorBoundary";
import "./SearchPageStyle.css";
import SearchButton from "../components/search/SearchButton";
import { withProfileManagement } from "../hoc/profile/withProfileManagement";
import { getBaseUrl } from "../services/utils.service";
import withAuthorizationManagement from "../hoc/AuthorizationManagement.hoc";

const SearchView = React.lazy(() =>
  import("../components/search/view/SearchView")
);
const ProfileLayout = React.lazy(() =>
  import("../components/profile/ProfileLayout")
);
const BannerResizable = React.lazy(() =>
  import("../components/utils/banner/BannerResizable")
);
const Header = React.lazy(() => import("../components/header/Header"));
const Search = React.lazy(() => import("../components/search/Search"));
const Popups = React.lazy(() => import("./Popups"));

console.debug("Loading SearchPage");

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      top: 16,
      headerHeight: 129,
      headerPosition: "INITIAL",
      visible: false,
      transitionDuration: 800
    };

    this.props.commonStore.setUrlParams(this.props.match);

    // clear wings bank
    this.props.commonStore.setLocalStorage("wingsBank", [], true);
  }

  componentWillUnmount() {
    if (this.unsubFilters) this.unsubFilters();
  }

  componentDidMount() {
    this.moveSearchInputListener();

    this.props.searchStore.decodeFilters(window.location.search);

    if (this.props.match.path.search("congrats") > -1)
      this.setState({ showCongratulation: true });

    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.handleShowSearchResults(200);
        window.history.pushState(
          null,
          window.document.title,
          this.props.searchStore.encodeFilters()
        );
      }
    );

    this.unsubResultsCount = observe(
      this.props.commonStore,
      "searchResultsCount",
      change => {
        this.props.keenStore.recordEvent("search", {
          results: change.newValue,
          filters: [],
          recordEmitter: undefsafe(
            this.props.recordStore.currentUserRecord,
            "_id"
          )
        });
        this.unsubResultsCount();
      }
    );

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

  /**
   * @description Move search block following user scroll
   */
  moveSearchInputListener = () => {
    var contentPart = document.getElementById("content-container");
    var contentMain = document.getElementById("search-button");
    var searchBox = document.getElementById("search-input");
    var shadowedBackground = document.getElementById("shadowed-background");

    contentPart.addEventListener("scroll", e =>
      this.moveSearchInput(
        contentPart,
        contentMain,
        searchBox,
        shadowedBackground
      )
    );
    window.addEventListener("resize", e =>
      this.moveSearchInput(
        contentPart,
        contentMain,
        searchBox,
        shadowedBackground
      )
    );
  };

  moveSearchInput = (
    contentPart,
    contentMain,
    searchBox,
    shadowedBackground
  ) => {
    var contentShape = contentMain.getBoundingClientRect();
    var contentTop = contentShape.top;
    let newTopValue = Math.min(
      Math.max(contentTop - this.state.headerHeight + 16, 16),
      window.innerHeight * 0.4
    );

    searchBox.style.top = newTopValue + "px";
    shadowedBackground.style.opacity =
      Math.min(
        1,
        contentPart.scrollTop / (window.innerHeight - this.state.headerHeight)
      ) * 0.6;

    if (newTopValue <= this.state.top) this.handleMenuButtonMobileDisplay(true);
    else if (newTopValue >= this.state.top + 8)
      this.handleMenuButtonMobileDisplay(false);
  };

  handleMenuButtonMobileDisplay = isInSearch => {
    var searchField = document.getElementById("search-container");
    var headerButton = document.getElementById("header-button");

    if (!searchField || !headerButton) return;

    if (
      this.props.width === "xs" &&
      isInSearch &&
      this.state.headerPosition === "INITIAL"
    ) {
      searchField.style.paddingLeft = 48 + "px";
      headerButton.style.top = 20 + "px";
      headerButton.style.height = 40 + "px";
      headerButton.style.width = 40 + "px";
      headerButton.style.minWidth = 0 + "px";
      headerButton.style.left = 20 + "px";
      this.setState({ headerPosition: "INSIDE" });
    } else if (!isInSearch && this.state.headerPosition !== "INITIAL") {
      searchField.style.paddingLeft = 0 + "px";
      headerButton.style.top = 16 + "px";
      headerButton.style.height = 48 + "px";
      headerButton.style.width = 48 + "px";
      headerButton.style.left = 16 + "px";
      this.setState({ headerPosition: "INITIAL" });
    }
  };

  /**
   * @description Scroll to search results part.
   */
  handleShowSearchResults = offset => {
    var contentPart = document.getElementById("content-container");
    if (!contentPart) return;
    var scrollMax = Math.min(
      contentPart.scrollHeight,
      window.innerHeight - 120
    );
    scroll.scrollTo(scrollMax, {
      duration: this.state.transitionDuration,
      smooth: "easeInOutCubic",
      containerId: "content-container",
      offset: offset || 0,
      delay: 200 // @todo : wait that search results is updated before launch scroll / remove this static delay
    });
  };

  componentDidUpdate() {
    if (this.state.redirectTo === window.location.pathname) {
      this.setState({ redirectTo: null });
    }
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

  render() {
    const { redirectTo, visible, transitionDuration } = this.state;
    const { classes } = this.props;

    return (
      <>
        {redirectTo && window.location.pathname !== redirectTo && (
          <Redirect push to={redirectTo} />
        )}
        <Suspense fallback={<></>}>
          <Header withProfileLogo />
        </Suspense>

        <main className={"search-container"}>
          <Suspense
            fallback={
              <div style={{ position: "absolute", height: "100vh" }}></div>
            }
          >
            <BannerResizable
              type={"organisation"}
              initialHeight={100}
              style={{ position: "absolute" }}
            />
          </Suspense>

          <div
            id="shadowed-background"
            className={classes.shadowedBackground}
          />

          {/* Search box - Search field & Search suggestions */}
          <div className={"search-input"} id="search-input">
            <Grid container justify="center">
              <Grid
                item
                xs={12}
                sm={8}
                md={6}
                lg={4}
                className={classes.searchMobileView}
              >
                <ErrorBoundary>
                  <Search />
                </ErrorBoundary>
              </Grid>
            </Grid>
          </div>

          <div className={"search-content-container"} id="content-container">
            <div className={"search-content-offset"} />
            <div className={"search-button"} id="search-button">
              <SearchButton onClick={this.handleShowSearchResults} />
            </div>

            {/* Search results part */}
            <div className={"search-content"} style={{ position: "relative" }}>
              <ErrorBoundary>
                <Grid
                  container
                  direction={"column"}
                  justify={"space-around"}
                  alignItems={"center"}
                >
                  <Suspense fallback={<CircularProgress color="secondary" />}>
                    <SearchView />
                  </Suspense>
                </Grid>
              </ErrorBoundary>
            </div>
          </div>
        </main>

        <Suspense fallback={<></>}>
          <ProfileLayout
            visible={visible}
            handleClose={this.handleCloseProfile}
            transitionDuration={transitionDuration}
          />
        </Suspense>

        <Suspense fallback={<></>}>
          <Popups />
        </Suspense>
      </>
    );
  }
}

SearchPage = withAuthorizationManagement(
  withProfileManagement(SearchPage),
  "search"
);

export default inject(
  "commonStore",
  "orgStore",
  "authStore",
  "userStore",
  "recordStore",
  "keenStore",
  "searchStore"
)(observer(withWidth()(withStyles(styles)(SearchPage))));
