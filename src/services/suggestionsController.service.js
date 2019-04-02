import { observable, decorate, action } from 'mobx';
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

    this._observeUpdate = Math.random();
  }

  getCurrentSuggestions = () => {
    return this._currentSuggestions;
  }

  reset = () => {
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

    // this.logData('in reset');
  }

  initSuggestions = (wingsFamily, algoliaKey) => {
    this.reset();
    SuggestionsService.init(algoliaKey)
    .then(()=> {
      SuggestionsService.makeInitialSuggestions((wingsFamily.charAt(0) === '#' ? wingsFamily : null))
      .then(() => {
        this._currentSuggestions.all = SuggestionsService.getCurrentSuggestions();
        this.makeInitialSuggestionsList();
        this._observeUpdate = Math.random();
        // this.logData('in init suggestions');
      });
    });
  }

  makeNewSuggestions = async (element, index) => {
    let indexRemoved = this._currentSuggestions.all.findIndex(suggestion => suggestion.tag === element.tag);
    if(indexRemoved !== -1){
      this._currentSuggestions.all.splice(indexRemoved, 1); 
      if(this._currentSuggestions.even[index] && this._currentSuggestions.even[index].tag === element.tag)
        this._currentSuggestions.even.splice(index, 1);
      if(this._currentSuggestions.odd[index] && this._currentSuggestions.odd[index].tag === element.tag)
        this._currentSuggestions.odd.splice(index, 1);
    }
    await SuggestionsService.updateSuggestions(element, indexRemoved)
    .then(() => {
      this._newSuggestions.all = SuggestionsService._newSuggestions;
      if(this._newSuggestions.all.length === 0){
        return;
      }
      this.makeNewSuggestionsList();

      let counter = 0;
      this._newSuggestions.all.forEach( (newS) => {
        let indexInCurrent = this._currentSuggestions.all.findIndex(sug => (sug.tag === newS.tag))
        if(indexInCurrent === -1){
          this._currentSuggestions.all.splice(indexRemoved + counter, 0, newS);
          counter++;
        }else if( true || indexInCurrent > indexRemoved){
          // if indexInCurrent > indexRemoved => move the suggestions
          // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>> move suggestion')
          // console.log(newS.tag + ' from ' + indexInCurrent + ' to ' + (indexRemoved));
          this._currentSuggestions.all.splice(indexInCurrent, 1);
          this._currentSuggestions.all.splice(indexRemoved, 0, newS);
          counter++;
        }
      });
      this.makeInitialSuggestionsList();
      this._observeUpdate = Math.random();
      // this.logData('in create new suggestions');
    })
  }

  makeInitialSuggestionsList = () => {
    this._currentSuggestions.even = [];
    this._currentSuggestions.odd = [];
    // eslint-disable-next-line
    this._currentSuggestions.all.map((suggestion, i) => {
      if(i%2 === 0) {
        this._currentSuggestions.even.push(suggestion);
      } else {
        this._currentSuggestions.odd.push(suggestion);
      }
    });
  }

  makeNewSuggestionsList = () => {
    this._newSuggestions.even = [];
    this._newSuggestions.odd = [];
    // eslint-disable-next-line
    this._newSuggestions.all.map((suggestion, i) => {
      if(i%2 === 0) {
        this._newSuggestions.even.push(suggestion);
      } else {
        this._newSuggestions.odd.push(suggestion);
      }
    });
  }

  logData = (log) => {
    console.log('--- --- --- ---')
    if(log) console.log(log);
    console.log('currentSuggestions all : ' + this._currentSuggestions.all.length);
    console.log('currentSuggestions even : ' + this._currentSuggestions.even.length);
    console.log('currentSuggestions odd : ' + this._currentSuggestions.odd.length);
    
    console.log('newSuggestions all : ' + this._newSuggestions.all.length);
    console.log('newSuggestions even : ' + this._newSuggestions.even.length);
    console.log('newSuggestions odd : ' + this._newSuggestions.odd.length);    
    this.logSuggestionsTag()
    console.log('--- --- --- ---')
  }

  logSuggestionsTag = () => {
    this._newSuggestions.all.forEach(elt => {
      console.log(elt.tag);
    })
  }

}

decorate(SuggestionsControllerService, {
  _currentSuggestions: observable,
  _newSuggestions: observable,
  _observeUpdate: observable,
  makeNewSuggestions: action,
  makeInitialSuggestionsList: action,
  getCurrentSuggestions: action,
});

export default new SuggestionsControllerService();
