export const styles = theme => ({
  suggestionsContainer: {
    textAlign: 'left',
    maxHeight: 63,
    overflowX: 'auto',
    overflowY: 'hidden',
    padding: '8px 0px',
    position: 'relative',
    zIndex: 1197,
    whiteSpace: 'nowrap',
    '&::-webkit-scrollbar': {
      width: '0 !important'
    },
    overflow: '-moz-scrollbars-none',
    MsOverflowStyle: 'none',
    scrollbarWidth: 'none',
  },
  suggestion: {
    margin: 8,
    marginBottom: 20,
    background: 'rgba(42, 44, 60, 0.85)',
    color: 'white',
    fontWeight: 500,
    '&:hover': {
      color: theme.palette.primary.dark,
      background: theme.palette.primary.main,
    },
    opacity: 0,
    animation: 'easeIn .6s',
    animationFillMode: 'forwards',
  },
  '@keyframes easeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
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
      borderRadius: 5
    }
  },
  suggestionButton: {
    position: 'absolute',
    zIndex: 1197,
    backgroundColor: 'rgba(42, 44, 60, 0.85)',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 32,
    padding: 0,
    color: 'white',
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      color: 'rgba(42, 44, 60, 0.85)',
      backgroundColor: 'white'
    }
  },
  leftButton: {
    left: -42,
  },
  rightButton: {
    right: -42
  },
  roundImg: {
    '& img': {
      borderRadius: '50%'
    }
  }
});