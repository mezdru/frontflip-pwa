import React, { Component } from "react";
import commonStore from '../stores/common.store';

const withSearchManagement = (ComponentToWrap) => {
  class SearchManagement extends Component {

    /**
     * @description Add a new filter
     * @param {element} Object with label and value
     */
    addFilter = (element) => {
      var currentSearchFilters = commonStore.getSearchFilters();
      if(!this.isInSearchFilters(currentSearchFilters, element)) {
        currentSearchFilters.push(element);
        commonStore.setSearchFilters(currentSearchFilters);
      }
    }

    removeFilter = (element) => {
      var currentSearchFilters = commonStore.getSearchFilters();
      var indexOfElement = currentSearchFilters.findIndex((filter => filter.tag === element.tag));
      currentSearchFilters.splice(indexOfElement, 1);
      commonStore.setSearchFilters(currentSearchFilters);
    }

    resetFilters = () => {
      commonStore.setSearchFilters([]);
    }

    makeFiltersRequest = async () => {
      var currentFilters = commonStore.getSearchFilters();
      var filterRequest = 'type:person';
      var queryRequest = '';
  
      currentFilters.forEach(filter => {
        if (filter.tag.charAt(0) !== '#' && filter.tag.charAt(0) !== '@') queryRequest += ((queryRequest !== '') ? ' ' : '') + filter.name;
        else if (filter.tag.charAt(0) === '#') filterRequest += ' AND hashtags.tag:' + filter.tag;
        else if (filter.tag.charAt(0) === '@') filterRequest += ' AND tag:' + filter.tag;
      });
  
      return {
        filterRequest: filterRequest,
        queryRequest: queryRequest
      };
    }

    isInSearchFilters(searchFilters, element) {
      return (searchFilters.find(filter =>  ( (filter.tag &&  element.tag && (filter.tag === element.tag) )  || (filter.name &&  element.name && (filter.name === element.name) ) )) !== undefined);
    }

    render() {
      return (
        <ComponentToWrap {...this.props} 
          addFilter={this.addFilter} 
          makeFiltersRequest={this.makeFiltersRequest}
          removeFilter={this.removeFilter}
          resetFilters={this.resetFilters}
        />
      )
    }
  }

  return SearchManagement;
}
export default withSearchManagement;