import commonStore from "../stores/common.store";
import algoliasearch from "algoliasearch";
import orgStore from "../stores/organisation.store";
import { observe } from "mobx";
import undefsafe from 'undefsafe';

class AlgoliaService {
  index;
  indexName = "world";
  client;
  algoliaKey;
  DATE_FIELDS = ["welcomedAt", "startDate", "endDate"];

  waitingTasks = [];

  constructor(algoliaKey) {
    if (algoliaKey) {
      this.algoliaKey = algoliaKey;
      this.client = algoliasearch(
        process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
        this.algoliaKey
      );
      this.index = this.client.initIndex(this.indexName);
      this.runWaitingTasks();
      let aKeyObject = orgStore.getAlgoliaKey(orgStore.currentOrganisation._id);
      aKeyObject.initialized = true;
    } else {
      let org = orgStore.currentOrganisation;
      if (org) orgStore.fetchAlgoliaKey(org._id, org.public);
    }

    observe(orgStore, "currentAlgoliaKey", change => {
      if (this.client) this.client.clearCache();
      if (!orgStore.currentAlgoliaKey && orgStore.currentOrganisation) {
        orgStore.fetchAlgoliaKey(
          orgStore.currentOrganisation._id,
          orgStore.currentOrganisation.public
        );
      } else {
        this.algoliaKey = orgStore.currentAlgoliaKey.value;
        this.client = algoliasearch(
          process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
          this.algoliaKey
        );
        this.index = this.client.initIndex(this.indexName);
        this.runWaitingTasks();
        let aKeyObject = orgStore.getAlgoliaKey(
          orgStore.currentOrganisation._id
        );
        aKeyObject.initialized = true;
      }
    });
  }

  setAlgoliaKey(algoliaKey) {
    if (!algoliaKey) return;
    this.algoliaKey = algoliaKey;
    this.client = algoliasearch(
      process.env.REACT_APP_ALGOLIA_APPLICATION_ID,
      algoliaKey
    );
    this.index = this.client.initIndex(this.indexName);
    this.runWaitingTasks();
    let aKeyObject = orgStore.getAlgoliaKey(orgStore.currentOrganisation._id);
    aKeyObject.initialized = true;
  }

  /**
   * @description If algolia client isn't initialized yet, the Algolia search methods will not works. We have to await the init to run the methods
   */
  addWaitingTask = () => {
    let waitingTaskResolve;
    let waitingTask = new Promise((resolve, reject) => {waitingTaskResolve = resolve});
    this.waitingTasks.push(waitingTaskResolve);
    return waitingTask;
  }

  /**
   * @description Run all waiting tasks to run all waiting methods (after algolia client init)
   */
  runWaitingTasks = () => {
    this.waitingTasks.forEach(waitingTask => {
      waitingTask();
    });
  }

  async fetchFacetValues(lastSelection, privateOnly, filters) {
    if(!this.index) await this.addWaitingTask();
    let [filtersRequest, queryRequest] = this.makeRequest(filters);

    return new Promise((resolve, reject) => {
      this.index.searchForFacetValues(
        {
          facetName: "hashtags.tag",
          query: queryRequest || "",
          facetQuery: "",
          filters: filtersRequest ? filtersRequest : "type:person OR type:event",
          maxFacetHits: 100,
          facetFilters:
            lastSelection && privateOnly !== null
              ? this.makeFacetFilters(lastSelection, privateOnly)
              : ""
        },
        (err, res) => {
          if (err) return resolve(res);
          return resolve(res);
        }
      );
    });
  }

  async fetchHashtags(families) {
    if(!this.index) await this.addWaitingTask();
    let filters = ["type:hashtag"];
    families.forEach(family => {
      if (family) filters.push("hashtags.tag:" + family.tag);
    });

    return new Promise((resolve, reject) => {
      this.index.search(
        {
          facetFilters: filters,
          maxFacetHits: 40
        },
        (err, res) => {
          if (err) return resolve(res);
          return resolve(res);
        }
      );
    });
  }

