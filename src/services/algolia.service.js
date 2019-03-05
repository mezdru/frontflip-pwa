import commonStore from '../stores/common.store';
import algoliasearch  from 'algoliasearch';
import organisationStore from '../stores/organisation.store';
import {observe} from 'mobx';

class AlgoliaService {

  index;
  indexName = 'world';
  client;
  algoliaKey;

  constructor(algoliaKey) {
    if(!algoliaKey) return;
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.algoliaKey);
    this.index = this.client.initIndex(this.indexName);

    observe(commonStore, 'algoliaKey', (change) => {
      this.client.clearCache();
      this.algoliaKey = commonStore.algoliaKey;
      this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.algoliaKey);
      this.index = this.client.initIndex(this.indexName);
    });
  }

  setAlgoliaKey(algoliaKey) {
    if(!algoliaKey) return;
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, algoliaKey);
    this.index = this.client.initIndex(this.indexName);
  }

  fetchFacetValues(lastSelection, privateOnly, filters, query) {
    return new Promise((resolve, reject) => {
      this.index.searchForFacetValues({
        facetName: 'hashtags.tag',
        query: query || '',
        facetQuery: '',
        filters: (filters ? filters : ''),
        hitsPerPage: 40,
        facetFilters:( (lastSelection && privateOnly !== null) ? this.makeFacetFilters(lastSelection, privateOnly) : ''),
      }, (err, res) => {
        if(err) return reject(err);
        return resolve(res);
      });
    });
  }

  makeFacetFilters(lastSelection, privateOnly) {
    let query = [];
    if(privateOnly) query.push('organisation:'+organisationStore.values.organisation._id);
    if(lastSelection) query.push('hashtags.tag:'+lastSelection.tag);
    return query;
  }

  loadBank(filters) {
    return new Promise((resolve, reject) => {
      if(!filters && commonStore.getLocalStorage('wingsBank', true)) resolve();
      this.index.search({
        filters: (filters ? 'type:hashtag AND ' + filters : 'type:hashtag'),
        hitsPerPage: 50
      }, (err, content) => {
        this.addToLocalStorage(content.hits).then(resolve());
      });
    });
  }

  /**
   * @description Add or update local bank and remove duplicate entries
   */
  addToLocalStorage(hits) {
    return new Promise((resolve, reject) => {
      let currentBank = commonStore.getLocalStorage('wingsBank', true) || [];
      hits.forEach(hit => {
        if(!currentBank.some(bankElt => bankElt.tag === hit.tag))
          currentBank.push(hit);
      });
      commonStore.setLocalStorage('wingsBank', currentBank, true)
      .then(resolve());
    });
  }

  fetchOptions(inputValue){
    return new Promise((resolve, reject) => {
      this.index.search({
          query: inputValue,
          attributesToRetrieve: ['type','name', 'name_translated', 'tag','picture'],
          restrictSearchableAttributes: ['name', 'name_translated', 'tag'],
          highlightPreTag: '<span>',
          highlightPostTag: '</span>',
          hitsPerPage: 5
        }, (err, content) => resolve(content));
    });
  }


  fetchHits(filters, query, facetFilters, page) {
    return new Promise((resolve, reject) => {
      this.index.search({
        page : page || 0,
        query: query || '',
        facetFilters: facetFilters || '',
        filters: filters || 'type:person',
        hitsPerPage: 20,
        attributesToSnippet: [
          "intro:"+15,
          "description:"+15
        ],
      }, (err, content) => {
        if(err) return reject(err);
        if(!content) return reject();
        return resolve(content)
      });
    });
  }


}



export default new AlgoliaService(commonStore.algoliaKey);