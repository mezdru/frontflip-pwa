import React from 'react'
import { Grid } from '@material-ui/core';

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: []
    };

    this.fetchHits = this.fetchHits.bind(this);
  }

  componentDidMount() {
    this.fetchHits(this.props.filters, this.props.query, null);
  }

  fetchHits(filters, query, facetFilters) {
    this.props.index.search({
      query: query || '',
      facetFilters: facetFilters || '',
      filters: filters || 'type:person',
      hitsPerPage: 50,
      attributesToSnippet: [
        "intro:"+15,
        "description:"+15
      ],
    }, (err, content) => {
      if (err) this.setState({hits: []});
      this.setState({hits: content.hits});
    });
  }

  render() {
    const {hits} = this.state;
    const {addToFilters, handleDisplayProfile, classes, HitComponent} = this.props;

    return (
      <div className={classes.hitList} >
      <ul>
        {hits.map((hit, i) => {
          return(
            <li key={i} style={{WebkitAnimationDelay: (0.3*i)+'s', animationDelay: (0.3*i)+'s'}}>
              <Grid item xs={12} sm={8} md={6} lg={4} className={classes.cardMobileView} 
                    >
                <HitComponent hit={hit} addToFilters={addToFilters} handleDisplayProfile={handleDisplayProfile} />
              </Grid>
            </li> 
          );
        })}
      </ul> 
      </div>
    );
  }
}

export default SearchResults;
