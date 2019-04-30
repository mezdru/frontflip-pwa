import React, { Suspense } from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';

import { styles } from './SearchPage.css';
import SearchBanner from '../components/search/SearchBanner';
import SearchResults from '../components/search/SearchResults';
import Card from '../components/card/CardProfile';

console.debug('Loading SearchPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <React.Fragment>
        <SearchBanner/>
        <SearchResults addToFilters={this.addToFilters} handleDisplayProfile={this.handleDisplayProfile}
                    HitComponent={Card} />
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withWidth()(withStyles(styles)(SearchPage))
  )
);
