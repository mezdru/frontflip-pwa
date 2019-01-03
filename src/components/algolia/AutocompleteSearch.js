import { TextField, CircularProgress } from "@material-ui/core";
import React, { Component } from 'react';
import {FormattedMessage} from 'react-intl';
import {inject, observer} from "mobx-react";
import { InstantSearch, Hits } from "react-instantsearch-dom";
import MaterialSearchBox from "./MaterialSearchBox";
import UrlService from '../../services/url.service';

class AutocompleteSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            algoliaKey: null
        }
    }

    componentDidMount() {
        this.props.organisationStore.setOrgTag('wingzy');
        this.props.organisationStore.getOrganisationForPublic()
        .then((res) => {
            this.props.organisationStore.getAlgoliaKey()
            .then((algoliaKey) => {
                this.setState({algoliaKey: algoliaKey});
            }).catch((err) => {
                window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
            });
        }).catch(err => {
            window.location.href = UrlService.createUrl(window.location.host, '/', undefined);
        })
    }

    render() {
        const {locale} = this.props.commonStore;
        const {algoliaKey} = this.state;

        if(algoliaKey) {
            return(
                <div>
                    <InstantSearch appId={process.env.REACT_APP_ALGOLIA_APPLICATION_ID} indexName={process.env.REACT_APP_ALGOLIA_INDEX} apiKey={algoliaKey}>
                        <MaterialSearchBox />
                        <Hits />
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
            AutocompleteSearch
        )
    );
        