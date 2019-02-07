import React, {Component} from 'react';
import { connectHits } from 'react-instantsearch-dom';
import {Grid} from '@material-ui/core';

class SearchResults extends Component {
    constructor(props) {
      super(props);
      
    } 

    render() {
      const {hits, addToFilters, handleDisplayProfile, classes, HitComponent} = this.props;

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
  
  const AlgoliaSearchResults = connectHits(SearchResults);
  export default (AlgoliaSearchResults);
