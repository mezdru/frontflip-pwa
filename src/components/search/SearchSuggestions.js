import React from 'react'
import { withStyles, Chip, Hidden, IconButton } from '@material-ui/core';
import AlgoliaService from '../../services/algolia.service';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import withSearchManagement from '../../hoc/SearchManagement.hoc';
import SuggestionsService from '../../services/suggestions.service';
import ProfileService from '../../services/profile.service';
import { ArrowLeft, ArrowRight } from '@material-ui/icons';
import withScrollManagement from '../../hoc/ScrollManagement.hoc';
import classNames from 'classnames';
import { getUnique } from '../../services/utils.service';
import undefsafe from 'undefsafe';

const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    maxHeight: 63,
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '8px 0px',
    position: 'relative',
    zIndex: 1197,
    whiteSpace: 'nowrap',
    '&::-webkit-scrollbar': {
      width: '0 !important'
    },
    overflow: '-moz-scrollbars-none',
    MsOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  suggestion: {
    margin: 8,
    marginBottom: 20,
    background: 'rgba(42, 44, 60, 0.85)',
    color: 'white',
    fontWeight: 500,
    '&:hover': {
      color: theme.palette.primary.dark,
      background: theme.palette.primary.main,
    },
    opacity: 0,
    animation: 'easeIn .6s',
    animationFillMode: 'forwards',
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  suggestionLabel: {
    paddingRight: 12,
    paddingLeft: 12,
  },
  suggestionPicture: {
    width: 32,
    height: 48,
    margin: '-5px -6px 0 -22px', // should be -15px -6px 0 -22px
    overflow: 'visible',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '& img': {
      width: '100%',
      height: 'auto',
      textAlign: 'center',
      objectFit: 'cover',
      borderRadius: 5
    }
  },
  suggestionButton: {
    position: 'absolute',
    zIndex: 1197,
    backgroundColor: 'rgba(42, 44, 60, 0.85)',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 32,
    padding: 0,
    color: 'white',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      color: 'rgba(42, 44, 60, 0.85)',
      backgroundColor: 'white'
    }
  },
  leftButton: {
    left: -42,
  },
  rightButton: {
    right: -42
  },
  roundImg: {
    '& img': {
      borderRadius: '50%'
    }
  }
});

class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facetHits: [],
      observer: () => { },
      observer2: () => { },
      filterRequest: 'type:person',
      queryRequest: '',
      firstWings: []
    };

  }

  componentDidMount() {
    AlgoliaService.setAlgoliaKey(undefsafe(this.props.orgStore.currentAlgoliaKey, 'value'));
    AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:#Wings', null, null, null)
      .then(content => {

        let firstWings = ((content && content.hits) ? content.hits : []);
        this.props.commonStore.hiddenWings = firstWings;

        this.setState({ firstWings: firstWings }, () => {
          this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);
        });
      });

    this.setState({
      observer: observe(this.props.orgStore, 'currentAlgoliaKey', (change) => {
        AlgoliaService.setAlgoliaKey(undefsafe(this.props.orgStore.currentAlgoliaKey, 'value'));
        AlgoliaService.fetchHits('type:hashtag AND hashtags.tag:#Wings', null, null, null)
          .then(content => {
            let firstWings = ((content && content.hits) ? content.hits : []);
            this.props.commonStore.hiddenWings = firstWings;
            this.setState({ firstWings: ((content && content.hits) ? content.hits : []) }, () => {
              this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);
            });
          });
      })
    });

    this.setState({
      observer2: observe(this.props.commonStore, 'searchFilters', (change) => {
        this.props.makeFiltersRequest()
          .then((request) => {
            if (JSON.stringify(change.newValue) !== JSON.stringify(change.oldValue)){
              this.setState({ filterRequest: request.filterRequest, queryRequest: request.queryRequest }, () => {
                this.fetchSuggestions(request.filterRequest, request.queryRequest);
              });
            }
          });
      })
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextState.shouldUpdate) {
      this.setState({ shouldUpdate: false });
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.state.observer();
    this.state.observer2();
  }

  componentWillReceiveProps(nextProps) {
    this.props.resetScroll("search-suggestions-container");
    this.setState({ facetHits: nextProps.autocompleteSuggestions, shouldUpdate: true });
  }

  fetchSuggestions = (filters, query) => {
    AlgoliaService.fetchFacetValues(null, false, filters, query)
      .then((res) => {
        if (!res) return;
        SuggestionsService.upgradeData(res.facetHits)
          .then(resultHits => {

            var resultHitsFiltered = [];

            resultHits.forEach(hit => {
              if (hit && this.state.firstWings.findIndex(wing => wing.tag === (hit.tag || hit.value)) === -1) {
                resultHitsFiltered.push(hit);
              }
            });

            var results = (resultHitsFiltered.length > 19 ? resultHitsFiltered : resultHits);

            this.props.resetScroll("search-suggestions-container");
            this.setState({ facetHits: getUnique(results.splice(0, 20), "tag"), shouldUpdate: true });
          });
      })
      .catch((e) => { console.log(e) });
  }

  shouldDisplaySuggestion(tag) {
    return (this.state.filterRequest.search(tag) === -1);
  }

  handleWingClick = (wing) => {
    this.props.addFilter(wing);
  }

  render() {
    const { facetHits } = this.state;
    const { classes } = this.props;
    const { locale } = this.props.commonStore;

    return (
      <div style={{position: 'relative'}}>
        
        <Hidden smDown>

          <IconButton className={classNames(classes.suggestionButton, classes.leftButton)} aria-label="Delete" 
                      onMouseDown={() => {this.props.scrollTo("right", "search-suggestions-container")}} 
                      onMouseUp={this.props.scrollStop} >
            <ArrowLeft fontSize="inherit" />
          </IconButton>

          <IconButton className={classNames(classes.suggestionButton, classes.rightButton)} aria-label="Delete" 
                      onMouseDown={() => {this.props.scrollTo("left", "search-suggestions-container")}} 
                      onMouseUp={this.props.scrollStop} >
            <ArrowRight fontSize="inherit" />
          </IconButton>

        </Hidden>

        <div className={classes.suggestionsContainer} id="search-suggestions-container">

          {facetHits.map((item, i) => {
            let indexOfItem = facetHits.findIndex(hit => (hit.tag || hit.value) === (item.tag || item.value) );
            if(indexOfItem < i) return null; // Already displayed

            let displayedName = ProfileService.getWingDisplayedName(item, locale);

            if(!displayedName) console.log('No displayedName for the Record: ', item);
            
            let pictureSrc = ProfileService.getPicturePath(item.picture);
            if (this.shouldDisplaySuggestion(item.tag || item.value)) {
              return (
                <Chip key={i}
                  component={React.forwardRef((props, ref) => {
                    return  (
                      <div {...props} ref={ref} >
                      {pictureSrc && (
                        <div className={classNames(classes.suggestionPicture, (item.type === 'person' ? classes.roundImg : null) )}>
                          <img alt="Emoji" src={pictureSrc} />
                        </div>
                      )}
                      <div className={classes.suggestionLabel}>{ProfileService.htmlDecode(displayedName)}</div>
                    </div>
                    )
                  })

                  }
                  onClick={(e) => this.handleWingClick({ name: displayedName, tag: (item.tag || item.value) })}
                  className={classes.suggestion}
                  style={{ animationDelay: (i * 0.05) + 's' }} />
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

SearchSuggestions = withScrollManagement(withSearchManagement(SearchSuggestions));

export default inject('commonStore', 'orgStore')(
  observer(withStyles(styles)(SearchSuggestions))
);
