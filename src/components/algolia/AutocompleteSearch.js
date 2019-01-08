import { TextField, CircularProgress, withStyles } from "@material-ui/core";
import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits } from "react-instantsearch-dom";
import MaterialSearchBox from "./MaterialSearchBox";
import UrlService from '../../services/url.service';
import { observe } from 'mobx';

const styles = {
    hitList: {
        width: '100%',
        '& ul': {
            listStyleType: 'none',
            padding:0
        }
    },
    fullWidth: {
        width: '100%'
    }
};

class AutocompleteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null
        }
    }

    componentDidMount() {
        observe(this.props.organisationStore.values, 'orgTag', (change) => {
            this.props.organisationStore.getAlgoliaKey()
            .then((algoliaKey) => {
                this.setState({algoliaKey: algoliaKey});
            }).catch((err) => {
                // window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
            });
        });
    }

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey} = this.state;
        const { hitComponent, classes } = this.props;

        if(algoliaKey) {
            return(
                <div className={classes.fullWidth}>
                    <InstantSearch  appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} 
                                    indexName={process.env.REACT_APP_ALGOLIA_INDEX} 
                                    apiKey={algoliaKey} >
                        <MaterialSearchBox/>
                        {hitComponent &&  (
                            <Hits hitComponent={hitComponent} className={classes.hitList}/>
                        )}
                        { !hitComponent && (
                            <Hits className={classes.hitList}/>
                        )}
                    </InstantSearch>
                </div>
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
        withStyles(styles)(AutocompleteSearch)
        )
    );
        