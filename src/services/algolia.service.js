import commonStore from '../stores/common.store';
import algoliasearch  from 'algoliasearch';
import organisationStore from '../stores/organisation.store';

class AlgoliaService {

  index;
  indexName = 'world';
  client;

  constructor(algoliaKey) {
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


}



export default AlgoliaService;