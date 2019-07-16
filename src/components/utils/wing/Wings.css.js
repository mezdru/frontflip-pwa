export const styles = theme => ({
  root: {
    padding: '6px 12px',
    cursor: 'pointer',
    margin: '16px 8px 4px 8px',
    borderRadius: 16,
    boxSizing: 'border-box',
    fontSize: '0.9125rem',
    display: 'inline-flex',
    fontWeight: 600,
    height: 32,
    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
  },
  profileMode: {
    backgroundColor: '#E0E0E0',
    color: theme.palette.primary.dark,
    '&:hover': {
      boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)'
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
  buttonMode: {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark
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
  }
});