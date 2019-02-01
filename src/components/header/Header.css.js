const drawerWidth = 300;

export const styles = theme => ({
    root: {
        display: 'flex',
        width: '100%',
        textAlign: 'center',
        backgroundColor: '#fff'
    },
    menuLink: {
        width:'180px',
        height: '40px',
    },
    grow: {
        flexGrow: 1,
    },
    title: {
        lineHeight: '50%',
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
    appBar: {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        background: 'white',
        zIndex: '999'
    },
    appBarShift: {
        width: '100%',
        marginLeft: drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
    },
    drawerPaper: {
        width: drawerWidth,
        padding: '0 !important',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    },
    content: {
        flexGrow: 1,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: -300,
        padding: 0,
    },
    contentShift: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    fixToRight: {
        position: 'absolute',
        right: 0
    },
    leftSubmenuLogo: {
        height: 30,
        width: 30,
        position: 'relative',
        top: '50%',
        transform: 'translateY(-50%)'
    },
    toolbar: {
        [theme.breakpoints.down('md')]: {
            padding:0
        }
    }
});
