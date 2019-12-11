import commonStore from "../stores/common.store";
import algoliasearch from "algoliasearch";
import orgStore from "../stores/organisation.store";
import { observe } from "mobx";

class AlgoliaService {
  index;
  indexName = "world";
  client;
  algoliaKey;

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

  addWaitingTask = () => {
    let waitingTaskResolve;
    let waitingTask = new Promise((resolve, reject) => {waitingTaskResolve = resolve});
    this.waitingTasks.push(waitingTaskResolve);
    return waitingTask;
  }

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
          filters: filtersRequest ? filtersRequest : "type:person", // type:person
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

  async loadBank(filters) {
    if(!this.index) await this.addWaitingTask();
    return new Promise((resolve, reject) => {
      let currentBank = commonStore.getLocalStorage("wingsBank", true);
      if (!filters && currentBank && currentBank.length > 0) resolve();
      this.index.search(
        {
          filters: filters ? "type:hashtag AND " + filters : "type:hashtag",
          hitsPerPage: 50
        },
        (err, content) => {
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
          filters: filtersRequest || "type:person AND welcomed=1",
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

  makeOptionsFilters(hashtagOnly, wingsFamily) {
    let filter = "";
    if (hashtagOnly) filter += "type:hashtag";
    if (wingsFamily) filter += " AND hashtags.tag:" + wingsFamily;
    return filter;
  }

  /**
   *
   * @param {*} filters
   * @return {[String, String]} [filterRequest, queryRequest]
   */
  makeRequest(filters) {
    if(!filters || filters.length === 0 ) return [null, null];
    let filterReq = "",
      queryReq = "";

    filters.forEach(filter => {

      if (filter.type === "query") {
        if (queryReq !== "") queryReq += " ";
        queryReq += filter.value;
      } else if(filter.type === 'welcomedAt') {
        if (filterReq !== "") filterReq += " AND ";
        let dateTimestamp = new Date(filter.value).getTime();
        filterReq += `${filter.type + (filter.options.operator === 'gt' ? ' > ' : ' < ') + dateTimestamp}`;
      } else {
        if (filterReq !== "") filterReq += " AND ";
        filterReq += `${filter.type}:${filter.value.replace("%23", "#")}`;
      }
    });

    return [filterReq, queryReq];
  }

  makeFacetFilters(lastSelection, privateOnly) {
    let query = [];
    if (privateOnly)
      query.push("organisation:" + orgStore.currentOrganisation._id);
    if (lastSelection) query.push("hashtags.tag:" + lastSelection.tag);
    return query;
  }
}

export default new AlgoliaService(commonStore.algoliaKey);
