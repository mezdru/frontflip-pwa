import React, { Suspense } from "react";
import { inject, observer } from "mobx-react";
import {
  withStyles,
  Grid,
  withWidth
} from "@material-ui/core";
import undefsafe from "undefsafe";

import { styles } from "./ListResults.css";
import Card from "../../card/CardProfile";
import { AutoSizer, List, WindowScroller } from "react-virtualized";

const SearchNoResults = React.lazy(() => import("../SearchNoResults"));

class ListResults extends React.Component {
  static whyDidYouRender = true;

  state = {
    scrollToIndex: null
  };

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

  componentWillReceiveProps(nextProps) {
    this.willReceiveProps = true;
  }

  rowRenderer = ({ index, isScrolling, isVisible, key, style }) => {
    const { hits, classes } = this.props;
    const row = hits[index];

    return (
      <div key={key} style={style}>
        <Grid
          item
          xs={12}
          sm={8}
          md={6}
          lg={4}
          className={classes.cardMobileView}
        >
          <Card hit={row} light={false} />
        </Grid>
      </div>
    );
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (
      JSON.stringify(nextState) === JSON.stringify(this.state) &&
      !this.willReceiveProps
    )
      return false;
    this.willReceiveProps = false;
    return true;
  }

  render() {
    const { hits, noResult } = this.props;
    const { classes } = this.props;
    const { scrollToIndex } = this.state;

    let customElement = window.document.getElementById("content-container");
    if (noResult) {
      return (
        <div className={classes.hitList}>
          <Suspense fallback={<></>}>
            <SearchNoResults />
          </Suspense>
        </div>
      );
    }

    return (
      <WindowScroller scrollElement={customElement}>
        {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
          <div className={styles.WindowScrollerWrapper}>
            <AutoSizer disableHeight>
              {({ width }) => (
                <div ref={registerChild}>
                  <List
                    ref={el => {
                      window.listEl = el;
                    }}
                    autoHeight
                    className={classes.hitList}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    overscanRowCount={5}
                    rowCount={hits.length}
                    rowHeight={this.props.width === "xs" ? 235 + 16 : 273 + 32}
                    scrollToIndex={scrollToIndex}
                    rowRenderer={this.rowRenderer}
                    scrollTop={scrollTop}
                    width={width}
                  />
                </div>
              )}
            </AutoSizer>
          </div>
        )}
      </WindowScroller>
    );
  }
}

export default inject(
  "searchStore",
  "orgStore"
)(observer(withStyles(styles)(withWidth()(ListResults))));
