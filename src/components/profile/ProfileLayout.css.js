const LOGO_HEIGHT = 170;

export const styles = theme => ({
    generalPart: {
        position: 'relative',
        minHeight: 'calc(100vh - 247px)',
        [theme.breakpoints.up('md')]: {
            minHeight: 'calc(100vh - 429px)'
        },
        background: theme.palette.secondary.light,
        padding: 16
    },
    hashtagsPart: {
        position: 'relative',
        minHeight: 'calc(100vh - 247px)',
        [theme.breakpoints.up('md')]: {
            minHeight: 'calc(100vh - 429px)'
        },
        padding: 16
    },
    logoContainer: {
        position: 'relative',
        transform: 'translateY(-50%)',
        top:0,
    },
    logo: {
        position: 'absolute',
        transform: 'translateY(-50%)',
        top: 0,
        left:0,
        right:0,
        marginLeft: 'auto',
        marginRight: 'auto',
        width: LOGO_HEIGHT-10,
        height: LOGO_HEIGHT,
        '& img': {
            height: '90%',
            width: '90%',
            borderRadius: '50%',
        },
    },
    subheader: {
        position: 'relative',
        marginTop: (LOGO_HEIGHT/2),
        marginBottom: 16,
    },
    button: {
        color: theme.palette.secondary.contrastText,
        paddingLeft: 0,
        wordBreak: 'break-all',
    },
    buttonIcon: {
        width: 40,
        height: 40,
        color: 'red'
    },
    wings: {
        display: 'inline-block',
        color: 'white',
        position: 'relative',
    },
    minHeightPossible: {
        height: '-moz-min-content',
        height: '-webkit-min-content',
        height: 'min-content',
    },
    editButton: {
        color: theme.palette.primary.main,
        marginLeft: 16
    },
    updateCoverButton: {
        position: 'absolute',
        top:-16,
        right: 16,
        transform: 'translateY(-100%)',
    },
    contactIcon: {
        color: theme.palette.secondary.contrastText, 
        marginRight: 16, 
        marginLeft: -8, 
        position:'relative', 
        width: 40,
        fontSize: 24
    }
});