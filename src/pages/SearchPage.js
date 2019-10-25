import React, { Suspense, PureComponent } from 'react'
import { withStyles, Grid } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import withWidth from '@material-ui/core/withWidth';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';
import { Redirect } from "react-router-dom";
import { observe } from 'mobx';
import { animateScroll as scroll } from 'react-scroll';
import undefsafe from 'undefsafe';

import { styles } from './SearchPage.css';
import ErrorBoundary from '../components/utils/errors/ErrorBoundary';
import './SearchPageStyle.css';
import SearchButton from '../components/search/SearchButton';
import withSearchManagement from '../hoc/SearchManagement.hoc';
import { withProfileManagement } from '../hoc/profile/withProfileManagement';
import AskForHelpFab from '../components/utils/buttons/AskForHelpFab';
import { getBaseUrl } from '../services/utils.service';
import withAuthorizationManagement from '../hoc/AuthorizationManagement.hoc';

const OnboardCongratulation = React.lazy(() => import('../components/utils/popup/OnboardCongratulation'));
const PromptIOsInstall = React.lazy(() => import('../components/utils/popup/PromptIOsInstall'));
const AskForHelp = React.lazy(() => import('../components/utils/popup/AskForHelp'));
const AddWingPopup = React.lazy(() => import('../components/utils/popup/AddWingPopup'));
const ProfileLayout = React.lazy(() => import("../components/profile/ProfileLayout"));
const BannerResizable = React.lazy(() => import('../components/utils/banner/BannerResizable'));
const Header = React.lazy(() => import('../components/header/Header'));
const SearchResults = React.lazy(() => import('../components/search/SearchResults'));
const Search = React.lazy(() => import('../components/search/Search'));
const Intercom = React.lazy(() => import('react-intercom'));

