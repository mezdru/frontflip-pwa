// I don't know why, but if I use 'theme' like in other css.js files, the layout is broken.
import theme from '../../theme';

export const styles = {
  root: {
    position: 'fixed',
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: 'white',
    zIndex: 99999,
    top: 0,
    left: 0,
    // overflow: 'scroll'
  },
  thumbnail: {
    position: 'relative',
    padding: 16,
    [theme.breakpoints.up('sm')]: {
      padding: 32,
      paddingBottom: 16,
    },
    [theme.breakpoints.up('lg')]: {
      paddingRight: 0,
      paddingBottom: 32,
      height: 'calc(100vh - 116px)',
    },
  },
  content: {
    position: 'relative',
    padding: 16,
    paddingTop: 0,
    [theme.breakpoints.up('sm')]: {
      padding: 32,
      paddingTop: 0,
    },
    [theme.breakpoints.up('lg')]: {
      padding: 32,
      paddingLeft: 0,
      paddingTop: 16,
    },
  },
  clapHistory: {
    marginTop: 28, // 32 - 4 (margin-bottom of one wing)
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 16,
      marginTop: -20 // Height of title
    }
  },
  wings: {
    [theme.breakpoints.up('lg')]: {
      paddingRight: 16,
      paddingLeft: 24,
      marginTop: -13,
    }
  },
  actions: {
    padding: 16,
    [theme.breakpoints.up('sm')]: {
      padding: 32,
    }
  },
  blackFilter: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.35,
    overflow: 'hidden',
  },
  banner: {
    position: 'fixed',
    // WebkitFilter: 'blur(2px)',
    // MozFilter: 'blur(2px)',
    // OFilter: 'blur(2px)',
    // MsFilter: 'blur(2px)',
    // filter: 'blur(2px)',
  },
  button: {
    height: 'initial',
    marginLeft: 32
  }
}