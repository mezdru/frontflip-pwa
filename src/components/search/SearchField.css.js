export const styles = theme => ({
  searchContainer: {
    position: 'relative',
    zIndex: 1198,
    border: '1px solid',
    borderColor: theme.palette.primary.dark,
    borderRadius: 5,
    height: 50,
    background: 'white',
    display: 'flex',
    flexDirection: 'row',
  },
  searchFiltersContainer: {
    display: 'flex',
    maxHeight: 42,
    maxWidth: '80%',
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