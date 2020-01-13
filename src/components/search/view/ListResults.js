import React, { Suspense } from "react";
import { inject, observer } from "mobx-react";
import { withStyles, Grid, CircularProgress } from "@material-ui/core";
import undefsafe from "undefsafe";

import { styles } from "./ListResults.css";
import Card from "../../card/CardProfile";
import InvitationDialog from "../../utils/popup/Invitation";
import { observe } from "mobx";
import { AutoSizer, List, WindowScroller } from "react-virtualized";

const SearchShowMore = React.lazy(() => import("../SearchShowMore"));
const SearchNoResults = React.lazy(() => import("../SearchNoResults"));

class ListResults extends React.Component {
  static whyDidYouRender = true;

  state = {
    hitsPerPage: 5, // 5 because CardProfile take too much time to render (15 - 30 ms per Card) ...
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

  componentWillReceiveProps(nextProps) {
    this.willReceiveProps = true;
  }

  rowRenderer = ({ index, isScrolling, isVisible, key, style }) => {
    const {hits, classes} = this.props;
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
          <Card hit={row} light={isScrolling} />
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
    const { hits, loading, noMore, noResult } = this.props;
    const { classes } = this.props;
    const { hitsPerPage, displayedPage } = this.state;

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
      <WindowScroller
        scrollElement={customElement}
      >
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
                    rowHeight={273 + 32}
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
)(observer(withStyles(styles)(ListResults)));
