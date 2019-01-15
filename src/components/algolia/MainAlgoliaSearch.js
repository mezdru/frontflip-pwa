import { CircularProgress, withStyles } from "@material-ui/core";
import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import AutoCompleteSearchField from "./AutoCompleteSearchField";
import { observe } from 'mobx';
import { StickyContainer, Sticky } from 'react-sticky';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
import {styles} from './MainAlgoliaSearch.css'

class MainAlgoliaSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null,
            filters: 'type:person',
            refresh: false,
            newFilter: {},
            findByQuery: false
        }
        this.updateFilters = this.updateFilters.bind(this);
        this.addToFilters = this.addToFilters.bind(this);
    }

    componentDidMount() {
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
        let newFilters = '';
        if(selectedOptions.find(elt => elt.value.charAt(0) !== '#' && elt.value.charAt(0) !== '@')){
            selectedOptions.forEach(option => {
                newFilters += ' '+ option.label;
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
                }else {
                    newFilters += ' AND intro:\''+option.value+'\'';
                }
            });
        }
        
        this.setState({filters: newFilters, newFilter: {}});
    }

    addToFilters(e, element) {
        e.preventDefault();
        this.setState({newFilter: {label: element.name, value: element.tag}});
    }

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey, filters, newFilter, findByQuery} = this.state;
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
                                {findByQuery && (
                                    <Configure query={filters} filters={"type:person"}/>
                                )}
                                {!findByQuery && (
                                    <Configure filters={filters}  />
                                )}
                                {HitComponent &&  (
                                    <Hits 
                                        hitComponent={hit => <HitComponent hit={hit.hit} addToFilters={this.addToFilters} />}
                                        className={classes.hitList}/>
                                )}
                                { !HitComponent && (
                                    <Hits className={classes.hitList}/>
                                )}
                            </InstantSearch>
                        </div>

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
