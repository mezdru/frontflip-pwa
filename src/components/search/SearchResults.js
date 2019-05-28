import React, { Suspense } from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';

import AlgoliaService from '../../services/algolia.service';
import { shuffleArray } from '../../services/utils.service';
import Card from '../card/CardProfile';

import withSearchManagement from './SearchManagement.hoc';

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
      opacity: 0,
      animation: 'fadeIn 0.9s 1',
      animationFillMode: 'forwards',
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
});

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      page: 0,
      showNoResult: false,
      loadInProgress: true,
      hideShowMore: false,
      hitsAlreadyDisplayed: 0,
      observer: () => { },
      filterRequest: '',
      queryRequest: '',
    };
  }

  componentDidMount() {
    this.props.makeFiltersRequest()
      .then((req) => {
        this.setState({ filterRequest: req.filterRequest, queryRequest: req.queryRequest }, () => {
          AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
          this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
        });
      });


    this.setState({
      observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
        AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
        this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
      })
    });

    observe(this.props.commonStore, 'searchFilters', (change) => {
      this.props.makeFiltersRequest()
        .then((req) => {
          this.setState({ filterRequest: req.filterRequest, queryRequest: req.queryRequest }, () => {
            AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
            this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
          });
        });
    });
  }

  componentWillUnmount() {
    this.state.observer();
  }

  fetchHits = (filters, query, facetFilters, page) => {
    AlgoliaService.fetchHits(filters, query, facetFilters, page)
      .then((content) => {

        if (!content || !content.hits || content.hits.length === 0) this.setState({ showNoResult: true, hideShowMore: true });
        else this.setState({ showNoResult: false });

        this.props.commonStore.searchResultsCount = content.nbHits;

        this.setState({ hitsAlreadyDisplayed: Math.min((content.hitsPerPage * (content.page)), content.nbHits) }); if (content.page === (content.nbPages - 1)) this.setState({ hideShowMore: true });
        if (page) this.setState({ hits: this.state.hits.concat(content.hits) }, this.endTask());
        else this.setState({ hits: content.hits }, this.endTask());

      }).catch((e) => { this.setState({ hits: [] }) });
  }

  endTask = () => {
    this.setState({ loadInProgress: false });
  }

  handleShowMore = (e) => {
    this.setState({ page: this.state.page + 1, loadInProgress: true }, () => {
      this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, this.state.page);
    });
  }

  render() {
    const { hits, loadInProgress, hideShowMore, hitsAlreadyDisplayed, showNoResult, filterRequest, queryRequest } = this.state;
    const { handleDisplayProfile, classes } = this.props;
    let hitsResult = hits;
    
    if ((filterRequest === 'type:person') && !queryRequest) {
      hitsResult = shuffleArray(hitsResult);
    }

    return (
      <div className={classes.hitList}>
        <ul>
          {hitsResult.map((hit, i) => {
            return (
              <li key={hit.objectID} style={{ WebkitAnimationDelay: (0.2 * (i - hitsAlreadyDisplayed)) + 's', animationDelay: (0.2 * (i - hitsAlreadyDisplayed)) + 's' }}>
                <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} >
                  <Card hit={hit} handleDisplayProfile={handleDisplayProfile} />
                </Grid>
              </li>
            );
          })}

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

export default inject('commonStore')(
  observer(
    withStyles(styles)(SearchResults)
  )
);
