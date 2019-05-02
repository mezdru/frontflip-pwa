import React, { Suspense } from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import withWidth from '@material-ui/core/withWidth';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';
import Header from '../components/header/Header';
import ProfileLayout from "../components/profile/ProfileLayout";

import { styles } from './SearchPage.css';
import SearchResults from '../components/search/SearchResults';
import Search from '../components/search/Search';
import Card from '../components/card/CardProfile';
import ErrorBoundary from '../components/utils/errors/ErrorBoundary';
import BannerResizable from '../components/utils/banner/BannerResizable';
import './SearchPageStyle.css';
import SearchButton from '../components/search/SearchButton';
import { Redirect } from "react-router-dom";


console.debug('Loading SearchPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedHit: this.getAskedHit(),
    };
  }

  getAskedHit = () => {
    if(this.props.match && this.props.match.params && this.props.match.params.profileTag) {
      console.log(this.props.match.params.profileTag);
      return {tag: this.props.match.params.profileTag};
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.moveSearchInputListener();
  }

  moveSearchInputListener = () => {
    var contentPart = document.getElementById('content-container');
    var lastScrollTop = 0;
    
    contentPart.addEventListener('scroll', function(e){
      var contentMain = document.getElementById('search-button');
      var contentShape = contentMain.getBoundingClientRect();
    
      var searchBox = document.getElementById('search-input');
      var contentTop = contentShape.top;
    
      if(lastScrollTop < contentPart.scrollTop) {
        var currentSearchTop = searchBox.getBoundingClientRect().top;
        while ( ( contentTop -  (currentSearchTop + 120)) < 48  && (currentSearchTop >= 8)) {
          searchBox.style.top = (currentSearchTop -= 2) + 'px';
        }
      } else {
        var interval = setInterval(function() {
          var currentSearchTop = searchBox.getBoundingClientRect().top;
          if( ( contentTop -  (currentSearchTop + 120)) > 16 && (currentSearchTop <= (window.innerHeight * 0.40))) {
            searchBox.style.top = (currentSearchTop += 2) + 'px';
          } else {
            interval = clearInterval(interval);
          }
        }, 2);
      }
    
      lastScrollTop = contentPart.scrollTop;
    });
  }

  componentDidUpdate() {
    if(this.state.redirectTo === window.location.pathname) {
      this.setState({redirectTo: null});
    }
  }

  handleDisplayProfile = (e, profileRecord) => {
    ReactGA.event({ category: 'User', action: 'Display profile' });
    this.setState({ displayedHit: profileRecord });
  }

  handleReturnToSearch = () => {
    this.setState({ displayedHit: null, redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.organisation.tag})
  }

  render() {
    const {displayedHit, redirectTo} = this.state;
    const {classes} = this.props;

    // if(redirectTo) {
    //   this.setState({redirectTo: null});
    //   return <Redirect to={redirectTo} />;
    // } 

    return (
      <React.Fragment>
        {redirectTo && (window.location.pathname !== redirectTo) && <Redirect to={redirectTo} />}
        <Header />
        <main className={'search-container'}>

          <BannerResizable 
            type={'organisation'}
            initialHeight={100}
            style={{
              position: 'absolute'
            }}
          />

          <div className={'search-input'} id="search-input">
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

          <div className={'search-content-container'} id="content-container">
            <div className={'search-content-offset'}></div>
            <div className={'search-button'} id="search-button">
              <SearchButton />
            </div>
            <div className={'search-content'}>
            <ErrorBoundary>
              <Suspense fallback={<CircularProgress color='secondary' />}>
                <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                  <SearchResults handleDisplayProfile={this.handleDisplayProfile} HitComponent={Card} />
                </Grid>
              </Suspense>
            </ErrorBoundary>
            </div>
          </div>
        </main>

        {displayedHit && (
          <ProfileLayout hit={displayedHit} handleReturnToSearch={this.handleReturnToSearch} className={classes.profileContainer}/>
        )}
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withWidth()(withStyles(styles)(SearchPage))
  )
);
