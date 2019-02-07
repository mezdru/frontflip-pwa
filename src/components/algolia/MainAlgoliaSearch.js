import { CircularProgress, withStyles, Grid } from "@material-ui/core";
import React, { Component } from 'react';
import { inject, observer } from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import AutoCompleteSearchField from "./AutoCompleteSearchField";
import { observe } from 'mobx';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import { styles } from './MainAlgoliaSearch.css'
import ProfileLayout from "../profile/ProfileLayout";
import { Redirect } from 'react-router-dom';
import SearchSuggestions from "./SearchSuggestions";
import Banner from '../../components/utils/banner/Banner';
import algoliasearch from 'algoliasearch'; 
import AlgoliaSearchResults from "./AlgoliaSearchResults";

class MainAlgoliaSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filters: 'type:person',
      refresh: false,
      newFilter: {},
      findByQuery: false,
      displayedHit: null,
      resultsType: this.props.resultsType || 'person',
      shouldUpdateUrl: false,
      shouldDisplayHitResults: true,
      algoliaClient: null,
    }
    this.updateFilters = this.updateFilters.bind(this);
    this.addToFilters = this.addToFilters.bind(this);
    this.handleDisplayProfile = this.handleDisplayProfile.bind(this);
    this.handleReturnToSearch = this.handleReturnToSearch.bind(this);
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.profileTag) {
      this.handleDisplayProfile(null, { tag: nextProp.profileTag });
    }
  }

  componentDidMount() {
    if(this.props.commonStore.algoliaKey)
      this.setState({algoliaClient: algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.props.commonStore.algoliaKey)});

    if (this.props.organisationStore.values.organisation._id) {
      this.props.organisationStore.getAlgoliaKey();
    }

    observe(this.props.commonStore, 'algoliaKey', (change) => {
      this.setState({algoliaClient: algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.props.commonStore.algoliaKey)});
    });
  }

  updateFilters(selectedOptions) {
    this.setState({shouldDisplayHitResults: false});
    let newFilters = '';
    if (selectedOptions.find(elt => elt.value.charAt(0) !== '#' && elt.value.charAt(0) !== '@')) {
      selectedOptions.forEach(option => {
        newFilters += ((newFilters !== '') ? ' ' : '') + option.label;
      });
      this.setState({ findByQuery: true });
    } else {
      this.setState({ findByQuery: false });
      newFilters = 'type:person';
      selectedOptions.forEach(option => {
        if (option.value.charAt(0) === '#') {
          newFilters += ' AND hashtags.tag:' + option.value;
        } else if (option.value.charAt(0) === '@') {
          newFilters += ' AND tag:' + option.value;
        }
      });
    }
    newFilters = newFilters.trim();
    this.setState({ filters: newFilters, newFilter: {} }, () => {
      this.setState({shouldDisplayHitResults: true});
    });
  }

  addToFilters(e, element, shouldAwaitToUpdateLayout) {
    e.preventDefault();
    this.setState({ newFilter: { label: element.name, value: element.tag } });
    if (this.state.resultsType === 'profile') {
      if(shouldAwaitToUpdateLayout) {
        setTimeout(function() {this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });}.bind(this), 600);
      } else {
        this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true });
      }
    }
  }

  handleDisplayProfile(e, hit) {
    if (e) e.preventDefault();
    this.setState({ displayedHit: hit, resultsType: 'profile', displayIn: true });
  }

  handleReturnToSearch() {
    this.setState({ resultsType: 'person', displayedHit: null, shouldUpdateUrl: true, displayIn: false});
  }

  render() {
    const { locale } = this.props.commonStore;
    const { filters, newFilter, shouldUpdateUrl, findByQuery, shouldDisplayHitResults, algoliaClient } = this.state;
    const { HitComponent, classes, profileTag } = this.props;
    const orgTag = this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag;
    const { algoliaKey } = this.props.commonStore;
    let resultsType = ((profileTag && !shouldUpdateUrl) ? 'profile' : null) || this.state.resultsType;
    let displayedHit = ((profileTag && !shouldUpdateUrl) ? { tag: profileTag } : null) || this.state.displayedHit;
    let rootUrl = '/' + locale + (orgTag ? '/' + orgTag : '');
    let searchBarWidth;

    if (isWidthUp('lg', this.props.width)) {
      searchBarWidth = (4 / 12) * 100 + '%';
    }else if (isWidthUp('md', this.props.width)) {
      searchBarWidth = (6 / 12) * 100 + '%';
    } else if (isWidthUp('sm', this.props.width)) {
      searchBarWidth = (8 / 12) * 100 + '%';
    } else if (isWidthUp('xs', this.props.width)) {
      searchBarWidth = 'calc(100% - 32px)';
    }

    if (algoliaKey && algoliaClient) {
      return (
        <div style={{ width: '100%', position: 'relative' }}>

            <div>

              <div  style={{
                      width: ((((isWidthDown('sm', this.props.width)))) ? '75%' : searchBarWidth),
                      marginRight: ((((isWidthDown('sm', this.props.width)))) ? 16 : '') }} 
                    className={classes.searchBar} > 
                <InstantSearch algoliaClient={algoliaClient} indexName={process.env.REACT_APP_ALGOLIA_INDEX} >
                  <Configure highlightPreTag={"<span>"} highlightPostTag={"</span>"} />
                  <AutoCompleteSearchField updateFilters={this.updateFilters} newFilter={newFilter} />
                </InstantSearch>
              </div>

              <Grid container item alignItems={"stretch"} >
                  <Banner style={{filter: 'brightness(90%)'}}>
                  <div style={{ width: searchBarWidth }} className={classes.suggestionsContainer}>
                    {shouldDisplayHitResults && (
                      <InstantSearch algoliaClient={algoliaClient} indexName={process.env.REACT_APP_ALGOLIA_INDEX} >
                        <Configure facetFilters={filters.split(' AND ')} />
                        <SearchSuggestions attribute="hashtags.tag" addToFilters={this.addToFilters} limit={7} currentFilters={filters}/>
                      </InstantSearch>
                    )}
                  </div>
                  </Banner>
              </Grid>
            
              <div className={classes.hitListContainer}>
                {(shouldUpdateUrl && resultsType === 'person' && (window.location.pathname !== rootUrl)) && (<Redirect push to={rootUrl} />)}
                <InstantSearch algoliaClient={algoliaClient} indexName={process.env.REACT_APP_ALGOLIA_INDEX}>
                  {findByQuery && (
                    <Configure query={filters} facetFilters={["type:person"]}
                      highlightPreTag={"<span>"} highlightPostTag={"</span>"}
                      attributesToHighlight={["intro:40", "description:40", "name:40"]} attributesToSnippet={["intro:8"]} />
                  )}
                  {!findByQuery && (
                    <Configure filters={filters} attributesToSnippet={["intro:12"]} />
                  )}
                  
                  {HitComponent && shouldDisplayHitResults && (
                    <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                      <AlgoliaSearchResults addToFilters={this.addToFilters} handleDisplayProfile={this.handleDisplayProfile} 
                                            classes={classes} HitComponent={HitComponent} />
                    </Grid>
                  )}
                  {!HitComponent && (
                    <Hits className={classes.hitList} />
                  )}
                </InstantSearch>
              </div>
            </div>

            {((resultsType === 'profile') && (window.location.pathname !== rootUrl + '/' + displayedHit.tag)) && (
              <Redirect push to={rootUrl + '/' + displayedHit.tag} />
            )}
            {resultsType === 'profile' && (
                <ProfileLayout hit={displayedHit} addToFilters={this.addToFilters} className={classes.profileContainer}
                    handleReturnToSearch={this.handleReturnToSearch}/>
            )}
          </div>
      )
    } else {
      return (
        <CircularProgress color="primary" />
      )
    }
  }
}

export default inject('commonStore', 'organisationStore')(
  observer(
    withWidth()(withStyles(styles)(MainAlgoliaSearch))
  )
);
