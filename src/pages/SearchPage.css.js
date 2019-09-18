export const styles = theme => ({
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
  },
  askForHelpButton: {
    position: 'fixed',
    top: 16,
    right: 16,
    zIndex: 2
  }
});
