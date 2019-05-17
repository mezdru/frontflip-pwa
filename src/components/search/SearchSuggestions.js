import React from 'react'
import { withStyles, Chip } from '@material-ui/core';
import AlgoliaService from '../../services/algolia.service';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import withSearchManagement from './SearchManagement.hoc';
import SuggestionsService from '../../services/suggestions.service';
import ProfileService from '../../services/profile.service';

const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    maxHeight: 63,
    overflow: 'hidden',
    padding: '8px 0px',
    marginLeft: '-8px',
    position: 'relative',
    zIndex: 1197,
  },
  suggestion: {
    margin: 8,
    marginBottom: 20,
    background: 'rgba(255,255,255, .9)',
    color: theme.palette.primary.dark,
    '&:hover': {
      background: 'rgba(220,220,220, .9)'
    },
    opacity: 0,
    animation: 'easeIn .6s',
    animationFillMode: 'forwards',
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  suggestionCount: {
    color: 'rgb(190,190,190)',
    borderRadius: '50%',
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: '32px'
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
    };

    this.fetchSuggestions = this.fetchSuggestions.bind(this);
  }

  componentDidMount() {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);

    this.setState({
      observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
        AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
        this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);
      })
    });

    this.setState({
      observer2: observe(this.props.commonStore, 'searchFilters', (change) => {
        this.props.makeFiltersRequest()
          .then((request) => {
            if (JSON.stringify(change.newValue) !== JSON.stringify(change.oldValue))
              this.setState({ filterRequest: request.filterRequest, queryRequest: request.queryRequest }, () => {
                this.fetchSuggestions(request.filterRequest, request.queryRequest);
              });
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
    if (nextProps.autocompleteSuggestions.length > 0) {
      this.setState({ facetHits: nextProps.autocompleteSuggestions, shouldUpdate: true });
    } else {
      this.setState({ facetHits: nextProps.autocompleteSuggestions, shouldUpdate: true });
    }
  }

  fetchSuggestions(filters, query) {
    AlgoliaService.fetchFacetValues(null, false, filters, query)
      .then((res) => {
        if (!res) return;
        SuggestionsService.upgradeData(res.facetHits)
          .then(resultHits => {
            this.setState({ facetHits: resultHits.splice(0, 7), shouldUpdate: true });
          });
      })
      .catch();
  }

  shouldDisplaySuggestion(tag) {
    return (this.state.filterRequest.search(tag) === -1);
  }

  render() {
    const { facetHits } = this.state;
    const { classes, addFilter } = this.props;
    const { locale } = this.props.commonStore;

    return (
      <div className={classes.suggestionsContainer} id="search-suggestions-container">

        {facetHits.map((item, i) => {
          let displayedName = (item.name_translated ? (item.name_translated[locale] || item.name_translated['en-UK']) || item.name || item.tag : item.name);
          let pictureSrc = ProfileService.getPicturePath(item.picture);
          if (this.shouldDisplaySuggestion(item.tag)) {
            return (
              <Chip key={i} 
                    component={ (props)=>
                              <div {...props}>
                                { pictureSrc && (
                                  <div className={classes.suggestionPicture}>
                                    <img alt="Emoji" src={pictureSrc} />
                                  </div>
                                )} 
                                <div className={classes.suggestionLabel}>{ProfileService.htmlDecode(displayedName)}</div>
                              </div>
                    }
                    onClick={(e) => addFilter({ name: displayedName, tag: item.tag})} 
                    className={classes.suggestion} 
                    style={{animationDelay: (i*0.05) +'s'}} />
            );
          } else {
            return null;
          }
        })}
      </div>
    );
  }
}

SearchSuggestions = withSearchManagement(SearchSuggestions);

export default inject('commonStore')(
  observer(withStyles(styles)(SearchSuggestions))
);
