import React, {Suspense} from 'react';
import BannerResizable from '../utils/banner/BannerResizable';
import { inject, observer } from "mobx-react";
import ErrorBoundary from '../utils/errors/ErrorBoundary';
import { withStyles, Grid, CircularProgress } from '@material-ui/core';
import SearchButton from './SearchButton';
import Sticky from 'react-stickynode';

const Search = React.lazy(() => import('./Search'));

const styles = theme => ({
  searchBox: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    left:0,
    right:0,
    margin: 'auto',
    backgroundColor: 'transparent',
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
  },
  stickyClass: {
    transform: 'none',
    zIndex: 1000,
    overflow: 'hidden',
    '& >div': {
      paddingTop:8,
      transition: 'background-image 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      backgroundColor: theme.palette.primary.dark,
    }
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
          <div style={{
            position: 'relative',
            height: '100vh'
          }}></div>
          <BannerResizable
            // style={{ filter: 'brightness(90%)' }}

            style={{
              position: 'fixed',
              zIndex: 0,
              // filter: 'brightness(80%)'
            }}
            type={'organisation'}
            initialHeight={100}
          >



          </BannerResizable>

          <Sticky top={0} enabled={true} activeClass={classes.stickyClass} releasedClass={classes.searchBox} 
                    enableTransforms={false} className={classes.searchBox}>
                <Grid container justify='center'>
                  <Grid item xs={12} sm={8} md={6} lg={4}>
                    <ErrorBoundary>
                      <Suspense fallback={<CircularProgress color='secondary' />}>
                          <Search />
                      </Suspense>
                    </ErrorBoundary>
                  </Grid>
                </Grid>
            </Sticky>

            <div className={classes.searchButton}>
              <SearchButton />
            </div>
      </>
    );
  }
}

export default inject('commonStore')(
  observer(
    withStyles(styles)(SearchBanner)
  )
);
