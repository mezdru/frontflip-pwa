export const styles = theme => ({
  logo: {
    width: 240,
    height: 240,
    marginBottom: -22,
    marginLeft: -62,
    backgroundColor: 'white',
    [theme.breakpoints.down('xs')]: {
      width: 190,
      height: 190,
      marginLeft: -56,
      marginBottom: -10,
    },
  },
  name: {
    color: 'white',
    fontSize: '1.5rem',
    '& span em': {
      backgroundColor: theme.palette.primary.main,
      borderRadius: 30,
      color: 'white',
      paddingLeft: 2,
      paddingRight: 2,
    },
    display: 'block',
  },
  intro: {
    fontSize: '1rem',
    maxHeight: '49px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  titleSmallestView: {
    marginLeft: -2,
    paddingTop: 16,
    [theme.breakpoints.down('xs')]: {
      marginLeft: -6,
    },
  },
  wings: {
    display: 'inline-block',
    position: 'relative',
    marginTop: '30px !important',
    marginBottom: 0,
    '& >div:first-child': {
      marginLeft: 16
    }
  },
  wingsContainer: {
    height: 94,
    overflowY: 'hidden',
    overflowX: 'auto',
    overflow: '-moz-scrollbars-none',
    MsOverflowStyle: 'none',
    scrollbarColor: '#2b2d3c #2b2d3c',
    '&::-webkit-scrollbar': {
      width: '0 !important',
    },
  },
  cardRoot: {
    width: '100%',
    cursor: 'pointer',
    height: 273,
    [theme.breakpoints.down('xs')]: {
      height: 235,
    }
  },
  cardHeader: {
    maxHeight: 138,
    [theme.breakpoints.down('xs')]: {
      maxHeight: 100,
    }
  },
  contact: {
    [theme.breakpoints.up('xs')]: {
      margin: 2,
    }
  },
  contactField: {
    marginLeft: 100,
    paddingLeft: 82,
    minHeight: 40,
    backgroundColor: 'transparent',
    [theme.breakpoints.down('xs')]: {
      minHeight: 35,
      marginLeft: 66,
      paddingLeft: 72,
    },
  },
  contactImage: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  contactButton: {
    width: 37,
    height: 37,
    fontSize: '20px !important',
    opacity: 0.5,
    '&::before': {
      position: 'absolute',
      left: 0,
      right: 0,
      margin: 'auto',
    },
    '&:hover': {
      backgroundColor: '#41424F',
      opacity: 1
    }
  },
  contactContainer: {
    maxHeight: 40,
    overflow: 'hidden'
  },
  backgroundLogo: {
    backgroundRepeat: 'no-repeat',
    backgroundPositionX: 'right',
    backgroundPositionY: 'bottom',
    borderRadius: '50%',
    backgroundSize: '200px 200px',
    [theme.breakpoints.down('xs')]: {
      backgroundSize: '150px 150px',
    }
  }
})