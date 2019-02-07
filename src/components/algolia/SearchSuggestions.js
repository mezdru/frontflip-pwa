import React, { Component } from 'react';
import { connectMenu } from 'react-instantsearch-dom';
import { withStyles, Chip } from '@material-ui/core'

const style = theme => ({
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
  },
  suggestionCount: {
    background: 'rgb(220,220,220)',
    color: 'white',
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

class SearchSuggestionsComponent extends Component {
  constructor(props) {
    super(props);
  }
  
  shouldDisplaySuggestion(tag) {
    return (this.props.currentFilters.search(tag) === -1);
  }

  render() {
    const { items, classes, addToFilters } = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        {items.map((item, i) => {
          if (this.shouldDisplaySuggestion(item.value)){
            return (
              <Chip key={i} 
                    component={ (props)=>{
                      return (<div {...props}>
                                <div className={classes.suggestionLabel}>{item.label}</div>
                                <div className={classes.suggestionCount}>{item.count}</div>
                              </div>);
                    }}
                    onClick={(e) => addToFilters(e, { name: item.label, tag: item.value })} 
                    className={classes.suggestion} />
            );
          }else {
            return null;
          }
        })}
      </div>
    );
  }
}

const SearchSuggestions = connectMenu(SearchSuggestionsComponent);
export default withStyles(style, { withTheme: true })(SearchSuggestions);
