const LOGO_HEIGHT = 170;

export const styles = theme => ({
  generalPart: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'unset'
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 166px)'
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 350px)'
    },
    background: theme.palette.secondary.light,
    padding: 16
  },
  hashtagsPart: {
    position: 'relative',
    background: 'white',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'unset'
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 166px)'
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 350px)'
    },
    padding:  16,
  },
  logoContainer: {
    position: 'relative',
    transform: 'translateY(-50%)',
    top: 0,
  },
  logo: {
    position: 'absolute',
    transform: 'translateY(-50%)',
    top: 0,
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: LOGO_HEIGHT,
    height: LOGO_HEIGHT,
    '& img': {
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      border: '9px solid white'
    },
  },
  subheader: {
    position: 'relative',
    marginTop: (LOGO_HEIGHT / 2),
    marginBottom: 16,
  },
  button: {
    color: theme.palette.secondary.contrastText,
    wordBreak: 'break-all',
    padding: '8px 24px',
  },
  buttonIcon: {
    color: theme.palette.primary.main
  },
  wings: {
    display: 'inline-block',
    color: 'white',
    position: 'relative',
  },
  minHeightPossible: {
    height: '-moz-min-content',
    // eslint-disable-next-line
    height: '-webkit-min-content',
    // eslint-disable-next-line
    height: 'min-content',
  },
  editButton: {
    color: theme.palette.primary.main,
    marginLeft: 16
  },
  updateCoverButton: {
    position: 'absolute',
    top: -24,
    right: 16,
    transform: 'translateY(-100%)',
  },
  contactIcon: {
    marginRight: 16,
    position: 'relative',
    textAlign: 'center',
    width: 24,
    fontSize: 24
  },
  returnButton: {
    position: 'absolute',
    margin: 16,
    background: 'white',
    color: theme.palette.primary.main
  },
  returnButtonSize: {
    fontSize: 24,
  },
  profileContainerHide: {
    position: 'fixed',
    top: 0,
    zIndex:99999,
    backgroundColor: 'white',
    width: '100%',
    '& ul': {
      listStyleType: 'none',
      padding: 0,
      marginTop: 0,
    },
    animationName: 'popOut',
    animationDuration: '.6s'
  },
  '@keyframes popOut': {
    from: { top: 0 },
    to: { top: '100vh' }
  },
  name: {
    marginLeft: 24,
  },
  aboutMe: {
    padding: 16,
  }
});
