import React from "react";
import { withStyles, Chip, Hidden, IconButton } from "@material-ui/core";
import AlgoliaService from "../../../services/algolia.service";
import { inject, observer } from "mobx-react";
import { observe } from "mobx";
import SuggestionsService from "../../../services/suggestions.service";
import ProfileService from "../../../services/profile.service";
import { ArrowLeft, ArrowRight } from "@material-ui/icons";
import withScroll from "../../../hoc/withScroll.hoc";
import classNames from "classnames";
import { getUnique } from "../../../services/utils.service";
import firstWings from "../../../resources/data/firstWings.json";
import { styles } from "./design";
import undefsafe from "undefsafe";
import { FormattedMessage } from "react-intl";

class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facetHits: [],
      firstWings: firstWings
    };
  }

  componentDidMount() {
    this.fetchSuggestions(this.props.searchStore.values.filters);

    this.unsubFilters = observe(
      this.props.searchStore.values.filters,
      change => {
        this.fetchSuggestions(this.props.searchStore.values.filters);
      }
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate) {
      this.setState({ shouldUpdate: false });
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    if (this.unsubAlgoliaKey) this.unsubAlgoliaKey();
    if (this.unsubFilters) this.unsubFilters();
  }

  componentWillReceiveProps(nextProps) {
    this.props.resetScroll("search-suggestions-container");
    let newSuggs = SuggestionsService.removeHiddenWings(
      nextProps.autocompleteSuggestions
    );
    this.setState({ facetHits: newSuggs, shouldUpdate: true });
  }

  /**
   * @param filters Array
   */
  fetchSuggestions = async filters => {
    const { currentOrganisation } = this.props.orgStore;
    let algoliaRes = await AlgoliaService.fetchFacetValues(
      null,
      false,
      filters
    );
    if (!algoliaRes) return null;

    let hits = await SuggestionsService.upgradeData(algoliaRes.facetHits);

    let resultHitsFiltered = hits.filter(
      hit =>
        hit &&
        !this.state.firstWings.some(fw => fw.tag === (hit.tag || hit.value))
    );
    resultHitsFiltered =
      resultHitsFiltered.length > 15 ? resultHitsFiltered : hits;
    resultHitsFiltered = SuggestionsService.removeHiddenWings(
      resultHitsFiltered
    );
    resultHitsFiltered.map(elt => {
      if (!elt.tag && elt.value) elt.tag = elt.value;
    });
    this.props.resetScroll("search-suggestions-container");
    let finalHits = getUnique(resultHitsFiltered.splice(0, 20), "tag");

    // add searchTabs if no filters
    if (!filters || filters.length === 0) {
      finalHits = (currentOrganisation.searchTabs || []).concat(finalHits);
    }

    this.setState({ facetHits: finalHits, shouldUpdate: true });
  };

  shouldDisplaySuggestion(tag) {
    return !this.props.searchStore.values.filters.some(f => f.value === tag);
  }

  handleWingClick = wing => {
    this.props.searchStore.addFilter(
      this.props.searchStore.getFilterTypeByTag(wing.value || wing.tag),
      wing.value || wing.tag
    );
  };

  handleEventFilter = () => {
    this.props.searchStore.addFilter("type", "event", { operator: "AND" });
  };

  render() {
    const { facetHits } = this.state;
    const { classes } = this.props;
    const { locale } = this.props.commonStore;
    const { currentOrganisation } = this.props.orgStore;

    return (
      <div style={{ position: "relative" }}>
        <Hidden smDown>
          <IconButton
            className={classNames(classes.suggestionButton, classes.leftButton)}
            aria-label="Delete"
            onMouseDown={() => {
              this.props.scrollTo("right", "search-suggestions-container");
            }}
            onMouseUp={this.props.scrollStop}
          >
            <ArrowLeft fontSize="inherit" />
          </IconButton>

          <IconButton
            className={classNames(
              classes.suggestionButton,
              classes.rightButton
            )}
            aria-label="Delete"
            onMouseDown={() => {
              this.props.scrollTo("left", "search-suggestions-container");
            }}
            onMouseUp={this.props.scrollStop}
          >
            <ArrowRight fontSize="inherit" />
          </IconButton>
        </Hidden>

        <div
          className={classes.suggestionsContainer}
          id="search-suggestions-container"
        >
          {(true || undefsafe(currentOrganisation, "features.events")) &&
            this.shouldDisplaySuggestion("event") && (
              <Chip
                component={React.forwardRef((props, ref) => {
                  return (
                    <div {...props} ref={ref}>
                      <div className={classes.suggestionPicture}>
                        <img
                          alt="Emoji"
                          src={ProfileService.getPicturePath({ emoji: "📅" })}
                        />
                      </div>
                      <div className={classes.suggestionLabel}>
                        <FormattedMessage id="search.type.event" />
                      </div>
                    </div>
                  );
                })}
                onClick={this.handleEventFilter}
                className={classes.suggestion}
              />
            )}

          {facetHits.map((item, i) => {
            let indexOfItem = facetHits.findIndex(
              hit => (hit.tag || hit.value) === (item.tag || item.value)
            );
            if (indexOfItem < i) return null; // Already displayed

            let displayedName = ProfileService.getWingDisplayedName(
              item,
              locale
            );

            if (!displayedName)
              console.log("No displayedName for the Record: ", item);

            let pictureSrc = ProfileService.getPicturePath(item.picture);
            if (this.shouldDisplaySuggestion(item.tag || item.value)) {
              return (
                <Chip
                  key={i}
                  component={React.forwardRef((props, ref) => {
                    return (
                      <div {...props} ref={ref}>
                        {pictureSrc && (
                          <div
                            className={classNames(
                              classes.suggestionPicture,
                              item.type === "person" ? classes.roundImg : null
                            )}
                          >
                            <img alt="Emoji" src={pictureSrc} />
                          </div>
                        )}
                        <div className={classes.suggestionLabel}>
                          {ProfileService.htmlDecode(displayedName)}
                        </div>
                      </div>
                    );
                  })}
                  onClick={e =>
                    this.handleWingClick({
                      name: displayedName,
                      tag: item.tag || item.value
                    })
                  }
                  className={classes.suggestion}
                  style={{ animationDelay: i * 0.05 + "s" }}
                />
              );
            } else {
              return null;
            }
          })}
        </div>
      </div>
    );
  }
}

SearchSuggestions = withScroll(SearchSuggestions);

export default inject(
  "commonStore",
  "orgStore",
  "searchStore"
)(observer(withStyles(styles)(SearchSuggestions)));
