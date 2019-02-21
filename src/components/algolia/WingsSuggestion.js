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

class WingsSuggestions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  shouldDisplaySuggestion(tag) {
    return (this.props.filters.search(tag) === -1);
  }

  render() {
    const {classes} = this.props;

    return (
      <div className={classes.suggestionsContainer} >
        @todo
      </div>
    );
  }
}

export default withStyles(styles)(WingsSuggestions);
