import commonStore from '../stores/common.store';
import { observable, action, decorate } from 'mobx';

class SuggestionsControllerService {

  constructor(){

    this._currentSuggestions = {,
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

  initSuggestions = () => {

  }

  getNewSuggestions = () => {

  }

  makeSuggestionsLists = () => {
    
  }

  build



}

decorate(SuggestionsControllerService, {
  _currentSuggestions: observable,
  _newSuggestions: observable
});

export default new SuggestionsControllerService();
