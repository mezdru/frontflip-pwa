import React, { Suspense } from "react";
import { styles } from "./design";
import { withStyles, Slide, CircularProgress, Grid } from "@material-ui/core";

const MapResults = React.lazy(() =>
  import("../../components/search/view/MapResults")
);

class MapPage extends React.Component {
  render() {
    const {
      classes,
      visible,
      transitionDuration,
      hits,
      fetchHits,
      switchView
    } = this.props;

    return (
      <Slide
        direction="up"
        in={visible}
        mountOnEnter
        timeout={{ enter: transitionDuration, exit: transitionDuration / 2 }}
      >
        <Grid container className={classes.root} alignContent="flex-start">
          <Suspense fallback={<CircularProgress color="secondary" />}>
            <MapResults fetchHits={fetchHits} hits={hits} switchView={switchView} />
          </Suspense>
        </Grid>
      </Slide>
    );
  }
}

export default withStyles(styles)(MapPage);
