import AlgoliaService from './algolia.service';
import commonStore from '../stores/common.store';
import { observable, decorate } from 'mobx';
import undefsafe from 'undefsafe';

class SuggestionsService {

  constructor() {
    this._currentSuggestions = [];
    this._bank = [];
    this._workInProgress = false;
    this._user = [];
    this._randomNumber = 0;

    this._newSuggestions = [];
  }

  //todo useless?
  async init(algoliaKey) {
    await AlgoliaService.setAlgoliaKey(algoliaKey);
    this._bank = await this.syncBank(null);
  }


  getSuggestions = async (wingSelected, query, featuredWingFamily) => {
    let suggestions = [];
    let sameFamiliesHits = [];
    let commonWithSelectedHits = [];
    let commonHits = [];

    try {

      // get sisters wings & children
      if (wingSelected && wingSelected.hashtags && wingSelected.hashtags.length > 0) {
        for (var i = 0; i < wingSelected.hashtags.length; i++) {
          let sameFamily = await AlgoliaService.fetchHashtags([wingSelected.hashtags[i], featuredWingFamily]);
          sameFamiliesHits = sameFamiliesHits.concat(sameFamily.hits);
        }
      }

      // get common wings in organisation with wingSelected if there is
      if (wingSelected && ! featuredWingFamily)
        commonWithSelectedHits = (await AlgoliaService.fetchFacetValues(wingSelected, false, null, query)).facetHits;

    } catch (e) {
      console.log("Can't customize suggestions : ", e);
      suggestions = [];
    }

    // get common wings in organisation
    if(!query && ! featuredWingFamily)
      commonHits = (await AlgoliaService.fetchFacetValues(null, false, null, null)).facetHits;

    suggestions = suggestions.concat(sameFamiliesHits.slice(0, 6));
    suggestions = suggestions.concat(commonWithSelectedHits.slice(0, 3));
    suggestions = suggestions.concat(commonHits.slice(0, (15 - suggestions.length)));

    if (suggestions.length <= 15) {
      let classicOptions = await AlgoliaService.fetchOptions(query, true, undefsafe(featuredWingFamily, 'tag'), 40);
      if (classicOptions) suggestions = suggestions.concat(classicOptions.hits);
    }

    suggestions = await this.upgradeData(suggestions);
    return suggestions;
  }

  /**
   * @description Get suggestions for onboard
   * @param lastSelection can be the latest wings chosen
   * @param query the current entry of the User in search field
   */
  getOnboardSuggestions = async (lastSelection, query, wingsFamily) => {
    let suggestions = [];

    try {
      if (lastSelection && !wingsFamily) {
        // get more common wings link to selected one
        let commonHits = (await AlgoliaService.fetchFacetValues(lastSelection, false, null, query)).facetHits;

        // get children wings
        let childrenHits = (await AlgoliaService.fetchHashtags(lastSelection)).hits;

        // get all wings in same family
        let sameFamilyHits = [];
        if (lastSelection.hashtags) {
          for (var i = 0; i < lastSelection.hashtags.length; i++) {
            let sameFamily = await AlgoliaService.fetchHashtags(lastSelection.hashtags[i]);
            sameFamilyHits = sameFamilyHits.concat(sameFamily.hits);
          }
        }

        suggestions = suggestions.concat(childrenHits.slice(0, 3));
        suggestions = suggestions.concat(sameFamilyHits.slice(0, 3));
        suggestions = suggestions.concat(commonHits.slice(0, 3));
      }
    } catch (e) {
      console.log("Can't customize suggestions.");
      suggestions = [];
    }

    if (suggestions.length <= 6) {
      let classicOptions = await AlgoliaService.fetchOptions(query, true, undefsafe(wingsFamily, 'tag'), 40);
      if (classicOptions) suggestions = suggestions.concat(classicOptions.hits);
    }

    suggestions = await this.upgradeData(suggestions);

    return suggestions;
  }

  /**
   * @description Get complete Wing data by tag thanks to current Wings bank
   */
  getData = (tag) => {
    if (this._bank)
      return this._bank.find(bankElt => bankElt.tag === tag);
    else
      return null;
  }

  /**
   * @description Sync wings bank with current state bank
   */
  syncBank = async (filters) => AlgoliaService.loadBank(filters).then(() => { return commonStore.getLocalStorage('wingsBank', true) });

  /**
   * @description Static : upgrade array of record data to fetch complete record data
   */
  upgradeData = async (suggestions) => {
    let bank = await this.syncBank(null);
    suggestions = this.populateData(suggestions, bank);
    let query = this.formatMissingQuery(suggestions);
    if (query) {
      suggestions = await this.syncBank(query)
        .then(newBank => {
          bank = newBank;
          return this.populateData(suggestions, bank);
        });
    }

    return suggestions;
  }

  /**
   * @description Static : Update array with bank of data
   */
  populateData = (suggestions, bank) => {
    return suggestions.map((suggestion, i) => {
      return (bank ? bank.find(bankElt => bankElt.tag === suggestion.value) || suggestion : suggestion);
    });
  }

  /**
   * @description Static : Format a query for algolia with missing record tag data
   */
  formatMissingQuery = (suggestions) => {
    let query = '';
    suggestions.forEach(suggestion => {
      if (!suggestion.objectID)
        query += (query !== '' ? ' OR' : '') + ' tag:' + (suggestion.tag || suggestion.value);
    });
    return query;
  }

  /**
 * @description Format query to fetch missing Wings data with Algolia
 */
  formatHashtagsQuery = () => {
    let query = '';
    this._currentSuggestions.forEach(suggestion => {
      if (!suggestion.objectID)
        query += (query !== '' ? ' OR' : '') + ' tag:' + suggestion.tag;
    });
    return query;
  }
}

decorate(SuggestionsService, {
  _randomNumber: observable,
  _newSuggestions: observable
});

export default new SuggestionsService();
