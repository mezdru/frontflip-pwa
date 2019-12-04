import green from '@material-ui/core/colors/green';

export const styles = theme => ({
  text: {
    margin: 0,
    padding: 0,
    paddingTop: 16,
    textAlign: 'center'
  },
  titleEmoji: {
    marginLeft: 16
  },
  title: {
    marginTop: -8,
    marginBottom: -8,
    textAlign: 'center',
    [theme.breakpoints.down('sm')]: {
      fontSize: '4.8rem',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '3rem',
    }
  },
  actions: {
    margin: 0,
    padding: 8,
    display: 'block'
  },
  buttons: {
    height: 'unset',
    margin: 8,
  },
  selectedSkillsContainer: {
    background: 'white',
    borderRadius: 4,
    padding : 8,
    minHeight: 112,
    // maxHeight: 112,
    overflowY: 'auto',
    overflowX: 'hidden',
    textAlign: 'left'
  },
  successIcon: {
    color: green[600]
  },
  failedIcon: {
    color: theme.palette.error.dark
  },
  stepTitle: {
    textAlign: 'center'
  },
  emojiImg: {
    marginBottom: 16
  }
});