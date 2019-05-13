import React from 'react'
import { withStyles, Chip } from '@material-ui/core';
import AlgoliaService from '../../services/algolia.service';
import { inject, observer } from 'mobx-react';
import { observe } from 'mobx';
import withSearchManagement  from './SearchManagement.hoc';
import SuggestionsService from '../../services/suggestions.service';
import ProfileService from '../../services/profile.service';
import Wings from '../utils/wing/Wing';

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
    paddingRight: 0,
    background: 'white',
    color: theme.palette.primary.dark,
    '&:hover': {
      background: 'rgb(220,220,220)'
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
    height:32,
    textAlign: 'center',
    lineHeight: '32px'
  },
  suggestionLabel: {
    marginRight: 8,
  }
});

class SearchSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      facetHits: [],
      observer: () => {},
      observer2: () => {},
      filterRequest: '',
      queryRequest: '',
    };

    this.fetchSuggestions = this.fetchSuggestions.bind(this);
  }

  componentDidMount() {
    AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
    this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);

    this.setState({observer: observe(this.props.commonStore, 'algoliaKey', (change) => {
      AlgoliaService.setAlgoliaKey(this.props.commonStore.algoliaKey);
      this.fetchSuggestions(this.state.filterRequest, this.state.queryRequest);
    })});

    this.setState({observer2: observe(this.props.commonStore, 'searchFilters', (change) => {
      this.props.makeFiltersRequest()
      .then((request) => {
        if(JSON.stringify(change.newValue) !== JSON.stringify(change.oldValue))
          this.setState({filterRequest: request.filterRequest, queryRequest: request.queryRequest}, () => {
            this.fetchSuggestions(request.filterRequest, request.queryRequest);
          });
      });
    })});
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.shouldUpdate) {
      this.setState({shouldUpdate: false});
      return true;
    }
    return false;
  }

  componentWillUnmount() {
    this.state.observer();
    this.state.observer2();
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.autocompleteSuggestions.length > 0) {
      this.setState({facetHits: nextProps.autocompleteSuggestions, shouldUpdate: true});
    } else {
      this.setState({facetHits: nextProps.autocompleteSuggestions, shouldUpdate: true});
    }
  }

  fetchSuggestions(filters, query) {
    AlgoliaService.fetchFacetValues(null, false, filters, query)
    .then((res) => {
      if(!res) return;
      SuggestionsService.upgradeData(res.facetHits)
      .then(resultHits => {
        this.setState({facetHits: resultHits.splice(0,7), shouldUpdate: true});
      });
    })
    .catch();
  }

  shouldDisplaySuggestion(tag) {
    return (this.state.filterRequest.search(tag) === -1);
  }

  render() {
    const {facetHits} = this.state;
    const {classes, addFilter} = this.props;
    const {locale} = this.props.commonStore;

    console.log(facetHits);

    return (
      <div className={classes.suggestionsContainer} >
        {facetHits.map((item, i) => {
          let displayedName = (item.name_translated ? (item.name_translated[locale] || item.name_translated['en-UK']) || item.name || item.tag : item.name);
          if (this.shouldDisplaySuggestion(item.tag)){
            return (
              <Wings src={ProfileService.getPicturePath(item.picture)} key={i}
              label={ProfileService.htmlDecode(displayedName)}
              onClick={(e) => addFilter({ name: displayedName, tag: displayedName})} 
              style={{animationDelay: (i*0.05) +'s'}}/>

              // <Chip key={i} 
              //       component={ (props)=>
              //                 <div {...props}>
              //                   <div className={classes.suggestionLabel}>{displayedName}</div>
              //                   <div className={classes.suggestionCount}>{item.count}</div>
              //                 </div>
              //       }
              //       onClick={(e) => addFilter({ name: displayedName, tag: displayedName})} 
              //       className={classes.suggestion} 
              //       style={{animationDelay: (i*0.05) +'s'}} />
            );
          }else {
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
