export const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    background: 'white'
  },
  main: {
    position: 'relative',
    width: '100%',
    height: '100%',
    padding: 32 
  },
  profilePicture: {
    position: 'absolute',
    left: 0,
    right: 0,
    margin: 'auto',
    top: -100,
    width: 200,
    height: 200,
    boxShadow: '0px 1px 5px 0px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 3px 1px -2px rgba(0,0,0,0.12)',
  },
  topOffset: {
    position: 'relative',
    height: 100,
    zIndex: -1,
  },
  text: {
    color: theme.palette.primary.dark,
  },
  description: {
    // color: '#555555',
    maxHeight: 150,
    overflowY: 'scroll',
    marginTop: 16
  }
});