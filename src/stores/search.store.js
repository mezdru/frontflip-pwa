import { observable, action, decorate } from "mobx";
import qs from "qs";

const TYPES = ["tag", "hashtags.tag", "query", "welcomedAt", "type"];
const OPERATORS = ["gt", "lt"];

class SearchStore {
  inProgress = false;
  errors = null;
  values = {
    userQuery: "",
    filters: []
  };

  reset() {
    this.values.userQuery = "";
    this.values.filters.splice(0, this.values.filters.length);
  }

  /**
   * @description Init filters array with url query
   * @param {String} urlQuery window location search
   */
  decodeFilters(urlQuery) {
    if (!urlQuery) return;
    if (urlQuery.charAt(0) === "?") urlQuery = urlQuery.substr(1);

    let parsedQuery = qs.parse(urlQuery);

    Object.keys(parsedQuery).forEach(key => {
      let value = parsedQuery[key];

      if (Array.isArray(value)) {
        value.forEach(valueElt => {
          this.addFilter(key, valueElt);
        });
      } else if (typeof value === "object") {
        Object.keys(value).forEach(secondaryKey => {
          if(OPERATORS.some(elt => elt === secondaryKey))
            this.addFilter(key, value[secondaryKey], {operator: secondaryKey});
        });
      } else if (typeof value === "string") {
        this.addFilter(key, value);
      }
    });
  }

  encodeFilters = () => {
    var urlQuery = "";

    this.values.filters.forEach(filter => {
      urlQuery += `&${filter.type}=${filter.value.replace('#', '%23')}`
    });

    urlQuery = urlQuery.substr(1);

    return '?' + urlQuery;
  }

  setUserQuery(query) {
    this.values.userQuery = query;
  }

  addFilter(type, value, options) {
    if (!TYPES.some(elt => elt === type)) throw new Error("Invalid type: " + type);

    if (
      !this.values.filters.some(
        filter => filter.type === type && filter.value === value
      )
    ) {
      this.values.filters.push({
        type,
        value,
        options
      });
    }
  }

  getFilterTypeByTag = (tag) => {
    switch(tag.charAt(0)) {
      case '#': return 'hashtags.tag';
      case '@': return 'tag';
      default: return 'query';
    }
  }

  removeFilter(value) {
    var indexOfElement = this.values.filters.findIndex(
      filter => filter.value === value
    );
    this.values.filters.splice(indexOfElement, 1);
  }
}

decorate(SearchStore, {
  inProgress: observable,
  errors: observable,
  values: observable,
  reset: action,
  setUserQuery: action,
  addFilter: action,
  removeFilter: action
});

export default new SearchStore();
