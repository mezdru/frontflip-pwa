import React, { Suspense } from "react";
import { inject, observer } from "mobx-react";
import { withStyles, Grid } from "@material-ui/core";
import undefsafe from "undefsafe";

import { styles } from "./ListResults.css";
import Card from "../../card/CardProfile";
import InvitationDialog from "../../utils/popup/Invitation";

const SearchShowMore = React.lazy(() => import("../SearchShowMore"));
const SearchNoResults = React.lazy(() => import("../SearchNoResults"));

class ListResults extends React.Component {

  componentDidMount() {
    this.createScrollObserver();
  }

  showMore = () => {
    if (!undefsafe(this.props.orgStore.currentAlgoliaKey, "initialized"))
      return;
    this.props.fetchHits(this.props.searchStore.values.filters, this.props.page + 1, true)
  };

  createScrollObserver = () => {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.props.noMore) {
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
    let hitsResult = Array.from(hits);

    return (
      <div className={classes.hitList}>
        <ul>
          {hitsResult.map((hit, i) => {
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
        </ul>
      </div>
    );
  }
}

export default inject(
  "searchStore",
  "orgStore"
)(observer(withStyles(styles)(ListResults)));
