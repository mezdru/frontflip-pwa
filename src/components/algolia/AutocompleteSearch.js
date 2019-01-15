import { CircularProgress, withStyles, Grid } from "@material-ui/core";
import React, { Component } from 'react';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits, Configure } from "react-instantsearch-dom";
import MaterialSearchBox from "./MaterialSearchBox";
import { observe, autorun } from 'mobx';
import { StickyContainer, Sticky } from 'react-sticky';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';

const styles = theme => ({
    hitListContainer: {
        position: 'relative',
        top: 60,
        [theme.breakpoints.up('md')]: {
            top: 150,
        },
        width: '100%',
    },
    hitList: {
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0,
            marginTop: '32px',
            marginBottom: '32px',
        },
        '& ul li': {
            marginBottom: '32px'
        },
        '& ul li > div:first-child' : {
            position: 'relative',
            left: '0',
            right: '0',
            margin: 'auto'
        }
    },
    fullWidth: {
        width: '100%'
    },
    searchBar: {
        left: 0,
        right: 0,
        margin: 'auto',
        zIndex: 1000,
        marginTop:21,
        background: 'transparent',
    },
    searchBarMarginTop: {
        position: 'static',
        marginTop:59, // 147 - 24 - 64
        [theme.breakpoints.up('md')]: {
            marginTop: 151, //239 - 24 - 64
        },
        width: '100%',
    }
});

class AutocompleteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null,
            filters: 'type:person',
            refresh: false,
            newFilter: {}
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

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey, filters, newFilter} = this.state;
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
                                    <MaterialSearchBox updateFilters={this.updateFilters} newFilter={newFilter}/>
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
        withWidth()(withStyles(styles)(AutocompleteSearch))
        )
);
