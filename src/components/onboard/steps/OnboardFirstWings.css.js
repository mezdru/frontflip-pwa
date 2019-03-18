export const styles = theme => ({
  firstWingsList: {
    listStyleType: 'none',
    padding: 8,
    paddingTop: 0,
    position: 'relative',
    left:0,
    right:0,
    margin: 'auto',
    width: 'calc(100% - 16px)',
    whiteSpace: 'nowrap',
    overflowX: 'auto',
    scrollbarWidth: 'thin',
    scrollbarColor:  'rgba(0, 0, 0, 0.26) transparent',
  },
  firstWing: {
    textAlign: 'center',
    cursor: 'pointer',
    display: 'inline-block',
    width: 159,
    height: 159,
    [theme.breakpoints.down('sm')]: {
      width: 130,
      height: 159,
    },
    overflow: 'hidden',
    padding: 16,
    margin: 8,
    marginTop:0,
    WebkitTransition: 'all .6s ease-in-out',
    MozTransition: 'all .6s ease-in-out',
    OTransition: 'all .6s ease-in-out',
    transition: 'all .6s ease-in-out',
    borderRadius: 30,
    '& img': {
      width: 145,
      height: 145,
      borderRadius: 75,
      [theme.breakpoints.down('sm')]: {
        width: 100,
        height: 100,
        borderRadius: 50,
      },
      outline: 'none',
    },
    '& div': {
      position: 'relative',
      height: '100%',
      width: '100%',
    },
    '& div div': {
      position:'absolute',
      left:0,
      right:0,
      margin: 'auto',
      bottom: 0,
      zIndex: 2,
      fontWeight: '600',
      height: 'initial',
    }
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