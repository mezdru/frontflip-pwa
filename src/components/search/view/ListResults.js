import React, { Suspense } from "react";
import { inject, observer } from "mobx-react";
import { withStyles, Grid } from "@material-ui/core";
import undefsafe from "undefsafe";

import AlgoliaService from "../../../services/algolia.service";
import { styles } from "./ListResults.css";
import Card from "../../card/CardProfile";
import InvitationDialog from "../../utils/popup/Invitation";
import { observe } from "mobx";

const SearchShowMore = React.lazy(() => import("../SearchShowMore"));
const SearchNoResults = React.lazy(() => import("../SearchNoResults"));
const DEFAULT_FILTER = { type: "type", value: "person" };

class ListResults extends React.Component {
  state = {
    hits: [],
    page: 0,
    noResult: false,
    loading: true,
    noMore: false
  };

  componentWillUnmount() {
    if(this.unsubFilters) this.unsubFilters();
  }

  componentDidMount() {
    this.fetchHits(this.props.searchStore.values.filters);

    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.setState({ page: 0 }, () => {
          this.fetchHits(this.props.searchStore.values.filters, this.state.page);
        });

        this.props.keenStore.recordEvent("search", {
          results: this.props.commonStore.searchResultsCount,
          filters: JSON.parse(JSON.stringify(this.props.searchStore.values.filters)),
          recordEmitter: undefsafe(
            this.props.recordStore.currentUserRecord,
            "_id"
          )
        });
      }
    );

    this.createScrollObserver();
  }

  fetchHits = async (filters, page) => {
    try {
      let res = await AlgoliaService.fetchHits(
        [DEFAULT_FILTER].concat(filters),
        null,
        page,
        true,
        5
      );

      if (!res) return;

      // Handle no result
      if ((!res.hits || res.hits.length === 0) && (!page || page === 0))
        this.setState({ noResult: true, noMore: true });
      else this.setState({ noResult: false });

      // Update search results count
      console.log(res.nbHits);
      this.props.commonStore.searchResultsCount = res.nbHits;
      console.log('after set')

      // Handle page is the last page ?
      if (res.page >= res.nbPages - 1) this.setState({ noMore: true });
      else if (res.nbPages > 1) this.setState({ noMore: false });

      if (page) {
        this.setState(
          { hits: this.state.hits.concat(res.hits) },
          this.endHitsLoad
        );
      } else {
        let hits = Array.from(res.hits);
        this.setState({ hits: hits }, this.endHitsLoad);
      }
    } catch (e) {
      console.error('ListResults.js - fetchHits', {filters: JSON.parse(JSON.stringify(filters)), page});
      console.error(e);
      this.setState({ hits: []});
    }
  };

  endHitsLoad = () => this.setState({ loading: false });

  showMore = () => {
    if (!undefsafe(this.props.orgStore.currentAlgoliaKey, "initialized"))
      return;
    this.setState({ page: this.state.page + 1, loading: true }, () =>
      this.fetchHits(this.props.searchStore.values.filters, this.state.page)
    );
  };

  createScrollObserver = () => {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.state.noMore) {
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
    const { hits, loading, noMore, noResult } = this.state;
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
  "commonStore",
  "searchStore",
  "keenStore",
  "recordStore",
  "orgStore"
)(observer(withStyles(styles)(ListResults)));