console.debug('Loading SearchPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      showCongratulation: false,
      actionInQueue: this.getActionInQueue(),
      hashtagsFilter: this.getHashtagsFilter(),
      top: 16,
      headerHeight: 129,
      headerPosition: 'INITIAL',
      visible: false,
      transitionDuration: 800,
      showAskForHelp: false,
    };

    this.props.commonStore.setUrlParams(this.props.match);
  }

  componentDidMount() {
    this.moveSearchInputListener();
    this.handleUrlSearchFilters();

    if(this.props.match.path.search('congrats') > -1) this.setState({ showCongratulation: true });

    observe(this.props.commonStore, 'searchFilters', (change) => {
      if (JSON.stringify(change.oldValue) !== JSON.stringify(change.newValue)) {
        if ((change.newValue && !change.oldValue) || (change.newValue && change.oldValue && change.newValue.length > change.oldValue.length)) {
          this.handleShowSearchResults(200);
        }
        this.forceUpdate();
      }
    });

    this.unsubResultsCount = observe(this.props.commonStore, 'searchResultsCount', (change) => {
      this.props.keenStore.recordEvent('search', {results: change.newValue, filters: []});
      this.unsubResultsCount();
    });

    if (this.props.commonStore.url.params.recordTag) {
      this.handleDisplayProfile(null, this.props.commonStore.url.params.recordTag);
    }

    this.unsubscribeRecordTag = observe(this.props.commonStore.url, 'params', (change) => {
      if (change.oldValue.recordTag !== change.newValue.recordTag && change.newValue.recordTag)
        this.handleDisplayProfile(null, change.newValue.recordTag);
      if (!change.newValue.recordTag && change.oldValue.recordTag)
        this.handleCloseProfile();
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

    contentPart.addEventListener('scroll', (e) => this.moveSearchInput(contentPart, contentMain, searchBox, shadowedBackground));
    window.addEventListener('resize', (e) => this.moveSearchInput(contentPart, contentMain, searchBox, shadowedBackground));
  }

  moveSearchInput = (contentPart, contentMain, searchBox, shadowedBackground) => {
    var contentShape = contentMain.getBoundingClientRect();
    var contentTop = contentShape.top;
    let newTopValue = Math.min(Math.max(contentTop - this.state.headerHeight + 16, 16), (window.innerHeight * 0.40));

    searchBox.style.top = newTopValue + 'px';
    shadowedBackground.style.opacity = Math.min(1, (contentPart.scrollTop / (window.innerHeight - this.state.headerHeight))) * 0.6;

    if (newTopValue <= this.state.top) this.handleMenuButtonMobileDisplay(true);
    else if (newTopValue >= (this.state.top + 8)) this.handleMenuButtonMobileDisplay(false);
  }

  handleMenuButtonMobileDisplay = (isInSearch) => {
    var searchField = document.getElementById('search-container');
    var headerButton = document.getElementById('header-button');

    if (!searchField || !headerButton) return;

    if (this.props.width === 'xs' && isInSearch && this.state.headerPosition === 'INITIAL') {
      searchField.style.paddingLeft = 48 + 'px';
      headerButton.style.top = 20 + 'px';
      headerButton.style.height = 40 + 'px';
      headerButton.style.width = 40 + 'px';
      headerButton.style.minWidth = 0 + 'px';
      headerButton.style.left = 20 + 'px';
      this.setState({ headerPosition: 'INSIDE' })
    } else if (!isInSearch && (this.state.headerPosition !== 'INITIAL')) {
      searchField.style.paddingLeft = 0 + 'px';
      headerButton.style.top = 16 + 'px';
      headerButton.style.height = 48 + 'px';
      headerButton.style.width = 48 + 'px';
      headerButton.style.left = 16 + 'px';
      this.setState({ headerPosition: 'INITIAL' })
    }
  }

  /**
   * @description Scroll to search results part.
   */
  handleShowSearchResults = (offset) => {
    var contentPart = document.getElementById('content-container');
    if(!contentPart) return;
    var scrollMax = Math.min(contentPart.scrollHeight, window.innerHeight - 120);
    scroll.scrollTo(scrollMax, {
      duration: this.state.transitionDuration,
      smooth: 'easeInOutCubic',
      containerId: "content-container",
      offset: offset || 0
    });
  }

  /**
   * @description Handle URL search filters to make first search filters
   */
  handleUrlSearchFilters = () => {
    if (!this.state.hashtagsFilter) return;

    let currentSearchFilters = this.props.commonStore.getSearchFilters();

    this.state.hashtagsFilter.forEach(wing => {
      if (!currentSearchFilters.find((searchFilter => searchFilter.tag === '#' + wing))) {
        this.props.addFilter({ tag: '#' + wing, value: '#' + wing, label: '#' + wing, name: wing });
      }
    });
  }

  /**
   * @description Get action in queue is used for Add Wings via URL
   */
  getActionInQueue = () => {
    let action = undefsafe(this.props.match, 'params.action');
    return action;
  }

  /**
   * @description Fetch Wings filters passed as URL params
   */
  getHashtagsFilter = () => {
    let wings = undefsafe(this.props.match, 'params.hashtags');
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

  handleDisplayAskForHelp = () => {
    this.setState({ showAskForHelp: false }, () => { this.setState({ showAskForHelp: true }) });
  }

  handleDisplayProfile = (e, recordTag) => {
    ReactGA.event({ category: 'User', action: 'Display profile' });
    this.props.profileContext.setProfileData(recordTag);
    this.setState({ visible: true, redirectTo: getBaseUrl(this.props) + '/' + recordTag });
  }

  handleCloseProfile = () => {
    this.setState({ visible: false });
    setTimeout(() => {
      this.props.profileContext.reset();
      this.setState({ redirectTo: getBaseUrl(this.props) });
    },
      (this.state.transitionDuration / 2)*0.9
    );
  }

  handleCloseCongrats = () => this.setState({showCongratulation: false});

  componentWillReceiveProps(nextProps) {
    this.props.commonStore.setUrlParams(nextProps.match);
  }

  render() {
    const { redirectTo, showCongratulation, actionInQueue, hashtagsFilter, visible, transitionDuration, showAskForHelp } = this.state;
    const { classes } = this.props;
    const { currentOrganisation } = this.props.orgStore;
    const { searchResultsCount } = this.props.commonStore;
    let searchFilters = this.props.commonStore.getSearchFilters();

    return (
      <React.Fragment>
        {(redirectTo && (window.location.pathname !== redirectTo)) && <Redirect push to={redirectTo} />}
        <Suspense fallback={<></>}>
          <Header withProfileLogo />
        </Suspense>

        <main className={'search-container'}>

          <Suspense fallback={<div style={{ position: 'absolute', height: '100vh' }}></div>} >
            <BannerResizable
              type={'organisation'}
              initialHeight={100}
              style={{ position: 'absolute' }}
            />
          </Suspense>


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
            <div className={'search-content-offset'} />
            <div className={'search-button'} id="search-button" >
              <SearchButton onClick={this.handleShowSearchResults} />
            </div>

            {/* Search results part */}
            <div className={'search-content'} style={{ position: 'relative' }}>
              <ErrorBoundary>
                <Suspense fallback={<CircularProgress color='secondary' />}>
                  <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                    <SearchResults />
                  </Grid>
                </Suspense>
              </ErrorBoundary>
            </div>

          </div>
          {currentOrganisation && !this.props.authStore.isAuth() && (
            <Suspense fallback={<></>}>
              <Intercom appID={"k7gprnv3"} />
            </Suspense>
          )}
          {currentOrganisation && (currentOrganisation.tag === 'demo') && this.props.authStore.isAuth() && (
            <Suspense fallback={<></>}>
              <Intercom 
                appID={"k7gprnv3"} 
                user_id={undefsafe(this.props.userStore.currentUser, '_id')}
                name={undefsafe(this.props.recordStore.currentUserRecord, 'name')}
                email={undefsafe(this.props.userStore.currentUser, 'email.value') || undefsafe(this.props.userStore.currentUser, 'google.email')}
              />
            </Suspense>
          )}
        </main>

        <Suspense fallback={<></>}>
          <ProfileLayout visible={visible} handleClose={this.handleCloseProfile} transitionDuration={transitionDuration} />
        </Suspense>

        <Suspense fallback={<CircularProgress color='secondary' />}>
          <AskForHelp isOpen={showAskForHelp} />
        </Suspense>

        {showCongratulation && (
          <Suspense fallback={<CircularProgress color='secondary' />}>
            <OnboardCongratulation isOpen={showCongratulation} handleClose={this.handleCloseCongrats}/>
          </Suspense>
        )}

        {hashtagsFilter.length > 0 && (actionInQueue === 'add') && (
          <Suspense fallback={<CircularProgress color='secondary' />}>
            <AddWingPopup wingsToAdd={hashtagsFilter} isOpen={true} />
          </Suspense>
        )}

        {this.props.authStore.isAuth() && (
          <AskForHelpFab className={classes.fab} onClick={this.handleDisplayAskForHelp} highlighted={(searchFilters && searchFilters.length > 0 && searchResultsCount <= 10)} />
        )}

        <Suspense fallback={<></>}>
          <PromptIOsInstall />
        </Suspense>
      </React.Fragment>
    );
  }
}

SearchPage = withAuthorizationManagement(withSearchManagement(withProfileManagement(SearchPage)), 'search');

export default inject('commonStore', 'orgStore', 'authStore', 'userStore', 'recordStore', 'keenStore')(
  observer(
    withWidth()(withStyles(styles)(SearchPage))
  )
);
