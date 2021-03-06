import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import { withTheme, withStyles, withWidth } from "@material-ui/core";
import { observe } from "mobx";
import { Clear } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

import "./SearchFieldStyle.css";
import ProfileService from "../../services/profile.service";
import Wings from "../utils/wing/Wings";
import { styles } from "./SearchField.css";
import suggestionsService from "../../services/suggestions.service";

const FILTERS_ALLOWED = ["hashtags.tag", "tag", "query", "type"];

class SearchField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      filters: []
    };
  }

  componentDidMount() {
    if (this.props.mode !== "onboard" && this.props.mode !== "propose") {
      this.makeDisplayedFilters(this.props.searchStore.values.filters).then(
        filters => {
          this.setState({ filters });
        }
      );

      this.unsubscribeSearchFilters = observe(
        this.props.searchStore.values.filters,
        change => {
          var currentSearchFilters = this.props.searchStore.values.filters;
          this.props.searchStore.setUserQuery(
            currentSearchFilters.length > 0 ? " " : ""
          );
          this.scrollToRight();

          this.makeDisplayedFilters(this.props.searchStore.values.filters).then(
            filters => {
              this.setState({ filters });
            }
          );
        }
      );
    } else {
      this.props.searchStore.setUserQuery("");
    }

    this.unsubscribeUserQuery = observe(
      this.props.searchStore.values,
      "userQuery",
      change => {
        this.forceUpdate();
      }
    );
    this.unsubscribeOrganisation = observe(
      this.props.orgStore,
      "currentOrganisation",
      change => {
        this.forceUpdate();
      }
    );
  }

  componentWillUnmount() {
    if (this.unsubscribeSearchFilters) this.unsubscribeSearchFilters();
    if (this.unsubscribeOrganisation) this.unsubscribeOrganisation();
    this.unsubscribeUserQuery();
  }

  async scrollToRight() {
    setTimeout(() => {
      let valueContainer = document.getElementById("search-filters-container");
      if (valueContainer) {
        valueContainer.scrollLeft = valueContainer.scrollWidth;
      }
    }, 100);
  }

  getSearchFieldPlaceholder = () => {
    if (this.props.mode === "onboard" || this.props.mode === "propose") {
      return this.props.intl.formatMessage({ id: "algolia.onboard" });
    } else {
      let organisation = this.props.orgStore.currentOrganisation;
      if (
        organisation.intro &&
        organisation.intro[this.props.commonStore.locale] &&
        organisation.intro[this.props.commonStore.locale] !== ""
      ) {
        return organisation.intro[this.props.commonStore.locale];
      }
      return this.props.intl.formatMessage(
        { id: "algolia.search" },
        { orgName: organisation.name }
      );
    }
  };

  handleEnter = e => {
    if (e.key === "Enter") {
      var value = e.target.value.trim();
      this.props.searchStore.setUserQuery("");
      if (this.props.mode !== "onboard" && this.props.mode !== "propose") {
        if (value) {
          this.props.searchStore.addFilter(
            this.props.searchStore.getFilterTypeByTag(value),
            value
          );
        }
      } else {
        if (value) {
          this.props.handleCreateWing({ name: value });
        }
      }
      e.target.value = "";
    }
  };

  handleInputChange = inputValue => {
    this.props.searchStore.setUserQuery(inputValue);
    if (this.props.mode !== "onboard" && this.props.mode !== "propose")
      this.props.fetchAutocompleteSuggestions(inputValue);
  };

  reset = () => {
    this.props.searchStore.reset();
    this.forceUpdate();
  };

  makeDisplayedFilters = async filters => {
    if (!filters || filters.length === 0) return [];
    let filtersP = JSON.parse(JSON.stringify(filters));

    filtersP = filtersP.filter(f =>
      FILTERS_ALLOWED.some(elt => elt === f.type)
    );
    filtersP = filtersP.map(f => {
      return { tag: f.value };
    });
    filtersP = await suggestionsService.upgradeData(filtersP);

    return filtersP;
  };

  render() {
    const { classes } = this.props;
    let { userQuery } = this.props.searchStore.values;
    let { filters } = this.state;

    return (
      <div
        className={classes.searchContainer}
        id="search-container"
        style={this.props.width === "xs" ? { paddingLeft: 48 } : {}}
      >
        <div
          className={classes.searchFiltersContainer}
          id="search-filters-container"
        >
          {filters &&
            filters.length > 0 &&
            filters.map((filter, index) => {
              let displayedName =
                filter.tag !== "event"
                  ? ProfileService.getWingDisplayedName(
                      filter,
                      this.props.commonStore.locale
                    )
                  : this.props.intl.formatMessage({ id: "search.type.event" });
              return (
                <Wings
                  label={ProfileService.htmlDecode(displayedName)}
                  key={index}
                  onDelete={e => {
                    this.props.searchStore.removeFilter(filter);
                  }}
                  mode="highlight"
                  className={"highlighted"}
                />
              );
            })}

          <input
            type="text"
            name="searchInput"
            className={classes.searchInput}
            value={userQuery}
            placeholder={this.getSearchFieldPlaceholder()}
            onKeyDown={this.handleEnter}
            onChange={e => {
              this.handleInputChange(e.target.value);
            }}
            autoComplete="off"
          />
        </div>

        {(userQuery || (filters && filters.length > 0)) && (
          <IconButton className={classes.searchClear} onClick={this.reset}>
            <Clear fontSize="inherit" />
          </IconButton>
        )}
      </div>
    );
  }
}

export default inject(
  "commonStore",
  "recordStore",
  "orgStore",
  "searchStore"
)(
  observer(
    injectIntl(
      withStyles(styles, { withTheme: true })(withWidth()(SearchField))
    )
  )
);
