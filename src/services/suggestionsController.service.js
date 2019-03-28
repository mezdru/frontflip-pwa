import commonStore from '../stores/common.store';
import { observable, action, decorate } from 'mobx';
import SuggestionsService from './suggestions.service';

class SuggestionsControllerService {

  constructor(){

    this._currentSuggestions = {
      all: [],
      even: [],
      odd: [],
    };

    this._newSuggestions = {
      all: [],
      even: [],
      odd: [],
    };
  }

  getCurrentSuggestions = () => {
    return this._currentSuggestions.all;
  }

  initSuggestions = (wingsFamily, algoliaKey) => {
    SuggestionsService.init(algoliaKey)
    .then(()=> {
      SuggestionsService.makeInitialSuggestions((wingsFamily.charAt(0) === '#' ? wingsFamily : null))
      .then(() => {
        this._currentSuggestions.all = SuggestionsService.getCurrentSuggestions();
        this.makeInitialSuggestionsList();
        this.logData();
      });
    });
  }

  makeNewSuggestions = (element) => {

  }

  makeInitialSuggestionsList = () => {
    this._currentSuggestions.all.map((suggestion, i) => {
      if(i%2 === 0) {
        this._currentSuggestions.even.push(suggestion);
      } else {
        this._currentSuggestions.odd.push(suggestion);
      }
    });
  }

  logData = () => {
    console.log('currentSuggestions all : ' + this._currentSuggestions.all.length);
    console.log('currentSuggestions even : ' + this._currentSuggestions.even.length);
    console.log('currentSuggestions odd : ' + this._currentSuggestions.odd.length);
    
    console.log('newSuggestions all : ' + this._newSuggestions.all.length);
    console.log('newSuggestions even : ' + this._newSuggestions.even.length);
    console.log('newSuggestions odd : ' + this._newSuggestions.odd.length);    
  }

}

decorate(SuggestionsControllerService, {
  _currentSuggestions: observable,
  _newSuggestions: observable
});

export default new SuggestionsControllerService();
