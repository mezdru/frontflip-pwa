import React from 'react'
import { Grid, Button, CircularProgress } from '@material-ui/core';
import {FormattedMessage} from 'react-intl';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      page: 0,
      loadInProgress: true,
      hideShowMore: false,
      hitsAlreadyDisplayed: 0,
    };

    this.fetchHits = this.fetchHits.bind(this);
    this.handleShowMore = this.handleShowMore.bind(this);
    this.endTask = this.endTask.bind(this);
  }

  componentDidMount() {
    this.fetchHits(this.props.filters, this.props.query, null, null);
  }

  fetchHits(filters, query, facetFilters, page) {
    this.props.index.search({
      page : page || 0,
      query: query || '',
      facetFilters: facetFilters || '',
      filters: filters || 'type:person',
      hitsPerPage: 5,
      attributesToSnippet: [
        "intro:"+15,
        "description:"+15
      ],
    }, (err, content) => {
      if (err) this.setState({hits: []});
      this.setState({hitsAlreadyDisplayed: Math.min((content.hitsPerPage * (content.page)), content.nbHits)})
      if(!content) return;
      if(content.page === (content.nbPages-1)) this.setState({hideShowMore: true});

      if(page) {
        this.setState({hits: this.state.hits.concat(content.hits)}, () => {
          this.endTask();
        });
      } else {
        this.setState({hits: content.hits}, () => {
          this.endTask();
        });
      }
    });
  }

  endTask() {
    this.setState({loadInProgress: false});
  }

  handleShowMore() {
    this.setState({page: this.state.page+1, loadInProgress: true}, () => {
      this.fetchHits(this.props.filter, this.props.query, null, this.state.page);
    });
  }


  render() {
    const {hits, loadInProgress, hideShowMore, hitsAlreadyDisplayed} = this.state;
    const {addToFilters, handleDisplayProfile, classes, HitComponent} = this.props;

    return (
      <div className={classes.hitList} >
      <ul>
        {hits.map((hit, i) => {
          return(
            <li key={i} style={{WebkitAnimationDelay: (0.2*(i-hitsAlreadyDisplayed))+'s', animationDelay: (0.2*(i-hitsAlreadyDisplayed))+'s'}}>
              <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} >
                <HitComponent hit={hit} addToFilters={addToFilters} handleDisplayProfile={handleDisplayProfile} />
              </Grid>
            </li> 
          );
        })}
        {!hideShowMore && (
          <li>
            <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} container justify={"center"} alignContent={"center"}>
              {loadInProgress && (
                <CircularProgress color="primary" />
              )}
              {!loadInProgress && (
                <Button onClick={this.handleShowMore}><FormattedMessage id="search.showMore" /></Button>
              )}
            </Grid>
          </li>
        )}
      </ul> 
      </div>
    );
  }
}

export default SearchResults;
