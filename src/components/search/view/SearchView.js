import React, { Suspense } from "react";
import { CircularProgress } from "@material-ui/core";
import qs from "qs";

const ListResults = React.lazy(() => import("./ListResults"));
const MapResults = React.lazy(() => import("./MapResults"));
const VIEW_LIST = "list";
const VIEW_MAP = "map";

class SearchView extends React.Component {
  state = {
    view: VIEW_LIST
  };

  componentDidMount() {
    let query = window.location.search;
    if (query.charAt(0) === "?") query = query.substr(1);
    let parsedQuery = qs.parse(query);
    if (parsedQuery.view) this.setState({ view: parsedQuery.view });
  }

  render() {
    const { view } = this.state;

    if (view === VIEW_LIST) {
      return (
        <Suspense
          fallback={<CircularProgress color="secondary"></CircularProgress>}
        >
          <ListResults />
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

export default SearchView;
