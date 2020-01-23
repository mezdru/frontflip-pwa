import React, { Suspense, lazy } from "react";
import {
  Grid,
  withStyles,
  CircularProgress,
  withWidth,
  Fab
} from "@material-ui/core";
import { observe } from "mobx";
import undefsafe from "undefsafe";
import { inject, observer } from "mobx-react";
import ErrorBoundary from "../components/utils/errors/ErrorBoundary";
import Search from "../components/search/Search";
import { styles } from "./SearchPage.css";
import { getParsedUrlQuery } from "../services/utils.service";
import SearchButton from "../components/search/SearchButton";
import withAuthorization from "../hoc/withAuthorization.hoc";
import { withProfile } from "../hoc/profile/withProfile";
import withScroll from "../hoc/withScroll.hoc";
import { Map, List } from "@material-ui/icons";

const SearchResults = lazy(() =>
  import("../components/search/view/SearchResults")
);
const BannerResizable = lazy(() =>
  import("../components/utils/banner/BannerResizable")
);
const Header = lazy(() => import("../components/header/Header"));

const VIEW_LIST = "list";
const VIEW_MAP = "map";

class SearchPage extends React.Component {
  state = {
    view: VIEW_LIST
  };

  componentDidMount() {
    this.setState({ view: getParsedUrlQuery().view || VIEW_LIST });
    this.props.searchPage.listenSearchScroll(129, this.props.width);

    this.props.searchStore.decodeFilters(window.location.search);

    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.props.searchPage.easeToSearchResults(200, 800);
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
        try {
          this.props.keenStore.recordEvent("search", {
            results: change.newValue,
            filters: [],
            recordEmitter: undefsafe(
              this.props.recordStore.currentUserRecord,
              "_id"
            )
          });
          this.unsubResultsCount();
        } catch (e) {
          console.error("SearchPage.js - observe results count");
          console.error(e);
        }
      }
    );
  }

  componentWillUnmount() {
    if (this.unsubFilters) this.unsubFilters();
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.view !== this.state.view) return true;
    return false;
  }

  switchView = () => {
    this.setState({
      view: this.state.view === VIEW_LIST ? VIEW_MAP : VIEW_LIST
    });
  };

  render() {
    const { classes, searchPage } = this.props;
    const { view } = this.state;
    const { currentOrganisation } = this.props.orgStore;

    return (
      <>
        <Suspense fallback={<></>}>
          <Header
            withProfileLogo
            forceInside={view === VIEW_MAP && this.props.width === "xs"}
          />
        </Suspense>

        <main className={classes.searchContainer}>
          <>
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
          </>

          <div
            className={
              view === VIEW_LIST
                ? classes.searchInputList
                : classes.searchInputMap
            }
            id="search-input"
          >
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

          <div
            className={classes.searchContentContainer}
            id="content-container"
          >
            <>
              <div className={classes.searchContentOffset} />
              <div className={classes.searchCountButton} id="search-button">
                <SearchButton onClick={searchPage.easeToSearchResults} />
              </div>
            </>

            {/* Search results part */}
            <div className={classes.searchContentList}>
              <ErrorBoundary>
                <Suspense fallback={<CircularProgress color="secondary" />}>
                  <SearchResults view={view} switchView={this.switchView} />
                </Suspense>
              </ErrorBoundary>
            </div>

            {undefsafe(currentOrganisation, "features.map") && (
              <Fab
                onClick={this.switchView}
                className={classes.viewCTA}
                color="secondary"
              >
                {view === VIEW_LIST ? (
                  <Map fontSize="large" />
                ) : (
                  <List fontSize="large" />
                )}
              </Fab>
            )}
          </div>
        </main>
      </>
    );
  }
}

export default inject(
  "keenStore",
  "searchStore",
  "recordStore",
  "orgStore"
)(
  observer(
    withWidth()(
      withStyles(styles)(
        withAuthorization(withProfile(withScroll(SearchPage)), "search")
      )
    )
  )
);
