import commonStore from '../stores/common.store';
import AlgoliaService from './algolia.service';

class SuggestionsService {

  currentSuggestions = [];
  bank = [];
  workInProgress = false;

  init = async (algoliaKey) => {
    await AlgoliaService.setAlgoliaKey(algoliaKey);
    this.bank = await this.syncBank(null);
  }

  /**
 * @description Sync wings bank with current state bank
 */
  syncBank = (filters) => AlgoliaService.loadBank(filters).then(() => { return commonStore.getLocalStorage('wingsBank', true) });


  getCurrentSuggestions = () => {
    return this.currentSuggestions;
  }

  makeInitialSuggestions = async (wingsFamily) => {
    if(this.workInProgress) return;
    this.workInProgress = true;
    this.currentSuggestions = [];
    if (!wingsFamily) {
      await this.fetchSuggestions(null, false, 5);
      await this.fetchSuggestions(null, true, 10);
      this.populateSuggestionsData();
      let query = this.formatHashtagsQuery();
      if (query)
        this.syncBank(query)
          .then(() => {
            this.populateSuggestionsData();
            this.workInProgress = false;
          });
      else this.workInProgress = false;
    } else {
      await this.fetchWingsFamily(wingsFamily);
      this.workInProgress = false;
    }
  }

  fetchWingsFamily = (wingsFamily) => {
    return AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:' + wingsFamily, null, null, null)
      .then(content => {
        if (content) {
          this.currentSuggestions = content.hits;
        }
      }).catch();
  }

  /**
   * @description Fetch suggestions and add them to suggestions list thanks to Algolia
   */
  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd, startIndex) => {
    return AlgoliaService.fetchFacetValues(lastSelection, privateOnly, 'type:person', null)
      .then(content => {
        let suggestions = this.currentSuggestions;
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
        this.currentSuggestions = suggestions;
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
        .then(() => {
          this.populateSuggestionsData();
        });
  }

  /**
   * @description Get complete Wing data by tag thanks to current Wings bank
   */
  getData = (tag) => {
    if (this.bank)
      return this.bank.find(bankElt => bankElt.tag === tag);
    else
      return null;
  }

  /**
   * @description Populate all suggestions data thanks to current Wings bank
   */
  populateSuggestionsData = () => {
    let suggestions = this.currentSuggestions;
    // eslint-disable-next-line
    this.currentSuggestions.map((suggestion, i) => {
      suggestions[i] = this.getData(suggestion.tag) || suggestion;
    });
    this.currentSuggestions = suggestions;
  }

  /**
 * @description Format query to fetch missing Wings data with Algolia
 */
  formatHashtagsQuery = () => {
    let query = '';
    this.currentSuggestions.forEach(suggestion => {
      if (!suggestion.objectID)
        query += (query !== '' ? ' OR' : '') + ' tag:' + suggestion.tag;
    });
    return query;
  }

}

export default new SuggestionsService();