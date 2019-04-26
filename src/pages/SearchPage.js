import React, { Suspense } from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import ReactGA from 'react-ga';
import CircularProgress from '@material-ui/core/CircularProgress';

import Header from '../components/header/Header';
import { styles } from './SearchPage.css';
import ProfileLayout from "../components/profile/ProfileLayout";
import BannerResizable from '../components/utils/banner/BannerResizable';


import { StickyContainer, Sticky } from 'react-sticky';



const Banner = React.lazy(() => import('../components/utils/banner/Banner'));
const SearchField = React.lazy(() => import('../components/algolia/SearchField'));
const SearchSuggestions = React.lazy(() => import('../components/algolia/SearchSuggestions'));
const SearchResults = React.lazy(() => import('../components/algolia/SearchResults'));
const Card = React.lazy(() => import('../components/card/CardProfile'));

const AddWingPopup = React.lazy(() => import('../components/utils/addWing/AddWingPopup'));
const PromptIOsInstall = React.lazy(() => import('../components/utils/prompt/PromptIOsInstall'));
const OnboardCongratulation = React.lazy(() => import('../components/onboard/steps/OnboardCongratulation'));






console.debug('Loading SearchPage');

ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_ID);

class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locale: this.props.commonStore.getCookie('locale') || this.props.commonStore.locale,
      filters: 'type:person',
      query: '',
      newFilter: {},
      displayedHit: null,
      resultsType: this.props.resultsType || 'person',
      shouldUpdateUrl: false,
      shouldDisplayHitResults: true,
      hashtagsFilter: this.getHashtagsFilter(),
      actionInQueue: this.getActionInQueue()
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.props.history.listen((location, action) => ReactGA.pageview(window.location.pathname));
    if (this.state.hashtagsFilter.length > 0) this.addHashtagsToSearch(this.state.hashtagsFilter);
  }

  addHashtagsToSearch = async (hashtags) => {
    let newFilters = [];
    hashtags.forEach(hashtag => {
      newFilters.push({ label: hashtag, value: '#' + hashtag });
      setTimeout(() => { this.setState({ newFilter: { label: hashtag, value: '#' + hashtag } }) }, 50 * newFilters.length);
    });
  }

  addToFilters = (e, element, shouldAwaitToUpdateLayout) => {
    this.setState({ newFilter: { label: element.name, value: element.tag } });
    if (this.state.resultsType === 'profile') {
      if (shouldAwaitToUpdateLayout) {
        setTimeout(function () { this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true }); }.bind(this), 500);
      } else {
        this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });
      }
    }
  }

  updateFilters = (selectedOptions) => {
    if (!selectedOptions) return;
    ReactGA.event({ category: 'Search', action: 'Perform search' });
    this.setState({ shouldDisplayHitResults: false });
    let newFilters = 'type:person';
    let newQuery = '';

    selectedOptions.forEach(option => {
      if (option.value.charAt(0) !== '#' && option.value.charAt(0) !== '@') newQuery += ((newQuery !== '') ? ' ' : '') + option.label;
      else if (option.value.charAt(0) === '#') newFilters += ' AND hashtags.tag:' + option.value;
      else if (option.value.charAt(0) === '@') newFilters += ' AND tag:' + option.value;
    });

    this.setState({ filters: newFilters, newFilter: {}, query: newQuery }, () => {
      this.setState({ shouldDisplayHitResults: true });
    });
  }

  getSearchBarWidth = () => {
    if (isWidthUp('lg', this.props.width)) return (4 / 12) * 100 + '%';
    else if (isWidthUp('md', this.props.width)) return (6 / 12) * 100 + '%';
    else if (isWidthUp('sm', this.props.width)) return (8 / 12) * 100 + '%';
    else if (isWidthUp('xs', this.props.width)) return 'calc(100% - 32px)';
    return null;
  }

  handleDisplayProfile = (e, hit) => {
    ReactGA.event({ category: 'User', action: 'Display profile' });
    this.setState({ resultsType: 'profile', displayedHit: hit });
  }

  handleReturnToSearch = () => this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });

  shouldSetRootUrl = (rootUrl) => {
    return (this.state.shouldUpdateUrl &&
      this.state.resultsType === 'person' &&
      (window.location.pathname !== rootUrl) &&
      (window.location.pathname !== rootUrl + '/congrats'));
  }

  getHashtagsFilter = () => {
    let wings = this.props.commonStore.getCookie('hashtagsFilter');
    this.props.commonStore.removeCookie('hashtagsFilter');
    if (wings) {
      return wings.split(',');
    } else {
      return [];
    }
  }

  getActionInQueue = () => {
    let action = this.props.commonStore.getCookie('actionInQueue');
    this.props.commonStore.removeCookie('actionInQueue');
    return action
  }

  render() {
    const { shouldDisplayHitResults, filters, newFilter, shouldUpdateUrl, query, hashtagsFilter, actionInQueue } = this.state;
    const { classes } = this.props;

    let profileTag = (this.props.match.params ? this.props.match.params.profileTag : null) || ((actionInQueue && actionInQueue.charAt(0) === '@') ? actionInQueue : null);
    const { locale } = this.props.commonStore;
    const orgTag = this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag;

    let resultsType = ((profileTag && (profileTag.charAt(0) === '@') && !shouldUpdateUrl) ? 'profile' : null) || this.state.resultsType;
    let displayedHit = ((profileTag && !shouldUpdateUrl) ? (this.state.displayedHit || { tag: profileTag }) : null) || this.state.displayedHit;
    let rootUrl = '/' + locale + '/' + orgTag;
    let searchBarWidth = this.getSearchBarWidth();
    let redirectTo, showCongratulation;

    //if (profileTag && profileTag.charAt(0) !== '@') redirectTo = '/' + locale + '/' + orgTag;
    if (profileTag === 'congrats') {
      profileTag = null;
      redirectTo = null;
      resultsType = 'person';
      showCongratulation = true;
    }
    if (redirectTo) {
      return (<Redirect to={redirectTo} />);
    }

    return (
      <React.Fragment>

        <Header handleDisplayProfile={this.handleDisplayProfile} />
        <main>
          {this.shouldSetRootUrl(rootUrl) && (<Redirect to={rootUrl} />)}
          <Grid container direction={'column'} alignItems={'center'}>

              <Suspense fallback={<CircularProgress color='secondary' />}>
                  <BannerResizable  
                    style={{ filter: 'brightness(90%)' }} 
                    type={'organisation'}
                    listenToScroll={true}
                    listenToInteraction={true}
                    initialHeight={80}
                  >
                    <div 
                      className={classes.searchContainer}  
                      style={{
                        width: ((((isWidthDown('sm', this.props.width)))) ? 'calc(100% - 32px)' : searchBarWidth),
                        marginRight: ((((isWidthDown('sm', this.props.width)))) ? 16 : ''),
                        marginLeft: ((((isWidthDown('sm', this.props.width)))) ? 16 : ''),
                      }}
                    >
                      <SearchField updateFilters={this.updateFilters} newFilter={newFilter} />
                      <SearchSuggestions addToFilters={this.addToFilters} filters={filters} query={query} />
                    </div>
                  </BannerResizable>
              </Suspense>

            {shouldDisplayHitResults && (
              <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                <Suspense fallback={<CircularProgress color='secondary' />}>

                  <SearchResults addToFilters={this.addToFilters} handleDisplayProfile={this.handleDisplayProfile}
                    classes={classes} HitComponent={Card} filters={filters} query={query} />
                </Suspense>
              </Grid>
            )}

            {resultsType === 'profile' && (
              <ProfileLayout hit={displayedHit} addToFilters={this.addToFilters} className={classes.profileContainer}
                handleReturnToSearch={this.handleReturnToSearch} />
            )}
          </Grid>

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
        </main>
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
