export const styles = theme => ({
  searchInputList: {
    position: 'absolute',
    top: '40%',
    width: '100%',
  },
  searchInputMap: {
    marginTop: 16,
  },
  searchContainer: {
    position: 'relative',
    width: '100%',
    height: '100vh',
    top:0,
    left:0,
    overflow: 'hidden',
    background: 'grey',
  },
  searchContentContainer: {
    height: 'calc(100% - 129px)',
    bottom: 0,
    position: 'absolute',
    overflowX: 'hidden',
    overflowY: 'scroll',
    width: '100%',
  },
  searchContentOffset: {
    height: 'calc(100vh - 229px)',
    overflow: 'hidden',
    width: '100%',
    background: 'transparent',
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
  },
  searchCountButton: {
    height: 100
  }
});
