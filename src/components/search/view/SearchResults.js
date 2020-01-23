import React, { Suspense } from "react";
import { CircularProgress } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import AlgoliaService from "../../../services/algolia.service";
import undefsafe from "undefsafe";
import { observe } from "mobx";

const ListResults = React.lazy(() => import("./ListResults"));
const MapPage = React.lazy(() => import("../../../pages/map"));
const VIEW_LIST = "list";
const VIEW_MAP = "map";
const DEFAULT_FILTER = [
  { type: "type", value: "person" },
  { type: "type", value: "event" }
];

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
            DEFAULT_FILTER.concat(filters),
            null,
            page,
            true,
            this.props.view === VIEW_LIST ? 1000 : 1000 // if list view, should not be "1000", should use pagination
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
    const { view, switchView } = this.props;
    const { currentOrganisation } = this.props.orgStore;

    return (
      <>
        {undefsafe(currentOrganisation, "features.map") && (
          <Suspense
            fallback={<CircularProgress color="secondary"></CircularProgress>}
          >
            <MapPage
              hits={hits}
              fetchHits={this.fetchHits}
              visible={view === VIEW_MAP}
              transitionDuration={300}
              switchView={switchView}
            />
          </Suspense>
        )}
        <Suspense
          fallback={<CircularProgress color="secondary"></CircularProgress>}
        >
          <ListResults
            hits={hits}
            noMore={noMore}
            noResult={noResult}
            loading={loading}
            fetchHits={this.fetchHits}
            page={page}
          />
        </Suspense>
      </>
    );
  }
}

export default inject(
  "commonStore",
  "searchStore",
  "keenStore",
  "recordStore",
  "orgStore"
)(observer(SearchResults));
