import React, { Suspense } from "react";
import { CircularProgress, Grid } from "@material-ui/core";

const ListResults = React.lazy(() => import("./ListResults"));
const MapResults = React.lazy(() => import("./MapResults"));
const VIEW_LIST = "list";
const VIEW_MAP = "map";

class SearchResults extends React.Component {
  render() {
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
            <ListResults />
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

export default SearchResults;
