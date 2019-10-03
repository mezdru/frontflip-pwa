export const styles = theme => ({
  root: {
    height: '100vh',
    overflow: 'hidden'
  },
  logo: {
    width: '6.5rem',
    height: '6.5rem',
    boxShadow: '0 5px 15px -1px darkgrey, 0 0 0 5px transparent',
    bottom: '3.6rem',
    marginBottom: '-7rem',
    zIndex: 2,
  },
  blackFilter: {
    position: 'fixed',
    width: '100%',
    height: '100vh',
    backgroundColor: 'black',
    opacity: 0.35,
    overflow: 'hidden',
  },
  banner: {
    position: 'fixed',
  },
  container: {
    position: 'absolute',
    width: 'calc(100% - 32px)',
    maxHeight: 'calc(100% - 64px)',
    zIndex: 2,
    overflow: 'hidden',
    margin: 16,
    [theme.breakpoints.down('xs')]: {
      top: 0,
      margin: 0,
      width: '100%',
      maxHeight: 'unset',
      overflow: 'auto',
      height: '100vh'
    }
  }
});