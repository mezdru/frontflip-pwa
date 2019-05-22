export const styles = theme => ({
  searchContainer: {
    position: 'relative',
    zIndex: 1198,
    border: 'none',
    borderRadius: 4,
    height: 50,
    background: 'rgba(255,255,255,1)',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    display: 'flex',
    flexDirection: 'row',
    transition: 'padding-left 300ms cubic-bezier(0.4, 0, 0.2, 1), box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1)',
    [theme.breakpoints.down('xs')]: {
      maxWidth: '100%',
    },
    '&:hover': {
      boxShadow: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    },
  },
  searchFiltersContainer: {
    display: 'flex',
    // maxHeight: 42,
    // maxWidth: '70%',
    height: 50,
    width: '100%',
    background: 'transparent',
    '& >div': {
      margin: 8,
    },
    overflowX: 'auto',
    flexWrap: 'nowrap',
    overflowY: 'hidden',
    paddingRight: 8,
    borderRadius: 5,
  },
  searchInput: {
    flex: 'auto',
    background: 'transparent',
    outline: 'none',
    border: 'none',
    height: '100%',
    fontSize: '1.1em',
    paddingLeft: 8,
    // minWidth: 0,
    minWidth: 100,
    cursor: 'pointer',
  },
  searchClear: {
    float: 'right',
    marginTop: 4,
    marginRight: 4,
    height: 40,
    '& svg': {
      color: theme.palette.primary.dark
    }
  }
});
