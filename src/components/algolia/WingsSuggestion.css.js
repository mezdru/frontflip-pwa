export const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    overflow: 'hidden',
    overflowX: 'auto',
    width: '100%',
    paddingBottom: 16,
    marginTop: 8,
  },
  suggestionList: {
    whiteSpace: 'nowrap',
    padding: 0,
    margin:0,
    height: 52,
    listStyleType: 'none',
    '& li ': {
      display: 'inline-block',
    }
  },
  suggestion: {
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