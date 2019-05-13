import commonStore from '../stores/common.store';
import recordStore from '../stores/record.store';
import AlgoliaService from './algolia.service';
import { observable, decorate } from 'mobx';

class SuggestionsService {

  constructor(){
    this._currentSuggestions = [];
    this._bank = [];
    this._workInProgress = false;
    this._user = [];
    this._randomNumber = 0;

    this._newSuggestions = [];
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
    this._currentSuggestions = this.removeUserWings(this._currentSuggestions);
    return this._currentSuggestions;
  }

  makeInitialSuggestions = async (wingsFamily, id) => { 
    this._currentSuggestions = [];
    this._newSuggestions = [];
    if (!wingsFamily) {
      await this.fetchSuggestions(null, true, 15);
      await this.fetchSuggestions(null, false, 10);
      if(this._currentSuggestions.length < 10) {
        await this.fetchPublicHashtags(10);
      }

      this.populateSuggestionsData();
      let query = this.formatHashtagsQuery();
      if (query)
        this.syncBank(query)
          .then((bank) => {
            this._bank = bank;
            this.populateSuggestionsData();
          }).catch(e => {console.log(e)})
      else {
      }
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

  addHitsToSuggestions = (hits, nbHitToAdd) => {
    let suggestions = this._currentSuggestions;
    for (let i = 0; i < nbHitToAdd; i++) {

      let suggestionToAdd = hits.splice(i, 1)[0];
      if(!suggestionToAdd) continue;

      suggestionToAdd.tag = suggestionToAdd.value || suggestionToAdd.tag;
      if(suggestionToAdd && !this.isInSuggestions(suggestionToAdd.tag) && !this.isInUserWings(suggestionToAdd.tag)){
        // console.log('>>>>>>>>> ADD >>>>>>>>>> '  + suggestionToAdd.tag)
        suggestions.push(suggestionToAdd);
        this._newSuggestions.push(suggestionToAdd);
      } else if (suggestionToAdd && !this.isInUserWings(suggestionToAdd.tag)) {
        this._newSuggestions.push(suggestionToAdd);
      }
      else i--;
    }
    return suggestions;
  }

  fetchPublicHashtags = (nbHitToAdd) => {
    return AlgoliaService.fetchHashtags()
    .then(content => {
      if (!content.hits || content.hits.length === 0) return;
      this._currentSuggestions = this.addHitsToSuggestions(this.removeUserWings(content.hits), nbHitToAdd);
    }).catch((e) => { console.log(e) });
  }

  /**
   * @description Fetch suggestions and add them to suggestions list thanks to Algolia
   */
  fetchSuggestions = (lastSelection, privateOnly, nbHitToAdd) => {
    return AlgoliaService.fetchFacetValues(lastSelection, privateOnly, 'type:person', null)
      .then(content => {
        if (!content.facetHits || content.facetHits.length === 0) return;
        this._currentSuggestions = this.addHitsToSuggestions(this.removeUserWings(content.facetHits), nbHitToAdd);
      }).catch((e) => { console.log(e) });
  }

  isInSuggestions = (tag) => (this._currentSuggestions.filter(suggestion => suggestion.tag === tag).length > 0);

  isInUserWings = (tag) => (recordStore.values.record.hashtags.filter(hashtag => hashtag.tag === tag).length > 0);

  /**
   * @description Remove user Wings for Wings suggestions
   */
  removeUserWings = (suggestions) => {
    let suggestionsToReturn = suggestions;
    suggestions.forEach(suggestion => {
      let suggestionTag = suggestion.value || suggestion.tag;
      try {
        if (recordStore.values.record.hashtags.findIndex(hashtag => {return (hashtag.tag === (suggestionTag))}) > -1) {
          let index = suggestionsToReturn.findIndex(sugInRet => (sugInRet.tag === suggestionTag) || (sugInRet.value === suggestionTag));
          if (index > -1) suggestionsToReturn.splice(index, 1);
        }
      } catch (e) {
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
    this._newSuggestions = [];
    await this.fetchSuggestions(filters, true, 2, index);
    await this.fetchSuggestions(null, true, 2, index);
    await this.fetchSuggestions(filters, false, 2, index);
    await this.fetchSuggestions(null, false, 1, index);
    if(this._newSuggestions.length < 3) {
      await this.fetchPublicHashtags(4);
    }

    this.populateSuggestionsData(true);
    let query = this.formatHashtagsQuery();
    if (query)
      await this.syncBank(query)
        .then((bank) => {
          this._bank = bank;
          this.populateSuggestionsData(true);
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
   * @description Static : upgrade array of record data to fetch complete record data
   */
  upgradeData = async (suggestions) => {
    suggestions = this.populateData(suggestions, bank);
    let bank = await this.syncBank(null);
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
    return suggestions.map((suggestion,i) => {
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
        query += (query !== '' ? ' OR' : '') + ' tag:' + suggestion.tag;
    });
    return query;
  }


  /**
   * @description Populate all suggestions data thanks to current Wings bank
   */
  populateSuggestionsData = (isNewSuggestions) => {
    if(!isNewSuggestions) {
      let suggestions = this._currentSuggestions;
      // eslint-disable-next-line
      this._currentSuggestions.map((suggestion, i) => {
        suggestions[i] = this.getData(suggestion.tag) || suggestion;
      });
      this._currentSuggestions = suggestions;
    } else {
      let suggestions = this._newSuggestions;
      // eslint-disable-next-line
      this._newSuggestions.map((suggestion, i) => {
        suggestions[i] = this.getData(suggestion.tag) || suggestion;
      });
      this._newSuggestions = suggestions;
    }
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
