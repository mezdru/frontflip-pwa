import React from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";

const styles = {

};

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hits: []
    };

    this.fetchHits = this.fetchHits.bind(this);
  }

  componentDidMount() {
    this.fetchHits(this.props.filters, null, null);
  }

  fetchHits(filters, query, facetFilters) {
    this.props.index.search({
      query: query || '',
      facetFilters: facetFilters || '',
      filters: filters || '',
      hitsPerPage: 50,
      attributesToSnippet: [
        "intro:"+8,
        "description:"+8
      ]
    }, (err, content) => {
      if (err) throw new Error(err);
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

export default inject('commonStore', 'organisationStore', 'authStore', 'recordStore', 'userStore')(
  observer(
    withStyles(styles)(SearchResults)
  )
);
