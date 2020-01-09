export const styles = theme => ({
  hitList: {
    position: "relative",
    zIndex: 999,
    width: "100%",
    minHeight: "calc(100vh - 129px)",
    backgroundColor: "#f2f2f2",
    "& ul": {
      listStyleType: "none",
      padding: 0,
      marginTop: "32px",
      marginBottom: "32px"
    },
    "& ul li": {
      marginBottom: "32px"
    },
    "& ul li > div:first-child": {
      position: "relative",
      left: "0",
      right: "0",
      margin: "auto"
    }
  },
  cardMobileView: {
    [theme.breakpoints.down("xs")]: {
      margin: "16px!important"
    }
  },
  sentinel: {
    position: "absolute",
    marginTop: "-2000px"
  },
  horizontalCenter: {
    left:0,
    right:0,
    margin: 'auto',
    position: 'relative',
    textAlign: 'center'
  }
});