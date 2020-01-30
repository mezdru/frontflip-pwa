const logoSize = {
  default: 200,
  xs: 130
};

export const styles = theme => ({
  root: {
    position: 'relative',
    width: '100%',
    cursor: 'pointer',
    height: 265,
    borderRadius: 4,
    overflow: 'hidden',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    transition: 'all 0.3s cubic-bezier(.25,.8,.25,1)',
    backgroundImage: 'linear-gradient(to bottom, #2b2d3c, #292a38, #262733, #24242f, #21212b)',
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
    [theme.breakpoints.down('xs')]: {
      height: 215,
    }
  },
  logo: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: logoSize.default+40,
    height: logoSize.default+40,
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    borderRadius: '50%',
    backgroundSize: `${logoSize.default}px ${logoSize.default}px`,
    [theme.breakpoints.down('xs')]: {
      width: logoSize.xs+40,
      height: logoSize.xs+40,
      backgroundSize: `${logoSize.xs}px ${logoSize.xs}px`,
    },
  },
  logoFilter: {
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    background: 'white',
    opacity: 1,
    transition: 'all 600ms cubic-bezier(.25,.8,.25,1)'
  },
  dataContainer: {
    position: 'relative',
    top: 0,
    right: 0,
    left: logoSize.default,
    width: 'calc(100% - 232px)',
    margin: 16,
    flex: 1,
    height: logoSize.default-32,
    [theme.breakpoints.down('xs')]: {
      width: 'calc(100% - 182px)',
      height: logoSize.xs-16,
      left: logoSize.xs,
      marginBottom: 0,
    }
  },
  text: {
    color: 'white',
    marginBottom: 0,
    overflow: 'hidden',
    maxHeight: '6.9rem',
    [theme.breakpoints.down('xs')]: {
      maxHeight: '4.5rem'
    }
  },
  ellipsis: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
  },
  contactsContainer : {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginLeft: -9
  },
  noLinkStyle: {
    textDecoration: 'none'
  },
  wingsContainer: {
    position: 'absolute',
    bottom : 0,
    paddingBottom: 8,
    width: '100%',
    overflowY: 'hidden',
    overflowX: 'auto',
    overflow: '-moz-scrollbars-none',
    scrollbarWidth: 'none',
    MsOverflowStyle: 'none',
    scrollbarColor: '#2b2d3c #2b2d3c',
    whiteSpace: 'nowrap',
    display: 'inline-block',
    marginBottom: 0,
    '& >div:first-child': {
      marginLeft: 16
    },
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }
})