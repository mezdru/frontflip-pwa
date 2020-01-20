const drawerWidth = 300;

export const styles = theme => ({
  root: {
    display: 'flex',
    width: '100%',
    textAlign: 'center',
    position: 'absolute',
  },
  menuLink: {
    position: 'fixed',
    top: 16,
    right: 8,
    zIndex: 1001,
    minWidth: '130px',
    height: '30px',
    marginRight: 8,
    color: theme.palette.secondary.main,
    backgroundColor: 'white',
    boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
    '&:hover': {
      color: theme.palette.secondary.main,
      backgroundColor: '#d5d5d5',
    }
  },
  title: {
    lineHeight: '50%',
    [theme.breakpoints.down('sm')]: {
      display: 'none'
    }
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    background: 'transparent',
    boxShadow: 'none',
    zIndex: '999'
  },
  appBarShift: {
    width: '100%',
    marginLeft: 0,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    '& > div:first-child' : {
      filter: 'brightness(0) invert(1)',
    },
    '& span': {
      color: 'white',
    },
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: theme.palette.primary.dark,
    width: drawerWidth,
    padding: '0 !important',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
  drawerIconButton: {
    padding: 0,
    background: 'white',
    margin: '8px 16px',
    opacity: 0.7,
    '&:hover': {
      backgroundColor: 'white',
      opacity: 1,
    }
  },
  drawerIcon: {
    color: theme.palette.secondary.main,
    fontSize: 40,
  },
  content: {
    flexGrow: 1,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -300,
    padding: 0,
  },
  contentShift: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  fixToRight: {
    position: 'absolute',
    right: 0
  },
  leftSubmenuLogo: {
    height: 30,
    width: 30,
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  toolbar: {
    padding: 0
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,.12)',
    margin: '8px 0',
  },
  menuButton: {
    position: 'fixed',
    top: 16,
    left: 16,
    zIndex: 1199,
    padding: 0,
    cursor: 'pointer',
    height: 48,
    width: 48,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: 'white',
    }
  },
  insideButton:{
    top: 20,
    height: 40,
    width: 40,
    minWidth: 0,
    left: 20
  },
  right: {
    right: '16px !important',
    left: 'unset',
  },
  logoBorder: {
    backgroundCOlor: 'white',
    border: '2px solid white',
  }
});
