import commonStore from '../stores/common.store';
import algoliasearch  from 'algoliasearch';
import orgStore from '../stores/organisation.store';
import {observe} from 'mobx';
import statisticsStore from '../stores/statistics.store';

class AlgoliaService {

  index;
  indexName = 'world';
  client;
  algoliaKey;

  constructor(algoliaKey) {
    if(algoliaKey) {
      this.algoliaKey = algoliaKey;
      this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.algoliaKey);
      this.index = this.client.initIndex(this.indexName);
      let aKeyObject = orgStore.getAlgoliaKey(orgStore.currentOrganisation._id);
      aKeyObject.initialized = true;
    } else {
      let org = orgStore.currentOrganisation;
      if(org) orgStore.fetchAlgoliaKey(org._id, org.public);
    }

    observe(orgStore, 'currentAlgoliaKey', (change) => {
      if(this.client) this.client.clearCache();
      if(!orgStore.currentAlgoliaKey && orgStore.currentOrganisation) {
        orgStore.fetchAlgoliaKey(orgStore.currentOrganisation._id, orgStore.currentOrganisation.public);
      } else {
        this.algoliaKey = orgStore.currentAlgoliaKey.value;
        this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, this.algoliaKey);
        this.index = this.client.initIndex(this.indexName);
        let aKeyObject = orgStore.getAlgoliaKey(orgStore.currentOrganisation._id);
        aKeyObject.initialized = true;
      }
    });
  }

  setAlgoliaKey(algoliaKey) {
    if(!algoliaKey) return;
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, algoliaKey);
    this.index = this.client.initIndex(this.indexName);
    let aKeyObject = orgStore.getAlgoliaKey(orgStore.currentOrganisation._id);
    aKeyObject.initialized = true;
  }

  fetchFacetValues(lastSelection, privateOnly, filters, query) {
    if(!this.index) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.index.searchForFacetValues({
        facetName: 'hashtags.tag',
        query: query || '',
        facetQuery: '',
        filters: (filters ? filters : ''),
        maxFacetHits: 40,
        facetFilters:( (lastSelection && privateOnly !== null) ? this.makeFacetFilters(lastSelection, privateOnly) : ''),
      }, (err, res) => {
        if(err) return resolve(res);
        return resolve(res);
      });
    });
  }

  fetchHashtags(families) {
    if(!this.index) return Promise.resolve();
    let filters = ['type:hashtag'];
    families.forEach(family => { if(family) filters.push('hashtags.tag:'+family.tag)});

    return new Promise((resolve, reject) => {
      this.index.search({
        facetFilters: filters,
        maxFacetHits: 40,
      }, (err, res) => {
        if(err) return resolve(res);
        return resolve(res);
      });
    });
  }

  makeFacetFilters(lastSelection, privateOnly) {
    let query = [];
    if(privateOnly) query.push('organisation:'+orgStore.currentOrganisation._id);
    if(lastSelection) query.push('hashtags.tag:'+lastSelection.tag);
    return query;
  }

  loadBank(filters) {
    if(!this.index) return Promise.resolve();
    return new Promise((resolve, reject) => {
      let currentBank = commonStore.getLocalStorage('wingsBank', true);
      if(!filters && currentBank && currentBank.length > 0) resolve();
      this.index.search({
        filters: (filters ? 'type:hashtag AND ' + filters : 'type:hashtag'),
        hitsPerPage: 50
      }, (err, content) => {
        this.addToLocalStorage(content.hits).then(() => {resolve()});
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
        let index = currentBank.findIndex(elt => elt.tag === hit.Tag);
        if(index === -1) currentBank.push(hit);
        else currentBank[index] = hit;
      });
      commonStore.setLocalStorage('wingsBank', currentBank, true)
      .then(() => {resolve()});
    });
  }

  fetchOptions(inputValue, hashtagOnly, wingsFamily, hitsParPage){
    if(!this.index) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.index.search({
          query: inputValue,
          filters: this.makeOptionsFilters(hashtagOnly, wingsFamily),
          attributesToRetrieve: ['type','name', 'name_translated', 'tag','picture', 'hashtags'],
          restrictSearchableAttributes: ['name', 'name_translated', 'tag'],
          highlightPreTag: '<span>',
          highlightPostTag: '</span>',
          hitsPerPage: hitsParPage || 5
        }, (err, content) => resolve(content));
    });
  }

  makeOptionsFilters(hashtagOnly, wingsFamily) {
    let filter = '';
    if(hashtagOnly) filter += 'type:hashtag';
    if(wingsFamily) filter += ' AND hashtags.tag:'+wingsFamily;
    return filter;
  }


  fetchHits(filters, query, facetFilters, page, logSearch, hitsPerPage) {
    if(!this.index) return Promise.resolve();
    return new Promise((resolve, reject) => {
      this.index.search({
        page : page || 0,
        query: query || '',
        facetFilters: facetFilters || '',
        filters: filters || 'type:person',
        hitsPerPage: hitsPerPage || 30,
        attributesToSnippet: [
          "intro:"+15,
          "description:"+15
        ],
      }, (err, content) => {
        if(err) return resolve(content);
        if(!content) return resolve(null);

        if(logSearch) this.logCurrentSearch( (content.nbHits || null) );

        return resolve(content)
      });
    });
  }

  logCurrentSearch(resultsCount) {
    let searchFilters = commonStore.searchFilters || [];
    let tagsArray = [];
    let query = '';

    searchFilters.forEach(filter => {
      if (filter.tag.charAt(0) !== '#' && filter.tag.charAt(0) !== '@') query += ((query !== '') ? ' ' : '') + filter.name;
      else tagsArray.push(filter.tag);
    });

    statisticsStore.postSearchLog(null, tagsArray, query, resultsCount);
  }

}

export default new AlgoliaService(commonStore.algoliaKey);