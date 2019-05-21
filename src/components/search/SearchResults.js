import React from 'react'
import {Grid, Button, CircularProgress, Typography, withStyles} from '@material-ui/core';
import {FormattedMessage} from 'react-intl';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';

import chat from '../../resources/images/chat.png';
import AlgoliaService from '../../services/algolia.service';
import { shuffleArray } from '../../services/utils.service';

import withSearchManagement  from './SearchManagement.hoc';

const styles = theme => ({
  image: {
    width: '47rem',
    height: 'auto',
    [theme.breakpoints.down('xs')]: {
      width: '24rem',
      height: 'auto',
    },
  },
  text: {
    textAlign: 'center',
    margin: 16,
    color: theme.palette.primary.dark,
    fontWeight: '600'
  },
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
      observer: () => {},
      filterRequest: '',
      queryRequest: '',
    };
  }
  
  componentDidMount() {
    this.props.makeFiltersRequest()
    .then((req) => {
      this.setState({filterRequest: req.filterRequest, queryRequest: req.queryRequest }, () => {
        AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
        this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
      });
    });

    
    this.setState({observer : observe(this.props.commonStore, 'algoliaKey', (change) => {
        AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
        this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, null);
    })});

    observe(this.props.commonStore, 'searchFilters', (change) => {
      this.props.makeFiltersRequest()
      .then((req) => {
        this.setState({filterRequest: req.filterRequest, queryRequest: req.queryRequest }, () => {
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
      
      if(!content || !content.hits || content.hits.length === 0) this.setState({showNoResult: true, hideShowMore: true});
      else this.setState({showNoResult: false});

      this.props.commonStore.searchResultsCount = content.nbHits;
      
      this.setState({hitsAlreadyDisplayed: Math.min((content.hitsPerPage * (content.page)), content.nbHits)});      if(content.page === (content.nbPages-1)) this.setState({hideShowMore: true});
      if(page) this.setState({hits: this.state.hits.concat(content.hits)}, this.endTask());
        else this.setState({hits: content.hits}, this.endTask());
        
    }).catch((e) => {this.setState({hits: []})});
  }
  
  endTask = () => {
    this.setState({loadInProgress: false});
  }
  
  handleShowMore = (e) => {
    this.setState({page: this.state.page+1, loadInProgress: true}, () => {
      this.fetchHits(this.state.filterRequest, this.state.queryRequest, null, this.state.page);
    });
  }
  
  render() {
    const {hits, loadInProgress, hideShowMore, hitsAlreadyDisplayed, showNoResult, filterRequest, queryRequest} = this.state;
    const {handleDisplayProfile, classes, HitComponent} = this.props;
    let hitsResult = hits;
    if( (filterRequest === 'type:person') && !queryRequest) {
      // The search results aren't filtered, we can randomize them.
      hitsResult = shuffleArray(hitsResult);
    }

    return (
      <div className={classes.hitList}>
        <ul>
          {hitsResult.map((hit, i) => {
          return(
            <li key={i} style={{WebkitAnimationDelay: (0.2*(i-hitsAlreadyDisplayed))+'s', animationDelay: (0.2*(i-hitsAlreadyDisplayed))+'s'}}>
              <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} >
                <HitComponent hit={hit} handleDisplayProfile={handleDisplayProfile} />
                </Grid>
              </li>
            );
          })}

          {!hideShowMore && (
            <li>
              <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} container justify={"center"} alignContent={"center"}>
                {loadInProgress && (
                <CircularProgress color="secondary" />
                )}
                {!loadInProgress && (
                <Button onClick={(e) => this.handleShowMore(e)}><FormattedMessage id="search.showMore" /></Button>
                )}
              </Grid>
            </li>
          )}
          {showNoResult && (
            <Grid container item justify={"center"} alignItems={'center'} direction={'column'}>
              <Grid item>
                <Typography variant="h4" className={classes.text} >
                  <FormattedMessage id={"nobody.searchList"}/>
                </Typography>
              </Grid>
              <Grid item>
                <img src={chat}  alt={'chat'} className={classes.image}/>
              </Grid>
            </Grid>
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
