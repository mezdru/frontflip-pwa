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
      maxWidth: 'calc(100% - 32px)',
      position: 'relative'
    },
  },
  shadowedBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgb(0,0,0)',
    opacity: 0,
  }
});
