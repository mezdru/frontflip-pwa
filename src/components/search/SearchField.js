import React, { PureComponent } from "react";
import { injectIntl } from "react-intl";
import { inject, observer } from "mobx-react";
import { withTheme, withStyles } from "@material-ui/core";
import { observe } from "mobx";
import { Clear } from "@material-ui/icons";
import IconButton from "@material-ui/core/IconButton";

import "./SearchFieldStyle.css";
import ProfileService from "../../services/profile.service";
import Wings from "../utils/wing/Wings";
import { styles } from "./SearchField.css";

class SearchField extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    if (this.props.mode !== "onboard" && this.props.mode !== "propose") {
      this.unsubscribeSearchFilters = observe(
        this.props.searchStore.values.filters,
        change => {
          var currentSearchFilters = this.props.searchStore.values.filters;
          this.props.searchStore.setUserQuery(
            currentSearchFilters.length > 0 ? " " : ""
          );
          this.scrollToRight();
          this.forceUpdate();
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

  render() {
    const { classes } = this.props;
    let { userQuery, filters } = this.props.searchStore.values;

    return (
      <div className={classes.searchContainer} id="search-container">
        <div
          className={classes.searchFiltersContainer}
          id="search-filters-container"
        >
          {filters &&
            filters.length > 0 &&
            filters.map((filter, index) => {
              if(filter.type !== 'hashtags.tag' && filter.type !== 'tag' && filter.type !== 'query') return null;
              let displayedName = ProfileService.getWingDisplayedName(
                filter,
                this.props.commonStore.locale
              );
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
      withTheme()(withStyles(styles, { withTheme: true })(SearchField))
    )
  )
);
