import React from 'react'
import { withStyles, Chip } from '@material-ui/core';

const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    maxHeight: 112, // 48 * 2 + 8 + 8
    overflow: 'hidden',
    padding: '8px 0px',
    marginLeft: '-8px',
  },
  suggestion: {
    margin: 8,
    paddingRight: 0,
    background: 'white',
    color: theme.palette.secondary.dark,
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
      facetHits: []
    };

    this.fetchSuggestions = this.fetchSuggestions.bind(this);
  }

  componentDidMount() {
    this._ismounted = true;
    this.fetchSuggestions(this.props.filters, this.props.query);
  }

  componentWillUnmount() {
    this._ismounted = false;
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.filters && this._ismounted) {
      this.fetchSuggestions(nextProps.filters, nextProps.query);
    }
  }

  fetchSuggestions(filters, query) {
    return this.props.index.searchForFacetValues({
      facetName: 'hashtags.tag',
      facetQuery: '',
      query: query || '',
      facetFilters: filters.split(' AND '),
      filters: filters || '',
    }, (err, res) => {
      if(!err) {
        this.setState({facetHits: res.facetHits});
      }
    });
  }

  shouldDisplaySuggestion(tag) {
    return (this.props.filters.search(tag) === -1);
  }

  render() {
    const {facetHits} = this.state;
    const {classes, addToFilters} = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        {facetHits.map((item, i) => {
          if (this.shouldDisplaySuggestion(item.value)){
            return (
              <Chip key={i} 
                    component={ (props)=>
                              <div {...props}>
                                <div className={classes.suggestionLabel}>{item.value}</div>
                                <div className={classes.suggestionCount}>{item.count}</div>
                              </div>
                    }
                    onClick={(e) => addToFilters(e, { name: item.value, tag: item.value })} 
                    className={classes.suggestion} 
                    style={{animationDelay: (i*0.05) +'s'}} />
            );
          }else {
            return null;
          }
        })}
      </div>
    );
  }
}

export default withStyles(styles)(SearchSuggestions);
