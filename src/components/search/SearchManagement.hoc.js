import React, { Component } from "react";
import commonStore from '../../stores/common.store';

const withSearchManagement = (ComponentToWrap) => {
  class SearchManagement extends Component {

    /**
     * @description Add a new filter
     * @param {element} Object with label and value
     */
    addFilter = (element) => {
      var currentSearchFilters = commonStore.getSearchFilters();
      currentSearchFilters.push(element);
      commonStore.setSearchFilters(currentSearchFilters);
    }

    makeFiltersRequest = async () => {
      var currentFilters = commonStore.getSearchFilters();
      var filterRequest = 'type:person';
      var queryRequest = '';
  
      currentFilters.forEach(filter => {
        if (filter.value.charAt(0) !== '#' && filter.value.charAt(0) !== '@') queryRequest += ((queryRequest !== '') ? ' ' : '') + filter.label;
        else if (filter.value.charAt(0) === '#') filterRequest += ' AND hashtags.tag:' + filter.value;
        else if (filter.value.charAt(0) === '@') filterRequest += ' AND tag:' + filter.value;
      });
  
      return {
        filterRequest: filterRequest,
        queryRequest: queryRequest
      };
    }

    render() {
      return (
        <ComponentToWrap {...this.props} addFilter={this.addFilter} makeFiltersRequest={this.makeFiltersRequest} />
      )
    }
  }

  return SearchManagement;
}
export default withSearchManagement;