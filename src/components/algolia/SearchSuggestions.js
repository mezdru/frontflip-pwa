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
    background: 'white',
    color: theme.palette.secondary.main,
    '&:hover': {
      background: 'rgb(220,220,220)'
    }
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
    const { items, classes } = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        {items.map((item, i) => {
          if (this.shouldDisplaySuggestion(item.value))
            return <Chip key={i} label={'(' + item.count + ') - ' + item.label} onClick={(e) => this.props.addToFilters(e, { name: item.label, tag: item.value })} className={classes.suggestion} />;
        })}
      </div>
    );
  }
}

const SearchSuggestions = connectMenu(SearchSuggestionsComponent);
export default withStyles(style, { withTheme: true })(SearchSuggestions);
