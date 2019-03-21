import commonStore from '../stores/common.store';
import AlgoliaService from './algolia.service';

/**
 * @warning The system of "this_user" is here because 5 WingsSuggestions component are created.
 *          The displayed one for "Wings" part of onboard is the first one (user index 0)
 *          The displayed one for "Featured Wings 1" is the index 4.
 */
class SuggestionsService {

  constructor(){
    this._currentSuggestions = [];
    this._bank = [];
    this._workInProgress = false;
    this._user = [];
  }

  async init(algoliaKey){
    await AlgoliaService.setAlgoliaKey(algoliaKey);
    this._bank = await this.syncBank(null);
  }

  /**
 * @description Sync wings bank with current state bank
 */
  syncBank = async (filters) => AlgoliaService.loadBank(filters).then(() => { return commonStore.getLocalStorage('wingsBank', true) });


  getCurrentSuggestions = () => {
    return this._currentSuggestions;
  }

  makeInitialSuggestions = async (wingsFamily, id) => { 
    this._currentSuggestions = [];
    if (!wingsFamily) {
      await this.fetchSuggestions(null, false, 5);
      await this.fetchSuggestions(null, true, 10);
      this.populateSuggestionsData();
      let query = this.formatHashtagsQuery();
      if (query)
        this.syncBank(query)
          .then((bank) => {
            this._bank = bank;
            this.populateSuggestionsData();
          }).catch(e => {console.log(e)})
      else {}
    } else {
      await this.fetchWingsFamily(wingsFamily);
    }
  }

  fetchWingsFamily = (wingsFamily) => {
    return AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:' + wingsFamily, null, null, null)
      .then(content => {
        if (content) {
          this._currentSuggestions = content.hits;
        }
      }).catch();
  }

  /**
   * @description Fetch suggestions and add them to suggestions list thanks to Algolia
   */
  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd, startIndex) => {
    return AlgoliaService.fetchFacetValues(lastSelection, privateOnly, 'type:person', null)
      .then(content => {
        let suggestions = this._currentSuggestions;
        content.facetHits = this.removeUserWings(content.facetHits);
        for (let i = 0; i < nbHitToAdd; i++) {
          if (content.facetHits.length === 0) break;

          let index = (i === 0 ? 0 : Math.floor(Math.random() * Math.floor(content.facetHits.length)));
          let suggestionToAdd = content.facetHits.splice(index, 1)[0];
          let knownIndex = suggestions.findIndex(hashtag => hashtag && (hashtag.tag === suggestionToAdd.value));

          if (knownIndex > -1 && (i > 0 || startIndex)) {
            i--;
            continue;
          } else if (i === 0 && knownIndex > -1 && !startIndex) {
            // elt known index is an important suggestion, we put it at the start of the array
            suggestions.splice(0, 0, suggestions.splice(knownIndex, 1)[0]);
            continue;
          }

          suggestionToAdd.tag = suggestionToAdd.value;
          suggestionToAdd.new = true;
          if (!startIndex) suggestions.push(suggestionToAdd);
          else suggestions.splice(startIndex, 0, suggestionToAdd);
        }
        this._currentSuggestions = suggestions;
      }).catch((e) => { console.log(e) });
  }

  /**
   * @description Remove user Wings for Wings suggestions
   */
  removeUserWings = (suggestions) => {
    let suggestionsToReturn = suggestions;
    suggestions.forEach(suggestion => {
      try {
        if (this.props.recordStore.values.record.hashtags.findIndex(hashtag => hashtag.tag === suggestion.value) > -1) {
          let index = suggestionsToReturn.findIndex(sugInRet => sugInRet.value === suggestion.value);
          if (index > -1) suggestionsToReturn.splice(index, 1);
        }
      } catch (e) {
        return;
      }
    });
    return suggestionsToReturn;
  }

  /**
   * @description Fetch and add new suggestions after user choose a Wing
   * @param filters Record object selected
   * @param index Index of the object in the suggestions displayed list
   */
  updateSuggestions = async (filters, index) => {
    await this.fetchSuggestions(null, false, 1, index);
    await this.fetchSuggestions(null, true, 2, index);
    await this.fetchSuggestions(filters, false, 2, index);
    await this.fetchSuggestions(filters, true, 2, index);
    this.populateSuggestionsData();
    let query = this.formatHashtagsQuery();
    if (query)
      await this.syncBank(query)
        .then((bank) => {
          this._bank = bank;
          this.populateSuggestionsData();
        });
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
   * @description Populate all suggestions data thanks to current Wings bank
   */
  populateSuggestionsData = () => {
    let suggestions = this._currentSuggestions;
    // eslint-disable-next-line
    this._currentSuggestions.map((suggestion, i) => {
      suggestions[i] = this.getData(suggestion.tag) || suggestion;
    });
    this._currentSuggestions = suggestions;
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

export default new SuggestionsService();
