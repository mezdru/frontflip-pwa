import React, { Suspense } from "react";
import { inject, observer } from "mobx-react";
import { withStyles, Grid, CircularProgress } from "@material-ui/core";
import undefsafe from "undefsafe";

import { styles } from "./ListResults.css";
import Card from "../../card/CardProfile";
import InvitationDialog from "../../utils/popup/Invitation";
import { observe } from "mobx";

const SearchShowMore = React.lazy(() => import("../SearchShowMore"));
const SearchNoResults = React.lazy(() => import("../SearchNoResults"));

class ListResults extends React.Component {
  state = {
    hitsPerPage: 10,
    displayedPage: 0 // page used by render only
  };

  componentWillUnmount() {
    if (this.unsubFilters) this.unsubFilters();
  }

  componentDidMount() {
    setTimeout(this.createScrollObserver, 100);

    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.setState({ displayedPage: 0 });
      }
    );
  }

  showMore = () => {
    if (!undefsafe(this.props.orgStore.currentAlgoliaKey, "initialized"))
      return;

    // Load other results 2 pages before the limit
    if (
      (this.state.displayedPage + 3) * this.state.hitsPerPage >=
        this.props.hits.length &&
      !this.props.noMore
    ) {
      this.props.fetchHits(
        this.props.searchStore.values.filters,
        this.props.page + 1,
        true
      );
    }

    this.setState({
      displayedPage: this.state.displayedPage + 1
    });
  };

  createScrollObserver = () => {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.showMore();
          }
        });
      });

      let hitList = document.getElementById("algolia-sentinel");
      observer.observe(hitList);
    } catch (e) {
      console.log(e);
    }
  };

  render() {
    const { hits, loading, noMore, noResult } = this.props;
    const { classes } = this.props;
    const { hitsPerPage, displayedPage } = this.state;

    const hitsDisplayed = Array.from(
      hits.slice(0, (displayedPage + 1) * hitsPerPage)
    );

    return (
      <div className={classes.hitList}>
        <ul>
          {hitsDisplayed.map((hit, i) => {
            return (
              <li key={hit.objectID}>
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={6}
                  lg={4}
                  className={classes.cardMobileView}
                >
                  <Card hit={hit} />
                </Grid>
              </li>
            );
          })}
          <div id="algolia-sentinel" className={classes.sentinel}></div>

          {!noMore && (
            <li>
              <Suspense fallback={<></>}>
                <SearchShowMore
                  loadInProgress={loading}
                  handleShowMore={this.showMore}
                />
              </Suspense>
            </li>
          )}

          {noResult && (
            <Suspense fallback={<></>}>
              <SearchNoResults />
            </Suspense>
          )}

          {loading ? (
            <Grid item className={classes.horizontalCenter}>
              <CircularProgress color="secondary" />
            </Grid>
          ) : (
            <Grid
              item
              xs={12}
              sm={8}
              md={6}
              lg={4}
              className={classes.cardMobileView}
              style={{ left: 0, right: 0, margin: "auto" }}
            >
              <InvitationDialog />
            </Grid>
          )}
        </ul>
      </div>
    );
  }
}

export default inject(
  "searchStore",
  "orgStore"
)(observer(withStyles(styles)(ListResults)));
