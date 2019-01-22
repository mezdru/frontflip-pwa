import { CircularProgress, withStyles, Grid } from "@material-ui/core";
import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import AutoCompleteSearchField from "./AutoCompleteSearchField";
import { observe } from 'mobx';
import { StickyContainer, Sticky } from 'react-sticky';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {styles} from './MainAlgoliaSearch.css'
import ProfileLayout from "../profile/ProfileLayout";

class MainAlgoliaSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null,
            filters: 'type:person',
            refresh: false,
            newFilter: {},
            displayedHit: null
        }
        this.updateFilters = this.updateFilters.bind(this);
        this.addToFilters = this.addToFilters.bind(this);
        this.handleDisplayProfile = this.handleDisplayProfile.bind(this);
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
        this.setState({filters: newFilters, newFilter: {}});
    }

    addToFilters(e, element) {
        e.preventDefault();
        this.setState({newFilter: {label: element.name, value: element.tag}});
    }

    handleDisplayProfile(e, hit) {
        e.preventDefault();
        this.setState({displayedHit: hit});
        this.setState({resultsType: 'profile'});
        console.log(hit);
    }

    render() {
        const {algoliaKey, filters, newFilter, displayedHit} = this.state;
        const { HitComponent, classes, resultsType } = this.props;

        if(algoliaKey) {
            return(
                    
                <StickyContainer style={{width:'100%', position: 'relative'}} >
                    <div className={classes.searchBarMarginTop}></div>
                    <Sticky topOffset={(isWidthUp('md', this.props.width)) ? 131 : 39}>
                        {({style}) => (
                            <div style={{...style}} className={classes.searchBar}>
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
                                                    <HitComponent hit={hit.hit} addToFilters={this.addToFilters} />
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
                    {resultsType === 'profile' &&(
                        <ProfileLayout hit={displayedHit} />
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
