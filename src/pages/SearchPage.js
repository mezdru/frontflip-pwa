import React, { Suspense } from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import withWidth from '@material-ui/core/withWidth';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from "react-router-dom";
import { observe } from 'mobx';

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
import Bezier from '../resources/javascripts/bezier';

const OnboardCongratulation = React.lazy(() => import('../components/onboard/steps/OnboardCongratulation'));
const PromptIOsInstall = React.lazy(() => import('../components/utils/prompt/PromptIOsInstall'));
const AddWingPopup = React.lazy(() => import('../components/utils/addWing/AddWingPopup'));

console.debug('Loading SearchPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayedHit: this.getAskedHit(),
      showCongratulation: false,
      actionInQueue: this.getActionInQueue(),
      hashtagsFilter: this.getHashtagsFilter(),
      top: 16,
      headerHeight: 129,
      headerPosition: 'INITIAL',
    };
  }

  getAskedHit = () => {
    if (this.props.match && this.props.match.params && this.props.match.params.profileTag &&
      (this.props.match.params.profileTag.charAt(0) === '#' || this.props.match.params.profileTag.charAt(0) === '@')) {
      return { tag: this.props.match.params.profileTag };
    } else {
      return null;
    }
  }

  componentDidMount() {
    this.moveSearchInputListener();
    this.handleUrlSearchFilters();
    try {
      if (this.props.match.params.profileTag === 'congrats') this.setState({ showCongratulation: true })
    } catch{ }

    observe(this.props.commonStore, 'searchFilters', (change) => {
      if(JSON.stringify(change.oldValue) !== JSON.stringify(change.newValue)) {
        if( (change.newValue && !change.oldValue) || (change.newValue && change.oldValue && change.newValue.length > change.oldValue.length) ) {
          this.handleShowSearchResults();
        }
        
      }
    });
  }


  /**
   * @description Move search block following user scroll
   */
  moveSearchInputListener = () => {
    var contentPart = document.getElementById('content-container');
    var contentMain = document.getElementById('search-button');
    var searchBox = document.getElementById('search-input');
    var shadowedBackground = document.getElementById('shadowed-background');
    var lastScrollTop = 0;

    contentPart.addEventListener('scroll', function (e) {
      var contentShape = contentMain.getBoundingClientRect();
      var contentTop = contentShape.top;

      shadowedBackground.style.opacity = Math.min(1, (contentPart.scrollTop / (window.innerHeight - this.state.headerHeight))) * 0.6;
      
      if (lastScrollTop < contentPart.scrollTop) {

        var currentSearchTop = searchBox.getBoundingClientRect().top;
        while ((contentTop - (currentSearchTop + this.state.headerHeight)) < 48 && (currentSearchTop >= this.state.top)) {
          searchBox.style.top = Math.max(8,(currentSearchTop -= 2)) + 'px';
        }
        if(currentSearchTop <= this.state.top) this.handleMenuButtonMobileDisplay(true);
        
      } else {

        var currentSearchTop = searchBox.getBoundingClientRect().top;
        while( (contentTop - (currentSearchTop + this.state.headerHeight)) > 16 && (currentSearchTop <= (window.innerHeight * 0.40)) ) {
          searchBox.style.top = (currentSearchTop += 2) + 'px';
        }
        if(currentSearchTop >= this.state.top + 8) this.handleMenuButtonMobileDisplay(false);

      }

      lastScrollTop = contentPart.scrollTop;
    }.bind(this));
  }

  handleMenuButtonMobileDisplay = (isInSearch) => {
    var searchField = document.getElementById('search-container');
    var headerButton = document.getElementById('header-button');

    if(this.props.width === 'xs' && isInSearch && this.state.headerPosition === 'INITIAL') {
      searchField.style.paddingLeft = 48 +'px';
      headerButton.style.top = 20 + 'px';
      headerButton.style.height = 40 + 'px';
      headerButton.style.width = 40 + 'px';
      headerButton.style.minWidth = 0 + 'px';
      headerButton.style.left = 20 + 'px';
      this.setState({headerPosition: 'INSIDE'})
    } else if (!isInSearch && (this.state.headerPosition !== 'INITIAL')) {
      searchField.style.paddingLeft = 0 +'px';
      headerButton.style.top = 16 + 'px';
      headerButton.style.height = 48 + 'px';
      headerButton.style.width = 48 + 'px';
      headerButton.style.left = 16 + 'px';
      this.setState({headerPosition: 'INITIAL'})
    }
  }

  /**
   * @description Scroll to search results part.
   */
  handleShowSearchResults = () => {
    var contentPart = document.getElementById('content-container');
    var scrollInitial = contentPart.scrollTop;
    var scrollMax = Math.min(contentPart.scrollHeight, window.innerHeight-120); 
    var scrollingDistance = scrollMax - scrollInitial;
    var duration = 0;
    var durationMax = 600;

    let interval = setInterval(function() {
      duration +=3;
      if(contentPart.scrollTop <= scrollMax && duration <= durationMax) {

        // Calc scrollTop following CubicBezier curve to copy CSS animation cubic-bezier.
        contentPart.scrollTop = Math.ceil((scrollInitial + scrollingDistance * Bezier.cubicBezier(0.4, 0, 0.2, 1, duration / durationMax , durationMax )));

        if(contentPart.scrollTop === scrollMax) interval = clearInterval(interval);
      } else {
        interval = clearInterval(interval);
      }
    }, 3);
  }

  /**
   * @description Handle URL search filters to make first search filters
   */
  handleUrlSearchFilters = () => {
    let wings = this.props.commonStore.getCookie('hashtagsFilter');
    this.props.commonStore.removeCookie('hashtagsFilter');
    if (!wings) return;

    let currentSearchFilters = this.props.commonStore.getSearchFilters();
    let wingsArray = wings.split(',');

    wingsArray.forEach(wing => {
      if (!currentSearchFilters.find((searchFilter => searchFilter.tag === '#' + wing))) {
        currentSearchFilters.push({ tag: '#' + wing, value: '#' + wing, label: '#' + wing });
      }
    });
    this.props.commonStore.setSearchFilters(currentSearchFilters);
  }
  
  /**
   * @description Get action in queue is used for Add Wings via URL
   */
  getActionInQueue = () => {
    let action = this.props.commonStore.getCookie('actionInQueue');
    this.props.commonStore.removeCookie('actionInQueue');
    return action;
  }

  /**
   * @description Fetch Wings filters passed as URL params
   */
  getHashtagsFilter = () => {
    let wings = this.props.commonStore.getCookie('hashtagsFilter');
    this.props.commonStore.removeCookie('hashtagsFilter');
    if (wings) {
      return wings.split(',');
    } else {
      return [];
    }
  }

  componentDidUpdate() {
    if (this.state.redirectTo === window.location.pathname) {
      this.setState({ redirectTo: null });
    }
  }

  handleDisplayProfile = (e, profileRecord) => {
    ReactGA.event({ category: 'User', action: 'Display profile' });
    this.setState({ displayedHit: profileRecord });
  }

  handleReturnToSearch = () => {
    this.setState({ displayedHit: null, redirectTo: '/' + this.props.commonStore.locale + '/' + this.props.organisationStore.values.organisation.tag })
  }

  render() {
    const { displayedHit, redirectTo, showCongratulation, actionInQueue, hashtagsFilter } = this.state;
    const { classes } = this.props;

    return (
      <React.Fragment>
        {redirectTo && (window.location.pathname !== redirectTo) && <Redirect to={redirectTo} />}
        <Header />

        <main className={'search-container'}>

          <BannerResizable
            type={'organisation'}
            initialHeight={100}
            style={{position: 'absolute'}}
          />
          <div id="shadowed-background" className={classes.shadowedBackground} />

          {/* Search box - Search field & Search suggestions */}
          <div className={'search-input'} id="search-input">
            <Grid container justify='center'>
              <Grid item xs={12} sm={8} md={6} lg={4} className={classes.searchMobileView}>
                <ErrorBoundary>
                  <Suspense fallback={<CircularProgress color='secondary' />}>
                    <Search />
                  </Suspense>
                </ErrorBoundary>
              </Grid>
            </Grid>
          </div>

          <div className={'search-content-container'} id="content-container">
            <div className={'search-content-offset'}/>
            <div className={'search-button'} id="search-button" >
              <SearchButton onClick={this.handleShowSearchResults} />
            </div>

            {/* Search results part */}
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
          <ProfileLayout hit={displayedHit} handleReturnToSearch={this.handleReturnToSearch} className={classes.profileContainer} />
        )}

        {showCongratulation && (
          <Suspense fallback={<CircularProgress color='secondary' />}>
            <OnboardCongratulation isOpen={showCongratulation} />
          </Suspense>
        )}

        {hashtagsFilter.length > 0 && (actionInQueue === 'add') && (
          <Suspense fallback={<CircularProgress color='secondary' />}>
            <AddWingPopup wingsToAdd={hashtagsFilter} isOpen={true} />
          </Suspense>
        )}

        <Suspense fallback={<div></div>}>
          <PromptIOsInstall />
        </Suspense>
      </React.Fragment>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withWidth()(withStyles(styles)(SearchPage))
  )
);
