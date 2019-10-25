import React, { Suspense } from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import undefsafe from 'undefsafe';

import AlgoliaService from '../../services/algolia.service';
import { shuffleArray } from '../../services/utils.service';
import Card from '../card/CardProfile';
import withSearchManagement from '../../hoc/SearchManagement.hoc';

const SearchShowMore = React.lazy(() => import('./SearchShowMore'));
const SearchNoResults = React.lazy(() => import('./SearchNoResults'));

const styles = theme => ({
  hitList: {
    position: 'relative',
    zIndex: 999,
    width: '100%',
    minHeight: 'calc(100vh - 129px)',
    backgroundColor: '#f2f2f2',
    '& ul': {
      listStyleType: 'none',
      padding: 0,
      marginTop: '32px',
      marginBottom: '32px',
    },
    '& ul li': {
      marginBottom: '32px',
    },
    '& ul li > div:first-child': {
      position: 'relative',
      left: '0',
      right: '0',
      margin: 'auto'
    }
  },
  cardMobileView: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px!important',
    },
  },
  sentinel: {
    position: 'absolute',
    marginTop: '-500px',
  }
});

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      page: 0,
      currentPageNumber: 0,
      showNoResult: false,
      loadInProgress: true,
      hideShowMore: false,
      observer: () => { },
      filterRequest: '',
      queryRequest: '',
    };
  }

  componentDidMount() {

    if(undefsafe(this.props.orgStore.currentAlgoliaKey, 'initialized')) {
      this.props.makeFiltersRequest()
      .then((req) => {
        this.setState({ filterRequest: req.filterRequest, queryRequest: req.queryRequest }, () => {
          this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
        });
      });
    }

    this.setState({
      observer: observe(this.props.orgStore, 'currentAlgoliaKey', (change) => {
        if(undefsafe(change.newValue, 'initialized')) {
          this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
        }
      })
    });

    observe(this.props.commonStore, 'searchFilters', (change) => {
      if (JSON.stringify(change.oldValue) !== JSON.stringify(change.newValue)) {
        this.props.makeFiltersRequest()
          .then((req) => {
            this.setState({ filterRequest: req.filterRequest, queryRequest: req.queryRequest, page: 0 }, () => {
              this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, this.state.page)
              .then(() => {
                this.props.keenStore.recordEvent('search', {results: this.props.commonStore.searchResultsCount, filters: change.newValue})
              });
            });
          });
      }
    });

    this.createScrollObserver();
  }

  componentWillUnmount() {
    this.state.observer();
  }

  createScrollObserver = () => {
    try {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !this.state.hideShowMore) {
            this.handleShowMore();
          }
        });
      });

      let hitList = document.getElementById('algolia-sentinel');
      observer.observe(hitList);
    } catch (e) {
      console.log(e);
    }
  }

  fetchHits = async (filters, query, facetFilters, page) => {
    await AlgoliaService.fetchHits(filters, query, facetFilters, page, true, 5)
      .then((content) => {

        if(!content) return;

        if ((!content.hits || content.hits.length === 0) && (!page || page === 0)) this.setState({ showNoResult: true, hideShowMore: true });
        else this.setState({ showNoResult: false });

        this.props.commonStore.searchResultsCount = content.nbHits;

        if (content.page >= (content.nbPages - 1) ) this.setState({ hideShowMore: true });
        else if (content.nbPages > 1) this.setState({ hideShowMore: false });

        if (page) {
          this.setState({ hits: this.state.hits.concat(content.hits) }, this.endHitsLoad);
        } else {
          let contentHits = Array.from(content.hits);
          if (this.state.filterRequest === 'type:person' && !this.state.queryRequest) {
            contentHits = shuffleArray(contentHits);
          }
          this.setState({ hits: contentHits }, this.endHitsLoad);
        }
      }).catch((e) => { this.setState({ hits: [] }) });
  }

  endHitsLoad = () => {
    this.setState({ loadInProgress: false });
  }

  handleShowMore = (e) => {
    if(! undefsafe(this.props.orgStore.currentAlgoliaKey, 'initialized')) return;
    this.setState({ page: this.state.page + 1, loadInProgress: true }, () => {
      this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, this.state.page);
    });
  }

  render() {
    const { hits, loadInProgress, hideShowMore, showNoResult } = this.state;
    const { handleDisplayProfile, classes } = this.props;
    let hitsResult = Array.from(hits);

    return (
      <div className={classes.hitList}>
        <ul>
          {hitsResult.map((hit, i) => {
            return (
              <li key={hit.objectID}>
                <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} >
                  <Card hit={hit} handleDisplayProfile={handleDisplayProfile} />
                </Grid>
              </li>
            );
          })}
          <div id="algolia-sentinel" className={classes.sentinel}></div>

          {!hideShowMore && (
            <li>
              <Suspense fallback={<></>}>
                <SearchShowMore loadInProgress={loadInProgress} handleShowMore={this.handleShowMore} />
              </Suspense>
            </li>
          )}
          

          {showNoResult && (
            <Suspense fallback={<></>}>
              <SearchNoResults />
            </Suspense>
          )}
        </ul>
      </div>
    );
  }
}

SearchResults = withSearchManagement(SearchResults);

export default inject('commonStore', 'orgStore', 'keenStore')(
  observer(
    withStyles(styles)(SearchResults)
  )
);
