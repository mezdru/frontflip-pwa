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
    background: theme.palette.background.default,
    borderRadius: 4,
    padding : '16px 8px',
    paddingTop: 0,
    minHeight: 112,
    textAlign: 'left'
  }
});