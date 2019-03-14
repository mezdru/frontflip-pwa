import React from 'react'
import { Grid, withStyles } from '@material-ui/core';
import { inject, observer } from "mobx-react";
import Header from '../components/header/Header';
import { Redirect } from "react-router-dom";
import SearchField from '../components/algolia/SearchField';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import { styles } from './SearchPage.css';
import ProfileLayout from "../components/profile/ProfileLayout";
import Banner from '../components/utils/banner/Banner';
import SearchSuggestions from '../components/algolia/SearchSuggestions';
import SearchResults from '../components/algolia/SearchResults';
import Card from '../components/card/CardProfile';
import ReactGA from 'react-ga';
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
    };
  }

  componentDidMount() {
    ReactGA.pageview(window.location.pathname);
    this.props.history.listen((location, action) => ReactGA.pageview(window.location.pathname));
  }

  addToFilters = (e, element, shouldAwaitToUpdateLayout) => {
    e.preventDefault();
    this.setState({ newFilter: { label: element.name, value: element.tag } });
    if (this.state.resultsType === 'profile') {
      if(shouldAwaitToUpdateLayout) {
        setTimeout(function() {this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });}.bind(this), 500);
      } else {
        this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });
      }
    }
  }

  updateFilters = (selectedOptions) => {
    if(!selectedOptions) return;
    ReactGA.event({category: 'Search',action: 'Perform search'});
    this.setState({shouldDisplayHitResults: false});
    let newFilters = 'type:person';
    let newQuery = '';

    selectedOptions.forEach(option => {
      if(option.value.charAt(0) !== '#' && option.value.charAt(0) !== '@') newQuery += ((newQuery !== '') ? ' ' : '') + option.label;
      else if (option.value.charAt(0) === '#') newFilters += ' AND hashtags.tag:' + option.value;
      else if (option.value.charAt(0) === '@') newFilters += ' AND tag:' + option.value;
    });

    this.setState({ filters: newFilters, newFilter: {}, query: newQuery }, () => {
      this.setState({shouldDisplayHitResults: true});
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
    ReactGA.event({category: 'User',action: 'Display profile'});
    this.setState({resultsType: 'profile', displayedHit: hit});
  }

  handleReturnToSearch = () => this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true});

  render() {
    const { shouldDisplayHitResults, filters, newFilter, shouldUpdateUrl, query } = this.state;
    const { classes } = this.props;

    let profileTag = (this.props.match.params ? this.props.match.params.profileTag : null);
    const { locale } = this.props.commonStore;
    const orgTag = this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag;

    let resultsType = ((profileTag && !shouldUpdateUrl) ? 'profile' : null) || this.state.resultsType;
    let displayedHit = ((profileTag && !shouldUpdateUrl) ? (this.state.displayedHit || { tag: profileTag }) : null) || this.state.displayedHit;
    let rootUrl = '/' + locale + (orgTag ? '/' + orgTag : '');
    let searchBarWidth = this.getSearchBarWidth();
    let redirectTo;


    if (profileTag && profileTag.charAt(0) !== '@') redirectTo = '/' + locale + '/' + orgTag;
    if (redirectTo) {
      return (<Redirect to={redirectTo} />);
    }

    
    return (
      <div>
        <Header handleDisplayProfile={this.handleDisplayProfile}/>
        <main>
          {(shouldUpdateUrl && resultsType === 'person' && (window.location.pathname !== rootUrl)) && (<Redirect to={rootUrl} />)}
          <Grid container direction={'column'} alignItems={'center'}>
            
            <div  style={{  width: ((((isWidthDown('sm', this.props.width)))) ? '75%' : searchBarWidth),
                            marginRight: ((((isWidthDown('sm', this.props.width)))) ? 16 : '') }} 
                  className={classes.searchBar} > 
              <SearchField updateFilters={this.updateFilters} newFilter={newFilter}/>
            </div>

            <Grid container item alignItems={"stretch"} >
                  <Banner style={{filter: 'brightness(90%)'}}>
                    <div style={{ width: searchBarWidth }} className={classes.suggestionsContainer}>
                      {shouldDisplayHitResults && (
                        <SearchSuggestions  addToFilters={this.addToFilters} filters={filters} query={query} />
                      )}
                    </div>
                  </Banner>
            </Grid>

            {shouldDisplayHitResults && (
              <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                <SearchResults addToFilters={this.addToFilters} handleDisplayProfile={this.handleDisplayProfile} 
                                      classes={classes} HitComponent={Card} filters={filters} query={query}/>
              </Grid>
            )}

            {resultsType === 'profile' && (
                <ProfileLayout hit={displayedHit} addToFilters={this.addToFilters} className={classes.profileContainer}
                    handleReturnToSearch={this.handleReturnToSearch}/>
            )}

          </Grid>
        </main>
      </div>
    );
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withWidth()(withStyles(styles)(SearchPage))
  )
);