  /**
   * 
   * @param {*} filters 
   * @todo Use makeRequest
   */
  async loadBank(filters) {
    if(!this.index) await this.addWaitingTask();
    return new Promise((resolve, reject) => {
      let currentBank = commonStore.getLocalStorage("wingsBank", true);
      if (!filters && currentBank && currentBank.length > 0) resolve();
      this.index.search(
        {
          filters: filters ? "type:hashtag AND " + filters : "type:hashtag",
          hitsPerPage: 500
        },
        (err, content) => {
          if(!content) return resolve();
          this.addToLocalStorage(content.hits).then(() => {
            resolve();
          });
        }
      );
    });
  }

  async fetchOptions(inputValue, hashtagOnly, wingsFamily, hitsParPage) {
    if(!this.index) await this.addWaitingTask();
    return new Promise((resolve, reject) => {
      this.index.search(
        {
          query: inputValue,
          filters: this.makeOptionsFilters(hashtagOnly, wingsFamily),
          attributesToRetrieve: [
            "type",
            "name",
            "name_translated",
            "tag",
            "picture",
            "hashtags",
            "description"
          ],
          restrictSearchableAttributes: [
            "name",
            "name_translated",
            "tag",
            "description"
          ],
          highlightPreTag: "<span>",
          highlightPostTag: "</span>",
          hitsPerPage: hitsParPage || 5
        },
        (err, content) => resolve(content)
      );
    });
  }

  async fetchHits(filters, facetFilters, page, logSearch, hitsPerPage) {
    if(!this.index) await this.addWaitingTask();
    let [filtersRequest, queryRequest] = this.makeRequest(filters);

    return new Promise((resolve, reject) => {
      this.index.search(
        {
          page: page || 0,
          query: queryRequest || "",
          facetFilters: facetFilters || "",
          filters: filtersRequest ? filtersRequest : "type:person OR type:event",
          hitsPerPage: hitsPerPage || 30,
          attributesToSnippet: ["intro:" + 15, "description:" + 15]
        },
        (err, content) => {
          if (err) return resolve(content);
          if (!content) return resolve(null);
          return resolve(content);
        }
      );
    });
  }

  /**
   * @description Add or update local bank and remove duplicate entries
   * @note Local Storage isn't the best way to store all this data. The max size is often reached.
   * @todo Use IndexedDB if possible ? (not available for all browser)
   */
  addToLocalStorage(hits) {
    return new Promise((resolve, reject) => {
      let currentBank = commonStore.getLocalStorage("wingsBank", true) || [];
      hits.forEach(hit => {
        let index = currentBank.findIndex(elt => elt.tag === hit.Tag);
        if (index === -1) currentBank.push(hit);
        else currentBank[index] = hit;
      });
      commonStore.setLocalStorage("wingsBank", currentBank, true).then(() => {
        resolve();
      });
    });
  }

  /**
   * @todo Useless method, use makeRequest
   */
  makeOptionsFilters(hashtagOnly, wingsFamily) {
    let filter = "";
    if (hashtagOnly) filter += "type:hashtag";
    if (wingsFamily) filter += " AND hashtags.tag:" + wingsFamily;
    return filter;
  }

  /**
   *
   * @param {*} filters
   * @return {[{type, value, options}]} Array of filters with filter type, filter value and options like operators
   */
  makeRequest(filters) {
    if(!filters || filters.length === 0 ) return [null, null];
    let filterReq = "",
      queryReq = "";

    filters.forEach(filter => {

      if (filter.type === "query") {
        if (queryReq !== "") queryReq += " ";
        queryReq += filter.value;
      } else if(this.DATE_FIELDS.some(elt => elt === filter.type)) {
        if (filterReq !== "") filterReq += " AND ";
        let dateTimestamp = new Date(filter.value).getTime();
        filterReq += `${filter.type + (filter.options.operator === 'gt' ? ' > ' : ' < ') + dateTimestamp}`;
      } else if(filter.type !== 'view'){
        if (filterReq !== "") filterReq += ` ${undefsafe(filter, 'options.operator') || "AND"} `;
        filterReq += `${filter.type}:${filter.value.replace("%23", "#")}`;
      }
    });

    return [filterReq, queryReq];
  }

  /**
   * @todo Useless method, use makeRequest
   */
  makeFacetFilters(lastSelection, privateOnly) {
    let query = [];
    if (privateOnly)
      query.push("organisation:" + orgStore.currentOrganisation._id);
    if (lastSelection) query.push("hashtags.tag:" + lastSelection.tag);
    return query;
  }
}

export default new AlgoliaService(commonStore.algoliaKey);
