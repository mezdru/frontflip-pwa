export const styles = {
  root: {
    position: 'fixed',
    width: '100vw',
    minHeight: '100vh',
    backgroundColor: 'white',
    zIndex: 99999,
    top: 0,
    left: 0,
    overflow: 'hidden'
  },
  thumbnail: {
    position: 'relative',
    padding: 32,
    paddingRight: 0,
    height: 'calc(100vh - 112px)',
  },
  content: {
    position: 'relative',
    padding: 32,
    paddingTop: 16,
    paddingLeft: 0,
  },
  clapHistory: {
    paddingLeft: 16,
    marginTop: -23 // Height of title
  },
  wings: {
    paddingRight: 16,
    paddingLeft: 24
  },
  actions: {
    padding: 32
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