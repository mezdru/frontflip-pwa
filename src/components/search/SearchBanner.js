import React, {Suspense} from 'react';
import BannerResizable from '../utils/banner/BannerResizable';
import { inject, observer } from "mobx-react";
import ErrorBoundary from '../utils/errors/ErrorBoundary';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import { observe } from 'mobx';
import SearchButton from './SearchButton';
import Header from '../header/Header';

const Search = React.lazy(() => import('./Search'));

const styles = theme => ({
  searchBox: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    left:0,
    right:0,
    margin: 'auto',
  },
  searchButton: {
    position: 'absolute',
    bottom: 16,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 16,
    textAlign: 'center',
    left: '50%',
    transform: 'translateX(-50%)',
  }
});

class SearchBanner extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {classes} = this.props; 

    return(
      <>
        <Header handleDisplayProfile={this.handleDisplayProfile} />
        <main>
          <BannerResizable
            style={{ filter: 'brightness(90%)' }} 
            type={'organisation'}
            initialHeight={100}
          >
            <div className={classes.searchBox}>
              <Grid container justify='center'>
                <Grid item xs={12} sm={8} md={6} lg={4}>
                  <ErrorBoundary>
                    <Suspense fallback={<CircularProgress color='secondary' />}>
                      <Search />
                    </Suspense>
                  </ErrorBoundary>
                </Grid>
              </Grid>
            </div>

            <div className={classes.searchButton}>
              <SearchButton />
            </div>

          </BannerResizable>
        </main>
      </>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(styles)(SearchBanner)
  )
);
