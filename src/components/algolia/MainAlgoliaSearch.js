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
            algoliaKey: null,
            filters: 'type:person',
            refresh: false,
            newFilter: {},
            displayedHit: this.props.profileTag ? {tag: this.props.profileTag} : null,
            resultsType: this.props.resultsType || 'person',
            shouldUpdateUrl: false
        }
        this.updateFilters = this.updateFilters.bind(this);
        this.addToFilters = this.addToFilters.bind(this);
        this.handleDisplayProfile = this.handleDisplayProfile.bind(this);
        this.handleReturnToSearch = this.handleReturnToSearch.bind(this);
    }

    componentDidMount() {
        if(this.props.organisationStore.values.organisation._id){
            this.props.organisationStore.getAlgoliaKey()
            .then((algoliaKey) => {
                this.setState({algoliaKey: algoliaKey});
            }).catch((err) => {
                // window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
            });
        }
        observe(this.props.organisationStore.values, 'organisation', (change) => {
            if(this.props.organisationStore.values.organisation._id){
                this.props.organisationStore.getAlgoliaKey()
                .then((algoliaKey) => {
                    this.setState({algoliaKey: algoliaKey});
                }).catch((err) => {
                    // window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
                });
            }
        });
    }
    
    updateFilters(selectedOptions) {
        let newFilters = 'type:person';
        selectedOptions.forEach(option => {
            if(option.value.charAt(0) === '#'){
                newFilters += ' AND hashtags.tag:'+option.value;
            }else if(option.value.charAt(0) === '@'){
                newFilters += ' AND tag:'+option.value;
            }
        });
        if(this.state.resultsType === 'profile') {
            this.setState({resultsType: 'person', displayedHit: null, shouldUpdateUrl: true});
        }
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
        e.preventDefault();
        this.setState({displayedHit: hit});
        this.setState({resultsType: 'profile'});
    }

    handleReturnToSearch() {
        this.setState({resultsType: 'person', displayedHit: null, shouldUpdateUrl: true});
    }

    render() {
        const {algoliaKey, filters, newFilter, displayedHit, resultsType, shouldUpdateUrl} = this.state;
        const { HitComponent, classes } = this.props;
        const { locale } = this.props.commonStore;
        const { orgTag } = this.props.organisationStore.values;

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
                            <div style={{...style, width: '50%'}} className={(resultsType !== 'profile') ? classes.searchBar : classes.searchBarProfile}>
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
                            {shouldUpdateUrl && (<Redirect push to={'/' + locale + '/' + orgTag + '/search'} />)}
                            
                            <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                            indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                            apiKey={algoliaKey}>

                                <Configure filters={filters} />
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
                    {resultsType === 'profile' && (
                        <Redirect push to={'/' + locale + '/' + orgTag + '/search/profile/' + displayedHit.tag } />
                    )}
                    {resultsType === 'profile' && (
                        <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                        indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                        apiKey={algoliaKey}>
                            <Configure filters={'type:person AND tag:'+displayedHit.tag} />
                            <Hits hitComponent={hit => (
                                <ProfileLayout hit={hit.hit} addToFilters={this.addToFilters} />
                            )} className={classes.hitListContainerWithoutMargin} />
                            
                        </InstantSearch>
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
