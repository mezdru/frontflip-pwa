const LOGO_HEIGHT = 170;

export const styles = theme => ({
  generalPart: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'unset'
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 247px)'
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 429px)'
    },
    background: theme.palette.secondary.light,
    padding: 16
  },
  hashtagsPart: {
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      minHeight: 'unset'
    },
    [theme.breakpoints.up('sm')]: {
      minHeight: 'calc(100vh - 247px)'
    },
    [theme.breakpoints.up('md')]: {
      minHeight: 'calc(100vh - 429px)'
    },
    padding: 16
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
  },
  buttonIcon: {
    // width: 40,
    // height: 40,
    color: theme.palette.primary.main
  },
  wings: {
    display: 'inline-block',
    color: 'white',
    position: 'relative',
  },
  minHeightPossible: {
    height: '-moz-min-content',
    height: '-webkit-min-content',
    height: 'min-content',
  },
  editButton: {
    color: theme.palette.primary.main,
    marginLeft: 16
  },
  updateCoverButton: {
    position: 'absolute',
    top: -16,
    right: 16,
    transform: 'translateY(-100%)',
  },
  contactIcon: {
    marginRight: 16,
    position: 'relative',
    textAlgin: 'center',
    width: 24,
    fontSize: 24
  }
});