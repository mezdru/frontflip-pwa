export const styles = theme => ({
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
  fullWidth: {
    width: '100%'
  },
  searchMobileView: {
    [theme.breakpoints.down('xs')]: {
      marginLeft: '16px!important',
      marginRight: '16px!important',
    },
  }
});
