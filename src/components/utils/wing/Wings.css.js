export const styles = theme => ({
  root: {
    padding: '6px 12px',
    cursor: 'pointer',
    maxWidth: 'calc(100% - 12px)',
    // margin: '16px 8px 0px 8px',
    margin: 8,
    borderRadius: 16,
    boxSizing: 'border-box',
    fontSize: '0.9125rem',
    display: 'inline-flex',
    fontWeight: 500,
    height: 32,
    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  profileMode: {
    backgroundColor: '#FFFFFF',
    color: theme.palette.primary.dark,
    // '&:hover': {
    //   boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
    // }
  },
  personMode: {
    backgroundColor: theme.palette.primary.dark,
    '& p': {
      color: '#FFFFFF !important',
    },
    '& svg': {
      color: '#FFFFFF !important',
    },
    '& img': {
      borderRadius: '50%',
    },
    '&:hover': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
  },
  cardMode: {
    backgroundColor: '#FFFFFF',
    color: theme.palette.primary.dark,
    '&:hover': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
  },
  highlightMode: {
    backgroundColor: theme.palette.primary.hover,
    color: 'white'
  },
  onboardMode: {
    backgroundColor: theme.palette.primary.light,
    color: theme.palette.primary.dark,

  },
  suggestionMode: {
    backgroundColor: theme.palette.primary.dark,
    '& p': {
      color: 'white !important'
    },
    '&:hover': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
  },
  buttonMode: {
    backgroundColor: 'white',
    border: '1px solid ' + theme.palette.secondary.main,
    '& p': {
      color: theme.palette.secondary.main,
    },
    '&:hover': {
      backgroundColor: 'rgba(50,50,50,.02)',
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    }
  },
  applauseIcon: {
    width: 20,
    height: 20,
    backgroundColor: 'transparent !important',
    pointerEvents: 'none',
    borderRadius: '50%',
  },
  avatar: {
    position: 'relative',
    height: 48,
    width: 32,
    margin: '-15px -6px 0 -22px',
    backgroundColor: 'transparent',
    overflow: 'visible',
    '& img': {
      width: '100%',
      height: 'auto',
      textAlign: 'center',
      objectFit: 'cover',
    }
  },
  label: {
    paddingLeft: 16,
    paddingRight: 12,
    display: 'flex',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    maxWidth: '100%',
  },
  labelContent: {
    textOverflow: 'ellipsis',
    width: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  },
  clapRoot: {
    WebkitTouchCallout: 'none', /* iOS Safari */
    WebkitUserSelect: 'none', /* Safari */
    KhtmlUserSelect: 'none', /* Konqueror HTML */
    MozUserSelect: 'none', /* Firefox */
    MsUserSelect: 'none', /* Internet Explorer/Edge */
    userSelect: 'none', /* Non-prefixed version, currently supported by Chrome and Opera */
    float: 'right',
    display: 'flex',
    opacity: .6,
    fontWeight: 500,
    transition: 'opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      opacity: 1
    },
    '& span': {
      pointerEvents: 'none',
      marginLeft: 2
    }
  },
  clearRoot: {
    backgroundColor: 'white',
    borderRadius: '50%',
    color: theme.palette.primary.light,
    marginRight: -4,
    transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      opacity: 0.6,
      color: theme.palette.primary.main
    }
  }
});