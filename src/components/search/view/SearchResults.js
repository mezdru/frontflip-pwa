import React, { Suspense } from "react";
import { CircularProgress, Grid } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import AlgoliaService from "../../../services/algolia.service";
import undefsafe from "undefsafe";
import { observe } from "mobx";

const ListResults = React.lazy(() => import("./ListResults"));
const MapResults = React.lazy(() => import("./MapResults"));
const VIEW_LIST = "list";
const VIEW_MAP = "map";
const DEFAULT_FILTER = { type: "type", value: "person" };

class SearchResults extends React.Component {
  state = {
    page: 0,
    hits: [],
    noResult: false,
    loading: true,
    noMore: false
  };

  componentWillUnmount() {
    if (this.unsubFilters) this.unsubFilters();
  }

  componentDidMount() {
    this.fetchHits(this.props.searchStore.values.filters);
    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.setState({ page: 0 }, () => {
          this.fetchHits(
            this.props.searchStore.values.filters,
            this.state.page
          );
        });

        this.props.keenStore.recordEvent("search", {
          results: this.props.commonStore.searchResultsCount,
          filters: JSON.parse(
            JSON.stringify(this.props.searchStore.values.filters)
          ),
          recordEmitter: undefsafe(
            this.props.recordStore.currentUserRecord,
            "_id"
          )
        });
      }
    );
  }

  fetchHits = async (filters, page, updatePageState) => {
    this.setState(
      { loading: true, page: updatePageState ? page : this.state.page },
      async () => {
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
          this.props.commonStore.searchResultsCount = res.nbHits;

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
          console.error("ListResults.js - fetchHits", {
            filters: JSON.parse(JSON.stringify(filters)),
            page
          });
          console.error(e);
          this.setState({ hits: [] });
        }
      }
    );
  };

  endHitsLoad = () => this.setState({ loading: false });

  render() {
    const { hits, noMore, noResult, loading, page } = this.state;
    const { view } = this.props;

    if (view === VIEW_LIST) {
      return (
        <Suspense
          fallback={<CircularProgress color="secondary"></CircularProgress>}
        >
          <Grid
            container
            direction={"column"}
            justify={"space-around"}
            alignItems={"center"}
          >
            <ListResults
              hits={hits}
              noMore={noMore}
              noResult={noResult}
              loading={loading}
              fetchHits={this.fetchHits}
              page={page}
            />
          </Grid>
        </Suspense>
      );
    } else if (view === VIEW_MAP) {
      return (
        <Suspense
          fallback={<CircularProgress color="secondary"></CircularProgress>}
        >
          <MapResults />
        </Suspense>
      );
    } else return null;
  }
}

export default inject(
  "commonStore",
  "searchStore",
  "keenStore",
  "recordStore",
  "orgStore"
)(observer(SearchResults));