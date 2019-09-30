import { observable, action, decorate } from "mobx";

class SearchStore {
  inProgress = false;
  errors = null;
  values = {
    userQuery: '',
    searchFilters: [],
  };

  reset() {
    this.values.userQuery = '';
    this.values.searchFilters = [];
  }

  setUserQuery(query){this.values.userQuery = query}
  setSearchFilters(sf){this.values.searchFilters = sf}

}

decorate(SearchStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
  setUserQuery: action,
  setSearchFilters: action
});

export default new SearchStore();