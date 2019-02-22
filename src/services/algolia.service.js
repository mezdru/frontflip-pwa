import commonStore from '../stores/common.store';
import algoliasearch  from 'algoliasearch';
import organisationStore from '../stores/organisation.store';

class AlgoliaService {

  index;
  indexName = 'world';
  client;
  algoliaKey;

  constructor(algoliaKey) {
    if(!algoliaKey) return;
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, algoliaKey);
    this.index = this.client.initIndex(this.indexName);
  }

  setAlgoliaKey(algoliaKey) {
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(process.env.REACT_APP_ALGOLIA_APPLICATION_ID, algoliaKey);
    this.index = this.client.initIndex(this.indexName);
  }

  fetchFacetValues(lastSelection, privateOnly) {
    return new Promise((resolve, reject) => {
      this.index.searchForFacetValues({
        facetName: 'hashtags.tag',
        query: '',
        facetQuery: '',
        filters: '',
        hitsPerPage: 40,
        facetFilters: this.makeFacetFilters(lastSelection, privateOnly),
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


}



export default new AlgoliaService(commonStore.algoliaKey);