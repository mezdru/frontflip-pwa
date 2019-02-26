export const styles = theme => ({
  hitListContainer: {
    position: 'relative',
    width: '100%',
    marginBottom: 150,
  },
  suggestionsContainer: {
    position: 'relative',
    left: 0,
    right: 0,
    margin: 'auto',
  },
  profileContainer: {
    position: 'fixed',
    top: 0,
    zIndex:99999,
    width: '100%',
    height: '100vh',
    overflowY: 'scroll',
    backgroundColor: 'white',
    '& ul': {
      listStyleType: 'none',
      padding: 0,
      marginTop: 0,
    },
    animationName: 'popIn',
    animationDuration: '.6s'
  },
  '@keyframes popIn': {
    from: { top: '100vh' },
    to: { top: 0 }
  },
  '@keyframes popOut': {
    from: { top: 0, opacity: 1 },
    to: { top: '100vh', opacity: 0 }
  },
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 1 }
  },
  cardMobileView: {
    [theme.breakpoints.down('xs')]: {
      margin: '16px!important',
    },
  },
  hitList: {
    width: '100%',
    backgroundColor: '#f2f2f2',
    '& ul': {
      listStyleType: 'none',
      padding: 0,
      marginTop: '32px',
      marginBottom: '32px',
    },
    '& ul li': {
      marginBottom: '32px',
      opacity: 0,
      animation: 'fadeIn 0.9s 1',
      animationFillMode: 'forwards',
    },
    '& ul li > div:first-child': {
      position: 'relative',
      left: '0',
      right: '0',
      margin: 'auto'
    }
  },
  fullWidth: {
    width: '100%'
  },
  searchBar: {
    position: 'fixed !important',
    top: 0,
    left: 0,
    right: 0,
    margin: 'auto',
    zIndex: 1000,
    marginTop: 8,
    background: 'transparent',
    width: '100%',
  },

  searchBanner: {
    position: 'relative',
    opacity: 0.8,
    filter: 'blur(.5px) brightness(55%)'
  }
});
