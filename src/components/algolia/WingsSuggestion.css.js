export const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    overflow: 'hidden',
    margin: '8px 0px',
    marginLeft: '-8px',
    overflowX: 'scroll',
  },
  suggestionList: {
    whiteSpace: 'nowrap',
    padding: 0,
    listStyleType: 'none',
    '& li ': {
      display: 'inline-block',
    }
  },
  suggestion: {
    margin: 8,
    color: theme.palette.secondary.dark,
    opacity: 0,
    animation: 'easeIn .6s',
    animationFillMode: 'forwards',
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
});