export const styles = theme => ({
  suggestionsContainer: {
    position: 'relative',
    textAlign: 'left',
    overflow: 'hidden',
    overflowX: 'auto',
    width: '100%',
    paddingBottom: 16,
    marginTop: -6,
    scrollbarWidth: 'thin',
    scrollbarColor:  'rgba(0, 0, 0, 0.26) transparent',
  },
  suggestionList: {
    whiteSpace: 'nowrap',
    padding: 0,
    margin:0,
    height: 52,
    listStyleType: 'none',
    paddingLeft: 8,
    paddingRight: 8,
    '& li ': {
      display: 'inline-block',
    },
    '& li:focus': {
      transform: 'scale(3)',
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
  transparentGradientBoxRight: {
    position: 'absolute',
    right:0,
    top:0,
    width: 16,
    height: '100%',
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0), #F2F2F2)',
    zIndex: 2,
  },
  transparentGradientBoxLeft: {
    position: 'absolute',
    left:0,
    top:0,
    width: 16,
    height: '100%',
    backgroundImage: 'linear-gradient(to right, #F2F2F2, rgba(0,0,0,0))',
    zIndex: 2,
  },
  scrollLeft: {
    left: -64,
  },
  scrollRight: {
    right: -64,
  },
  scrollButton: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    border: 'none',
    color: 'rgba(0, 0, 0, 0.26)',
    fontSize: 45,
    padding: 0,
    overflow: 'hidden',
    minWidth: 0,
    width: 56,
  }
});