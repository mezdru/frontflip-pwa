export const styles = theme => ({
  root: {
    padding: '6px 12px',
    cursor: 'pointer',
    margin: '16px 8px 4px 8px',
    borderRadius: 16,
    boxSizing: 'border-box',
    fontSize: '0.9125rem',
    backgroundColor: '#E0E0E0',
    display: 'inline-flex',
    fontWeight: 600,
    height: 32,
    transition: 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
    '&:hover': {
      backgroundColor: 'rgb(206, 206, 206)',
    }
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
    height: 48,
    "& img": {
      height: 20,
      width: 20
    },
    '& span': {
      marginLeft: 2
    }
  }
});