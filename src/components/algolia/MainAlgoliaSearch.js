import { CircularProgress, withStyles, Grid, IconButton } from "@material-ui/core";
import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import AutoCompleteSearchField from "./AutoCompleteSearchField";
import { observe } from 'mobx';
import { StickyContainer, Sticky } from 'react-sticky';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {styles} from './MainAlgoliaSearch.css'
import ProfileLayout from "../profile/ProfileLayout";
import { Redirect } from 'react-router-dom';
import { ArrowBack } from "@material-ui/icons";

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
            shouldUpdateUrl: false
        }
        this.updateFilters = this.updateFilters.bind(this);
        this.addToFilters = this.addToFilters.bind(this);
        this.handleDisplayProfile = this.handleDisplayProfile.bind(this);
        this.handleReturnToSearch = this.handleReturnToSearch.bind(this);
    }

    componentWillReceiveProps(nextProp) {
        if(nextProp.profileTag) {
            this.handleDisplayProfile(null, {tag: nextProp.profileTag});
        }
    }

    componentDidMount() {
        if(this.props.organisationStore.values.organisation._id){
            this.props.organisationStore.getAlgoliaKey();
        }

        observe(this.props.commonStore, 'algoliaKey', (change) => {
            this.forceUpdate();
        });
    }
    
    updateFilters(selectedOptions) {
        let newFilters = '';
        if(selectedOptions.find(elt => elt.value.charAt(0) !== '#' && elt.value.charAt(0) !== '@')){
            selectedOptions.forEach(option => {
                newFilters += ( (newFilters !== '') ? ' ' : '') + option.label;
            });
            this.setState({findByQuery: true});
        }else{
            this.setState({findByQuery: false});
            newFilters = 'type:person';
            selectedOptions.forEach(option => {
                if(option.value.charAt(0) === '#'){
                    newFilters += ' AND hashtags.tag:'+option.value;
                }else if(option.value.charAt(0) === '@'){
                    newFilters += ' AND tag:'+option.value;
                }
            });
        }
        newFilters = newFilters.trim();
        this.setState({filters: newFilters, newFilter: {}});
    }

    addToFilters(e, element) {
        e.preventDefault();
        this.setState({newFilter: {label: element.name, value: element.tag}});
        if(this.state.resultsType === 'profile') {
            this.setState({resultsType: 'person', displayedHit: null, shouldUpdateUrl: true});
        }
    }

    handleDisplayProfile(e, hit) {
        if(e) e.preventDefault();
        this.setState({displayedHit: hit, resultsType: 'profile'});
    }

    handleReturnToSearch() {
        this.setState({resultsType: 'person', displayedHit: null, shouldUpdateUrl: true});
    }

    render() {
        const {locale} = this.props.commonStore;
        const { filters, newFilter, shouldUpdateUrl, findByQuery} = this.state;
        const { HitComponent, classes, profileTag } = this.props;
        const orgTag = this.props.organisationStore.values.orgTag || this.props.organisationStore.values.organisation.tag;
        const { algoliaKey } = this.props.commonStore;
        let resultsType = ( (profileTag && !shouldUpdateUrl) ? 'profile' : null) || this.state.resultsType;
        let displayedHit = ( (profileTag && !shouldUpdateUrl) ? {tag: profileTag} : null) || this.state.displayedHit;
        let rootUrl = '/' + locale + (orgTag ? '/' + orgTag : '');
        
        let searchBarWidth;
        if(isWidthUp('lg', this.props.width)){
            searchBarWidth = (4/12)*100 + '%';
        }else if(isWidthUp('sm', this.props.width)){
            searchBarWidth = (6/12)*100 + '%';
        }else if(isWidthUp('xs', this.props.width)){
            searchBarWidth = (10/12)*100 + '%';
        }

        if(algoliaKey) {
            return(
                    
                <StickyContainer style={{width:'100%', position: 'relative'}} >
                    {resultsType === 'profile' && (
                        <IconButton aria-label="Edit" className={classes.returnButton} onClick={this.handleReturnToSearch}>
                            <ArrowBack fontSize="large"  />
                        </IconButton>
                    )}
                    <div className={classes.searchBarMarginTop}></div>
                    <Sticky topOffset={(isWidthUp('md', this.props.width)) ? 131 : 39}>
                        {({style}) => (
                            <div style={{...style, width: searchBarWidth }} className={(resultsType !== 'profile') ? classes.searchBar : classes.searchBarProfile}>
                                <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                                indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                                apiKey={algoliaKey} >
                                    <AutoCompleteSearchField updateFilters={this.updateFilters} newFilter={newFilter}/>
                                </InstantSearch>
                            </div>
                        )}
                    </Sticky>

                    {/* Search results */}
                    {resultsType === 'person' && (
                        <div className={classes.hitListContainer}>
                                { (shouldUpdateUrl && (window.location.pathname !== rootUrl) ) && (<Redirect push to={rootUrl} />)}
                                <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                        indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                        apiKey={algoliaKey}>
                                {findByQuery && (
                                    <Configure query={filters} facetFilters={["type:person"]}
                                        highlightPreTag={"<span>"} highlightPostTag={"</span>"} attributesToSnippet={["intro:15", "description:15"]}/>
                                )}
                                {!findByQuery && (
                                    <Configure filters={filters}  />
                                )}
                                {HitComponent &&  (
                                    // <Grid container xs={12} sm={6}>
                                    <Grid container direction={"column"} justify={"space-around"} alignItems={"center"}>
                                        <Hits 
                                            hitComponent={hit => (
                                                <Grid item xs={10} sm={6} lg={4}>
                                                    <HitComponent hit={hit.hit} addToFilters={this.addToFilters} handleDisplayProfile={this.handleDisplayProfile} />
                                                </Grid>
                                            )}
                                            className={classes.hitList}/>
                                    </Grid>
                                )}
                                { !HitComponent && (
                                    <Hits className={classes.hitList}/>
                                )}
                            </InstantSearch>
                        </div>
                    )}
                    {((resultsType === 'profile') && (window.location.pathname !== rootUrl + '/' + displayedHit.tag)) && (
                        <Redirect push to={rootUrl + '/' + displayedHit.tag } />
                    )}
                    {resultsType === 'profile' && (
                                <ProfileLayout hit={displayedHit} addToFilters={this.addToFilters} className={classes.hitListContainerWithoutMargin}/>
                    )}
                </StickyContainer>
            )
        }else{
            return(
                <CircularProgress color="primary"/>
            )
        }
    }
}

export default inject('commonStore', 'organisationStore')(
    observer(
        withWidth()(withStyles(styles)(MainAlgoliaSearch))
        )
);
