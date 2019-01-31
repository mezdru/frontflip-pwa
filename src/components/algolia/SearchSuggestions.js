import React, {Component} from 'react';
import { connectMenu } from 'react-instantsearch-dom';
import {withStyles, Chip} from '@material-ui/core'

const style = theme => ({
    suggestionsContainer: {
        textAlign: 'center',
    }
});

class SearchSuggestionsComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { items, classes } = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        {items.map((item, i) => {
            return <Chip key={i} label={ '('+item.count + ') - ' + item.label} onClick={(e) => this.props.addToFilters(e, {name: item.label, tag: item.value})} />;
        })}
      </div>
    );
  }
}

const SearchSuggestions = connectMenu(SearchSuggestionsComponent);
export default withStyles(style, {withTheme: true})(SearchSuggestions);
